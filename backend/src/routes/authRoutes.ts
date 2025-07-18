import { Router } from "express";
import { userRegistFunc, userLoginFunc, refreshTokenFunc, authenticatedUserFunc, logoutFunc } from "../controllers/authControllers.js";
import { verifyUser } from "../middleware/protectRoutes.js";
import { AuthenticatedRequest } from "../interfaces/AuthInterface.js";
import { Response } from "express";


const authRoutes = Router();

authRoutes.post('/signup', userRegistFunc);
authRoutes.post('/login', userLoginFunc);
authRoutes.post('/refresh-token', refreshTokenFunc);
authRoutes.post('/logout', verifyUser, logoutFunc);
authRoutes.get('/auth-user', verifyUser, authenticatedUserFunc);


authRoutes.get('/test', verifyUser, async (request: AuthenticatedRequest, res: Response) => {
  res.status(200).json('Ok');
});


export default authRoutes;

