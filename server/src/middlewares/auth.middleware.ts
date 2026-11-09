import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";

// Only lets the request through if it carries a valid token
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  // The header should look like "Bearer <token>"
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing token" });
    return;
  }

  const token = header.split(" ")[1];

  try {
    const payload = verifyToken(token);
    res.locals.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Only lets admins through. Must run after requireAuth, which sets the userId
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = await prisma.user.findUnique({
    where: { id: res.locals.userId },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    res.status(403).json({ error: "Admins only" });
    return;
  }

  next();
};