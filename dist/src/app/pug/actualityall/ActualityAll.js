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
exports.getAllPugsUsersPageable = void 0;
const checkdata_1 = require("../../../util/validator/checkdata");
const UserRepository_1 = __importDefault(
  require("../../../repository/UserRepository")
);
const CustomError_1 = require("../../../util/error/CustomError");
const tokenManagement_1 = require("../../../util/security/tokenManagement");
const PugRepository_1 = __importDefault(
  require("../../../repository/PugRepository")
);
const util_1 = require("../../../util/util");
const PugResponse_1 = require("../../../response/PugResponse");
const UserFactoryResponse_1 = require("../../../response/UserFactoryResponse");
const FollowerRepository_1 = __importDefault(
  require("../../../repository/FollowerRepository")
);
const getAllPugsUsersPageable = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const { startInd, endInd } = req.query;
      const token =
        ((_a = req.headers.authorization) === null || _a === void 0
          ? void 0
          : _a.split(" ")[1]) || "";
      const { userId } = (0, tokenManagement_1.decodeToken)(token);
      const result = yield execute(
        userId,
        parseInt(startInd),
        parseInt(endInd)
      );
      res.status(200).json({
        code: util_1.successCode,
        message: "Pugs de tous les utilisateurs",
        payload: { pugs: result },
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
exports.getAllPugsUsersPageable = getAllPugsUsersPageable;
const execute = (userId, startInd, endInd) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield UserRepository_1.default.findById(userId);
    const blockedList =
      yield FollowerRepository_1.default.findAllBlockedFromUser(
        currentUser.username
      );
    (0, checkdata_1.checkThatUserExistsOrThrow)(currentUser);
    yield (0, checkdata_1.checkThatUserIsNotBanned)(currentUser);
    const result = yield PugRepository_1.default.getAllPugs(startInd, endInd);
    const pugsResponse = [];
    result.forEach((elem) => {
      if (!blockedList.find((value) => value.username == elem._id))
        pugsResponse.push(
          (0, PugResponse_1.pugToResponsePageableSorted)(
            elem.pug,
            (0, UserFactoryResponse_1.userToUserFactoryResponse)(currentUser),
            {
              _id: elem.userId,
              username: elem._id,
              profilePicture: elem.profilePicture,
            }
          )
        );
    });
    return pugsResponse;
  });
