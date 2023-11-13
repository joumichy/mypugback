"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = void 0;
const checkdata_1 = require("../../../util/validator/checkdata");
const CustomError_1 = require("../../../util/error/CustomError");
const UserRepository_1 = __importDefault(require("../../../repository/UserRepository"));
const util_1 = require("../../../util/util");
const tokenManagement_1 = require("../../../util/security/tokenManagement");
const UserResponse_1 = require("../../../response/UserResponse");
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield signInUser(username, password);
        console.log("Connexion utilisateur : " + username);
        res.status(200).json({
            code: util_1.successCode,
            message: "Connexion avec succès",
            payload: (0, UserResponse_1.userToUserResponse)(user),
            token: (0, tokenManagement_1.generateAccessToken)(user),
        });
    }
    catch (err) {
        if (err instanceof CustomError_1.CustomError) {
            res.status(400).json({ message: err.message, code: err.code });
        }
        else {
            console.log(err);
        }
    }
});
exports.signIn = signIn;
const signInUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    (0, checkdata_1.checkThatUserSignInCredentialsOrThrow)(username, password);
    const existingUser = yield UserRepository_1.default.findByUsername(username);
    yield (0, checkdata_1.checkThatUserExistsOrThrow)(existingUser);
    yield(0, checkdata_1.checkThatPasswordsAreEqualsOrThrow)(
      password,
      existingUser.password
    );
    yield(0, checkdata_1.checkThatUserIsNotBanned)(existingUser);
    console.log(existingUser);
    return existingUser;
});
