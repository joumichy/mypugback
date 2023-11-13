import { Request, Response } from "express";
import { checkThatUserExistsOrThrow } from "../../../util/validator/checkdata";

import UserRepository from "../../../repository/UserRepository";
import { CustomError } from "../../../util/error/CustomError";
import { Pug } from "../../../models/Pug";
import { decodeToken } from "../../../util/security/tokenManagement";
import PugRepository from "../../../repository/PugRepository";
import { successCode } from "../../../util/util";
import FollowerRepository from "../../../repository/FollowerRepository";
import { PugResponse, pugToResponse } from "../../../response/PugResponse";
import { UserFactory } from "../../../models/UserFactory";

export const getAllPugsFromFollowing = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const { userId } = decodeToken(token);
    const result = await execute(userId);
    res.status(200).json({
      code: successCode,
      message: "Pugs Utilisateur",
      payload: { pugs: result },
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

const execute = async (userId: string): Promise<any> => {
  const currentUser = await UserRepository.findById(userId);
  const blockedList = await FollowerRepository.findAllBlockedFromUser(
    currentUser.username
  );
  checkThatUserExistsOrThrow(currentUser);
  const data: UserFactory[] = await FollowerRepository.findAllFollowingFromUser(
    currentUser.username
  );
  const usernames: string[] = [];
  data.forEach((value) => usernames.push(value.username));
  const result = await PugRepository.getAllPugsFromFollowing(usernames);

  const pugsResponse: PugResponse[] = [];
  result.forEach((value: any) => {
    if (value.pugs && !blockedList.includes(value.username)) {
      value.pugs.forEach((elem: Pug) => {
        pugsResponse.push(
          pugToResponse(elem, currentUser.username, value.username)
        );
      });
    }
  });

  return pugsResponse;
};
