import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { phone_number } = req.body;

  try {
    const customer = await prisma.customer.findUnique({
      where: {
        phone_number,
        is_active: true,
      },
      select: {
        id: true,
      },
    });

    if (!customer) throw new Error("Customer not found");
    const otp = {
      customer_id: customer.id,
      otp: (Math.floor(Math.random() * 9000) + 1000).toString(),
      otp_expiry: new Date(new Date().setDate(new Date().getDate() + 7)),
      otp_type: "mobile",
      is_used: false,
    };

    await prisma.oneTimePassword.upsert({
      where: {
        customer_id: customer.id,
      },
      create: otp,
      update: otp,
    });

    res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export default handler;
