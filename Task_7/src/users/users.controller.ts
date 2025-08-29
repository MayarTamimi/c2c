import express from "express";
import { updateUserSchema, couchSchema } from "./users.dto";
import type { Request, Response } from "express";
import { repository } from "../shared/Repository";
import bcrypt from "bcrypt";
import type { User } from "../shared/types";

const userRepo = new repository<User>();

export function getCurrentUser(req: Request, res: Response) {
  const currentUser = userRepo.findById((req as any).user.id);
  if (!currentUser) return res.status(404).json({ message: "User not found" });

  const { password, ...userWithoutPassword } = currentUser;
  res.status(200).json(userWithoutPassword);
}

export async function updateCurrentUser(req: Request, res: Response) {
  try {
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: parsed.error });

    const user = userRepo.findById((req as any).user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updatedUser = userRepo.update(user.id, parsed.data);
    if (!updatedUser)
      return res.status(500).json({ message: "User could not be updated" });

    const { password, ...userWithoutPassword } = updatedUser;
    return res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createCoach(req: Request, res: Response) {
  const requester = (req as any).user;
  if (requester.role !== "ADMIN")
    return res.status(403).json({ message: "Forbidden" });

  const parsed = couchSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: parsed.error });

  const { name, email, password } = parsed.data;

  // Check if email exists
  const existing = userRepo.findAll().find(u => u.email === email);
  if (existing)
    return res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newCoach = userRepo.create({
    name,
    email,
    password: hashedPassword,
    role: "COACH",
  });

  const { password: _p, ...coachWithoutPassword } = newCoach;
  return res.status(201).json(coachWithoutPassword);
}
