import express from "express";
import {
  postRequest,
  acceptRequest,
  rejectRequest,
  getRequestFromMe,
  getRequestFromUser,
  deleteRequest,
  getFriends
} from "../controller/request.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, postRequest);
router.get("/friends", protectRoute, getFriends);

router.put("/accept", protectRoute, acceptRequest);

router.put("/reject", protectRoute, rejectRequest);
router.get("/from-me", protectRoute, getRequestFromMe);
router.get("/from-user", protectRoute, getRequestFromUser);
router.delete("/delete/:requestId", protectRoute, deleteRequest);

export default router;
