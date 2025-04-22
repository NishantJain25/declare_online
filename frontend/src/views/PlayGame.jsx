import { styled } from "styled-components";
import useSocket from "../hooks/useSocket";
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import Img from "../assets/card-2-spades.png";

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
`;

const PlayGame = () => {
	const [players, setPlayers] = useState([]);
	const [currentPlayer, setCurrentPlayer] = useState("Player 2");
	const [score, setScore] = useState(25);
	const [inProgress, setInProgress] = useState(false);
	const { socket } = useSocket();
	const { roomId } = useParams();
	socket.current.on("room:join", (room) => {
		setPlayers(room.players);
		if (room.inProgress) setInProgress(true);
	});
	const player = useMemo(() => {
		players.find((player) => player.id === "Player 1");
	}, []);
	console.log(player);
	return (
		<Container>
			<TopBar>
				<button>Quit Match</button>
				<p>
					{inProgress ? `${currentPlayer}'s chance` : "Waiting for players..."}
				</p>
				<button>View Score Table</button>
			</TopBar>
			<GameArea>
				<OpponentsContainer>
					{players
						.filter((player) => player.id !== "Player 1")
						.map(({ name, cards }) => {
							return (
								<div>
									<PlayerInfo>
										<PlayerImage />
										<p>{name}</p>
										{inProgress && (
											<div style={{ display: "flex" }}>
												{new Array(cards).fill(null).map((_, i) => (
													<Card
														opponent={true}
														key={i}
													/>
												))}
											</div>
										)}
									</PlayerInfo>
								</div>
							);
						})}
				</OpponentsContainer>
				<div style={{ position: "relative", flex: 2 }}>
					<BottomCard />
					<Deck />
					<NullCard />
				</div>
				<PlayerContainer>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							gap: "80px",
						}}>
						<div
							style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
							<PlayerInfo>
								<PlayerImage />
								<p>Player 1</p>
							</PlayerInfo>
							<p>Total: {0}</p>
						</div>
						{inProgress && (
							<div style={{ display: "flex", gap: "5px" }}>
								{["A", "2", "5", "7", "K"].map((_, i) => (
									<Card key={i}>
										<img
											src={Img}
											alt="2 of spades"
											style={{
												objectFit: "cover",
												height: "100%",
												width: "100%",
												scale: 1.15,
											}}
										/>
									</Card>
								))}
							</div>
						)}
						<div
							style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
							{currentPlayer === "Player 1" && (
								<>
									<button>Play</button>
									<button>Declare</button>
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
