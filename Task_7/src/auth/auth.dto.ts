import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const updatedSchema = z.object({
  name: z.string().min(3).max(30).optional(),
  email: z.string().email().optional()
});
