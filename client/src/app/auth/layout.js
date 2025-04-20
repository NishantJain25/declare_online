"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { styled } from "styled-components";
import styles from "../page.module.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const Container = styled.div`
	width: 30vw;
	height: 50vh;
	background-color: white;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default function AuthLayout({ children }) {
	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<Container>{children}</Container>
			</main>
		</div>
	);
}
