import { userProfileFunc, toggleFollowUserFunc, profileUpdateFunc, getUserInfoFunc } from "../controllers/profilesController.js";
import { Router } from "express";
import { verifyUser } from "../middleware/protectRoutes.js";
import { upload } from "../middleware/fileHandler.js";



const profileRoutes = Router();


profileRoutes.post('/toogle-follow', verifyUser, toggleFollowUserFunc);
profileRoutes.put('/update-user', verifyUser, upload.single("file",), profileUpdateFunc);
profileRoutes.get('/user-info', verifyUser, getUserInfoFunc);
profileRoutes.get('/:username', verifyUser, userProfileFunc);


export default profileRoutes;