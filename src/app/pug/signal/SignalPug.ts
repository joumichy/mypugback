import { Request, Response } from "express";
import {
  checkThatSignalExistOrThrow,
  checkThatUserExistsOrThrow,
} from "../../../util/validator/checkdata";
import UserRepository from "../../../repository/UserRepository";
import { CustomError } from "../../../util/error/CustomError";
import { decodeToken } from "../../../util/security/tokenManagement";
import { ObjectId } from "bson";
import { SignalPug } from "../../../models/SignalPug";
import SignalPugRepository from "../../../repository/SignalPugRepository";
import moment from "moment";
import { SignalReason } from "../../../models/SignalReason";

export const signalPug = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const { userId } = decodeToken(token);
    const { username, reason, pugId } = req.body;
    const user = await execute(userId, username, reason, pugId);
    res
      .status(200)
      .json({ code: user.code, message: user.message, payload: user.payload });
  } catch (err: any) {
    if (err instanceof CustomError) {
      console.log(err);
      res.status(400).json({ message: err.message, code: err.code });
    } else {
      console.log(err);
    }
  }
};

const execute = async (
  userId: string,
  username: string,
  reason: SignalReason,
  pugId: string
): Promise<any> => {
  const currentUser = await UserRepository.findById(userId);
  const otherUser = await UserRepository.findByUsername(username);

  checkThatUserExistsOrThrow(currentUser);
  checkThatUserExistsOrThrow(otherUser);
  const date = moment().unix();

  const signal: SignalPug = {
    userId: new ObjectId(otherUser._id),
    username: otherUser.username,
    reason,
    senderId: new ObjectId(currentUser._id),
    pugId: new ObjectId(pugId),
    date,
  };
  const result = await SignalPugRepository.insert(signal);
  checkThatSignalExistOrThrow(result);
  return {
    code: 0,
    message: "Signalement effectué",
  };
};
