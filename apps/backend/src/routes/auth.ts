import express, { Request, Response, Router, NextFunction } from "express";
import { prisma } from "../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authRouter: Router = express.Router();

const secretKey = process.env.JWT_SECRET_KEY as string;

authRouter.post("/register", async (req, res) => {
  const { mobileNumber, password } = req.body;
  const otherUser = await prisma.user.findFirst({ where: { mobileNumber } });
  if (otherUser) {
    return res.status(401).json({ err: "user already exists!" });
  }
  try {
    const user = prisma.user.create({
      data: {
        mobileNumber,
        password: await bcrypt.hash(password, 10),
      },
    });
    res.status(200).json({ msg: "user created successfully!" });
  } catch {
    res.status(400).json({ err: "failed to create user" });
  }
});

authRouter.get("/auth", isAuthenticated, (req, res) => {
  /* route to check if the user is authenticated */
  res.json({isAuthenticated: true});
})

authRouter.post("/login", async (req, res) => {
  const { mobileNumber } = req.body;
  const user = await prisma.user.findFirst({ where: { mobileNumber } });
  if (!user) {
    return res.status(404).json({ err: "user does not exist!" });
  }
  const token = jwt.sign({ mobileNumber }, secretKey);
  res.status(200).json({ token });
});


export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ err: "access denied!" });
  }
  try {
    const result: any = jwt.verify(token, secretKey);
    const user = await prisma.user.findFirst({
      where: { mobileNumber: result.mobileNumber },
    });
    res.locals.user = user;
    next();
  } catch {
    res.status(401).json({ err: "you are not logged in!" });
  }
}
