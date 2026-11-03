import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Fail right away if the secret is missing, instead of on the first login
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

export const signToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
};

// Throws an error if the token is fake or expired
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: number };
};