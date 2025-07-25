import { pinsListFunc, pinCreateFunc, makePins, pinDetailFunc, authUserPinsFunc, searchPinsFunc} from "../controllers/pinControllers.js";
import { Router } from "express";
import { verifyUser } from "../middleware/protectRoutes.js";
import { upload } from "../middleware/fileHandler.js";


const pinRoutes = Router();

pinRoutes.get('/all', verifyUser, pinsListFunc);
pinRoutes.post('/create', verifyUser, upload.single("file"), pinCreateFunc);
pinRoutes.get('/test-ai', makePins);
pinRoutes.get('/auth-pins', verifyUser, authUserPinsFunc);
pinRoutes.post('/search-pins', verifyUser, searchPinsFunc);
pinRoutes.get('/:id', verifyUser, pinDetailFunc);


export default pinRoutes;
