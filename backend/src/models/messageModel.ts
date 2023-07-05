import { InferSchemaType, model, Schema } from "mongoose";

const messageSchema = new Schema(
	{
		match: { type: Schema.Types.ObjectId, ref: "Match", required: true },
		sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
		content: { type: String, trim: true },
		date: { type: Date, required: true },
		readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

type Message = InferSchemaType<typeof messageSchema>;
export default model<Message>("Message", messageSchema);
