import React from "react";
import { styled } from "styled-components";
import useSocket from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";
import useGameState from "../hooks/useGameState";

const MainMenuContainer = styled.div`
  width: 50vw;
  height: 50vh;
  background-color: white;
  border-radius: var(--border-radius-l);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
`;
const GameTitleContainer = styled.div`
  position: relative;
`;
const GameTitle = styled.h1`
  font-size: 4em;
  color: Yellow;
`;

const GameSubtitle = styled.h2`
  font-size: 1.5em;
  position: absolute;
  rotate: -15deg;
  color: red;
  bottom: -5%;
  right: -5%;
`;

export const Button = styled.div`
  width: 50%;
  height: 15%;
  border: none;
  border-radius: var(--border-radius-m);
  font-size: 1.5em;
  background-color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MainMenu = () => {
  const { socket } = useSocket();
  const { setRoomState } = useGameState();

  let navigate = useNavigate();
  socket.current?.on("connect", (socket) =>
    console.log("connected", socket.current?.connected, socket.id)
  );

  const handleCreateGame = () => {
    socket.current?.emit(
      "room:create",
      { id: "Player 1", username: "Nishant" },
      (room) => {
        console.log({ room });
        setRoomState(room);
        navigate(`/playGame/${room.id}`, {
          state: { authUser: { id: "Player 1", username: "Nishant" } },
        });
      }
    );
  };

  const handleJoinGame = () => {
    navigate("/joinGame");
  };
  return (
    <>
      <Header>
        <GameTitleContainer>
          <GameTitle>Declare</GameTitle>
          <GameSubtitle>Online</GameSubtitle>
        </GameTitleContainer>
      </Header>
      <MainMenuContainer>
        <ButtonsContainer>
          <Button onClick={handleCreateGame}>Start a game</Button>
          <Button onClick={handleJoinGame}>Join a game</Button>
          <Button href={"/rulebook"}>Rulebook</Button>
        </ButtonsContainer>
      </MainMenuContainer>
    </>
  );
};

export default MainMenu;
