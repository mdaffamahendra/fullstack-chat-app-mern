import express from "express";
import {
  getNotifications,
  clearNotifications,
} from "../controller/notifications.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/clear/:senderId", protectRoute, clearNotifications);

export default router;
