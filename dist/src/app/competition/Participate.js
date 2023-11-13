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
exports.participateToCompetition = void 0;
const tokenManagement_1 = require("../../util/security/tokenManagement");
const CustomError_1 = require("../../util/error/CustomError");
const UserRepository_1 = __importDefault(
  require("../../repository/UserRepository")
);
const checkdata_1 = require("../../util/validator/checkdata");
const bson_1 = require("bson");
const CompetitionRepository_1 = __importDefault(
  require("../../repository/CompetitionRepository")
);
const moment_1 = __importDefault(require("moment"));
const participateToCompetition = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const token =
        ((_a = req.headers.authorization) === null || _a === void 0
          ? void 0
          : _a.split(" ")[1]) || "";
      const { userId } = (0, tokenManagement_1.decodeToken)(token);
      const { pugId, competitionId, pugPicture } = req.body;
      const user = yield execute(userId, pugId, competitionId, pugPicture);
      res
        .status(200)
        .json({
          code: user.code,
          message: user.message,
          payload: user.payload,
        });
    } catch (err) {
      if (err instanceof CustomError_1.CustomError) {
        console.log(err);
        res.status(400).json({ message: err.message, code: err.code });
      } else {
        console.log(err);
      }
    }
  });
exports.participateToCompetition = participateToCompetition;
const execute = (userId, pugId, competitionId, pugPicture) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const currentUser = yield UserRepository_1.default.findById(userId);
    (0, checkdata_1.checkThatUserExistsOrThrow)(currentUser);
    const participant = {
      username: currentUser.username,
      date: (0, moment_1.default)().unix(),
      sex: (_b = currentUser.sex) !== null && _b !== void 0 ? _b : "man",
      userId: new bson_1.ObjectId(currentUser._id),
      pugId: new bson_1.ObjectId(pugId),
      pugPicture: pugPicture,
    };
    const result = yield CompetitionRepository_1.default.addParticipant(
      participant,
      competitionId
    );
    (0, checkdata_1.checkThatCompetitionExist)(result);
    return {
      code: 0,
      message: "Inscription au concours effectué",
    };
  });
