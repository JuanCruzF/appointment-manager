import { Request, Response } from "express";

// Handles new user sign ups
export const register = (req: Request, res: Response) => {
  res.status(201).json({ received: req.body });
};