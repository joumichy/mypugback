import { UserFactory } from "./UserFactory";

export interface User extends UserFactory {
  password: string;
  email: string;
  admin: boolean;
  phoneNumber: string;
  following: number;
  followers: number;
  pugs: number;
  banned: boolean;
  description: string;
  sex: "man" | "woman";
  trophy: boolean;
}
