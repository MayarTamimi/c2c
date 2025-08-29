import {z} from "zod";

export const updateUserSchema = z.object({
    name : z.string().min(3).max(30).optional(),
    email : z.string().email().optional()
})

export const couchSchema = z.object({
    name : z.string().min(3).max(30),
    email : z.string().email(),
    password : z.string().min(8)
})