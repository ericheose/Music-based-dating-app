import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose, { Schema } from "mongoose";
import MatchModel from "../models/matchModel";
import UserModel from "../models/userModel";
import { assertIsDefined } from "../util/assertIsDefined";

export const getMatches: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const matches = await MatchModel.find({
        $or: [
            { userId: authenticatedUserId },
            { matchedWithId: authenticatedUserId }
        ]
    }).exec();
    if (!matches) {
        throw createHttpError(404, "Match not found");
    }
    res.status(200).json(matches);

};

export const getMatch: RequestHandler = async (req, res, next) => {
    const matchId = req.params.matchId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(matchId)) {
            throw createHttpError(400, "Invalid match id");
        }

        const match = await MatchModel.findById(matchId).exec();

        if (!match) {
            throw createHttpError(404, "Match not found");
        }

        if (!match.matchedWithId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this match");
        }

        res.status(200).json(match);
    } catch (error) {
        next(error);
    }
};

interface CreateMatchBody {
    matchedWithId: Schema.Types.ObjectId,
    sharedMusic?: {
        sharedsongs?: Array<string>,
        sharedalbums?: Array<string>,
        sharedgenres?: Array<string>,
        sharedartists?: Array<string>,
    },
    lastMessage?: string,
}

interface SharedMusicBody {
    sharedsongs?: [{
        id: string,
        name: string,
    }],
    sharedalbums?: [{
        id: string,
        name: string,
    }],
    sharedgenres?: [{
        id: string,
        name: string,
    }],
    sharedartists?: [{
        id: string,
        name: string,
    }],
}

export const generateMatch: RequestHandler = async (req, res, next) => {



    const currentUID = req.session.userId;
    const currentUser = await UserModel.findById(currentUID).exec();
    if (!currentUser) {
        throw createHttpError(400, "Can't match without a user 😭");
    }
    const currentUserSongs = currentUser.favouriteSongs;
    if (!currentUserSongs) {
        throw createHttpError(400, "Can't match without songs 😭");
    }
    const allUsers = await UserModel.find().exec();

    try {
        assertIsDefined(currentUID);

        if (!currentUser || !allUsers) {
            throw createHttpError(400, "Can't match 😭");
        }
        for (const otherUser of allUsers) {

            // Check if other user is current user
            if (otherUser.id == currentUID) {
                continue;
            }

            // Check if other user is interested in current user
            if (!(currentUser.orientation == "Both" && otherUser.orientation == "Both")) {
                if (currentUser.gender != otherUser.orientation || otherUser.gender != currentUser.orientation) {
                    console.log("User " + otherUser.username + " is not interested in " + currentUser.username)
                    continue;
                }
            }

            // Check if any user disliked the other user
            if (currentUser.disliked.includes(otherUser.id) || otherUser.disliked.includes(currentUser.id)) {
                console.log("Users " + otherUser.username + " and " + currentUser.username + " disliked each other")
                continue;
            }

            // Check if current user is already matched with other user
            const existingMatch = await MatchModel.findOne({
                $or: [
                    { userId: currentUID, matchedWithId: otherUser.id },
                    { userId: otherUser.id, matchedWithId: currentUID }
                ],
            }).exec();

            if (existingMatch) {
                console.log("Match already exists for this user");
                continue;
            }

            const sharedMusicBody: SharedMusicBody = {
                sharedsongs: undefined,
                sharedalbums: undefined,
                sharedgenres: undefined,
                sharedartists: undefined,
            };


            let matchFound = false;

            // Loop over all songs of the other user
            for (const otherSong of otherUser.favouriteSongs) {
                // Loop over all songs of the current user
                for (const currentUserSong of currentUserSongs) {

                    // If the songs match, create a match
                    if (currentUserSong.id == otherSong.id) {
                        matchFound = true;

                        // Add the shared song to the sharedMusicBody
                        if (!sharedMusicBody.sharedsongs) {
                            sharedMusicBody.sharedsongs = [
                                {
                                    id: currentUserSong.id || "",
                                    name: currentUserSong.name || "",
                                }
                            ];
                        } else {
                            sharedMusicBody.sharedsongs.push({
                                id: currentUserSong.id || "",
                                name: currentUserSong.name || "",
                            });
                        }
                    }
                }
            }

            // Loop over all albums of the other user
            for (const otherAlbum of otherUser.favouriteAlbums) {
                // Loop over all albums of the current user
                for (const currentUserAlbum of currentUser.favouriteAlbums) {

                    // If the albums match, create a match
                    if (currentUserAlbum.id == otherAlbum.id) {
                        matchFound = true;

                        // Add the shared album to the sharedMusicBody
                        if (!sharedMusicBody.sharedalbums) {
                            sharedMusicBody.sharedalbums = [
                                {
                                    id: currentUserAlbum.id || "",
                                    name: currentUserAlbum.name || "",
                                }
                            ];
                        } else {
                            sharedMusicBody.sharedalbums.push({
                                id: currentUserAlbum.id || "",
                                name: currentUserAlbum.name || "",
                            });
                        }
                    }
                }
            }

            // Loop over all artists of the other user
            for (const otherArtist of otherUser.favouriteArtists) {
                // Loop over all artists of the current user
                for (const currentUserArtist of currentUser.favouriteArtists) {

                    // If the artists match, create a match
                    if (currentUserArtist.id == otherArtist.id) {
                        matchFound = true;
                        console.log("Found artist match " + currentUserArtist.name + " with " + otherUser.username)

                        // Add the shared artist to the sharedMusicBody
                        if (!sharedMusicBody.sharedartists) {
                            sharedMusicBody.sharedartists = [
                                {
                                    id: currentUserArtist.id || "",
                                    name: currentUserArtist.name || "",
                                }
                            ];
                        } else {
                            sharedMusicBody.sharedartists.push({
                                id: currentUserArtist.id || "",
                                name: currentUserArtist.name || "",
                            });
                        }
                    }
                }
            }

            // Loop over all genres of the other user
            for (const otherGenre of otherUser.favouriteGenres) {
                // Loop over all genres of the current user
                for (const currentUserGenre of currentUser.favouriteGenres) {

                    // If the genres match, create a match
                    if (currentUserGenre.id == otherGenre.id) {
                        matchFound = true;
                        console.log("Found genre match " + currentUserGenre.name + " with " + otherUser.username)

                        // Add the shared genre to the sharedMusicBody
                        if (!sharedMusicBody.sharedgenres) {
                            sharedMusicBody.sharedgenres = [
                                {
                                    id: currentUserGenre.id || "",
                                    name: currentUserGenre.name || "",
                                }
                            ];
                        } else {
                            sharedMusicBody.sharedgenres.push({
                                id: currentUserGenre.id || "",
                                name: currentUserGenre.name || "",
                            });
                        }
                    }
                }
            }

            if (!matchFound) {
                continue;
            }
            console.log("Found match between" + currentUser.username + " and " + otherUser.username)
            await MatchModel.create({
                user: currentUser.username,
                userId: currentUID,
                matchedWith: otherUser.username,
                matchedWithId: otherUser.id,
                sharedMusic: sharedMusicBody,
                messages: [
                    {
                        messageBody: "Hey, I think we have similar music taste!",
                        senderid: currentUID,
                        date: new Date(),
                    },
                ],
                lastMessage: "Hey, I think we have similar music taste!",
                lastMessageDate: new Date(),
            });
        }

        res.status(201);
    } catch (error) {
        next(error);
    }
};




export const createMatch: RequestHandler<unknown, unknown, CreateMatchBody, unknown> = async (req, res, next) => {
    const matchedWithId = req.body.matchedWithId;
    const sharedMusic = req.body.sharedMusic;
    const lastMessage = req.body.lastMessage;

    const currentUID = req.session.userId;

    try {
        assertIsDefined(currentUID);

        if (!matchedWithId) {
            throw createHttpError(400, "Can't match without a partner 😭");
        }

        const otherUser = UserModel.findById(matchedWithId).exec();
        if (!otherUser) {
            throw createHttpError(400, "Can't match with a non-existing user 😭");
        }
        const newMatch = await MatchModel.create({
            matchedWithId: matchedWithId,
            sharedMusic: sharedMusic,
            lastMessage: lastMessage,
        });
        res.status(201).json(newMatch);
    } catch (error) {
        next(error);
    }
};

interface UpdateMatchParams {
    matchId: string,
}

interface UpdateMatchBody {
    title?: string,
    text?: string,
}

export const updateMatch: RequestHandler<UpdateMatchParams, unknown, UpdateMatchBody, unknown> = async (req, res, next) => {
    const matchId = req.params.matchId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(matchId)) {
            throw createHttpError(400, "Invalid match id");
        }

        if (!newTitle) {
            throw createHttpError(400, "Match must have a title");
        }

        const match = await MatchModel.findById(matchId).exec();

        if (!match) {
            throw createHttpError(404, "Match not found");
        }

        if (!match.matchedWithId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this match");
        }

        // match.title = newTitle;
        // match.text = newText;

        const updatedMatch = await match.save();

        res.status(200).json(updatedMatch);
    } catch (error) {
        next(error);
    }
};

export const deleteMatch: RequestHandler = async (req, res, next) => {
    const matchId = req.params.matchId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(matchId)) {
            throw createHttpError(400, "Invalid match id");
        }

        const match = await MatchModel.findById(matchId).exec();

        if (!match) {
            throw createHttpError(404, "Match not found");
        }

        if (!match.matchedWithId.equals(authenticatedUserId) && !match.userId.equals(authenticatedUserId)) {
            console.log(authenticatedUserId, match.userId.toString(), match.matchedWithId.toString())
            throw createHttpError(401, "You cannot access this match");
        }

        match.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
