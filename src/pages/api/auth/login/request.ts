import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "POST":
      return post(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { phone_number } = req.body;


  try {

    const customer = await prisma.customer.findUnique({
      where:{
        phone_number:req.body.phone_number
      }
    });

    
    if (!customer) {
      return res.status(400).json({ message: "Phone number not registered" });
    } else if (!(customer.is_phone_verified || customer.is_email_verified)) {
      throw new Error(
        "Account not verified. Please verify your phone to log in."
      );
    }
    await prisma.oneTimePassword.upsert({
      where: {
        customer_id: customer.id,
      },
      create: {
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
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ status: "error", message: e.errors[0] });
    }
    return res.status(400).json({ status: "error", message: e.message });
  }
};

export default handler;
