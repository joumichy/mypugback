"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.competitionsToResponse = exports.competitionToResponse = void 0;
function competitionToResponse(competition) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j;
  return {
    _id: competition._id,
    endDate: (_a = competition.endDate) !== null && _a !== void 0 ? _a : 0,
    endVotingDate:
      (_b = competition.endVotingDate) !== null && _b !== void 0 ? _b : 0,
    participants:
      (_c = competition.participants) !== null && _c !== void 0 ? _c : [],
    pugWinnerMan:
      (_d = competition.pugWinnerMan) !== null && _d !== void 0 ? _d : "",
    pugWinnerWoman:
      (_e = competition.pugWinnerWoman) !== null && _e !== void 0 ? _e : "",
    selectedParticipants:
      (_f = competition.selectedParticipants) !== null && _f !== void 0
        ? _f
        : [],
    startDate: (_g = competition.startDate) !== null && _g !== void 0 ? _g : 0,
    winnerMan: (_h = competition.winnerMan) !== null && _h !== void 0 ? _h : "",
    winnerWoman:
      (_j = competition.winnerWoman) !== null && _j !== void 0 ? _j : "",
  };
}
exports.competitionToResponse = competitionToResponse;
function competitionsToResponse(competitions) {
  const result = [];
  competitions.forEach((elem) => result.push(competitionToResponse(elem)));
  return result;
}
exports.competitionsToResponse = competitionsToResponse;
