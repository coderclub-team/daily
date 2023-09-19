import { Customer, PrismaClient } from "@prisma/client";
import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import jwt from "jsonwebtoken";

export const generateToken = (customer: Partial<Customer>): string => {
  const secretKey = process.env.JWT_SECRET;
  console.log(secretKey);
  // Create the JWT token
  return jwt.sign(customer, secretKey!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): any => {
  const secretKey = process.env.JWT_SECRET;

  return jwt.verify(token, secretKey!);
};

export const decodeToken = (token: string): Partial<Customer> | null => {
  try {
    const secretKey = process.env.JWT_SECRET;

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, secretKey!) as Partial<Customer>;

    // Return the decoded customer data
    return decoded;
  } catch (error) {
    // Handle token verification errors (e.g., invalid token, expired token)
    return null;
  }
};

export const errorMessage = (error: any) => {
  error.code == "P2002" &&
    error.meta.target == "customers_phone_number_key" &&
    (error.message = "The phone number has already been taken");
  error.code == "P2002" &&
    error.meta.target == "customers_email_key" &&
    (error.message = "The email has already been taken");
  return Promise.resolve(error.message);
};

//a javascript function to generate a stricktly unique 16digit like credit card number using datetime

export const generateCardNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const millisecond = date.getMilliseconds();
  const random = Math.floor(Math.random() * 1000);
  const cardNumber = `${year}${month}${day}${hour}${minute}${second}${millisecond}${random}`;
  return cardNumber;
};


export function uuid() {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substr(2, 5); // Get a random string
  return `${timestamp}-${randomString}`;
}
