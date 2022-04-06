import {Follower} from "./Follower";
import {ObjectId} from "bson";

export interface User {
    _id?: ObjectId;
    username:string;
     password:string;
     email :string;
     admin:boolean;
     phoneNumber:string;
     following :number;
     followers : number;
     followersUser? : Follower[];
}