import { CustomError } from "../../util/error/CustomError";
import UserRepository from "../../repository/UserRepository";
import {
  checkThatCompetitionExist,
  checkThatUserExistsOrThrow,
} from "../../util/validator/checkdata";
import Competition from "../../repository/CompetitionRepository";
import { successCode } from "../../util/util";
import { ObjectId } from "bson";

export const voteForParticipant = async (
  currentUsername: string,
  conversationId: string,
  selectedParticipantId: string
): Promise<any> => {
  try {
    const message = await execute(
      currentUsername,
      conversationId,
      selectedParticipantId
    );
    return { message, code: successCode };
  } catch (err: any) {
    if (err instanceof CustomError) {
      console.log(err);
      return { message: err.message, code: err.code };
    } else {
      console.log(err);
    }
  }
};

const execute = async (
  currentUsername: string,
  conversationId: string,
  selectedParticipantId: string
) => {
  const currentUser = await UserRepository.findByUsername(currentUsername);
  const competition = await Competition.findById(conversationId);

  checkThatUserExistsOrThrow(currentUser);
  checkThatCompetitionExist(competition);
  const selectedParticipant = competition.selectedParticipants.find(
    (value) => new ObjectId(selectedParticipantId) == value._id
  );

  if (selectedParticipant) {
    return await Competition.voteForParticipant(
      currentUser,
      selectedParticipant,
      new ObjectId(competition._id)
    );
  }
  return competition;
};