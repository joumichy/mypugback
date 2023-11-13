import { Request, Response } from "express";
import {
  checkThatUserDoesntExistOrThrow,
  checkThatUserSignUpCredentialsOrThrow,
  checkThatUserWithUsernameDoesntExistOrThrow,
} from "../../../util/validator/checkdata";
import { User } from "../../../models/User";
import { encodePassword } from "../../../util/security/passwordManagement";
import UserRepository from "../../../repository/UserRepository";
import { CustomError } from "../../../util/error/CustomError";
import { generateAccessToken } from "../../../util/security/tokenManagement";
import { userToUserResponse } from "../../../response/UserResponse";
import { executeAddFriend } from "../../user/follow/Follow";
import { LUCIE } from "../../../util/util";

export const signUp = async (req: Request, res: Response) => {
  const { email, username, password, phoneRegion, sex } = req.body;

  try {
    const user = await signUpUser(email, username, password, phoneRegion, sex);
    await executeAddFriend(String(user._id), LUCIE);

    res.status(201).json({
      code: 0,
      message: "inscription réalisée avec succès",
      payload: userToUserResponse(user),
      token: generateAccessToken(user),
    });
  } catch (err: any) {
    if (err instanceof CustomError) {
      res.status(400).json({ message: err.message, code: err.code });
    } else {
      console.log(err);
    }
  }
};

const signUpUser = async (
  email: string,
  username: string,
  password: string,
  phoneRegion: string,
  sex: "man" | "woman"
): Promise<User> => {
  checkThatUserSignUpCredentialsOrThrow(email, password, username, phoneRegion);

  const existingUser = await UserRepository.findByEmail(email);
  const existingUserWithUserName = await UserRepository.findByUsername(
    username
  );

  checkThatUserDoesntExistOrThrow(existingUser);
  checkThatUserWithUsernameDoesntExistOrThrow(existingUserWithUserName);

  const hashedPassword = await encodePassword(password);
  const newUser: User = {
    profilePicture: "",
    admin: false,
    email,
    password: hashedPassword,
    phoneNumber: "",
    username,
    followers: 0,
    following: 0,
    pugs: 0,
    description: "",
    banned: false,
    trophy: false,
    sex,
  };

  return await UserRepository.insert(newUser);
};
