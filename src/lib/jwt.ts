import jwt from "jsonwebtoken";

const secret = process.env.ACCESS_TOKEN_SECRET!;

export async function verifyJWT(token: string) {
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (err: unknown) {
    throw new Error("Invalid or expired token");
  }
}
