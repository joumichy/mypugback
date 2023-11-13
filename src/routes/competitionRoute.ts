import { Router } from "express";
import { participateToCompetition } from "../app/competition/Participate";
import { getCompetition } from "../app/competition/GetCompetition";
import { getCompetitionByid } from "../app/competition/GetCompetitionById";
import { getWinners } from "../app/competition/GetWinners";
import { changeSelectedParticipants } from "../app/competition/ChangeSelectedParticipants";

const competition = Router();

const getAllCompetitionPath = "/all";
const getCompetitionPath = "/";
const getCompetitionByIdPath = "/:id";
const getCompetitionWinnerPath = "/winner";
const particiaptePath = "/participate";
const changePath = "/change";

competition.get(getCompetitionPath, getCompetition);
competition.get(getCompetitionByIdPath, getCompetitionByid);
competition.get(getCompetitionWinnerPath, getWinners);
competition.put(particiaptePath, participateToCompetition);
competition.put(changePath, changeSelectedParticipants);

export default competition;
