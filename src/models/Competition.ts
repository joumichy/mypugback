import { ObjectId } from "bson";
import { Participant } from "./Participant";
import { SelectedParticipant } from "./SelectedParticipant";

export interface Competition {
  _id?: ObjectId;
  startDate: number;
  endDate: number;
  endVotingDate: number;
  participants: Participant[];
  selectedParticipants: SelectedParticipant[];
  winnerMan: ObjectId | String;
  pugWinnerMan: ObjectId | String;
  winnerWoman: ObjectId | String;
  pugWinnerWoman: ObjectId | String;
}
