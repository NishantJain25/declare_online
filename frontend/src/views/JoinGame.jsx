import React, { useState } from "react";
import Input from "../components/Input";
import useSocket from "../hooks/useSocket";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";

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
	const navigate = useNavigate();
	const handleJoinRoom = () => {
		socket.current?.emit(
			"room:join",
			{ id: "Player 1", username: "Nishant" },
			(room) => {
				console.log(room);

				navigate(`/playGame/${room.id}`);
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
