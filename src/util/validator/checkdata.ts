import {
  accountAlreadyBlocked,
  accountAlreadyExist,
  accountAlreadyExistWithPhoneNumber,
  accountAlreadyExistWithUsername,
  accountAlreadyFollow,
  accountBanned,
  accountBlocked,
  accountDoesntExist,
  accountIsHimself,
  accountNotAllowed,
  accountNotConnected,
  accountNotFollowed,
  alreadyLiked,
  bannedCode,
  blockedCode,
  commentNotFound,
  competitionDoesntExist,
  conversationDoesntExist,
  conversationsDoesntExist,
  emailInvalid,
  errorCode,
  errorCodeLucie,
  errorSurrounded,
  lucie,
  notAlreadyliked,
  passwordInvalid,
  pugDoesntExist,
  pugsDoesntExist,
  sameUser,
  usernameInvalid,
  usernameIsLucie,
  wrongPassword,
} from "../util";
import * as EmailValidator from "email-validator";
import { CustomError } from "../error/CustomError";
import { isSame } from "../security/passwordManagement";
import { User } from "../../models/User";
import Conversation from "../../models/Conversation";
import { Pug } from "../../models/Pug";
import { UserPug } from "../../models/UserPug";
import { SignalFactory } from "../../models/SignalFactory";
import { UserFactory } from "../../models/UserFactory";
import { Competition } from "../../models/Competition";

export function checkThatUserSignUpCredentialsOrThrow(
  email: string,
  password: string,
  username: string,
  phoneRegion: string
) {
  // const pn = parsePhoneNumber(phoneNumber, { regionCode: phoneRegion });
  if (!email || email == "" || !EmailValidator.validate(email)) {
    throw new CustomError(errorCode, emailInvalid, {});
  }

  if (!password || password == "" || password.length < 7) {
    throw new CustomError(errorCode, passwordInvalid, {});
  }
  if (!username || username == "") {
    throw new CustomError(errorCode, usernameInvalid, {});
  }
  // if (!pn.valid) {
  //   throw new CustomError(errorCode, phoneNumberInvalid, {});
  // }
}

export function checkThatUserSignInCredentialsOrThrow(
  password: string,
  username: string
) {
  if (!password || password == "") {
    throw new CustomError(errorCode, passwordInvalid, {});
  }
  if (!username || username == "") {
    throw new CustomError(errorCode, usernameInvalid, {});
  }
}

export async function checkThatPasswordsAreEqualsOrThrow(
  password: string,
  confirmedPassword: string
) {
  if (!(await isSame(confirmedPassword, password))) {
    throw new CustomError(errorCode, wrongPassword, {});
  }
}

export function checkThatUserIsConnected(token: string) {
  if (token == "" || token == null) {
    throw new CustomError(errorCode, accountNotConnected, {});
  }
}

export function checkThatUserisntHimself(user: User, userToAdd: User) {
  if (user.username == userToAdd.username) {
    throw new CustomError(errorCode, accountIsHimself, {});
  }
}
export function checkThatUserExistsOrThrow(user: User) {
  if (!user) {
    throw new CustomError(errorCode, accountDoesntExist, {});
  }
}
export function checkThatUserFactoryExistsOrThrow(user: UserFactory) {
  if (!user) {
    throw new CustomError(errorCode, accountDoesntExist, {});
  }
}

export function checkThatSignalExistOrThrow(signalFactory: SignalFactory) {
  if (!signalFactory) {
    throw new CustomError(errorCode, errorSurrounded, {});
  }
}
export function checkThatFeatureIsSucess(user: User) {
  if (!user) {
    throw new CustomError(errorCode, errorSurrounded, {});
  }
}
export function checkThatUserisNotBlocked(user: User) {
  if (user) {
    throw new CustomError(blockedCode, accountBlocked, {});
  }
}

export function checkThatCommentsExistOrThrow(comment: any) {
  if (!comment) {
    throw new CustomError(errorCode, commentNotFound, {});
  }
}

export function checkThatUserIsNotLucieOrThrow(user: User) {
  if (user.username == lucie) {
    throw new CustomError(errorCodeLucie, usernameIsLucie, {});
  }
}

export function checkThatUserIsNotTheSame(user: User, secondUser: User) {
  if (user.username == secondUser.username) {
    throw new CustomError(errorCode, sameUser, {});
  }
}

export function checkThatPugExistOrThrow(pug: Pug) {
  if (!pug) {
    throw new CustomError(errorCode, pugDoesntExist, {});
  }
}

export function checkThatPugsExistOrThrow(userPug: UserPug) {
  if (!userPug) {
    throw new CustomError(errorCode, pugsDoesntExist, {});
  }
}

export function checkThatUserIsNotLucieOrThrowWithName(username: String) {
  if (username == lucie) {
    throw new CustomError(errorCodeLucie, usernameIsLucie, {});
  }
}
export function checkThatUserIsLucie(user: User) {
  if (user.username == lucie) {
    throw new CustomError(errorCode, accountNotAllowed, {});
  }
}

export function checkThatUsersExistsOrThrow(user: User[]) {
  if (!user) {
    throw new CustomError(errorCode, accountDoesntExist, {});
  }
}

export function checkThatUserNotAlreadyLike(user: any) {
  if (user) {
    throw new CustomError(errorCode, alreadyLiked, {});
  }
}

export function checkThatUserHasLiked(user: any) {
  if (!user) {
    throw new CustomError(errorCode, notAlreadyliked, {});
  }
}
export function checkThatUserIsNotAlreadyFollow(user: any) {
  if (user) {
    throw new CustomError(errorCode, accountAlreadyFollow, {});
  }
}
export function checkThatUserIsNotAlreadyBlocked(user: any) {
  if (user) {
    throw new CustomError(errorCode, accountAlreadyBlocked, {});
  }
}
export function checkThatUserIsNotBanned(user: User) {
  if (user.banned) {
    throw new CustomError(bannedCode, accountBanned, {});
  }
}

export function checkThatUserNotFollowed(user: User) {
  if (!user) {
    throw new CustomError(errorCode, accountNotFollowed, {});
  }
}

export function checkThatConversationExist(conversations: Conversation) {
  if (!conversations) {
    throw new CustomError(errorCode, conversationDoesntExist, {});
  }
}

export function checkThatCompetitionExist(competition: Competition) {
  if (!competition) {
    throw new CustomError(errorCode, competitionDoesntExist, {});
  }
}

export function checkThatConversationsExist(conversations: Conversation[]) {
  if (conversations.length == 0) {
    throw new CustomError(errorCode, conversationsDoesntExist, {});
  }
}

export function checkThatUserWithUsernameDoesntExistOrThrow(user: User) {
  if (user) {
    throw new CustomError(errorCode, accountAlreadyExistWithUsername, {});
  }
}
export function checkThatUserDoesntExistOrThrow(user: User) {
  if (user) {
    throw new CustomError(errorCode, accountAlreadyExist, {});
  }
}

export function checkThatUserWithPhoneNumberDoesntExistOrThrow(user: User) {
  if (user) {
    throw new CustomError(errorCode, accountAlreadyExistWithPhoneNumber, {});
  }
}
