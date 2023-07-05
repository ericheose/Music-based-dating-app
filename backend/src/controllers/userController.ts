import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export interface SpotifyItem {
	id: string;
	name: string;
}

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
	try {
		const user = await UserModel.findById(req.session.userId).select("+email").exec();
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

interface SignUpBody {
	username: string;
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	gender?: string;
	age?: number;
	bio?: string;
	profilePicture?: string;
	orientation?: string;
	favouriteSongs?: SpotifyItem[];
	favouriteArtists?: SpotifyItem[];
	favouriteAlbums?: SpotifyItem[];
	favouriteGenres?: SpotifyItem[];
}


export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
	const username = req.body.username;
	const email = req.body.email;
	const passwordRaw = req.body.password;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const gender = req.body.gender;
	const age = req.body.age;
	const bio = req.body.bio;
	const profilePicture = req.body.profilePicture;
	const orientation = req.body.orientation;
	const favouriteSongs = req.body.favouriteSongs;
	const favouriteArtists = req.body.favouriteArtists;
	const favouriteAlbums = req.body.favouriteAlbums;
	const favouriteGenres = req.body.favouriteGenres;
  
	try {
		if (!username || !email || !passwordRaw) {
			throw createHttpError(400, "Parameters missing");
		}

		const existingUsername = await UserModel.findOne({ username: username }).exec();

		if (existingUsername) {
			throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
		}

		const existingEmail = await UserModel.findOne({ email: email }).exec();

		if (existingEmail) {
			throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
		}

		const passwordHashed = await bcrypt.hash(passwordRaw, 10);

		const newUser = await UserModel.create({
			username: username,
			email: email,
			password: passwordHashed,
			firstName: firstName,
			lastName: lastName,
			gender: gender,
			age: age,
			bio: bio,
			profilePicture: profilePicture,
			orientation: orientation,
			favouriteSongs: favouriteSongs,
			favouriteArtists: favouriteArtists,
			favouriteAlbums: favouriteAlbums,
			favouriteGenres: favouriteGenres,
			connections: {
				facebookLink: "",
				instagramLink: "",
				twitterLink: "",
				spotifyLink: "",
				soundcloudLink: "",
				youtubeLink: "",
			}
		});

		req.session.userId = newUser._id;

		res.status(201).json(newUser);
	} catch (error) {
	  next(error);
	}
  };
  

interface LoginBody {
	username: string;
	password: string;
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	try {
		if (!username || !password) {
			throw createHttpError(400, "Parameters missing");
		}

		const user = await UserModel.findOne({ username: username }).select("+password +email").exec();

		if (!user) {
			throw createHttpError(401, "Invalid username");
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			throw createHttpError(401, "Invalid password");
		}

		req.session.userId = user._id;
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

export const logout: RequestHandler = (req, res, next) => {
	req.session.destroy((error) => {
		if (error) {
			next(error);
		} else {
			res.status(200).json({ message: 'User has been logged out.' });
		}
	});
};

interface Query {
	$push?: { [key: string]: { id: string; name: string } };
	$pull?: { [key: string]: { id: string; name: string } };
}

const fieldsByType: { [key: string]: string } = {
	Song: "favouriteSongs",
	Artist: "favouriteArtists",
	Album: "favouriteAlbums",
	Genre: "favouriteGenres",
};

export const getFields = (type: string, id: string, name: string): { [key: string]: { id: string; name: string } } => {
	const fields: { [key: string]: { id: string; name: string } } = {};
	fields[fieldsByType[type]] = { id, name };
	return fields;
};

export const getUpdate = (type: string, id: string, name: string): Query => {
	const fields = getFields(type, id, name);
	return { $push: fields };
};

export const getRemove = (type: string, id: string, name: string): Query => {
	const fields = getFields(type, id, name);
	return { $pull: fields };
};

export const getSelect = (type: string): string => {
	return fieldsByType[type];
};

export const addToProfile: RequestHandler<unknown, unknown, { id: string, name: string }, unknown> = (req, res, next) => {
	const type = (req.query as { type: string }).type.toString();
	const filter = { _id: req.session.userId };
	const id = req.body.id;
	const name = req.body.name;
	const update = getUpdate(type, id, name);
	const query = UserModel.findOneAndUpdate(filter, update, {
		new: true
	});

	query.then((result) => {
		res.status(200).json(result);
	}).catch((error) => {
		res.status(500).json({ message: error.message });
	});
}


export const removeFromProfile: RequestHandler<unknown, unknown, { id: string, name: string }, unknown> = (req, res, next) => {
	const type = (req.query as { type: string }).type.toString();
	const filter = { _id: req.session.userId };
	const remove = getRemove(type, req.body.id, req.body.name);
	const query = UserModel.findOneAndUpdate(filter, remove, {
		new: true
	});

	query.then((result) => {
		res.status(200).json(result);
	}).catch((error) => {
		res.status(500).json({ message: error.message });
	});
}

export const getProfile: RequestHandler<{ profileId?: string }, unknown, unknown, unknown> = async (req, res, next) => {
	if (req.params.profileId != undefined) {
		const id = req.params.profileId.toString() || req.session.userId;
		try {
			if (!mongoose.isValidObjectId(id)) {
				return res.status(404).json({ message: "Invalid objectID" });
			}

			const user = await UserModel.findOne({ _id: id }).exec();
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}
			return res.status(200).json(user);
		} catch (error) {
			return res.status(500).json({ message: "Internal server error" });
		}
	}
}

export const getProfileMusic: RequestHandler<unknown, unknown, unknown, { uid?: string }> = async (req, res, next) => {
	// const url = `/api/users/getProfileMusic?type=${type}&uid=${uid}`;
	// CALL LIKE THIS IF YOU WANT TO GET MUSIC FROM A SPECIFIC USER INSTEAD OF THE LOGGED IN USER
	try {
		const type = (req.query as { type: string }).type.toString();
		const select = getSelect(type);
		const uid = req.query.uid ? { _id: req.query.uid } : { _id: req.session.userId };
		const music = await UserModel.findById(uid).select("-_id " + select).exec();
		res.status(200).json(music);
	} catch (err) {
		res.status(500).json({ message: "Internal server error" });
	}
}

interface ProfileDetails {
	_id: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	gender: string;
	age: number;
	profilePicture: string;
	connections: {
		facebookLink?: string;
		instagramLink?: string;
		twitterLink?: string;
		spotifyLink?: string;
		soundcloudLink?: string;
	}
}

export const updateProfile: RequestHandler<unknown, unknown, ProfileDetails, unknown> = async (req, res, next) => {
	try {
		const user = req.body;
		const filter = { _id: user._id };
		const update = {
			$set: {
				firstName: user.firstName,
				lastName: user.lastName,
				username: user.username,
				email: user.email,
				gender: user.gender,
				age: user.age,
				connections: {
					facebookLink: user.connections.facebookLink,
					instagramLink: user.connections.instagramLink,
					twitterLink: user.connections.twitterLink,
					spotifyLink: user.connections.spotifyLink,
					soundcloudLink: user.connections.soundcloudLink,
				},
				profilePicture: user.profilePicture,
			}
		};

		const result = UserModel.updateOne(filter, update).exec();

		res.status(200).json({
			message: "Profile updated successfully",
			data: result
		});
	} catch (err) {
		res.status(500).json({ message: "Internal server error" });
	}
};

interface base64 {
	base64: string;
}

export const uploadPicture: RequestHandler<unknown, unknown, base64, unknown> = async (req, res, next) => {
	const base64 = req.body.base64;
	const stringSplit = base64.split(",");
	const base64String = stringSplit[1];
	try {
		const formData = new FormData();
		formData.append("image", base64String);
		const response = await fetch("https://api.imgur.com/3/image/", {
			method: "POST",
			headers: {
				Authorization: `Client-ID 09bcc8280c0a1e0`,
			},
			body: formData,
		});
		if (!response.ok) {
			throw new Error(await response.text());

		}
		const data = await response.json();
		console.log(data.data.link)
		return res.status(200).send(data.data.link);
	} catch (err) {
		console.error(err);
		return res.status(500).send(err);
	}
};
