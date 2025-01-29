import Express, { Router } from 'express';
import AuthController from '../controller/AuthController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';


const authRouter = Router();

// Signup Route
authRouter.post("/signup", AuthController.signup as Express.RequestHandler);

// SignIn Route
authRouter.post("/signin", AuthController.signin as Express.RequestHandler);

// whoami Route
authRouter.get("/whoami", AuthMiddleware as Express.RequestHandler, AuthController.whoami as Express.RequestHandler);

// Logout Route
authRouter.get("/logout",  AuthController.logout as Express.RequestHandler);

export {authRouter};