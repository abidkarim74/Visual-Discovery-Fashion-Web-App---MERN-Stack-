import { userProfileFunc, toggleFollowUserFunc, profileUpdateFunc, getUserInfoFunc, followersListFunc, followingListFunc, profilePinsFunc } from "../controllers/profilesController.js";
import { Router } from "express";
import { verifyUser } from "../middleware/protectRoutes.js";
import { upload } from "../middleware/fileHandler.js";



const profileRoutes = Router();


profileRoutes.post('/toogle-follow', verifyUser, toggleFollowUserFunc);
profileRoutes.get('/followers-list', verifyUser, followersListFunc);
profileRoutes.get('/followings-list', verifyUser, followingListFunc);
profileRoutes.put('/update-user', verifyUser, upload.single("file",), profileUpdateFunc);
profileRoutes.get('/user-info', verifyUser, getUserInfoFunc);
profileRoutes.get('/created/:userId', verifyUser, profilePinsFunc);
profileRoutes.get('/:username', verifyUser, userProfileFunc);



export default profileRoutes;