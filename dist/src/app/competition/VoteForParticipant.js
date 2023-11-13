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
exports.voteForParticipant = void 0;
const CustomError_1 = require("../../util/error/CustomError");
const UserRepository_1 = __importDefault(
  require("../../repository/UserRepository")
);
const checkdata_1 = require("../../util/validator/checkdata");
const CompetitionRepository_1 = __importDefault(
  require("../../repository/CompetitionRepository")
);
const util_1 = require("../../util/util");
const bson_1 = require("bson");
const voteForParticipant = (currentUsername, competitionId, pugId, username) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const message = yield execute(
        currentUsername,
        competitionId,
        pugId,
        username
      );
      return { message, code: util_1.successCode };
    } catch (err) {
      if (err instanceof CustomError_1.CustomError) {
        console.log(err);
        return { message: err.message, code: err.code };
      } else {
        console.log(err);
      }
    }
  });
exports.voteForParticipant = voteForParticipant;
const execute = (currentUsername, conversationId, pugId, username) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield UserRepository_1.default.findByUsername(
      currentUsername
    );
    const competition = yield CompetitionRepository_1.default.findById(
      conversationId
    );
    (0, checkdata_1.checkThatUserExistsOrThrow)(currentUser);
    (0, checkdata_1.checkThatCompetitionExist)(competition);
    const selectedParticipant = competition.selectedParticipants.find(
      (value) =>
        new bson_1.ObjectId(pugId) == value.pugId && username == value.username
    );
    if (selectedParticipant) {
      return yield CompetitionRepository_1.default.voteForParticipant(
        currentUser,
        selectedParticipant,
        new bson_1.ObjectId(competition._id)
      );
    }
    return competition.selectedParticipants;
  });
