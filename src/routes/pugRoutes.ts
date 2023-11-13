import { Router } from "express";
import { addPug } from "../app/pug/add/AddPug";
import { getAllPugs } from "../app/pug/getall/GetAllPug";
import { getAllPugsFromFollowing } from "../app/pug/getallfromfollowing/GetAllFromFollowing";
import { likePug } from "../app/pug/like/Like";
import { unLikePug } from "../app/pug/unlike/UnLike";
import { commentPug } from "../app/pug/comment/CommentPug";
import { getComments } from "../app/pug/getcomment/GetComment";
import { getAllPugsFromUser } from "../app/pug/getallfromuser/GetAllFromUser";
import { getAllPugsFromFollowingPagealble } from "../app/pug/getallfromfollowing/GetAllFromFollowingPageable";
import { deletePug } from "../app/pug/delete/DeletePug";
import { getAllPugsUsersPageable } from "../app/pug/actualityall/ActualityAll";
import { getPug } from "../app/pug/get/GetPug";
import { signalPug } from "../app/pug/signal/SignalPug";

const pugRouter = Router();

const add = "/add";
const get = "/get";
const deletePath = "/delete";
const getAll = "/getall";
const getAllFromUser = "/getallfromuser";
const actualitypageable = "/actualitypageable";

const actualityall = "/actualityall";
const actuality = "/actuality";
const like = "/like";
const unlike = "/unlike";
const comment = "/comment";
const signalPath = "/signal";

pugRouter.post(add, addPug);
pugRouter.get(get, getPug);
pugRouter.get(getAll, getAllPugs);
pugRouter.get(getAllFromUser, getAllPugsFromUser);

pugRouter.get(actuality, getAllPugsFromFollowing);
pugRouter.get(actualitypageable, getAllPugsFromFollowingPagealble);
pugRouter.get(actualityall, getAllPugsUsersPageable);

pugRouter.put(deletePath, deletePug);
pugRouter.put(like, likePug);
pugRouter.put(unlike, unLikePug);
pugRouter.put(comment, commentPug);
pugRouter.get(comment, getComments);
pugRouter.post(signalPath, signalPug);

export default pugRouter;
