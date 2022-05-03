import {Router} from "express";
import {signUp} from "../app/auth/signup/SignUp";
import {signIn} from "../app/auth/signin/SignIn";
import {addPug} from "../app/pug/add/AddPug";
import {getAllPugs} from "../app/pug/getall/GetAllPug";
import {getAllPugsFromFollowing} from "../app/pug/getallfromfollowing/GetAllFromFollowing";
import {likePug} from "../app/pug/like/Like";
import {unLikePug} from "../app/pug/unlike/UnLike";
import {commentPug} from "../app/pug/comment/CommentPug";
import {getComments} from "../app/pug/getcomment/GetComment";
import {getAllPugsFromUser} from "../app/pug/getallfromuser/GetAllFromUser";
import {getAllPugsFromFollowingPagealble} from "../app/pug/getallfromfollowing/GetAllFromFollowingPageable";

const pugRouter = Router();

const add = "/add";
const get = "/get";
const getAll = "/getall";
const getAllFromUser = "/getallfromuser";
const actualitypageable = "/actualitypageable";

const actuality = "/actuality";
const like = "/like";
const unlike = "/unlike";
const comment = "/comment";


///
const multer = require('multer');
const storage = multer.diskStorage({
    destination : (req: any, file: any, callback: (arg0: null, arg1: string) => void) => {
        callback(null,'./uploads');
    },
    filename : (req : any, file: any, callback: any)=> {
        const date = new Date().toISOString().replace(':','-').replace(':','-').replace('.','-')
        const name = date+file.originalname
        callback(null, name)
    }
})
const fileFilter = (req : any, file : any, cb : any) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png ' || file.mimetype === 'image/jpg'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }

}
const upload = multer( {
    dest : 'uploads/',storage,
    limits :{
        fileSize :1024 * 1024 *5
    },
    // fileFilter : fileFilter
    });
///


pugRouter.post(add, upload.single('newimage'),addPug)
pugRouter.get(get,getAllPugs);
pugRouter.get(getAll,getAllPugs)
pugRouter.get(getAllFromUser,getAllPugsFromUser)

pugRouter.get(actuality,getAllPugsFromFollowing)
pugRouter.get(actualitypageable,getAllPugsFromFollowingPagealble)

pugRouter.put(like,likePug)
pugRouter.put(unlike,unLikePug)
pugRouter.put(comment,commentPug)
pugRouter.get(comment,getComments)

export default pugRouter;
