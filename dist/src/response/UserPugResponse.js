"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPugToResponseNoComment = exports.userPugToResponse = void 0;
const bson_1 = require("bson");
const PugResponse_1 = require("./PugResponse");
function userPugToResponse(userPug, username) {
  const pugsResponse = [];
  userPug.pugs.forEach((value) =>
    pugsResponse.push(
      (0, PugResponse_1.pugToResponse)(value, username, userPug)
    )
  );
  return {
    pugs: pugsResponse,
    username: userPug.username,
  };
}
exports.userPugToResponse = userPugToResponse;
function userPugToResponseNoComment(userPug, currentUser, otherUser) {
  const pugsResponse = [];
  userPug.forEach((value) => {
    var _a;
    return pugsResponse.push(
      (0, PugResponse_1.pugToResponseNoComment)(
        value.pug,
        currentUser,
        {
          _id: new bson_1.ObjectId(value.userId),
          username: value._id,
          profilePicture:
            (_a = value.profilePicture) !== null && _a !== void 0 ? _a : "",
        },
        value.numberOfComments
      )
    );
  });
  return {
    pugs: pugsResponse,
    username: otherUser.username,
  };
}
exports.userPugToResponseNoComment = userPugToResponseNoComment;
