import { ObjectId } from "bson";
import { UserPug } from "../models/UserPug";
import {
  PugResponse,
  pugToResponse,
  pugToResponseNoComment,
} from "./PugResponse";
import { UserPugNoComment } from "../models/UserPugNoComment";
import { UserFactory } from "../models/UserFactory";

export interface UserPugResponse {
  _id?: ObjectId;
  username: string;
  pugs: PugResponse[];
}

export interface UserPugNoCommentResponse {
  _id?: string;
  username: string;
  pugs: PugResponse[];
}

export function userPugToResponse(
  userPug: UserPug,
  username: string
): UserPugResponse {
  const pugsResponse: PugResponse[] = [];
  userPug.pugs.forEach((value) =>
    pugsResponse.push(pugToResponse(value, username, userPug))
  );
  return {
    pugs: pugsResponse,
    username: userPug.username,
  };
}

export function userPugToResponseNoComment(
  userPug: UserPugNoComment[],
  currentUser: UserFactory,
  otherUser: UserFactory
): UserPugNoCommentResponse {
  const pugsResponse: PugResponse[] = [];
  userPug.forEach((value) =>
    pugsResponse.push(
      pugToResponseNoComment(
        value.pug,
        currentUser,
        {
          _id: new ObjectId(value.userId),
          username: value._id,
          profilePicture: value.profilePicture ?? "",
        },
        value.numberOfComments
      )
    )
  );
  return {
    pugs: pugsResponse,
    username: otherUser.username,
  };
}
