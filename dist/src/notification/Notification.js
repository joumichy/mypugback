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
exports.sendNotificationEventCreation = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));

function sendNotificationEventCreation(token, username, message, type) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      var payload = {
        notification: {
          title: username + " vous a envoyé un" + type,
          body: message,
        },
        data: { click_action: "FLUTTER_NOTIFICATION_CLICK" },
      };
      yield firebase_admin_1.default.messaging().send({
        token,
        notification: {
          title:
            type == "text"
              ? username + " vous a envoyé un nouveau message"
              : username + " vous a partagé un " + type,
          body: message,
        },
        data: { click_action: "FLUTTER_NOTIFICATION_CLICK" },
      });
    } catch (e) {
      console.log("Erreur :", e);
    }
  });
}

exports.sendNotificationEventCreation = sendNotificationEventCreation;
