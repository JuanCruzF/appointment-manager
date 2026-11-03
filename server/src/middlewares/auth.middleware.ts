import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

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