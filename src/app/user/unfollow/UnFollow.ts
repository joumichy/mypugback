import { Request, Response } from "express";
import {
  checkThatUserExistsOrThrow,
  checkThatUserNotFollowed,
} from "../../../util/validator/checkdata";
import UserRepository from "../../../repository/UserRepository";
import { CustomError } from "../../../util/error/CustomError";
import { decodeToken } from "../../../util/security/tokenManagement";
import FollowerRepository from "../../../repository/FollowerRepository";
import { userToUserFactoryResponse } from "../../../response/UserFactoryResponse";

export const unFollowUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const { userId } = decodeToken(token);
    const { username } = req.body;
    const user = await execute(userId, username);
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

const execute = async (userId: string, username: string): Promise<any> => {
  const currentUser = await UserRepository.findById(userId);
  const otherUser = await UserRepository.findByUsername(username);

  checkThatUserExistsOrThrow(currentUser);
  checkThatUserExistsOrThrow(otherUser);

  const userNotFollow = await FollowerRepository.findUserInFollwingList(
    currentUser.username,
    otherUser.username
  );
  console.log("data :" + userNotFollow);
  checkThatUserNotFollowed(userNotFollow);

  const resultFollowing = await FollowerRepository.deleteUserFromFollowing(
    currentUser,
    userToUserFactoryResponse(otherUser)
  );
  if (resultFollowing) {
    await UserRepository.updateUserFollowing(currentUser, -1);
  }
  const resultFollower = await FollowerRepository.deleteUserFromFollower(
    otherUser,
    userToUserFactoryResponse(currentUser)
  );
  if (resultFollower) {
    await UserRepository.updateUserFollower(otherUser, -1);
  }
  return {
    code: 0,
    message: "Nouvel utilisateur unfollow",
  };
};
