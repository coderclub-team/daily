import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { decodeToken } from "~/functions";
import * as yup from "yup";
import { subscription_create_schema as schema } from "~/yup/schema";
const prisma = new PrismaClient();
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return get(req, res);
    case "POST":
      return post(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};
const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "Token is required" });
  const customer = decodeToken(token);
  if (!customer) return res.status(400).json({ message: "Invalid token" });
  const { customer_id } = req.query;
  const subscriptions = await prisma.subscription.findMany({
    where: {
      customer_id: customer_id as string,
    },
    orderBy: {
      start_date: "desc",
    },
  });
  res.status(200).json({
    status: "success",
    data: subscriptions,
  });
};
const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { customer_id } = req.query;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "Token is required" });
  const customer = decodeToken(token);
  if (!customer) return res.status(400).json({ message: "Invalid token" });

  try {
    const { days_and_quantity, ...data } = await schema({
      customer_id: customer_id as string,
    }).validate(req.body);
    /** */
    data.frequency_type === "daily"
      ? Object.keys(days_and_quantity).forEach((key) => {
          data.delivery_intervals = 0;
          days_and_quantity[key as keyof typeof days_and_quantity] = 1;
        })
      : data.frequency_type === "interval"
      ? Object.keys(days_and_quantity).forEach((key) => {
          days_and_quantity[key as keyof typeof days_and_quantity] = 0;
        })
      : data.frequency_type === "flexible"
      ? (data.delivery_intervals = 0)
      : null;
    /** */
    const subscription = await prisma.subscription.create({
      data: {
        ...data,
        ...days_and_quantity,
        
      },
    });
    res.status(200).json({
      status: "success",
      data: subscription,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
export default handler;
