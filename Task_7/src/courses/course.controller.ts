import { Request, Response } from "express";
import { repository } from "../shared/Repository";
import type { Course } from "../shared/types";
import { createCourseSchema, updateCourseSchema } from "./courses.dto";

const courseRepo = new repository<Course>();

export function createCourseController(req: Request, res: Response) {
  const user = (req as any).user;
  if (!["ADMIN", "COACH"].includes(user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const parsed = createCourseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error });
  }

  const course = courseRepo.create(parsed.data);
  res.status(201).json(course);
}

export function getAllCoursesController(_req: Request, res: Response) {
  const courses = courseRepo.findAll();
  res.status(200).json(courses);
}

export function getCourseByIdController(req: Request, res: Response) {
  const course = courseRepo.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.status(200).json(course);
}

export function updateCourseController(req: Request, res: Response) {
  const user = (req as any).user;
  const course = courseRepo.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  if (user.role !== "ADMIN" && user.role !== "COACH") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const parsed = updateCourseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error });

  const updatedCourse = courseRepo.update(course.id, parsed.data);
  res.status(200).json(updatedCourse);
}

export function deleteCourseController(req: Request, res: Response) {
  const user = (req as any).user;
  const course = courseRepo.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  if (user.role !== "ADMIN" && user.role !== "COACH") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const deleted = courseRepo.delete(course.id);
  if (!deleted) return res.status(500).json({ message: "Could not delete course" });

  res.status(200).json({ message: "Course deleted successfully" });
}
