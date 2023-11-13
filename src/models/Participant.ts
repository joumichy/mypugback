import { ObjectId } from "bson";

export interface Participant {
  _id?: ObjectId;
  date: number;
  pugId: ObjectId;
  pugPicture: String;
  userId: ObjectId;
  username: String;
  sex: "man" | "woman";
}
