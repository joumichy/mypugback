import { Request, Response } from "express";
import { checkThatUserExistsOrThrow } from "../../../util/validator/checkdata";
import UserRepository from "../../../repository/UserRepository";
import { CustomError } from "../../../util/error/CustomError";
import { decodeToken } from "../../../util/security/tokenManagement";
import PugRepository from "../../../repository/PugRepository";
import FollowerRepository from "../../../repository/FollowerRepository";

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const { userId } = decodeToken(token);
    const user = await execute(userId);
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

const execute = async (userId: string): Promise<any> => {
  const currentUser = await UserRepository.findById(userId);
  checkThatUserExistsOrThrow(currentUser);
  await PugRepository.detePugsFromUser(currentUser);
  await FollowerRepository.deleteUser(currentUser);
  await UserRepository.deleteUser(currentUser);

  return {
    code: 0,
    message: "Utilisateur supprimé",
  };
};
