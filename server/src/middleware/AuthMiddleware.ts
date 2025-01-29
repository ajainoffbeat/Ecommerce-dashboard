import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
require("dotenv").config();

declare module 'express' {
  interface Request {
    email?: string; // Make it optional
  }
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "your_secret_key";

export async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token; // Retrieve token from cookies

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'No token provided',
    });
  }

  try {
    const decode = jwt.verify(token, JWT_SECRET_KEY) as jwt.JwtPayload; // JWT payload type
    req.email = decode.email;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);

    // Invalid or expired token
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
}