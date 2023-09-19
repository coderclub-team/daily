// write a nextjs api route that will verify the otp

import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import { PrismaClient } from "@prisma/client";
// import {
//   PrismaClientInitializationError,
//   PrismaClientKnownRequestError,
//   PrismaClientRustPanicError,
//   PrismaClientUnknownRequestError,
//   PrismaClientValidationError,
// } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    // case "GET":
    // return get(req,res);
    case "POST":
      return post(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await yup
      .object({
        one_time_password: yup.string().required("OTP is required"),
        phone_number: yup.string().required("Phone number is required"),
      })
      .validate(req.body);

    const customer = await prisma.customer.findUnique({
      where: {
        phone_number: data.phone_number,
      },
      include: {
        one_time_password: true,
      },
    });

    if (!customer) throw new Error("Customer not found");
    const { id, one_time_password } = customer;

    if (!one_time_password)
      throw new Error("One-Time password not found in our records");
    if (one_time_password.is_used)
      throw new Error("One-Time Password (OTP) has already been used");
    if (one_time_password.otp !== data.one_time_password)
      throw new Error("Invalid One-Time Password (OTP)");
    await prisma.$transaction(async (tx) => {
      await tx.customer.update({
        where: {
          id,
        },
        include: {
          one_time_password: true,
        },
        data: {
          is_phone_verified: true,
        },
      });

      const otp = await tx.oneTimePassword.update({
        where: {
          customer_id: id,
          otp: one_time_password.otp,
        },

        data: {
          is_used: true,
        },
      });

      if (!otp) throw new Error("Invalid or expired One-Time Password (OTP)");

      res.status(200).json({
        status: "success",
        message: "One-Time Password (OTP) verified successfully",
      });
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export default handler;
