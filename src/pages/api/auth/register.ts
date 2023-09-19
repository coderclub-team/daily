import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { errorMessage, generateCardNumber } from "~/functions";

const prisma = new PrismaClient();

const hendler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    // case "GET":
    // return get(req, res);
    case "POST":
      return post(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { phone_number } = req.body;
    const { hub_id } = req.query;

    await prisma.$transaction(async (tx) => {
      const hub = await tx.hub.findUnique({
        where:{
          id:hub_id as string
        }
      })
      const { id } = await tx.customer.create({
        data: req.body,
      });

      await tx.walletRegistry.create({
        data: {
          customer_id: id,
          wallet_id: generateCardNumber(),
          balance: 0,
        },
      });
      await tx.oneTimePassword.upsert({
        where: {
          customer_id: id,
        },
        create: {
          customer_id: id,
          otp: (Math.floor(Math.random() * 9000) + 1000).toString(),
          otp_expiry: new Date(new Date().setDate(new Date().getDate() + 7)),
          otp_type: "mobile",
          is_used: false,
        },
        update: {
          otp: (Math.floor(Math.random() * 9000) + 1000).toString(),
          otp_expiry: new Date(new Date().setDate(new Date().getDate() + 7)),
          otp_type: "mobile",
          is_used: false,
        },
      });

      return res.status(200).json({ status: "success" });
    });
  } catch (error) {
    const message = await errorMessage(error);
    return res.status(400).json({ status: "error", message });
  }
};

export default hendler;
