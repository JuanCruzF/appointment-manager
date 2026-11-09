import { Router } from "express";
import { createService } from "../controllers/service.controller";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, requireAdmin, createService);

export default router;