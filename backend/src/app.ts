import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import matchRoute from "./routes/matchRoute";
import userRoute from "./routes/userRoute";
import spotifyRoute from "./routes/spotifyRoute";
import chatRoute from "./routes/chatRoute";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/requireAuth";

const app = express();

app.use(morgan("dev"));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(express.json());

app.use(
	session({
		secret: env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 60 * 60 * 1000,
		},
		rolling: true,
		store: MongoStore.create({
			mongoUrl: env.MONGO_CONNECTION_STRING,
		}),
	})
);

app.use("/api/users", userRoute);
app.use("/api/match", requiresAuth, matchRoute);
app.use("/api/spotify", spotifyRoute);
app.use("/api/chat", chatRoute);

app.use((req, res, next) => {
	next(createHttpError(404, "Endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
	console.error(error);
	let errorMessage = "An unknown error occurred";
	let statusCode = 500;
	if (isHttpError(error)) {
		statusCode = error.status;
		errorMessage = error.message;
	}
	res.status(statusCode).json({ error: errorMessage });
});

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log("A user connected");

	// Emit a test event to the client
	socket.emit("testEvent", "Hello from server!");

	socket.on("message", (data) => {
		// send the message to all connected clients except the sender
		socket.broadcast.emit("message", data);
	});

	socket.on("disconnect", () => {
		console.log("User disconnected");
	});
});

server.listen("5000", () => {
	console.log(`Socket Server running on port ${"5000"}`);
});

export default app;
