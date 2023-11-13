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
exports.jobSelectParticipants = void 0;
const moment_1 = __importDefault(require("moment"));
const CompetitionRepository_1 = __importDefault(
  require("../../repository/CompetitionRepository")
);
const bson_1 = require("bson");
const loadsh = require("lodash");
const jobSelectParticipants = (competitionId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const date = (0, moment_1.default)().weekday(1).hour(12);
    const competiton = competitionId
      ? yield CompetitionRepository_1.default.findById(competitionId)
      : yield CompetitionRepository_1.default.findByDate(date.unix());
    if (competiton && competiton.participants.length) {
      const participants = competiton.participants;
      const selectedManParticipants = getSelectedPaticipants(
        participants,
        "man"
      );
      selectedManParticipants.map((value) => (value.vote = 0));
      const selectedWomanParticipants = getSelectedPaticipants(
        participants,
        "woman"
      );
      selectedWomanParticipants.map((value) => (value.vote = 0));
      return yield CompetitionRepository_1.default.addSelectedParticipants(
        [...selectedManParticipants, ...selectedWomanParticipants],
        new bson_1.ObjectId(competiton._id)
      );
    }
  });
exports.jobSelectParticipants = jobSelectParticipants;
const getSelectedPaticipants = (participants, sex) => {
  const filteredParticipant = participants.filter(
    (participant) => participant.sex == sex
  );
  return loadsh.sampleSize(filteredParticipant, 2);
};
