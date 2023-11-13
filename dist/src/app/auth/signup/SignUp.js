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
exports.signUp = void 0;
const checkdata_1 = require("../../../util/validator/checkdata");
const passwordManagement_1 = require("../../../util/security/passwordManagement");
const UserRepository_1 = __importDefault(
  require("../../../repository/UserRepository")
);
const CustomError_1 = require("../../../util/error/CustomError");
const tokenManagement_1 = require("../../../util/security/tokenManagement");
const UserResponse_1 = require("../../../response/UserResponse");
const Follow_1 = require("../../user/follow/Follow");
const signUp = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, phoneRegion, sex } = req.body;
    try {
      const user = yield signUpUser(
        email,
        username,
        password,
        phoneRegion,
        sex
      );
      yield (0, Follow_1.executeAddFriend)(String(user._id), "lucie");
      res.status(201).json({
        code: 0,
        message: "inscription réalisée avec succès",
        payload: (0, UserResponse_1.userToUserResponse)(user),
        token: (0, tokenManagement_1.generateAccessToken)(user),
      });
    } catch (err) {
      if (err instanceof CustomError_1.CustomError) {
        res.status(400).json({ message: err.message, code: err.code });
      } else {
        console.log(err);
      }
    }
  });
exports.signUp = signUp;
const signUpUser = (email, username, password, phoneRegion, sex) =>
  __awaiter(void 0, void 0, void 0, function* () {
    (0,
    checkdata_1.checkThatUserSignUpCredentialsOrThrow)(email, password, username, phoneRegion);
    const existingUser = yield UserRepository_1.default.findByEmail(email);
    const existingUserWithUserName =
      yield UserRepository_1.default.findByUsername(username);
    (0, checkdata_1.checkThatUserDoesntExistOrThrow)(existingUser);
    (0,
    checkdata_1.checkThatUserWithUsernameDoesntExistOrThrow)(existingUserWithUserName);
    const hashedPassword = yield (0, passwordManagement_1.encodePassword)(
      password
    );
    const newUser = {
      profilePicture: "",
      admin: false,
      email,
      password: hashedPassword,
      phoneNumber: "",
      username,
      followers: 0,
      following: 0,
      pugs: 0,
      description: "",
      banned: false,
      trophy: false,
      sex,
    };
    return yield UserRepository_1.default.insert(newUser);
  });
