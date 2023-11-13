import { Router } from "express";
import { getAllPugsSignal } from "../app/signal/getpugs/GetPugs";
import { getPugSignal } from "../app/signal/getPug/GetPug";
import { getPugsSignalByUsername } from "../app/signal/getPug/GetPugsFromUser";
import { getUserSignal } from "../app/signal/getUser/GetUser";
import { getAllUsersSignal } from "../app/signal/getusers/GetUsers";
import { banUser } from "../app/user/ban/BanUser";

const signalRouter = Router();
const pugsPath = "/pugs";
const pugsByUsernamePath = "/pugs/user";
const pugPath = "/pug";
const usersPath = "/users";
const userPath = "/user";
const userBanPath = "/user/ban";

signalRouter.get(pugsPath, getAllPugsSignal);
signalRouter.get(pugPath, getPugSignal);
signalRouter.get(pugsByUsernamePath, getPugsSignalByUsername);
signalRouter.get(userPath, getUserSignal);
signalRouter.get(usersPath, getAllUsersSignal);
signalRouter.put(userBanPath, banUser);

export default signalRouter;
