import { db } from "./db";
import { User } from "../models/User";
import { Pug } from "../models/Pug";
import { UserPug } from "../models/UserPug";
import { ObjectId } from "bson";
import { Comment } from "../models/Comment";
import { UserPugNoComment } from "../models/UserPugNoComment";

const collectionName = "pugs";

export default class PugRepository {
  static async insert(user: User, pug: Pug): Promise<UserPug> {
    const call = db.get(collectionName);
    const newPug: UserPug = {
      profilePicture: user.profilePicture,
      userId: new ObjectId(user._id).toString(),
      username: user.username,
      pugs: [pug],
    };
    return await call.insert(newPug);
  }

  static async findById(id: string, username: string): Promise<any> {
    const call = db.get(collectionName);

    return await call.findOne(
      { "pugs.id": new ObjectId(id), username: username },
      { projection: { pugs: { $elemMatch: { id: new ObjectId(id) } } } }
    );
  }

  static async updateUserInfo(
    user: User,
    profilePicture: string
  ): Promise<any> {
    const call = db.get(collectionName);
    return await call.findOneAndUpdate(
      { username: user.username },
      {
        $set: { profilePicture },
      }
    );
  }

  static async findByIdWithCommentsOnly(
    id: string,
    username: string
  ): Promise<any> {
    const call = db.get(collectionName);
    return await call.findOne(
      { "pugs.id": new ObjectId(id), username: username },
      { projection: { pugs: { $elemMatch: { id: new ObjectId(id) } } } }
    );
  }

  static async addNewPug(user: User, pug: Pug): Promise<UserPug> {
    const call = db.get(collectionName);
    let result = await call.findOneAndUpdate(
      { username: user.username },
      {
        $push: { pugs: { $each: [pug], $position: 0 } },
      }
    );
    if (!result) {
      result = await this.insert(user, pug);
    }
    return result;
  }

  static async deletePug(pug: Pug, username: string): Promise<UserPug> {
    const call = db.get(collectionName);
    return await call.findOneAndUpdate(
      {
        pugs: { $elemMatch: { id: new ObjectId(pug.id) } },
        username: username,
      },
      {
        $pull: { pugs: pug },
      }
    );
  }

  static async getAllPugsFromUser(username: string): Promise<UserPug> {
    const call = db.get(collectionName);
    return await call.findOne({
      username,
    });
  }

  static async getAllPugsFromUserNoComment(
    username: string
  ): Promise<UserPugNoComment[]> {
    const call = db.get(collectionName);
    return await call.aggregate([
      { $unwind: { path: "$pugs" } },
      { $match: { $expr: { $eq: ["$username", username] } } },
      {
        $group: {
          _id: "$username",
          pug: { $push: "$pugs" },
          profilePicture: { $first: "$profilePicture" },
          userId: { $first: "userId" },
        },
      },
      { $unwind: "$pug" },
      {
        $project: {
          _id: 1,
          pug: 1,
          profilePicture: 1,
          numberOfComments: {
            $cond: {
              if: { $isArray: "$pug.comments" },
              then: { $size: "$pug.comments" },
              else: "0",
            },
          },
        },
      },
      { $unset: "pug.comments" },
    ]);
  }

  static async likeUserPug(
    user: User,
    pug: Pug,
    username: string
  ): Promise<UserPug> {
    const call = db.get(collectionName);
    await call.findOneAndUpdate(
      { "pugs.id": pug.id, username: username },
      {
        $push: { "pugs.$.usersLike": user.username },
      }
    );
    return await call.findOneAndUpdate(
      { "pugs.id": pug.id, username: username },
      {
        $set: { "pugs.$.like": pug.like + 1 },
      }
    );
  }

  static async commentUserPug(
    comment: Comment,
    pug: Pug,
    username: string
  ): Promise<UserPug> {
    const call = db.get(collectionName);
    return await call.findOneAndUpdate(
      { "pugs.id": pug.id, username: username },
      {
        $push: { "pugs.$.comments": comment },
      }
    );
  }

  static async unLikePug(
    user: User,
    pug: Pug,
    pugName: string
  ): Promise<UserPug> {
    const call = db.get(collectionName);
    await call.findOneAndUpdate(
      { "pugs.id": pug.id, username: pugName },
      {
        $pull: { "pugs.$.usersLike": user.username },
      }
    );
    return await call.findOneAndUpdate(
      { "pugs.id": pug.id, username: pugName },
      {
        $set: { "pugs.$.like": pug.like - 1 },
      }
    );
  }

  static async findUserInPugLike(
    username: string,
    pug: Pug,
    pugname: string
  ): Promise<any> {
    const call = db.get(collectionName);
    return await call.findOne(
      {
        pugs: { $elemMatch: { usersLike: username, id: new ObjectId(pug.id) } },
        username: pugname,
      },
      {
        projection: { "pugs.id": 1 },
      }
    );
  }

  static async getAllPugsFromFollowing(usernames: string[]): Promise<any> {
    const call = db.get(collectionName);

    return await call.find(
      { username: { $in: usernames } },
      { projection: { "pugs.comments": { $slice: -1 } } }
    );
  }

  static async getAllPugsFromFollowingPageable(
    usernames: string[],
    startInd: number
  ): Promise<any> {
    const call = db.get(collectionName);
    return await call.aggregate([
      { $unwind: { path: "$pugs" } },
      { $unwind: "$pugs.date" },

      { $match: { $expr: { $in: ["$username", usernames] } } },
      {
        $group: {
          _id: "$username",
          pug: { $push: "$pugs" },
          profilePicture: { $first: "$profilePicture" },
          userId: { $first: "$userId" },
        },
      },
      { $unwind: "$pug" },
      { $unwind: "$pug.date" },
      { $sort: { "pug.date": -1 } },
      { $skip: startInd },
      { $limit: 5 },
    ]);
  }

  static async getAllPugs(startInd: number, endInd: number): Promise<any> {
    const call = db.get(collectionName);
    return await call.aggregate([
      { $unwind: { path: "$pugs" } },
      { $unwind: "$pugs.date" },

      {
        $group: {
          _id: "$username",
          pug: { $push: "$pugs" },
          profilePicture: { $first: "$profilePicture" },
          userId: { $first: "$userId" },
        },
      },
      { $unwind: "$pug" },
      { $unwind: "$pug.date" },
      { $sort: { "pug.date": -1 } },
      { $skip: startInd },
      { $limit: 5 },

      {
        $project: {
          _id: 1,
          pug: 1,
          profilePicture: 1,
          userId: 1,
        },
      },
    ]);
  }

  static async detePugsFromUser(user: User): Promise<any> {
    const call = db.get(collectionName);
    return await call.remove({ username: user.username });
  }
}
