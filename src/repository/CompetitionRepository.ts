import { db } from "./db";
import { Competition } from "../models/Competition";
import { Participant } from "../models/Participant";
import { UserFactory } from "../models/UserFactory";
import { SelectedParticipant } from "../models/SelectedParticipant";
import { ObjectId } from "bson";

const collectionName = "competitions";

export default class CompetitionRepository {
  static async insert(competition: Competition): Promise<Competition> {
    const call = db.get(collectionName);
    return await call.insert(competition);
  }

  static async insertMany(competitions: Competition[]): Promise<Competition> {
    const call = db.get(collectionName);
    return await call.insert(competitions);
  }

  static async findByDate(startDate: number): Promise<Competition> {
    const call = db.get(collectionName);
    return await call.findOne({
      startDate,
    });
  }

  static async findByDateWithWinnersOnly(
    startDate: number
  ): Promise<Competition> {
    const call = db.get(collectionName);
    return await call.findOne(
      {
        startDate,
      },
      {
        projection: {
          startDate: -1,
          endDate: -1,
          endVotingDate: -1,
          participants: -1,
          selectedParticipants: -1,
        },
      }
    );
  }

  static async findAll(): Promise<Competition[]> {
    const call = db.get(collectionName);
    return await call.find();
  }

  static async findById(_id: string): Promise<Competition> {
    const call = db.get(collectionName);
    return await call.findOne({
      _id,
    });
  }

  static async addParticipant(
    participant: Participant,
    id: string
  ): Promise<Competition> {
    const call = db.get(collectionName);
    return await call.findOneAndUpdate(
      { _id: id },
      {
        $push: { participants: participant },
      }
    );
  }

  static async addSelectedParticipants(
    selectedParticipants: SelectedParticipant[],
    id: ObjectId
  ): Promise<Competition> {
    const call = db.get(collectionName);
    return await call.findOneAndUpdate(
      { _id: id },
      {
        $set: { selectedParticipants: selectedParticipants },
      }
    );
  }

  static async addWinnerManAndWoman(
    manWinner: SelectedParticipant,
    womanWinner: SelectedParticipant,
    id: ObjectId
  ): Promise<Competition> {
    const call = db.get(collectionName);
    return await call.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          winnerMan: manWinner._id,
          womanWinner: womanWinner._id,
          pugWinnerMan: manWinner.pugId,
          pugWinnerWoman: womanWinner.pugId,
        },
      }
    );
  }

  static async voteForParticipant(
    user: UserFactory,
    selectedParticipant: SelectedParticipant,
    competitionId: ObjectId
  ): Promise<Competition> {
    const call = db.get(collectionName);
    await call.findOneAndUpdate(
      {
        "selectedParticipants._id": selectedParticipant._id,
        _id: competitionId,
      },
      {
        $push: { "selectedParticipants.$.vote": user.username },
      }
    );

    return await call.findOneAndUpdate(
      {
        "selectedParticipants._id": selectedParticipant._id,
        _id: competitionId,
      },
      {
        $set: { "selectedParticipants.$.vote": selectedParticipant.vote + 1 },
      }
    );
  }

  static async unvoteForParticipant(
    user: UserFactory,
    selectedParticipant: SelectedParticipant,
    competitionId: ObjectId
  ): Promise<Competition> {
    const call = db.get(collectionName);
    await call.findOneAndUpdate(
      {
        "selectedParticipants._id": selectedParticipant._id,
        _id: competitionId,
      },
      {
        $pull: { "selectedParticipants.$.vote": user.username },
      }
    );

    return await call.findOneAndUpdate(
      {
        "selectedParticipants._id": selectedParticipant._id,
        _id: competitionId,
      },
      {
        $set: { "selectedParticipants.$.vote": selectedParticipant.vote - 1 },
      }
    );
  }
}
