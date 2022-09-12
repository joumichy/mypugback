"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SignUp_1 = require("../app/auth/signup/SignUp");
const SignIn_1 = require("../app/auth/signin/SignIn");
const GetInfo_1 = require("../app/user/info/GetInfo");
const GetInfoFromUser_1 = require("../app/user/info/GetInfoFromUser");
const Follow_1 = require("../app/user/follow/Follow");
const UnFollow_1 = require("../app/user/unfollow/UnFollow");
const FindUsers_1 = require("../app/user/find/FindUsers");
const GetFollowing_1 = require("../app/user/following/GetFollowing");
const GetFollowers_1 = require("../app/user/followers/GetFollowers");
const userRouter = (0, express_1.Router)();
const signUpPath = "/signup";
const signInPath = "/signin";
const infoPath = "/info";
const getPath = "/get";
const findPath = "/find";
const getfollowers = "/followers";
const getfollowing = "/following";
const followPath = "/follow";
const unfollowPath = "/unfollow";
userRouter.post(signUpPath, SignUp_1.signUp);
userRouter.post(signInPath, SignIn_1.signIn);
userRouter.get(infoPath, GetInfo_1.getUserInfo);
userRouter.get(getPath, GetInfoFromUser_1.getUserWithName);
userRouter.get(findPath, FindUsers_1.findUsers);
userRouter.get(getfollowing, GetFollowing_1.getUserFollowing);
userRouter.get(getfollowers, GetFollowers_1.getUserFollowers);
userRouter.put(followPath, Follow_1.followUser);
userRouter.put(unfollowPath, UnFollow_1.unFollowUser);
exports.default = userRouter;
