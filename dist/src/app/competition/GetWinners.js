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
exports.getWinners = void 0;
const tokenManagement_1 = require("../../util/security/tokenManagement");
const util_1 = require("../../util/util");
const CustomError_1 = require("../../util/error/CustomError");
const UserRepository_1 = __importDefault(
  require("../../repository/UserRepository")
);
const checkdata_1 = require("../../util/validator/checkdata");
const CompetitionRepository_1 = __importDefault(
  require("../../repository/CompetitionRepository")
);
const moment_1 = __importDefault(require("moment"));
const getWinners = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const token =
        ((_a = req.headers.authorization) === null || _a === void 0
          ? void 0
          : _a.split(" ")[1]) || "";
      const { userId } = (0, tokenManagement_1.decodeToken)(token);
      const result = yield execute(userId);
      res.status(200).json({
        code: util_1.successCode,
        message: "Competition",
        payload: result,
      });
    } catch (err) {
      if (err instanceof CustomError_1.CustomError) {
        res.status(400).json({ message: err.message, code: err.code });
      } else {
        console.log(err);
      }
    }
  });
exports.getWinners = getWinners;
const execute = (userId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield UserRepository_1.default.findById(userId);
    const date = (0, moment_1.default)().weekday(1).hour(12);
    (0, checkdata_1.checkThatUserExistsOrThrow)(currentUser);
    const competiton =
      yield CompetitionRepository_1.default.findByDateWithWinnersOnly(
        date.unix()
      );
    (0, checkdata_1.checkThatCompetitionExist)(competiton);
    return competiton;
  });
