import { Router } from "express";
import { addCommentFunc, commentsListFunc } from "../controllers/commentControllers.js";
import { verifyUser } from "../middleware/protectRoutes.js";


const commentRoutes = Router();


commentRoutes.post('/add-comment', verifyUser, addCommentFunc);
commentRoutes.get('/:pinId/comments-list', verifyUser, commentsListFunc);


export default commentRoutes;