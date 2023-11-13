import { Request, Response } from "express";
import { decodeToken } from "../../util/security/tokenManagement";
import { CustomError } from "../../util/error/CustomError";
import UserRepository from "../../repository/UserRepository";
import {
  checkThatCompetitionExist,
  checkThatUserExistsOrThrow,
} from "../../util/validator/checkdata";
import { Participant } from "../../models/Participant";
import { ObjectId } from "bson";
import CompetitionRepository from "../../repository/CompetitionRepository";
import moment from "moment";

export const participateToCompetition = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const { userId } = decodeToken(token);
    const { pugId, competitionId, pugPicture } = req.body;
    const user = await execute(userId, pugId, competitionId, pugPicture);
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

const execute = async (
  userId: string,
  pugId: string,
  competitionId: string,
  pugPicture: string
): Promise<any> => {
  const currentUser = await UserRepository.findById(userId);

  checkThatUserExistsOrThrow(currentUser);

  const participant: Participant = {
    username: currentUser.username,
    date: moment().unix(),
    sex: currentUser.sex ?? "man",
    userId: new ObjectId(currentUser._id),
    pugId: new ObjectId(pugId),
    pugPicture: pugPicture,
  };
  const result = await CompetitionRepository.addParticipant(
    participant,
    competitionId
  );
  checkThatCompetitionExist(result);
  return {
    code: 0,
    message: "Inscription au concours effectué",
  };
};
