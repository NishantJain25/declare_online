"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { styled } from "styled-components";
import useSocket from "./useSocket";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MainMenu = styled.div`
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

export const Button = styled(Link)`
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

export default function Home() {
	const router = useRouter();
	const { socket } = useSocket();
	socket.current?.on("connect", (socket) =>
		console.log("connected", socket.current?.connected, socket.id)
	);

	const handleCreateGame = () => {
		socket.current?.emit("room:create", { username: "Nishant" }, (roomId) => {
			router.push(`/playGame/${roomId}`);
		});
	};
	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<Header>
					<GameTitleContainer>
						<GameTitle>Declare</GameTitle>
						<GameSubtitle>Online</GameSubtitle>
					</GameTitleContainer>
				</Header>
				<MainMenu>
					<ButtonsContainer>
						<Button
							href={"/playGame"}
							onClick={handleCreateGame}>
							Start a game
						</Button>
						<Button href={"/joinGame"}>Join a game</Button>
						<Button href={"/rulebook"}>Rulebook</Button>
					</ButtonsContainer>
				</MainMenu>
			</main>
			<footer className={styles.footer}>
				<a
					href="www.nishantjain.netlify.app"
					target="_blank">
					<Image
						aria-hidden
						src="/globe.svg"
						alt="Globe icon"
						width={16}
						height={16}
					/>
					Learn more about me →
				</a>
			</footer>
		</div>
	);
}
