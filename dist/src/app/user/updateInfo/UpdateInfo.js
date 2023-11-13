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
exports.updateInfoUser = void 0;
const checkdata_1 = require("../../../util/validator/checkdata");
const UserRepository_1 = __importDefault(
  require("../../../repository/UserRepository")
);
const CustomError_1 = require("../../../util/error/CustomError");
const tokenManagement_1 = require("../../../util/security/tokenManagement");
const UserResponse_1 = require("../../../response/UserResponse");
const util_1 = require("../../../util/util");
const FollowerRepository_1 = __importDefault(
  require("../../../repository/FollowerRepository")
);
const PugRepository_1 = __importDefault(
  require("../../../repository/PugRepository")
);
const ConversationRepository_1 = __importDefault(
  require("../../../repository/ConversationRepository")
);
const updateInfoUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const token =
        ((_a = req.headers.authorization) === null || _a === void 0
          ? void 0
          : _a.split(" ")[1]) || "";
      const { userId } = (0, tokenManagement_1.decodeToken)(token);
      const { description, profilePicture } = req.body;
      const user = yield execute(userId, description, profilePicture);
      res.status(200).json({
        code: util_1.successCode,
        message: "Information utilisateur mise à jour",
        payload: user,
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
exports.updateInfoUser = updateInfoUser;
const execute = (userId, description, profilePicture) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield UserRepository_1.default.findById(userId);
    (0, checkdata_1.checkThatUserExistsOrThrow)(currentUser);
    const followings =
      yield FollowerRepository_1.default.findAllFollowingFromUser(
        currentUser.username
      );
    const followers =
      yield FollowerRepository_1.default.findAllFollowersFromUser(
        currentUser.username
      );
    const usernamesFollowings = [];
    const usernamesFollowers = [];
    followings.forEach((value) => usernamesFollowings.push(value.username));
    followers.forEach((value) => usernamesFollowers.push(value.username));
    yield Promise.all([
      FollowerRepository_1.default.updateUserInfoFollowing(
        usernamesFollowings,
        currentUser.username,
        profilePicture
      ),
      yield FollowerRepository_1.default.updateUserInfoFollowers(
        usernamesFollowers,
        currentUser.username,
        profilePicture
      ),
      yield ConversationRepository_1.default.updateUserInfo(
        currentUser.username,
        profilePicture
      ),
      yield PugRepository_1.default.updateUserInfo(currentUser, profilePicture),
    ]);
    const result = yield UserRepository_1.default.updateUserInfo(
      currentUser,
      description,
      profilePicture
    );
    return (0, UserResponse_1.userToUserResponse)(result);
  });
