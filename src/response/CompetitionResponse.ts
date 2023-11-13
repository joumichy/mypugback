import { Competition } from "../models/Competition";

export interface CompetitionResponse extends Competition {}

export function competitionToResponse(
  competition: Competition
): CompetitionResponse {
  return {
    _id: competition._id,
    endDate: competition.endDate ?? 0,
    endVotingDate: competition.endVotingDate ?? 0,
    participants: competition.participants ?? [],
    pugWinnerMan: competition.pugWinnerMan ?? "",
    pugWinnerWoman: competition.pugWinnerWoman ?? "",
    selectedParticipants: competition.selectedParticipants ?? [],
    startDate: competition.startDate ?? 0,
    winnerMan: competition.winnerMan ?? "",
    winnerWoman: competition.winnerWoman ?? "",
  };
}

export function competitionsToResponse(
  competitions: Competition[]
): CompetitionResponse[] {
  const result: CompetitionResponse[] = [];
  competitions.forEach((elem) => result.push(competitionToResponse(elem)));
  return result;
}
