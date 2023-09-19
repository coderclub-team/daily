import { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";
import * as yup from "yup";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return post(req, res);
  }
  res.status(405).json({ message: "Method not allowed" });
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { amount, currency, customer_id, receipt, payment_method_type } =
      req.body;

    const data = await yup
      .object({
        amount: yup.number().required(),
        currency: yup.string().required(),
        customer_id: yup.string().required(),
        receipt: yup.string().required(),
        payment_method_type: yup
          .string()
          .oneOf(["netbanking", "upi", "card", "emandate", "nach"])
          .required("Payment method type is required"),
      })
      .validate(req.body, { abortEarly: false });

    const intent = await razorpay.orders.create({
      amount: data.amount * 100, // amount in the smallest currency unit
      currency,
      payment_capture: true,
      //   customer_id: data.customer_id,
      receipt: data.receipt,
      method: data.payment_method_type,
    });

    res.json({ message: "success", data: intent });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default handler;
