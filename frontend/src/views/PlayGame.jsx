import { styled } from "styled-components";
import useSocket from "../hooks/useSocket";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useMemo, useState } from "react";
import Img from "../assets/card-2-spades.png";
import useGameState from "../hooks/useGameState";
import { IMAGES } from "../assets";

const Container = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  background-color: green;
  display: flex;
  flex-direction: column;
  gap: 1em;
  box-sizing: border-box;
  padding: 1em;
`;
const PlayerImage = styled.div`
  aspect-ratio: 1;
  width: 50px;
  background-color: white;
  border-radius: var(--border-radius-xs);
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const GameArea = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const OpponentsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`;

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: flex-end;
  flex: 2;
`;

const TopBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Card = styled.div`
  aspect-ratio: 3/4;
  width: ${(props) => (props.opponent ? "50px" : "120px")};
  background-color: black;
  border-radius: var(--border-radius-card);
  border: 1px solid black;
  transform: translateY(${(props) => (props.selected ? "-2em" : "0px")});
  transition: 0.1s all ease-out;
  z-index: 1;
`;
const BottomCard = styled(Card)`
  position: absolute;
  left: 35%;

  &:nth-of-type(2) {
    left: 30%;
    z-index: 0;
  }
`;
const Deck = styled.div`
  left: unset;
  right: 40%;
  aspect-ratio: 3/4;
  border-radius: var(--border-radius-card);
  width: 120px;
  background-color: red;
  position: absolute;
  z-index: 1;
  border: 1px solid black;
`;

const NullCard = styled(Deck)`
  right: 35%;
  top: 5%;
  z-index: 0;
  text-align: right;
`;

const PlayGame = () => {
  const { state } = useLocation();
  console.log({ authPlayer: state.authUser });
  const { roomState, setRoomState } = useGameState();
  const [selectedCards, setSelectedCards] = useState([]);
  const [pickCardFrom, setPickCardFrom] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const { socket } = useSocket();
  const navigate = useNavigate();

  const players = React.useMemo(() => roomState.players, [roomState.players]);
  const { currentPlayer } = roomState;

  const beginGame = () => {
    socket.current.emit("game:begin", { room: roomState });
  };

  socket.current.on("room:update", (room) => {
    console.log("update", room);
    setRoomState(room);
    if (room.inProgress) setInProgress(true);
  });

  socket.current.on("game:declare", (room, didPlayerLose, playerToDeclare) => {
    console.log({ playerToDeclare, didPlayerLose, room });
    setRoomState(room);
  });

  socket.current.on("disconnect", () => {
    navigate("/");
  });
  console.log({ roomState, players });
  const user = useMemo(() => {
    return players.find((player) => player.id === state.authUser.id);
  }, [players]);
  console.log(user.cardsInHand?.cards.length);

  const handleCardSelect = (card) => {
    console.log({ selectedCards });
    if (selectedCards.includes(card))
      setSelectedCards((selectedCards) =>
        selectedCards.filter((selectedCard) => selectedCard !== card)
      );
    else if (
      selectedCards.length === 1 &&
      selectedCards[0].slice(0, -1) === card.slice(0, -1)
    )
      setSelectedCards((prev) => [...prev, card]);
    else setSelectedCards([card]);
  };

  const handlePlay = () => {
    socket.current.emit("game:play", {
      selectedCards,
      currentPlayer,
      pickCardFrom,
      roomId: roomState.id,
    });
    setPickCardFrom(null);
    setSelectedCards([]);
  };

  const handleDeclare = () => {
    socket.current.emit("game:declare", {
      playerToDeclare: user,
      roomId: roomState.id,
    });
  };
  return (
    <Container>
      <TopBar>
        <button>Quit Match</button>
        <p>
          {inProgress
            ? `${currentPlayer.name}'s chance`
            : "Waiting for players..."}
        </p>
        {!inProgress && players.length === 2 ? (
          <button onClick={beginGame}>Begin Game</button>
        ) : (
          <button>View Score Table</button>
        )}
      </TopBar>
      <GameArea>
        <OpponentsContainer>
          {players
            .filter((player) => player.id !== user.id)
            .map(({ name, cardsInHand }) => {
              return (
                <div>
                  <PlayerInfo>
                    <PlayerImage />
                    <p>{name}</p>
                    {inProgress && (
                      <div style={{ display: "flex" }}>
                        {new Array(cardsInHand?.cards.length)
                          .fill(null)
                          .map((_, i) => (
                            <Card opponent={true} key={i} />
                          ))}
                      </div>
                    )}
                  </PlayerInfo>
                </div>
              );
            })}
        </OpponentsContainer>
        <div style={{ position: "relative", flex: 2 }}>
          {roomState.bottomCard && (
            <BottomCard onClick={() => setPickCardFrom("bottom")}>
              <img
                src={IMAGES[roomState.bottomCard]}
                alt="card"
                style={{
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                  scale: 1.15,
                }}
              />
            </BottomCard>
          )}
          <Deck onClick={() => setPickCardFrom("deck")} />
          <NullCard>{roomState.nullCard}</NullCard>
        </div>
        <PlayerContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "80px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <PlayerInfo>
                <PlayerImage />
                <p>{user.name}</p>
              </PlayerInfo>
              <p>Total: {user.totalScore}</p>
            </div>
            {inProgress && (
              <div style={{ display: "flex", gap: "5px" }}>
                {user.cardsInHand.cards.map((card, i) => (
                  <Card
                    key={i}
                    onClick={() => handleCardSelect(card)}
                    selected={selectedCards.includes(card)}
                  >
                    <img
                      src={IMAGES[card]}
                      alt="card"
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                        scale: 1.15,
                      }}
                    />
                    {card}
                  </Card>
                ))}
              </div>
            )}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {currentPlayer.id === user.id && (
                <>
                  <button
                    disabled={!selectedCards.length || !pickCardFrom}
                    onClick={handlePlay}
                  >
                    Play
                  </button>
                  <button
                    disabled={!!selectedCards.length}
                    onClick={handleDeclare}
                  >
                    Declare
                  </button>
                </>
              )}
            </div>
          </div>
        </PlayerContainer>
      </GameArea>
    </Container>
  );
};

export default PlayGame;
