import React, { useState } from "react";
import Input from "../components/Input";
import useSocket from "../hooks/useSocket";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import useGameState from "../hooks/useGameState";

const Error = styled.div`
  width: 100%;
  background-color: red;
  text-align: left;
  padding: 5px 10px;
  box-sizing: border-box;
  border-radius: var(--border-radius-xs);
`;

const JoinGame = () => {
  const [error, setError] = useState(null); // todo: create a toast
  const { socket } = useSocket();
  const { setRoomState } = useGameState();
  const navigate = useNavigate();
  const handleJoinRoom = () => {
    socket.current?.emit(
      "room:join",
      { player: { id: "Player 2", username: "Nish" }, roomId: "room1" },
      (room) => {
        console.log({ room });
        setRoomState(room);
        navigate(`/playGame/${room.id}`, {
          state: { authUser: { id: "Player 2", username: "Nish" } },
        });
      }
    );
    socket.current.on("room:error", (error) => {
      setError(error);
    });
  };
  return (
    <div>
      <Input
        name={"roomId"}
        label={"Enter room ID"}
        onFocus={() => setError(null)}
      />
      {error && <Error>{error}</Error>}
      <button onClick={handleJoinRoom}>Join</button>
    </div>
  );
};

export default JoinGame;
