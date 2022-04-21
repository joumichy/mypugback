import {Request, Response} from "express";
import {checkThatUserExistsOrThrow,} from "../../../util/validator/checkdata";

import UserRepository from "../../../repository/UserRepository";
import {CustomError} from "../../../util/error/CustomError";
import {decodeToken} from "../../../util/security/tokenManagement";
import {successCode} from "../../../util/util";
import FollowerRepository from "../../../repository/FollowerRepository";
import {FollowerResponse, followersToResponse} from "../../../response/FollowerResponse";





export const getUserFollowers = async  (req : Request, res : Response) =>{

    try{
        const token = req.headers.authorization?.split(" ")[1] || "";
        const {userId} = decodeToken(token);
        const  result = await execute(userId);
        res.status(200).json({code : successCode, message :"Utilisateur qui vous suivent", payload : result});
    }catch (err : any){

        if(err instanceof CustomError){
            console.log(err);
            res.status(400).json({message : err.message, code : err.code});
        }
        else{
            console.log(err);
        }

    }

}

const execute = async (userId: string): Promise<FollowerResponse[]> => {

    const currentUser = await UserRepository.findById(userId);
    checkThatUserExistsOrThrow(currentUser);
    const result = await FollowerRepository.findAllFollowersFromUser(currentUser.username);

    return followersToResponse(result);
}

