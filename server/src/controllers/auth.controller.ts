import { Request, Response } from "express";
import { z } from "zod";
import { registerSchema } from "../schemas/auth.schema";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

// Handles new user sign ups
export const register = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);

  // Stop here if the data is invalid and tell the client what's wrong
  if (!result.success) {
    res.status(400).json({ errors: z.flattenError(result.error).fieldErrors });
    return;
  }

  const { name, email, password } = result.data;

  // Emails must be uniue, so check if this one is alredy taken
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    res.status(409).json({ error: "Email already registered" });
    return;
  };

  // Never store plain passwords, only their hash

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  res.status(201).json({ user });
};