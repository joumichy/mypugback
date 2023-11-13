import { Request, Response } from "express";
import {
  checkThatPasswordsAreEqualsOrThrow,
  checkThatUserExistsOrThrow,
  checkThatUserIsNotBanned,
  checkThatUserSignInCredentialsOrThrow,
} from "../../../util/validator/checkdata";
import { CustomError } from "../../../util/error/CustomError";
import UserRepository from "../../../repository/UserRepository";
import { successCode } from "../../../util/util";
import { User } from "../../../models/User";
import { generateAccessToken } from "../../../util/security/tokenManagement";
import { userToUserResponse } from "../../../response/UserResponse";

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await signInUser(username, password);
    console.log("Connexion utilisateur : " + username);
    res.status(200).json({
      code: successCode,
      message: "Connexion avec succès",
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

const signInUser = async (
  username: string,
  password: string
): Promise<User> => {
  checkThatUserSignInCredentialsOrThrow(username, password);
  const existingUser = await UserRepository.findByUsername(username);
  await checkThatUserExistsOrThrow(existingUser);
  await checkThatPasswordsAreEqualsOrThrow(password, existingUser.password);
  await checkThatUserIsNotBanned(existingUser);
  console.log(existingUser);

  return existingUser;
};
