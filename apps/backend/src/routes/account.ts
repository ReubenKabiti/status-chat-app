import express, { Request, Response, Router, NextFunction } from "express";
import { prisma } from "../db/db";
import { isAuthenticated } from "./auth";

export const accountRouter: Router = express.Router();

accountRouter.delete("/delete", isAuthenticated, async (req, res) => {
  await prisma.user.deleteMany({where: {mobileNumber: res.locals.user.mobileNumber}});
})
