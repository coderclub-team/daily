import { decodeToken } from "~/functions";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
const prisma = new PrismaClient();

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "POST":
      return post(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};
const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "Token is required" });
  const customer = decodeToken(token);
  if (!customer) return res.status(400).json({ message: "Invalid token" });

  try {
    const data = await yup
      .object({
        payment_type: yup.string().required("Payment type is required"),
        transaction_amount: yup
          .number()
          .required("Transaction amount is required"),
        payment_id: yup.string().required("Payment id is required"),
      })
      .validate(req.body);

    await prisma.$transaction(async (tx) => {
      const wallet = await tx.walletRegistry.findUnique({
        where: {
          customer_id: customer.id,
        },
      });
      if (wallet) {
        const transaction = await tx.walletTransaction.create({
          data: {
            wallet_registry_id: wallet.id,
            transaction_amount: data.transaction_amount,
            transaction_type: "CREDIT",
            transaction_id: Date.now().toString(16),
            payment_id: data.payment_id,
            payment_type: data.payment_type,
          },
        });
        return res.status(200).json({ status: "success", data: transaction });
      } else if (!wallet) {
        const wallet_registry = await tx.walletRegistry.create({
          data: {
            customer_id: customer.id,
          },
        });
        const transaction = await tx.walletTransaction.create({
          data: {
            wallet_registry_id: wallet_registry.id,
            transaction_amount: data.transaction_amount,
            transaction_type: "CREDIT",
            transaction_id: Date.now().toString(16),
            payment_id: data.payment_id,
            payment_type: data.payment_type,
          },
        });
        return res.status(200).json({ status: "success", data: transaction });
      }
    });
  } catch (error: any) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

export default handler;
