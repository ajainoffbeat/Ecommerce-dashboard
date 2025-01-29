import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
require('dotenv').config();

import UserModel from '../model/UserModel';
import { signInSchema, signUpSchema } from '../zod/authSchema';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key';
const saltRounds = 10;

const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const validateBody = signUpSchema.safeParse(req.body);

  if (!validateBody.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid input data',
      errors: validateBody.error.errors,
    });
  }

  try {
    const userExist = await UserModel.findOne({ email });

    if (userExist) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await UserModel.create({ email, password: hashedPassword, name });

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our end. Please try again later.',
    });
  }
};

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const validateBody = signInSchema.safeParse(req.body);

  if (!validateBody.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid input data',
      errors: validateBody.error.errors,
    });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, name: user.name },
      JWT_SECRET_KEY,
      { expiresIn: '2h' },
    );

    // Set the JWT token as a cookie
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 2,
      secure: true,
      path: '/',
    });

    // Successful response
    res.status(200).json({
      status: 'success',
      message: 'User signed in successfully',
    });
  } catch (error) {
    console.error(error);

    // Internal server error response
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error. Please try again later.',
    });
  }
};

const logout = async (req: Request, res: Response) => {
  // Set the JWT token as a cookie
  res.clearCookie('token', {
    path: '/',
  });

  res.status(200).json({
    status: 'success',
    message: 'User logged out successfully',
  });
};

const whoami = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.find({ email: req.email });
    res.status(200).json({
      data: user,
      status: 'success',
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized', // Same generic message for consistency
    });
  }
};

const AuthController = { signin, signup, logout, whoami };

export default AuthController;
