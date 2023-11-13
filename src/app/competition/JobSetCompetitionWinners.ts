import moment from "moment";
import CompetitionRepository from "../../repository/CompetitionRepository";
import { SelectedParticipant } from "../../models/SelectedParticipant";
import { ObjectId } from "bson";

export const jobSetCompetitionsWinners = async () => {
  const date = moment().weekday(1).hour(12);
  const competiton = await CompetitionRepository.findByDate(date.unix());

  if (competiton && competiton.selectedParticipants.length) {
    const selectedParticipants: SelectedParticipant[] =
      competiton.selectedParticipants;
    const manWinner = getWinnerPaticipants(selectedParticipants, "man");
    const womanWinner = getWinnerPaticipants(selectedParticipants, "woman");
    await CompetitionRepository.addWinnerManAndWoman(
      manWinner,
      womanWinner,
      new ObjectId(competiton._id)
    );
  }
};

const getWinnerPaticipants = (
  participants: SelectedParticipant[],
  sex: "man" | "woman"
): SelectedParticipant => {
  const filteredParticipant = participants.filter(
    (participant) => participant.sex == sex
  );
  return filteredParticipant.reduce(function (prev, current) {
    return prev.vote > current.vote ? prev : current;
  });
};
