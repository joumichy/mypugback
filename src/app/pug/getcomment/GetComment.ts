import { Request, Response } from "express";
import {
  checkThatCommentsExistOrThrow,
  checkThatUserExistsOrThrow,
} from "../../../util/validator/checkdata";

import UserRepository from "../../../repository/UserRepository";
import { CustomError } from "../../../util/error/CustomError";
import { decodeToken } from "../../../util/security/tokenManagement";
import PugRepository from "../../../repository/PugRepository";
import { successCode } from "../../../util/util";
import { Comment } from "../../../models/Comment";

export const getComments = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const { userId } = decodeToken(token);
    const { pugId, username } = req.query;
    const result = await execute(userId, <string>pugId, <string>username);
    res.status(200).json({
      code: successCode,
      message: "Liste des commentaires",
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
  pugId: string,
  pugName: string
): Promise<any> => {
  const currentUser = await UserRepository.findById(userId);

  checkThatUserExistsOrThrow(currentUser);
  const result = await PugRepository.findByIdWithCommentsOnly(pugId, pugName);
  checkThatCommentsExistOrThrow(result.pugs[0].comments);
  const comments: Comment[] = result.pugs[0].comments;
  const users: string[] = [];
  comments.forEach((value) => users.push(value.author.username));
  const usersWithPicture = await UserRepository.findUsersInList(users);
  comments.forEach(
    (value) =>
      (value.author.profilePicture = usersWithPicture.find(
        (user) => user.username == value.author.username
      )!.profilePicture)
  );
  return comments;
};
