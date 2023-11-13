import moment from "moment";
import CompetitionRepository from "../../repository/CompetitionRepository";
import { Competition } from "../../models/Competition";

export const createCompetition = async () => {
  const date = moment().weekday(1).hour(12);
  const competiton = await CompetitionRepository.findByDate(date.unix());

  if (!competiton) {
    const deadline = moment().weekday(5).hour(20);
    const endVotingDate = moment().weekday(6).hour(20);
    const newCompetition: Competition = {
      selectedParticipants: [],
      startDate: date.unix(),
      endDate: deadline.unix(),
      endVotingDate: endVotingDate.unix(),
      participants: [],
      winnerMan: "",
      winnerWoman: "",
      pugWinnerMan: "",
      pugWinnerWoman: "",
    };
    await CompetitionRepository.insert(newCompetition);
  }
};
