import { Request, Response } from "express";
import { decodeToken } from "../../util/security/tokenManagement";
import { successCode } from "../../util/util";
import { CustomError } from "../../util/error/CustomError";
import { Competition } from "../../models/Competition";
import UserRepository from "../../repository/UserRepository";
import {
  checkThatCompetitionExist,
  checkThatUserExistsOrThrow,
} from "../../util/validator/checkdata";
import CompetitionRepository from "../../repository/CompetitionRepository";
import moment from "moment";

export const getWinners = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const { userId } = decodeToken(token);
    const result = await execute(userId);
    res.status(200).json({
      code: successCode,
      message: "Competition",
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

const execute = async (userId: string): Promise<Competition> => {
  const currentUser = await UserRepository.findById(userId);
  const date = moment().weekday(1).hour(12);
  checkThatUserExistsOrThrow(currentUser);
  const competiton = await CompetitionRepository.findByDateWithWinnersOnly(
    date.unix()
  );
  checkThatCompetitionExist(competiton);
  return competiton;
};
