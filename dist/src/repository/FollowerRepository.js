"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const collectionName = "userfriends";
class FollowerRepository {
    static insert(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = db_1.db.get(collectionName);
            return yield call.insert(model);
        });
    }
    static findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = db_1.db.get(collectionName);
            return yield call.findOne({
                username,
            });
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = db_1.db.get(collectionName);
            return yield call.findOne({
                _id: id,
            });
        });
    }
    static addUserToFollowing(user, follower) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.findByUsername(user.username);
            if (!exist) {
                const dataset = { following: [], followers: [], username: user.username };
                yield this.insert(dataset);
            }
            const call = db_1.db.get(collectionName);
            return yield call.findOneAndUpdate({ username: user.username }, {
                $push: { following: follower
                }
            });
        });
    }
    static addUserToFollower(user, follower) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.findByUsername(user.username);
            if (!exist) {
                const dataset = { following: [], followers: [], username: user.username };
                yield this.insert(dataset);
            }
            const call = db_1.db.get(collectionName);
            return yield call.findOneAndUpdate({ username: user.username }, {
                $push: { followers: follower
                }
            });
        });
    }
    static deleteUserFromFollowing(user, follower) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = db_1.db.get(collectionName);
            return yield call.findOneAndUpdate({ username: user.username }, {
                $pull: { following: follower
                }
            });
        });
    }
    static deleteUserFromFollower(user, follower) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = db_1.db.get(collectionName);
            return yield call.findOneAndUpdate({ username: user.username }, {
                $pull: { followers: follower
                }
            });
        });
    }
    static findAllFollowersFromUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = db_1.db.get(collectionName);
            return yield call.distinct("followers", { "username": username });
        });
    }
    static findAllFollowingFromUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = db_1.db.get(collectionName);
            return yield call.distinct("following", { "username": username });
        });
    }
    static findUserInFollwingList(username, userToFollow) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = db_1.db.get(collectionName);
            return yield call.findOne({
                username, "following.username": userToFollow
            }, {
                projection: { following: { $elemMatch: { username: userToFollow } } }
            });
        });
    }
}
exports.default = FollowerRepository;