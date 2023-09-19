// model ProductCategory {
//     id                String            @id @unique @default(uuid())
//     name              String
//     description       String?
//     image_url         String?
//     count             Int?              @default(0)
//     parent_id         String?
//     sort_order        Int?              @default(0)
//     parent            ProductCategory?  @relation("Parent", fields: [parent_id], references: [id], onDelete: SetNull, onUpdate: Cascade)
//     parent_categories ProductCategory[] @relation("Parent")
//     products          Product[]

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//     @@map("product_categories")
//   }

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return get(req, res);
  }
  res.status(405).json({ message: "Method not allowed" });
};
const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: {
        sort_order: "asc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        count: true,
      },
    });
    res.status(200).json({ message: "success", data: categories });
  } catch (error:any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default handler;
