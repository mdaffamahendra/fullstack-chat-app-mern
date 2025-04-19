import express from "express";
import { getUsersForSidebar, getMessages, sendMessage, deleteMessage, editMessage} from "../controller/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);
router.delete("/delete/:id", protectRoute, deleteMessage);
router.put("/edit/:id", protectRoute, editMessage);

export default router;
