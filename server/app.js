const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { default: Deck } = require("./deck");

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
				deck: new Deck(),
				currentRound: 1,
				nullCard: null,
				currentPlayer: "player1",
				scoreTable: [],
				dealer: "player1",
				inProgress: false,
			},
		};
		rooms.push(room);
		callback(room);
	});
	socket.on("room:join", (payload, callback) => {
		console.log("Joining", { payload });
		const room = rooms.find((room) => room.id === payload.roomId);
		const player = new Player(payload.player);
		room.players.push(player);
		if (room.players.length === 5) room.vacant = false;
		console.log({ room });
		io.emit("room:join", room);
		callback("room1");
	});

	socket.on("game:begin", (payload, callback) => {
		const room = rooms.find((room) => room.id === payload.roomId);
		room.game.inProgress = true;
		room.game.deck.shuffleDeck();
	});
	socket.on("room:leave", (payload) => console.log("leaving", { payload }));
	socket.on("room:update", (payload) => console.log("update", { payload }));
	socket.on("disconnect", () => console.log("disconnected"));
};
httpServer.listen(port);
io.listen(socketPort);
io.on("connection", onConnection);
