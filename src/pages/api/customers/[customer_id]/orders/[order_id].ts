import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      await get(req, res);
      break;
    default:
      res.status(405).end(); //Method Not Allowed
      break;
  }
};
const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const {customer_id, order_id } = req.query;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "Token is required" });
  const customer = token;
  if (!customer) return res.status(400).json({ message: "Invalid token" });

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: order_id as string,
      },
      include: {
        order_items_line: true
      },
    });
    
    res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (e: any) {
    res.status(400).json({
      status: "error",
      message: e.message,
    });
  }
};
export default handler;
