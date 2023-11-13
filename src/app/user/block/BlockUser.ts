import { Request, Response } from "express";
import {
  checkThatUserExistsOrThrow,
  checkThatUserIsNotAlreadyBlocked,
  checkThatUserisntHimself,
} from "../../../util/validator/checkdata";
import UserRepository from "../../../repository/UserRepository";
import { CustomError } from "../../../util/error/CustomError";
import { decodeToken } from "../../../util/security/tokenManagement";
import FollowerRepository from "../../../repository/FollowerRepository";
import { userToUserFactoryResponse } from "../../../response/UserFactoryResponse";
import { UserFactory } from "../../../models/UserFactory";

export const blockUser = async (req: Request, res: Response) => {
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
  checkThatUserisntHimself(currentUser, otherUser);

  const userAlreadyBlocked = await FollowerRepository.findUserInBlockingList(
    currentUser.username,
    otherUser.username
  );
  checkThatUserIsNotAlreadyBlocked(userAlreadyBlocked);

  await FollowerRepository.addUserToBlocking(
    currentUser,
    userToUserFactoryResponse(otherUser)
  );

  //Deleting current user's following
  const following = await FollowerRepository.deleteUserFromFollowing(
    currentUser,
    userToUserFactoryResponse(otherUser)
  );
  console.log("Bloquer :", following);

  //Deleting the name of current user in the blocked user's followers
  const follower = await FollowerRepository.deleteUserFromFollower(
    otherUser,
    userToUserFactoryResponse(currentUser)
  );

  //Deleting blocked user's following current user
  const userFollowing = await FollowerRepository.deleteUserFromFollowing(
    otherUser,
    userToUserFactoryResponse(currentUser)
  );
  //Deleting user blocked from current user's followed list
  const userFollower = await FollowerRepository.deleteUserFromFollower(
    currentUser,
    userToUserFactoryResponse(otherUser)
  );

  if (
    following.following.find(
      (elem: UserFactory) => elem.username == otherUser.username
    )
  ) {
    await UserRepository.updateUserFollowing(currentUser, -1);
  }

  if (
    follower.followers.find(
      (elem: UserFactory) => elem.username == otherUser.username
    )
  ) {
    await UserRepository.updateUserFollower(otherUser, -1);
  }

  if (
    userFollowing.following.find(
      (elem: UserFactory) => elem.username == currentUser.username
    )
  ) {
    await UserRepository.updateUserFollowing(otherUser, -1);
  }

  if (
    userFollower.followers.find(
      (elem: UserFactory) => elem.username == currentUser.username
    )
  ) {
    await UserRepository.updateUserFollower(currentUser, -1);
  }

  return {
    code: 0,
    message: "Utilisateur bloqué",
  };
};
