import { registerSchema, loginSchema } from "./auth.dto";
import { repository } from "../shared/Repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { User } from "../shared/types";
import type { Request, Response } from "express";

dotenv.config();

const userRepo = new repository<User>();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export async function register(req: Request, res: Response) {
  try {
    const parsedResult = registerSchema.safeParse(req.body);
    if (!parsedResult.success) return res.status(400).json({ message: parsedResult.error });
    const parsed = parsedResult.data;

    if (userRepo.findAll().find(u => u.email === parsed.email))
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const newUser = userRepo.create({ ...parsed, password: hashedPassword, role: "STUDENT" });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET_KEY, { expiresIn: "1h" });
    const { password, ...userWithoutPassword } = newUser;

    return res.status(201).json({ ...userWithoutPassword, token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsedResult = loginSchema.safeParse(req.body);
    if (!parsedResult.success) return res.status(400).json({ message: parsedResult.error });
    const data = parsedResult.data;

    const user = userRepo.findAll().find(u => u.email === data.email);
    if (!user) return res.status(400).json({ message: "Email not found" });

    if (!await bcrypt.compare(data.password, user.password))
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET_KEY, { expiresIn: "1h" });
    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({ ...userWithoutPassword, token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
