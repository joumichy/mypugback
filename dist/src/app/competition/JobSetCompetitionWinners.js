"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobSetCompetitionsWinners = void 0;
const moment_1 = __importDefault(require("moment"));
const CompetitionRepository_1 = __importDefault(
  require("../../repository/CompetitionRepository")
);
const bson_1 = require("bson");
const jobSetCompetitionsWinners = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const date = (0, moment_1.default)().weekday(1).hour(12);
    const competiton = yield CompetitionRepository_1.default.findByDate(
      date.unix()
    );
    if (competiton && competiton.selectedParticipants.length) {
      const selectedParticipants = competiton.selectedParticipants;
      const manWinner = getWinnerPaticipants(selectedParticipants, "man");
      const womanWinner = getWinnerPaticipants(selectedParticipants, "woman");
      yield CompetitionRepository_1.default.addWinnerManAndWoman(
        manWinner,
        womanWinner,
        new bson_1.ObjectId(competiton._id)
      );
    }
  });
exports.jobSetCompetitionsWinners = jobSetCompetitionsWinners;
const getWinnerPaticipants = (participants, sex) => {
  const filteredParticipant = participants.filter(
    (participant) => participant.sex == sex
  );
  return filteredParticipant.reduce(function (prev, current) {
    return prev.vote > current.vote ? prev : current;
  });
};
