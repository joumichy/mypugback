import { Pug } from "./Pug";

export interface UserPugNoComment {
  _id: string;
  numberOfComments: number;
  userId: string;
  profilePicture: string;
  pug: Pug;
}
