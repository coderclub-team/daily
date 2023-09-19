import { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";
import * as yup from "yup";
import { decodeToken, uuid } from "~/functions";
import { order_create_schema } from "~/yup/schema";



const prisma = new PrismaClient()
.$extends({
  name:"orderItem",
  query: {
    orderItem: {
      async create({ model, operation, args, query }) {
        const product_id = args.data.item_id;
        const product = await prisma.product.findUnique({
          where: {
            id: product_id,
          },
        }); 
        if (!product) {
          throw new yup.ValidationError("Item id is not valid");
        }

        if (product.status === "DRAFT") {
          throw new yup.ValidationError(
            `Product ${product.title} is not published`
          );
        }

        if (product.status === "TRASH") {
          throw new yup.ValidationError(`Product ${product.title} is trashed`);
        }
        //how to complete the code
        return  query(args)
      
      },
      
    },
  },
 
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      await get(req, res);
      break;
    case "POST":
      await post(req, res);
      break;
    // case 'DELETE':
    //   await deleteCustomer(req, res)
    //   break
    default:
      res.status(405).end(); //Method Not Allowed
      break;
  }
};

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { customer_id } = req.query;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "Token is required" });
  const customer = decodeToken(token);
  if (!customer) return res.status(400).json({ message: "Invalid token" });

  try {
    const orders = await prisma.order.findMany({
      where: {
        customer_id: customer_id as string,
      },
      include: {
        order_items_line: true,
      },
    });
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (e: any) {
    res.status(400).json({
      status: "error",
      message: e.message,
    });
  }
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { customer_id } = req.query;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "Token is required" });
  const customer = decodeToken(token);
  if (!customer) return res.status(400).json({ message: "Invalid token" });

  try {
    const { order_items_line, coupons_line, ...data } =
      await order_create_schema({
        customer_id: customer_id as string,
      }).validate(req.body);
    await prisma.$transaction(async (tx) => {
      const coupans = await tx.coupon.findMany({
        where: {
          id: {
            in: coupons_line?.map((i) => i.id),
          },
        },
      });

      const order = await tx.order.create({
        data: {
          ...data,
          order_items_line: {
            createMany: {
              data:order_items_line
            },
          },
          // coupons_line: {
          //   create: coupans,
          // },
        },
      include:{
        order_items_line:{
          include:{
            item:true
          }
        },
        
      
        // coupons_line:true
      }

      
      });
      res.status(200).json({
        status: "success",
        data: order,
      });
    });
  } catch (e: any) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }

  //   date_paid                     DateTime?
  //   date_completed                 DateTime?
  //   cart_hash                     String?

  //   order_items_line          OrderItem[]
  //   shipping_line  Shipping?
  //   coupans_line    Coupan[]
  //   refund_line Refund?
};
export default handler;
