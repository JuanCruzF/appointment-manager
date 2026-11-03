import { Request, Response } from "express";
import { z } from "zod";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";

// Handles new user sign ups
export const register = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);

  // Stop here if the data is invalid and tell the client what's wrong
  if (!result.success) {
    res.status(400).json({ errors: z.flattenError(result.error).fieldErrors });
    return;
  }

  const { name, email, password } = result.data;

  // Emails must be unique, so check if this one is already taken
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  // Never store plain passwords, only their hash
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  res.status(201).json({ user });
};

// Checks the credentials and gives back a token
export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: z.flattenError(result.error).fieldErrors });
    return;
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  res.status(200).json({ token: signToken(user.id) });
};

// Returns the logged in user's data
export const getMe = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: res.locals.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.status(200).json({ user });
};