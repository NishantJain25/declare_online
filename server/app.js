const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	connectionStateRecovery: {
		maxDisconnectionDuration: 60 * 1000,
		skipMiddlewares: true,
	},
	cors: {
		origin: "http://localhost:3000",
	},
});

const port = 8000;
const socketPort = 8080;

const corsOptions = {
	origin: "http://localhost:3000", // Allow only requests from this origin
	methods: "GET,POST", // Allow only these methods
	allowedHeaders: ["Content-Type", "Authorization"], // Allow only these headers
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

const onConnection = (socket) => {
	console.log("Someone connected to the game", { id: socket.id });
	const rooms = [];
	socket.on("room:create", (payload, callback) => {
		console.log("create room", { payload });
		const room = {
			id: "room1",
			players: [],
			playerCount: 1,
			inProgress: false,
		};
		rooms.push(room);
		callback(room);
	});
	socket.on("room:join", (payload, callback) => {
		console.log("Joining", { payload });
		callback("room1");
	});
	socket.on("room:leave", (payload) => console.log("leaving", { payload }));
	socket.on("room:update", (payload) => console.log("update", { payload }));
	socket.on("disconnect", () => console.log("disconnected"));
};
httpServer.listen(port);
io.listen(socketPort);
io.on("connection", onConnection);
