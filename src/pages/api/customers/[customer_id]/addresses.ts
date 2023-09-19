// write a nextjs api handler

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { decodeToken, generateToken } from "~/functions";
import * as yup from "yup";

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

  if (!customer_id) return res.status(400).json({ message: "Id is required" });


  try {
    const address = await prisma.address.findFirst({
      where: {
        customer_id: customer_id as string,
      },
    });
    if (!address) {
      throw new Error("Address not found");
    }
    return res.status(200).json({ status: "success", data: address });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { customer_id } = req.query;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "Token is required" });
  const customer = decodeToken(token);
  if (!customer) return res.status(400).json({ message: "Invalid token" });

  try {
    const data = await yup
      .object({
        street: yup.string().required("Street is required"),
        city: yup.string().required("City is required"),
        state: yup.string().required("State is required"),
        zip: yup.string().required("Zip is required"),
        apartment: yup.string(),
        customer_id: yup.string().default(customer_id as string),

      })
      .validate(req.body);
    const address = await prisma.address.upsert({
      where: {
        customer_id: customer_id as string,
      },
      create: data,
      update: data,
    });
    return res.status(200).json({ status: "success", data: address });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export default handler;
