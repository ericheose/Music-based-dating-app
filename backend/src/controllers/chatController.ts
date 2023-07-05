import { RequestHandler } from "express";
import MatchModel from "../models/matchModel";
import createHttpError from "http-errors";

export const getMessages: RequestHandler = async (req, res, next) => {
	const chatId = req.params.chatId;

	try {
		const match = await MatchModel.findById(chatId);

		if (!match) {
			throw createHttpError(404, "Match not found");
		}

		const messages = match.messages;

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};

export const sendMessage: RequestHandler = async (req, res) => {
	const { chatId, content, sender } = req.body;
	const match = await MatchModel.findById(chatId);
	if (!match) {
		return res.status(404).json({ message: "Chat not found" });
	}
	const newMessage = { content, sender, date: new Date(), readBy: [] };
	match.messages.push(newMessage);
	match.lastMessage = content;
	match.lastMessageDate = newMessage.date;
	await match.save();
	res.status(200).json({ message: "Message sent", match });
};
