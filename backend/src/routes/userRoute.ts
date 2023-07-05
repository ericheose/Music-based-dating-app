import express from "express";
import * as UserController from "../controllers/userController";
import { requiresAuth } from "../middleware/requireAuth";

const router = express.Router();

router.get("/", requiresAuth, UserController.getAuthenticatedUser);

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.post("/addToProfile", requiresAuth, UserController.addToProfile)

router.get("/getProfile/:profileId", UserController.getProfile)

router.get("/getProfileMusic", requiresAuth, UserController.getProfileMusic)

router.post("/removeFromProfile", requiresAuth, UserController.removeFromProfile)

router.post("/updateProfile", requiresAuth, UserController.updateProfile)

router.post("/uploadPicture", UserController.uploadPicture);

export default router;
