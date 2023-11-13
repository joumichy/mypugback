import { Request, Response } from "express";
import {
  checkThatUserExistsOrThrow,
  checkThatUserisNotBlocked,
} from "../../../util/validator/checkdata";

import UserRepository from "../../../repository/UserRepository";
import { CustomError } from "../../../util/error/CustomError";
import { decodeToken } from "../../../util/security/tokenManagement";
import PugRepository from "../../../repository/PugRepository";
import { successCode } from "../../../util/util";
import {
  UserPugNoCommentResponse,
  userPugToResponseNoComment,
} from "../../../response/UserPugResponse";
import FollowerRepository from "../../../repository/FollowerRepository";

export const getAllPugsFromUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const { userId } = decodeToken(token);
    const { username } = req.query;
    const result = await execute(userId, <string>username);
    res.status(200).json({
      code: successCode,
      message: "Pugs Utilisateur",
      payload: result,
    });
  } catch (err: any) {
    if (err instanceof CustomError) {
      res.status(400).json({ message: err.message, code: err.code });
    } else {
      console.log(err);
    }
  }
};

const execute = async (
  userId: string,
  username: string
): Promise<UserPugNoCommentResponse> => {
  const currentUser = await UserRepository.findById(userId);
  const otherUser = await UserRepository.findByUsername(username);
  checkThatUserExistsOrThrow(currentUser);

  const userBlocked = await FollowerRepository.findUserInBlockingList(
    currentUser.username,
    otherUser.username
  );
  checkThatUserisNotBlocked(userBlocked);
  const otherUserBlocked = await FollowerRepository.findUserInBlockingList(
    otherUser.username,
    currentUser.username
  );
  checkThatUserisNotBlocked(otherUserBlocked);

  const result = await PugRepository.getAllPugsFromUserNoComment(
    otherUser.username
  );
  if (!result)
    return {
      username: otherUser.username,
      pugs: [],
    };

  return userPugToResponseNoComment(result, currentUser, otherUser);
};
