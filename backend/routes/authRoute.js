const express = require("express");
const router = express.Router();
const { signupHandler, loginHandler, isAuthenticated } = require("../routeHandlers/authRouteHandlers");
const catchAsync = require("../utils/catchAsync");
const multer = require('multer');
const path = require('path');

//Initilize storage engine for post images
const avatarStorage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve(__dirname,"../../public/upload/profiles/"));
    },
    filename:function(req,file,cb){
        const uniqueSuffix = Data.now()+'-'+Math.round(Math.random()*1e9);
        cb(null,file.fieldname +'_'+ uniqueSuffix + path.extname(file.originalname))
    }
})

const avatarUpload = multer({
    storage: avatarStorage,
    limit: { fileSize: 1000000 * 10 }
});

router.post("/signup",avatarUpload.single('avatar'),catchAsync(signupHandler));
router.post("/login",catchAsync(loginHandler));

router.put("update/profile",isAuthenticated,avatarUpload.single('avatar'));
router.put("update/password",isAuthenticated);
// router.post('/password/forgot')
// router.put('password/reset/:token')
module.exports = router;