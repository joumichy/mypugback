"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = void 0;
const config_1 = require("../../util/config");
const tokenManagement_1 = require("../../util/security/tokenManagement");
const util_1 = require("../../util/util");
const CustomError_1 = require("../../util/error/CustomError");
const stripe = require("stripe")(config_1.env.STRIPE_SECRET_KEY);
const createPayment = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token =
      ((_a = req.headers.authorization) === null || _a === void 0
        ? void 0
        : _a.split(" ")[1]) || "";
    try {
      let { amount, currency } = req.body;
      const paymentIntent = yield stripe.paymentIntents.create({
        amount,
        currency,
      });
      const { userId } = (0, tokenManagement_1.decodeToken)(token);
      res.status(200).json({
        code: util_1.successCode,
        message: "Tentative de paiement",
        payload: { paymentIntent: paymentIntent.client_secret },
      });
    } catch (err) {
      if (err instanceof CustomError_1.CustomError) {
        console.log(err);
        res.status(400).json({ message: err.message, code: err.code });
      } else {
        console.log(err);
      }
    }
  });
exports.createPayment = createPayment;
