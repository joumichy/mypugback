import Conversation from "../models/Conversation";

export default interface ConversationResponse extends Conversation {}

export function conversationToResponse(
  conversation: Conversation
): ConversationResponse {
  return {
    members: conversation.members,
    chat: conversation.chat,
    _id: conversation._id,
    seen: conversation.seen ? conversation.seen : [],
    membersInfos: conversation.membersInfos ? conversation.membersInfos : [],
  };
}

export function conversationsToResponse(
  conversations: Conversation[]
): ConversationResponse[] {
  const response: ConversationResponse[] = [];
  conversations.forEach((value) => {
    response.push(conversationToResponse(value));
  });
  return response;
}
