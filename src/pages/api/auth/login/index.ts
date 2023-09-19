// write a token nextjs controller

import { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";
import { generateToken } from "~/functions";

const prisma = new PrismaClient();
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
  const { phone_number, password, one_time_password } = req.body;

  if (!phone_number || !one_time_password) {
    return res.status(400).json({
      message: "Phone number and One time password (OTP) is required",
    });
  }
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        phone_number,
      },
      select: {
        name: true,
        phone_number: true,
        is_phone_verified: true,
        is_email_verified: true,
        id: true,
        one_time_password: true,
      },
    });
    if (!customer) {
      return res.status(400).json({ message: "Phone number not registered" });
    } else if (!(customer.is_phone_verified || customer.is_email_verified)) {
      throw new Error(
        "Account not verified. Please verify your phone to log in."
      );
    } else if (customer.one_time_password?.is_used) {
      throw new Error("One-Time Password (OTP) has already been used");
    } else if (customer.one_time_password?.otp !== one_time_password) {
      throw new Error("Invalid One-Time Password (OTP)");
    } else if (
      customer.one_time_password?.otp_expiry &&
      new Date(customer.one_time_password?.otp_expiry) < new Date()
    ) {
      throw new Error("One-Time Password (OTP) has expired");
    }

    const otp = await prisma.oneTimePassword.update({
      where: {
        customer_id: customer.id,
      },
      data: {
        is_used: true,
      },
    });

    if (!otp) throw new Error("Invalid or expired One-Time Password (OTP)");

    res.status(200).json({
      status: "success",
      message: "One-Time Password (OTP) verified successfully",
      data: {
        ...customer,
        token: generateToken(customer),
      },
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default handler;
