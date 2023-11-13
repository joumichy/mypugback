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
exports.getCompetitionByid = void 0;
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
const CompetitionResponse_1 = require("../../response/CompetitionResponse");
const getCompetitionByid = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const token =
        ((_a = req.headers.authorization) === null || _a === void 0
          ? void 0
          : _a.split(" ")[1]) || "";
      const { userId } = (0, tokenManagement_1.decodeToken)(token);
      const { id } = req.params;
      const result = yield execute(userId, id);
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
exports.getCompetitionByid = getCompetitionByid;
const execute = (userId, competitionId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield UserRepository_1.default.findById(userId);
    (0, checkdata_1.checkThatUserExistsOrThrow)(currentUser);
    const competiton = yield CompetitionRepository_1.default.findById(
      competitionId
    );
    (0, checkdata_1.checkThatCompetitionExist)(competiton);
    return (0, CompetitionResponse_1.competitionToResponse)(competiton);
  });
