const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { Deck } = require("./deck");
const { Player } = require("./player");

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

const rooms = [];

const onConnection = (socket) => {
  console.log("Someone connected to the game", { id: socket.id });
  socket.on("room:create", (payload, callback) => {
    console.log("create room", { payload });
    const player1 = new Player(payload);
    const room = {
      id: "room1",
      players: [player1],
      playerCount: 1,
      inProgress: false,
      deck: new Deck(),
      currentRound: 1,
      nullCard: null,
      currentPlayer: player1,
      scoreTable: [],
      dealer: player1,
      inProgress: false,
      bottomCard: null,
    };

    rooms.push(room);
    callback(room);
  });

  socket.on("room:join", (payload, callback) => {
    console.log("Joining", { payload, rooms });
    const room = rooms.find((room) => room.id === payload.roomId);
    const player = new Player(payload.player);
    room.players.push(player);
    if (room.players.length === 2) room.vacant = false;
    console.log({ room });
    callback("room1");
    io.emit("room:update", room);
  });

  socket.on("game:begin", (payload, callback) => {
    console.log("game begin", { payload });
    const room = rooms.find((room) => room.id === payload.room.id);
    room.inProgress = true;
    room.deck.shuffleDeck();
    room.players[0].setCards(room.deck.slice(0, 5));
    room.players[1].setCards(room.deck.slice(5, 10));
    room.deck.remove(room.deck.slice(0, 11));
    room.nullCard = room.deck.pop();
    room.players[0].updateScore(room.nullCard);
    room.players[1].updateScore(room.nullCard);

    console.log(room.deck, room.players[0].cardsInHand.cards);
    io.emit("room:update", room);
  });

  socket.on(
    "game:play",
    ({ selectedCards, currentPlayer, pickCardFrom, roomId }) => {
      const room = rooms.find((room) => room.id === roomId);
      const currIndex = room.players.findIndex(
        (player) => player.id === currentPlayer.id
      );
      console.log(currIndex);
      console.log("before", room.players[currIndex]);

      room.players[currIndex].playCards(selectedCards, room.nullCard);
      let pickedCard;
      if (pickCardFrom === "bottom") {
        pickedCard = room.bottomCard;
      } else {
        pickedCard = room.deck.pop();
      }
      room.players[currIndex].receiveCard(pickedCard);
      room.bottomCard = selectedCards[0];
      console.log(room.players[currIndex]);
      room.currentPlayer =
        room.players[currIndex + 1 === room.players.length ? 0 : currIndex + 1];
      console.log(room);
      io.emit("room:update", room);
    }
  );

  socket.on("game:declare", ({ playerToDeclare, roomId }) => {
    const room = rooms.find((room) => room.id === roomId);
    let didPlayerLose;
    let highestScore = 0;
    room.players.forEach((player) => {
      if (player.totalScore <= playerToDeclare) didPlayerLose = true;
      if (player.totalScore > highestScore) highestScore = player.totalScore;
    });
    const finalScores = room.players.reduce((finalScores, player) => {
      finalScores[player.id] = didPlayerLose
        ? player === playerToDeclare
          ? highestScore * 2
          : 0
        : player.totalScore;
      return finalScores;
    }, {});
    room.scoreTable.push({ round: room.currentRound, scores: finalScores });

    io.emit("game:declare", room, didPlayerLose, playerToDeclare);
  });
  socket.on("room:leave", (payload) => console.log("leaving", { payload }));
  socket.on("room:update", (payload) => console.log("update", { payload }));
  socket.on("disconnect", () => console.log("disconnected"));
};
httpServer.listen(port);
io.listen(socketPort);
io.on("connection", onConnection);
