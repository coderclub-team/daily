import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return get(req, res);
  }
  res.status(405).json({ message: "Method not allowed" });
};
const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        // sort_order: "asc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        image_id: true,
        regular_price:true,
        sale_price:true,
        _count: true,

      },
    });
    res.status(200).json({ message: "success", data: products });
  } catch (error:any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default handler;
