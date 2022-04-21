"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SignUp_1 = require("../app/auth/signup/SignUp");
const SignIn_1 = require("../app/auth/signin/SignIn");
const userRouter = (0, express_1.Router)();
const signUpPath = "/signup";
const signInPath = "/signin";
userRouter.post(signUpPath, SignUp_1.signUp);
userRouter.post(signInPath, SignIn_1.signIn);
exports.default = userRouter;