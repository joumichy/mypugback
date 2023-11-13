import { db } from "./db";
import { User } from "../models/User";

const collectionName = "users";

export default class UserRepository {
  static async insert(user: User): Promise<User> {
    const call = db.get(collectionName);
    return await call.insert(user);
  }

  static async findByUsername(username: string): Promise<User> {
    const call = db.get(collectionName);
    return await call.findOne({
      username,
    });
  }

  static async findByEmail(email: string): Promise<User> {
    const call = db.get(collectionName);
    return await call.findOne({
      email,
    });
  }

  static async findByPhoneNumber(phoneNumber: string): Promise<User> {
    const call = db.get(collectionName);
    return await call.findOne({
      phoneNumber,
    });
  }

  static async findUsersByUsername(username: string): Promise<User[]> {
    const call = db.get(collectionName);
    return await call.find({
      username: { $regex: new RegExp("^" + username), $options: "i" },
    });
  }

  static async findById(id: string): Promise<User> {
    const call = db.get(collectionName);
    return await call.findOne({
      _id: id,
    });
  }

  static async findUsersInList(usernames: string[]): Promise<User[]> {
    const call = db.get(collectionName);

    return await call.find(
      { username: { $in: usernames } },
      { projection: { username: 1, profilePicture: 1 } }
    );
  }

  static async updateUserPug(user: User, numberOfPug: number): Promise<User> {
    const call = db.get(collectionName);
    return await call.findOneAndUpdate(
      { username: user.username },
      {
        $set: { pugs: user.pugs + numberOfPug },
      }
    );
  }

  static async updateUserFollower(user: User, number: number): Promise<User> {
    const call = db.get(collectionName);
    return await call.findOneAndUpdate(
      { username: user.username },
      {
        $set: { followers: user.followers + number },
      }
    );
  }

  static async updateUserFollowing(user: User, number: number): Promise<User> {
    const call = db.get(collectionName);
    return await call.findOneAndUpdate(
      { username: user.username },
      {
        $set: { following: user.following + number },
      }
    );
  }

  static async banUser(user: User, isBanned: boolean): Promise<User> {
    const call = db.get(collectionName);
    return await call.findOneAndUpdate(
      { username: user.username },
      {
        $set: { banned: isBanned },
      }
    );
  }

  static async updateUserInfo(
    user: User,
    description: string,
    profilePicture: string
  ): Promise<User> {
    const call = db.get(collectionName);
    return await call.findOneAndUpdate(
      { username: user.username },
      {
        $set: { description, profilePicture },
      }
    );
  }

  static async deleteUser(user: User): Promise<any> {
    const call = db.get(collectionName);
    return await call.remove({ username: user.username });
  }
}
