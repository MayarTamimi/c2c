import { Router } from "express";
import { authMiddleWare } from "../shared/auth.middleware";
import {
  createCourseController,
  getAllCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController,
} from "./course.controller";

const courseRouter = Router();

// Routes
courseRouter.post("/", authMiddleWare, createCourseController);
courseRouter.get("/", getAllCoursesController);
courseRouter.get("/:id", getCourseByIdController);
courseRouter.put("/:id", authMiddleWare, updateCourseController);
courseRouter.delete("/:id", authMiddleWare, deleteCourseController);

export default courseRouter;
