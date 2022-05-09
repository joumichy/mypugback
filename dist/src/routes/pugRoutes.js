"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AddPug_1 = require("../app/pug/add/AddPug");
const GetAllPug_1 = require("../app/pug/getall/GetAllPug");
const GetAllFromFollowing_1 = require("../app/pug/getallfromfollowing/GetAllFromFollowing");
const Like_1 = require("../app/pug/like/Like");
const UnLike_1 = require("../app/pug/unlike/UnLike");
const CommentPug_1 = require("../app/pug/comment/CommentPug");
const GetComment_1 = require("../app/pug/getcomment/GetComment");
const GetAllFromUser_1 = require("../app/pug/getallfromuser/GetAllFromUser");
const GetAllFromFollowingPageable_1 = require("../app/pug/getallfromfollowing/GetAllFromFollowingPageable");
const pugRouter = (0, express_1.Router)();
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
    destination: (req, file, callback) => {
        callback(null, './uploads');
    },
    filename: (req, file, callback) => {
        const date = new Date().toISOString().replace(':', '-').replace(':', '-').replace('.', '-');
        const name = date + file.originalname + ".png";
        callback(null, name);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png ' || file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = multer({
    dest: 'uploads/', storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    // fileFilter : fileFilter
});
///
pugRouter.post(add, upload.single('newimage'), AddPug_1.addPug);
pugRouter.get(get, GetAllPug_1.getAllPugs);
pugRouter.get(getAll, GetAllPug_1.getAllPugs);
pugRouter.get(getAllFromUser, GetAllFromUser_1.getAllPugsFromUser);
pugRouter.get(actuality, GetAllFromFollowing_1.getAllPugsFromFollowing);
pugRouter.get(actualitypageable, GetAllFromFollowingPageable_1.getAllPugsFromFollowingPagealble);
pugRouter.put(like, Like_1.likePug);
pugRouter.put(unlike, UnLike_1.unLikePug);
pugRouter.put(comment, CommentPug_1.commentPug);
pugRouter.get(comment, GetComment_1.getComments);
exports.default = pugRouter;
