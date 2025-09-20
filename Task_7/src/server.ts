import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./auth/auth.routes";
import courseRoutes from "./courses/courses.routes";
import { authMiddleWare } from "./shared/auth.middleware";
import { repository } from "./shared/Repository";
import { updatedSchema } from "./auth/auth.dto";
import type { User } from "./shared/types";

dotenv.config();
const PORT = process.env.PORT || 3333;

export const app = express();
app.use(express.json());

const userRepo = new repository<User>();

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);

app.use((err: any, _req: Request, res: Response, _next: any) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.get("/users/me", authMiddleWare, (req: Request, res: Response) => {
  const currentUser = userRepo.findById((req as any).user.id);
  if (!currentUser) return res.status(404).json({ message: "User not found" });

  const { password, ...userWithoutPassword } = currentUser;
  res.status(200).json(userWithoutPassword);
});

app.put("/users/me", authMiddleWare, (req: Request, res: Response) => {
  const parsed = updatedSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: parsed.error });

  const user = userRepo.findById((req as any).user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const updatedUser = userRepo.update(user.id, parsed.data);
  if (!updatedUser)
    return res.status(500).json({ message: "Could not update user" });

  const { password, ...userWithoutPassword } = updatedUser;
  res.status(200).json(userWithoutPassword);
});

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}
