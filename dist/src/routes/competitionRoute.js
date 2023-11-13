"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Participate_1 = require("../app/competition/Participate");
const GetCompetition_1 = require("../app/competition/GetCompetition");
const GetCompetitionById_1 = require("../app/competition/GetCompetitionById");
const GetWinners_1 = require("../app/competition/GetWinners");
const ChangeSelectedParticipants_1 = require("../app/competition/ChangeSelectedParticipants");
const competition = (0, express_1.Router)();
const getAllCompetitionPath = "/all";
const getCompetitionPath = "/";
const getCompetitionByIdPath = "/:id";
const getCompetitionWinnerPath = "/winner";
const particiaptePath = "/participate";
const changePath = "/change";
competition.get(getCompetitionPath, GetCompetition_1.getCompetition);
competition.get(
  getCompetitionByIdPath,
  GetCompetitionById_1.getCompetitionByid
);
competition.get(getCompetitionWinnerPath, GetWinners_1.getWinners);
competition.put(particiaptePath, Participate_1.participateToCompetition);
competition.put(
  changePath,
  ChangeSelectedParticipants_1.changeSelectedParticipants
);
exports.default = competition;
