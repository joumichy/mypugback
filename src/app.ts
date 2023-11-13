import express from "express";

import { env } from "./util/config";
import router from "./routes/routes";
import { Socket } from "socket.io";
import { allUsersConnected, allUsersNotificationToken } from "./util/util";
import { sendMessage } from "./app/conversation/sendMessage";
import { seenConversation } from "./app/conversation/seenConversation";
import { executeConversationsFromUser } from "./app/conversation/getConversations";
import { createCompetition } from "./app/competition/JobCreateCompetition";
import { voteForParticipant } from "./app/competition/VoteForParticipant";
import { jobSelectParticipants } from "./app/competition/JobSelectParticipants";
import { jobSetCompetitionsWinners } from "./app/competition/JobSetCompetitionWinners";
import { sendNotificationEventMessage } from "./notification/Notification";
import UserRepository from "./repository/UserRepository";
import { userToUserFactoryResponse } from "./response/UserFactoryResponse";
import serviceAccount = require("./reborn-4ddb8-firebase-adminsdk-m93a0-fe3668baa0.json");

var admin = require("firebase-admin");

const schedule = require("node-schedule");

const init = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const app = express();

  app.get("/file", (req: any, res: any) => {
    res.sendFile(__dirname + "/index.html");
  });

  app.get("/", (req: any, res: any) => {
    console.log("MyPug server");
    res.status(200).send("MyPug Server working..");
  });

  app.use(express.json());

  app.use(router);

  const httpServer = require("http").createServer(app);
  const io = require("socket.io")(httpServer, {});

  httpServer.listen(env.PORT, () => {
    console.log(`Listening on port ${env.PORT}`);
  });

  // Tous les lundis à 12:01
  const jobCompetition = schedule.scheduleJob(
    "1 * 12 * * /1",
    async function () {
      await createCompetition();
    }
  );
  // Tous les lundis à 20:01
  const jobParticipants = schedule.scheduleJob(
    "1 * 20 * * /1",
    async function () {
      await jobSelectParticipants();
    }
  );

  // Tous les dimanche à 12:01
  const jobWinner = schedule.scheduleJob("0 * 12 * * /1", async function () {
    await jobSetCompetitionsWinners();
  });

  io.on("connection", (socket: Socket) => {
    console.log("Connection ! :", socket.id);
    socket.on("disconnect", (msg: any) => {
      console.log("Deconnecté !");
    });

    socket.on("disconnect_user", (msg: any) => {
      allUsersConnected.delete(msg);
      allUsersNotificationToken.delete(msg);
      console.log("Deconnecté !");
    });

    socket.on("credentials", (msg: any) => {
      allUsersConnected.set(msg, socket.id);
    });
    socket.on("credentials_notification", (msg: any) => {
      allUsersNotificationToken.set(msg.username, msg.token);
      console.log("TOKEN :", msg.token);
    });

    socket.on("notification", async (msg: any) => {
      const result = await executeConversationsFromUser(msg.userId);
      socket.emit("notificationCallBack", result);
    });

    socket.on("seenConversation", async (msg: any) => {
      const result = await seenConversation(
        msg.senderUsername,
        msg.conversationId
      );
      if (result.code == 0) {
        socket.emit("seenCallback", result.code.toString());
      } else {
        socket.emit("seenCallback", result.code.toString());
      }
    });

    socket.on("vote", async (msg: any) => {
      const result = await voteForParticipant(
        msg.currentUsername,
        msg.competitionId,
        msg.pugId,
        msg.username
      );
      console.log("Vote effectué");
      io.sockets.emit("voteCallBack", result);
    });

    socket.on("message", async (msg: any) => {
      if (msg.senderUsername == msg.receiverUsername) {
        socket.emit("messagesuccess", 1);
      }
      const result = await sendMessage(
        msg.senderUsername,
        msg.receiverUsername,
        msg.content,
        msg.type
      );

      if (result.code == 0) {
        const senderUser = await UserRepository.findByUsername(
          msg.senderUsername
        );
        if (allUsersConnected.has(msg.receiverUsername)) {
          io.to(allUsersConnected.get(msg.receiverUsername)).emit(
            "instantmessage",
            result.message
          );
        }

        socket.emit(
          "messagesuccess",
          `${result.code.toString()}_${msg.receiverUsername}`
        );
        //TODO: Notification
        console.log(allUsersNotificationToken);
        if (allUsersNotificationToken.has(msg.receiverUsername)) {
          await sendNotificationEventMessage(
            allUsersNotificationToken.get(msg.receiverUsername),
            msg.senderUsername,
            msg.message,
            msg.type,
            userToUserFactoryResponse(senderUser)
          );
        }
      } else {
        socket.emit("messagesuccess", result.code.toString());
      }
    });
  });
};

export { init };
