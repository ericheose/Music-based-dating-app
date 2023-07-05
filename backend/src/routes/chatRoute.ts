import express from "express";
import * as chatController from "../controllers/chatController";
import { requiresAuth } from "../middleware/requireAuth";

const router = express.Router();

router.post("/", chatController.sendMessage);
router.get("/:chatId", chatController.getMessages);

export default router;
