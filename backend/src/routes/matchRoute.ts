import express from "express";
import * as MatchController from "../controllers/matchController";

const router = express.Router();

router.get("/", MatchController.getMatches);

router.post("/", MatchController.generateMatch);

router.get("/:matchId", MatchController.getMatch);

router.patch("/:matchId", MatchController.updateMatch);

router.delete("/:matchId", MatchController.deleteMatch);

export default router;
