"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = require("./util/config");
const routes_1 = __importDefault(require("./routes/routes"));
const util_1 = require("./util/util");
const sendMessage_1 = require("./app/conversation/sendMessage");
const seenConversation_1 = require("./app/conversation/seenConversation");
const getConversations_1 = require("./app/conversation/getConversations");
const JobCreateCompetition_1 = require("./app/competition/JobCreateCompetition");
const VoteForParticipant_1 = require("./app/competition/VoteForParticipant");
const JobSelectParticipants_1 = require("./app/competition/JobSelectParticipants");
const JobSetCompetitionWinners_1 = require("./app/competition/JobSetCompetitionWinners");
const serviceAccount = require("./reborn-4ddb8-firebase-adminsdk-m93a0-fe3668baa0.json");
const Notification_1 = require("./notification/Notification");
var admin = require("firebase-admin");
const schedule = require("node-schedule");
const init = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const app = (0, express_1.default)();
  app.get("/file", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });
  app.get("/", (req, res) => {
    console.log("MyPug server");
    res.status(200).send("MyPug Server working..");
  });
  app.use(express_1.default.json());
  app.use(routes_1.default);
  const httpServer = require("http").createServer(app);
  const io = require("socket.io")(httpServer, {});
  httpServer.listen(config_1.env.PORT, () => {
    console.log(`Listening on port ${config_1.env.PORT}`);
  });
  // Tous les lundis à 12:01
  const jobCompetition = schedule.scheduleJob("1 * 12 * * /1", function () {
    return __awaiter(this, void 0, void 0, function* () {
      yield (0, JobCreateCompetition_1.createCompetition)();
    });
  });
  // Tous les lundis à 20:01
  const jobParticipants = schedule.scheduleJob("1 * 20 * * /1", function () {
    return __awaiter(this, void 0, void 0, function* () {
      yield (0, JobSelectParticipants_1.jobSelectParticipants)();
    });
  });
  // Tous les dimanche à 12:01
  const jobWinner = schedule.scheduleJob("0 * 12 * * /1", function () {
    return __awaiter(this, void 0, void 0, function* () {
      yield (0, JobSetCompetitionWinners_1.jobSetCompetitionsWinners)();
    });
  });
  io.on("connection", (socket) => {
    console.log("Connection ! :", socket.id);
    socket.on("disconnect", (msg) => {
      console.log("Deconnecté !");
    });
    socket.on("disconnect_user", (msg) => {
      util_1.allUsersConnected.delete(msg);
      console.log("Deconnecté !");
    });
    socket.on("credentials", (msg) => {
      util_1.allUsersConnected.set(msg, socket.id);
    });
    socket.on("credentials_notification", (msg) => {
      util_1.allUsersNotificationToken.set(msg.username, msg.token);
      console.log("TOKEN :", msg.token);
    });
    socket.on("notification", (msg) =>
      __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0,
        getConversations_1.executeConversationsFromUser)(msg.userId);
        socket.emit("notificationCallBack", result);
      })
    );
    socket.on("seenConversation", (msg) =>
      __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, seenConversation_1.seenConversation)(
          msg.senderUsername,
          msg.conversationId
        );
        if (result.code == 0) {
          socket.emit("seenCallback", result.code.toString());
        } else {
          socket.emit("seenCallback", result.code.toString());
        }
      })
    );
    socket.on("vote", (msg) =>
      __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, VoteForParticipant_1.voteForParticipant)(
          msg.currentUsername,
          msg.competitionId,
          msg.pugId,
          msg.username
        );
        console.log("Vote effectué");
        io.sockets.emit("voteCallBack", result);
      })
    );
    socket.on("message", (msg) =>
      __awaiter(void 0, void 0, void 0, function* () {
        if (msg.senderUsername == msg.receiverUsername) {
          socket.emit("messagesuccess", 1);
        }
        const result = yield (0, sendMessage_1.sendMessage)(
          msg.senderUsername,
          msg.receiverUsername,
          msg.content,
          msg.type
        );
        console.log(result);
        if (result.code == 0) {
          if (util_1.allUsersConnected.has(msg.receiverUsername)) {
            io.to(util_1.allUsersConnected.get(msg.receiverUsername)).emit(
              "instantmessage",
              result.message
            );
          }
          socket.emit(
            "messagesuccess",
            `${result.code.toString()}_${msg.receiverUsername}`
          );
          //TODO: Notification
          console.log(util_1.allUsersNotificationToken);
          if (util_1.allUsersNotificationToken.has(msg.receiverUsername)) {
            console.log("YES");
            yield (0, Notification_1.sendNotificationEventCreation)(
              util_1.allUsersNotificationToken.get(msg.receiverUsername),
              msg.senderUsername,
              msg.message,
              msg.type
            );
          }
        } else {
          socket.emit("messagesuccess", result.code.toString());
        }
      })
    );
  });
};
exports.init = init;
