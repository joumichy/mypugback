import { Request, Response } from "express";
import BaseResponse from "../../../response/BaseResponse";
import {
  checkThatUserExistsOrThrow,
  checkThatUserIsNotAlreadyFollow,
  checkThatUserisntHimself,
} from "../../../util/validator/checkdata";
import UserRepository from "../../../repository/UserRepository";
import { CustomError } from "../../../util/error/CustomError";
import { decodeToken } from "../../../util/security/tokenManagement";
import FollowerRepository from "../../../repository/FollowerRepository";
import { allUsersNotificationToken } from "../../../util/util";
import { sendNotificationEvent } from "../../../notification/Notification";
import { userToUserFactoryResponse } from "../../../response/UserFactoryResponse";

export const followUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const { userId } = decodeToken(token);
    const { username } = req.body;
    const user = await executeAddFriend(userId, username);
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

export const executeAddFriend = async (
  userId: string,
  username: string
): Promise<BaseResponse<any>> => {
  const currentUser = await UserRepository.findById(userId);
  const otherUser = await UserRepository.findByUsername(username);

  checkThatUserExistsOrThrow(currentUser);
  checkThatUserExistsOrThrow(otherUser);
  checkThatUserisntHimself(currentUser, otherUser);

  const userAlreadyFollow = await FollowerRepository.findUserInFollwingList(
    currentUser.username,
    otherUser.username
  );

  checkThatUserIsNotAlreadyFollow(userAlreadyFollow);

  await FollowerRepository.addUserToFollowing(currentUser, otherUser);
  await FollowerRepository.addUserToFollower(otherUser, currentUser);

  await UserRepository.updateUserFollower(otherUser, 1);
  await UserRepository.updateUserFollowing(currentUser, 1);
  if (allUsersNotificationToken.has(otherUser.username)) {
    await sendNotificationEvent(
      allUsersNotificationToken.get(otherUser.username),
      userToUserFactoryResponse(currentUser),
      "follow"
    );
  }

  return {
    code: 0,
    message: "Nouvel utilisateur suivit",
  };
};
