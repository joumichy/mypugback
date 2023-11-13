import UserRepository from "../../repository/UserRepository";
import {
  checkThatUserExistsOrThrow,
  checkThatUserIsNotLucieOrThrow,
  checkThatUserIsNotTheSame,
} from "../../util/validator/checkdata";
import ConversationRepository from "../../repository/ConversationRepository";
import { Request, Response } from "express";
import { decodeToken } from "../../util/security/tokenManagement";
import { successCode } from "../../util/util";
import { CustomError } from "../../util/error/CustomError";
import { conversationToResponse } from "../../response/ConversationResponse";
import Conversation from "../../models/Conversation";
import { userToUserFactoryResponse } from "../../response/UserFactoryResponse";

export const createConversation = async (
  req: Request,
  res: Response
): Promise<any> => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  try {
    const { userId } = decodeToken(token);
    const { username } = req.body;
    const { conversation, exist } = await execute(userId, username);
    const message = exist ? "Already Exist, sending data.." : "created";
    res.status(200).json({
      code: successCode,
      message: "Conversation : " + message,
      payload: conversation,
    });
  } catch (err: any) {
    if (err instanceof CustomError) {
      console.log(err);
      res.status(400).json({ message: err.message, code: err.code });
    } else {
      console.log(err);
    }
  }
};

const execute = async (userId: string, receiverUsername: string) => {
  const currentUser = await UserRepository.findById(userId);
  const receiverUser = await UserRepository.findByUsername(receiverUsername);

  checkThatUserExistsOrThrow(currentUser);
  checkThatUserExistsOrThrow(receiverUser);
  checkThatUserIsNotLucieOrThrow(receiverUser);
  checkThatUserIsNotTheSame(currentUser, receiverUser);
  const result = await ConversationRepository.findByMembers([
    currentUser.username,
    receiverUser.username,
  ]);

  if (result) {
    let conversation = conversationToResponse(result);

    return { conversation, exist: true };
  } else {
    const newConversation: Conversation = {
      members: [currentUser.username, receiverUser.username],
      chat: [],
      seen: [currentUser.username],
      membersInfos: [
        userToUserFactoryResponse(currentUser),
        userToUserFactoryResponse(receiverUser),
      ],
    };
    await ConversationRepository.insert(newConversation);
    return { conversation: newConversation, exist: false };
  }
};
