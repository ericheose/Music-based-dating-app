import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    age: { type: Number, required: false },
    gender: { type: String, required: false },
    orientation: { type: String, required: false },
    bio: { type: String, required: false },
    interests: { type: String, required: false },
    location: { type: String, required: false },
    profilePicture: { type: String, required: false },
    connections:
    {
        facebookLink: { type: String },
        instagramLink: { type: String },
        twitterLink: { type: String },
        spotifyLink: { type: String },
        soundcloudLink: { type: String },
        youtubeLink: { type: String },
    },

    disliked: { type: [String] },
    favouriteSongs: [{ id: { type: String }, name: { type: String } }],
    favouriteArtists: [{ id: { type: String }, name: { type: String } }],
    favouriteAlbums: [{ id: { type: String }, name: { type: String } }],
    favouriteGenres: [{ id: { type: String }, name: { type: String } }],
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
