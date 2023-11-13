import { Request, Response } from "express";
import { env } from "../../util/config";
import { decodeToken } from "../../util/security/tokenManagement";
import { successCode } from "../../util/util";
import { CustomError } from "../../util/error/CustomError";

const stripe = require("stripe")(env.STRIPE_SECRET_KEY);

export const createPayment = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1] || "";

  try {
    let { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    const { userId } = decodeToken(token);

    res.status(200).json({
      code: successCode,
      message: "Tentative de paiement",
      payload: { paymentIntent: paymentIntent.client_secret },
    });
  } catch (err: any) {
    if (err instanceof CustomError) {
      console.log(err);
      res.status(400).json({ message: err.message, code: err.code });
    } else {
      console.log(err);
    }
  }
};
