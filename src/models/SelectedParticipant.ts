import { Participant } from "./Participant";

export interface SelectedParticipant extends Participant {
  vote: number;
}
