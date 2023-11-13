import { IMonkManager } from "monk";
import { env } from "../util/config";

const monk = require("monk");
export const db: IMonkManager = monk(env.DBURL);
console.log("Connected to DB", db._state);
