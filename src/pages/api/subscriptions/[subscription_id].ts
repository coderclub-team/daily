import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return get(req, res);
    case "DELETE":
      return del(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { subscription_id} = req.query;
  try {
    const subscription = await prisma.subscription.findUnique({
      where: {
        id: subscription_id as string,
      },
    });
    if (!subscription) {
      return res.status(404).json({
        message:
          "We regret to inform you that the subscription could not be located in our records",
      });
    }
    return res.status(200).json({
      subscription,
    });
  } catch (e: any) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const del = async (req: NextApiRequest, res: NextApiResponse) => {
  const { subscription_id } = req.query;
  try {

   const sub= await prisma.subscription.findFirst({
      where:{
        id:subscription_id as string,
      }
    })
    console.log("dsubscription_to_delet",sub)
    const subscription = await prisma.subscription.update({
      where: {
        id: subscription_id as string,
        deleted_at:null
      },
      data: {
        deleted_at: new Date().toISOString(),
        status:"TRASH",
        
      },
    });
    
    if (!subscription) {
      return res.status(404).json({
        message:
          "We regret to inform you that the subscription could not be located in our records",
      });
    }
    return res.status(200).json({
      status: "success",
      data: subscription,
    });
  } catch (e: any) {
    if (
      e instanceof
      (PrismaClientKnownRequestError ||
        PrismaClientValidationError ||
        PrismaClientInitializationError ||
        PrismaClientRustPanicError ||
        PrismaClientUnknownRequestError)
    ) {
      res.status(400).json({
        status: "error",
        message: e.meta?.cause || e.message,
      });
    } else {
      return res.status(500).json({
        message: e.message,
      });
    }
  }
};

export default handler;
