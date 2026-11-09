import { Router } from "express";
import { createService, listServices } from "../controllers/service.controller";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, requireAdmin, createService);
router.get("/", listServices);

export default router;