import { Router } from "express";
import { signUp } from "../app/auth/signup/SignUp";
import { signIn } from "../app/auth/signin/SignIn";
import { getUserInfo } from "../app/user/info/GetInfo";
import { getUserWithName } from "../app/user/info/GetInfoFromUser";
import { followUser } from "../app/user/follow/Follow";
import { unFollowUser } from "../app/user/unfollow/UnFollow";
import { findUsers } from "../app/user/find/FindUsers";
import { getUserFollowing } from "../app/user/following/GetFollowing";
import { getUserFollowers } from "../app/user/followers/GetFollowers";
import { deleteAccount } from "../app/user/delete/DeleteAccount";
import { blockUser } from "../app/user/block/BlockUser";
import { signalUser } from "../app/user/signal/SignalUser";
import { deblockUser } from "../app/user/deblock/DeblockUser";
import { getUsersBlocked } from "../app/user/findBlocked/GetBlocked";
import { updateInfoUser } from "../app/user/updateInfo/UpdateInfo";
import { createPayment } from "../app/payment/Payment";

const userRouter = Router();

const signUpPath = "/signup";
const signInPath = "/signin";
const infoPath = "/info";
const updateInfoPath = "/info";
const deletePath = "/delete";
const blockPath = "/block";
const blockedPath = "/blocked";
const deblockPath = "/deblock";
const getPath = "/get";
const findPath = "/find";
const getfollowers = "/followers";
const getfollowing = "/following";

const followPath = "/follow";
const unfollowPath = "/unfollow";
const signalPath = "/signal";
const createPaymentPath = "/createpayment";

userRouter.post(signUpPath, signUp);
userRouter.post(signInPath, signIn);
userRouter.get(infoPath, getUserInfo);
userRouter.get(getPath, getUserWithName);
userRouter.get(findPath, findUsers);
userRouter.get(getfollowing, getUserFollowing);
userRouter.get(getfollowers, getUserFollowers);

userRouter.put(followPath, followUser);
userRouter.delete(deletePath, deleteAccount);
userRouter.put(blockPath, blockUser);
userRouter.put(deblockPath, deblockUser);
userRouter.get(blockedPath, getUsersBlocked);
userRouter.put(unfollowPath, unFollowUser);
userRouter.post(signalPath, signalUser);
userRouter.put(updateInfoPath, updateInfoUser);
userRouter.post(createPaymentPath, createPayment);

export default userRouter;
