import { Request, Response } from "express";
import { z } from "zod";
import { registerSchema } from "../schemas/auth.schema";

// Handles new user sign ups
export const register = (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);
  
  // Stop here if the data is invalid and tell the client what's wrong
  if (!result.success){
    res.status(400).json({ errors:z.flattenError(result.error).fieldErrors });
    return;
  }
  res.status(201).json({ received: result.data });
};