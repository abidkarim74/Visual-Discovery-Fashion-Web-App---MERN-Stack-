import { deletePinFunc, savedPinsListFunc, savePinFunc, unsavePinFunc } from "../controllers/feedControllers.js";
import { Router } from "express";
import { verifyUser } from "../middleware/protectRoutes.js";


const feedRoutes = Router();

feedRoutes.post('/save-pin', verifyUser, savePinFunc);
feedRoutes.get('/saved-pins', verifyUser, savedPinsListFunc);
feedRoutes.post('/unsave-pin', verifyUser, unsavePinFunc);
feedRoutes.post('/delete-pin', verifyUser, deletePinFunc);

export default feedRoutes;