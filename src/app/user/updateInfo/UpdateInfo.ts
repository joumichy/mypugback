import { Request, Response } from "express";
import { checkThatUserExistsOrThrow } from "../../../util/validator/checkdata";
import UserRepository from "../../../repository/UserRepository";
import { CustomError } from "../../../util/error/CustomError";
import { decodeToken } from "../../../util/security/tokenManagement";
import UserResponse, {
  userToUserResponse,
} from "../../../response/UserResponse";
import { successCode } from "../../../util/util";
import FollowerRepository from "../../../repository/FollowerRepository";
import PugRepository from "../../../repository/PugRepository";
import ConversationRepository from "../../../repository/ConversationRepository";

export const updateInfoUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const { userId } = decodeToken(token);
    const { description, profilePicture } = req.body;
    const user = await execute(userId, description, profilePicture);
    res.status(200).json({
      code: successCode,
      message: "Information utilisateur mise à jour",
      payload: user,
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
  description: string,
  profilePicture: string
): Promise<UserResponse> => {
  const currentUser = await UserRepository.findById(userId);

  checkThatUserExistsOrThrow(currentUser);

  const followings = await FollowerRepository.findAllFollowingFromUser(
    currentUser.username
  );
  const followers = await FollowerRepository.findAllFollowersFromUser(
    currentUser.username
  );
  const usernamesFollowings: string[] = [];
  const usernamesFollowers: string[] = [];
  followings.forEach((value) => usernamesFollowings.push(value.username));
  followers.forEach((value) => usernamesFollowers.push(value.username));

  await Promise.all([
    FollowerRepository.updateUserInfoFollowing(
      usernamesFollowings,
      currentUser.username,
      profilePicture
    ),
    await FollowerRepository.updateUserInfoFollowers(
      usernamesFollowers,
      currentUser.username,
      profilePicture
    ),
    await ConversationRepository.updateUserInfo(
      currentUser.username,
      profilePicture
    ),
    await PugRepository.updateUserInfo(currentUser, profilePicture),
  ]);
  const result = await UserRepository.updateUserInfo(
    currentUser,
    description,
    profilePicture
  );

  return userToUserResponse(result);
};
