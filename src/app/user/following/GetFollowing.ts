import { Request, Response } from "express";
import { checkThatUserExistsOrThrow } from "../../../util/validator/checkdata";

import UserRepository from "../../../repository/UserRepository";
import { CustomError } from "../../../util/error/CustomError";
import { decodeToken } from "../../../util/security/tokenManagement";
import { successCode } from "../../../util/util";
import FollowerRepository from "../../../repository/FollowerRepository";
import {
  FollowerResponse,
  followersToResponse,
} from "../../../response/FollowerResponse";

export const getUserFollowing = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const { userId } = decodeToken(token);
    const { username } = req.query;
    const result = await execute(userId, <string>username);
    res.status(200).json({
      code: successCode,
      message: "Utilisateur que vous suivez",
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
): Promise<FollowerResponse[]> => {
  const currentUser = await UserRepository.findById(userId);
  const otherUser = await UserRepository.findByUsername(username);

  checkThatUserExistsOrThrow(currentUser);
  checkThatUserExistsOrThrow(otherUser);

  const result = await FollowerRepository.findAllFollowingFromUser(
    otherUser.username
  );
  //TODO : Update for profile picutre optimisation
  // let usernames = result.map((value) => value.username);
  // const data = await UserRepository.findUsersInList(usernames);
  // result.forEach(
  //   (value) =>
  //     (value.profilePicture = data.find(
  //       (value1) => value1.username == value.username
  //     )!.profilePicture)
  // );
  return followersToResponse(result);
};
