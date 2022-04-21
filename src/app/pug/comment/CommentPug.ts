import {Request, Response} from "express";
import BaseResponse from "../../../response/BaseResponse";
import {checkThatUserExistsOrThrow, checkThatUserNotAlreadyLike,} from "../../../util/validator/checkdata";
import moment from "moment";

import UserRepository from "../../../repository/UserRepository";
import {CustomError} from "../../../util/error/CustomError";
import {decodeToken} from "../../../util/security/tokenManagement";
import PugRepository from "../../../repository/PugRepository";
import {Pug} from "../../../models/Pug";
import {Comment} from "../../../models/Comment";
import {ObjectId} from "bson";





export const commentPug = async  (req : Request, res : Response) =>{

    try{
        const token = req.headers.authorization?.split(" ")[1] || "";
        const {pugId,comment, username} = req.body;
        const {userId} = decodeToken(token);
        const  result = await execute(userId,pugId, username, comment);
        res.status(200).json({code : result.code, message : result.message, payload : result.payload});
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

const execute = async (userId: string, pugId :string, pugName: string, content : string): Promise<any> => {

    const currentUser = await UserRepository.findById(userId);

    checkThatUserExistsOrThrow(currentUser);

    const data = await PugRepository.findById(pugId,pugName);


    const pug : Pug =data.pugs[0];
    const date  = moment().unix().toString()
    const comment : Comment = {content, author : currentUser.username, date : date,id : new ObjectId(),
    }
    await PugRepository.commentUserPug(comment, pug,pugName);

    return {code: 0, message: "Nouveau commentaire ajotué",payload :""}



}
