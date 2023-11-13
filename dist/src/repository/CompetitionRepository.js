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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const collectionName = "competitions";

class CompetitionRepository {
  static insert(competition) {
    return __awaiter(this, void 0, void 0, function* () {
      const call = db_1.db.get(collectionName);
      return yield call.insert(competition);
    });
  }

  static insertMany(competitions) {
    return __awaiter(this, void 0, void 0, function* () {
      const call = db_1.db.get(collectionName);
      return yield call.insert(competitions);
    });
  }

  static findByDate(startDate) {
    return __awaiter(this, void 0, void 0, function* () {
      const call = db_1.db.get(collectionName);
      return yield call.findOne({
        startDate,
      });
    });
  }

  static findByDateWithWinnersOnly(startDate) {
    return __awaiter(this, void 0, void 0, function* () {
      const call = db_1.db.get(collectionName);
      return yield call.findOne(
        {
          startDate,
        },
        {
          projection: {
            startDate: -1,
            endDate: -1,
            endVotingDate: -1,
            participants: -1,
            selectedParticipants: -1,
          },
        }
      );
    });
  }

  static findAll() {
    return __awaiter(this, void 0, void 0, function* () {
      const call = db_1.db.get(collectionName);
      return yield call.find();
    });
  }

  static findById(_id) {
    return __awaiter(this, void 0, void 0, function* () {
      const call = db_1.db.get(collectionName);
      return yield call.findOne({
        _id,
      });
    });
  }

  static addParticipant(participant, id) {
    return __awaiter(this, void 0, void 0, function* () {
      const call = db_1.db.get(collectionName);
      return yield call.findOneAndUpdate(
        { _id: id },
        {
          $push: { participants: participant },
        }
      );
    });
  }

  static addSelectedParticipants(selectedParticipants, id) {
    return __awaiter(this, void 0, void 0, function* () {
      const call = db_1.db.get(collectionName);
      return yield call.findOneAndUpdate(
        { _id: id },
        {
          $set: { selectedParticipants: selectedParticipants },
        }
      );
    });
  }

  static addWinnerManAndWoman(manWinner, womanWinner, id) {
    return __awaiter(this, void 0, void 0, function* () {
      const call = db_1.db.get(collectionName);
      return yield call.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            winnerMan: manWinner._id,
            womanWinner: womanWinner._id,
            pugWinnerMan: manWinner.pugId,
            pugWinnerWoman: womanWinner.pugId,
          },
        }
      );
    });
  }

  static voteForParticipant(user, selectedParticipant, competitionId) {
    return __awaiter(this, void 0, void 0, function* () {
      const call = db_1.db.get(collectionName);
      yield call.findOneAndUpdate(
        {
          "selectedParticipants._id": selectedParticipant._id,
          _id: competitionId,
        },
        {
          $push: { "selectedParticipants.$.vote": user.username },
        }
      );
      return yield call.findOneAndUpdate(
        {
          "selectedParticipants._id": selectedParticipant._id,
          _id: competitionId,
        },
        {
          $set: { "selectedParticipants.$.vote": selectedParticipant.vote + 1 },
        }
      );
    });
  }

  static unvoteForParticipant(user, selectedParticipant, competitionId) {
    return __awaiter(this, void 0, void 0, function* () {
      const call = db_1.db.get(collectionName);
      yield call.findOneAndUpdate(
        {
          "selectedParticipants._id": selectedParticipant._id,
          _id: competitionId,
        },
        {
          $pull: { "selectedParticipants.$.vote": user.username },
        }
      );
      return yield call.findOneAndUpdate(
        {
          "selectedParticipants._id": selectedParticipant._id,
          _id: competitionId,
        },
        {
          $set: { "selectedParticipants.$.vote": selectedParticipant.vote - 1 },
        }
      );
    });
  }
}
exports.default = CompetitionRepository;
