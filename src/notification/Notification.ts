import admin from "firebase-admin";
import { UserFactoryResponse } from "../response/UserFactoryResponse";

export async function sendNotificationEventMessage(
  token: string,
  username: string,
  message: string,
  type: string,
  senderUser: UserFactoryResponse
) {
  try {
    await admin.messaging().send({
      token,
      notification: {
        title:
          type == "text"
            ? username + " vous a envoyé un nouveau message"
            : username + " vous a partagé un " + type,
      },

      android: {
        notification: {
          sound: "default",
          clickAction: "FLUTTER_NOTIFICATION_CLICK",
          priority: "high",
          defaultSound: true,
          visibility: "public",
          defaultVibrateTimings: true,
          channelId: "vibratenow",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        sound: "default",
        sender_username: senderUser.username,
        sender_profilepicture: senderUser.profilePicture,
        type: "message",
      },
    });
  } catch (e) {
    console.log("Erreur :", e);
  }
}

export async function sendNotificationEvent(
  token: string,
  senderUser: UserFactoryResponse,
  type: "follow" | "like" | "comment",
  pugId?: string,
  username?: string,
  description?: string
) {
  try {
    let sentence = "";
    switch (type) {
      case "follow":
        sentence = " s'est abonné à votre compte";
        break;
      case "like":
        sentence = " a aimé votre pug";
        break;
      case "comment":
        sentence = " a commenté votre pug";
        break;
    }
    await admin.messaging().send({
      token,
      notification: {
        title: senderUser.username + sentence,
      },

      android: {
        notification: {
          sound: "default",
          clickAction: "FLUTTER_NOTIFICATION_CLICK",
          priority: "high",
          defaultSound: true,
          visibility: "public",
          defaultVibrateTimings: true,
          channelId: "vibratenow",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        sound: "default",
        sender_username: senderUser.username,
        sender_profilepicture: senderUser.profilePicture,
        type: type,
        pug_id: pugId ?? "",
        username: username ?? "",
        description: description ?? "",
      },
    });
  } catch (e) {
    console.log("Erreur :", e);
  }
}
