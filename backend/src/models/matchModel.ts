import { InferSchemaType, model, Schema } from "mongoose";

const matchschema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, required: true },
		matchedWithId: { type: Schema.Types.ObjectId, required: true },
		sharedMusic: {
			sharedsongs: { type: Array },
			sharedalbums: { type: Array },
			sharedgenres: { type: Array },
			sharedartists: { type: Array },
		},
		messages: [
			{
				content: { type: String},
				sender: { type: Schema.Types.ObjectId},
				date: { type: Date },
				readBy: [{ type: Schema.Types.ObjectId }],
			},
		],
		lastMessage: { type: String },
		lastMessageDate: { type: Date },
	},
	{ timestamps: true }
);

matchschema.index({ location: "2dsphere" });

matchschema.pre<Match>("save", function (next) {
    if (this.sharedMusic) {
        const { sharedsongs, sharedalbums, sharedgenres, sharedartists } = this.sharedMusic;
        if (!sharedsongs && !sharedalbums && !sharedgenres && !sharedartists) {
            next(new Error("At least one of sharedsongs, sharedalbums, sharedgenres, sharedartists must be provided."));
            return;
        }
    }
    next();
});

type Match = InferSchemaType<typeof matchschema>;

export default model<Match>("Match", matchschema);
