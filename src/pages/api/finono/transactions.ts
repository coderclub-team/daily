import { decodeToken } from "~/functions";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return get(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};
const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "Token is required" });
  const customer = decodeToken(token);
  if (!customer) return res.status(400).json({ message: "Invalid token" });
  prisma.$transaction(async (tx) => {
    const wallet = await tx.walletRegistry.findUnique({
      where: {
        customer_id: customer.id,
      },
    });

    const transactions = await tx.walletTransaction.findMany({
      where: {
        wallet_registry_id: wallet?.id,
      },
    });

    return res.status(200).json({ status: "success", data: transactions });
  });
};

export default handler;
