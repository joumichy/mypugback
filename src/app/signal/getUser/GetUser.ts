import { Request, Response } from "express";
import { checkThatUserExistsOrThrow } from "../../../util/validator/checkdata";

import UserRepository from "../../../repository/UserRepository";
import { CustomError } from "../../../util/error/CustomError";
import { decodeToken } from "../../../util/security/tokenManagement";
import { successCode } from "../../../util/util";
import SignalUserRepository from "../../../repository/SignalRepository";
import {
  SignalResponse,
  signalsToResponse,
} from "../../../response/SignalResponse";

export const getUserSignal = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const { userId } = decodeToken(token);
    const { username } = req.query;

    const result = await execute(userId, <string>username);
    res.status(200).json({
      code: successCode,
      message: "Liste de signalement de l'utilisateur " + username,
      payload: result,
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

const execute = async (
  userId: string,
  username: string
): Promise<SignalResponse[]> => {
  const currentUser = await UserRepository.findById(userId);

  checkThatUserExistsOrThrow(currentUser);

  const result = await SignalUserRepository.findByUsername(username);

  return signalsToResponse(result);
};
