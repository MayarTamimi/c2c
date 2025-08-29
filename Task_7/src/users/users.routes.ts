import { Router } from "express";
import {authMiddleWare} from "../shared/auth.middleware";
import {
  getCurrentUser,
  updateCurrentUser,
  createCoach,
} from "./users.controller.js";

const router = Router();

router.get("/me", authMiddleWare, getCurrentUser); 
router.put("/me", authMiddleWare, updateCurrentUser); 
router.post("/coach", authMiddleWare, createCoach); 

export default router;
