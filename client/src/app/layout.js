import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SocketProvider from "./socketContext";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "Declare online",
	description: "Play Declare online",
};

export default function RootLayout({ children }) {
	return (
		<SocketProvider>
			<html lang="en">
				<body className={`${geistSans.variable} ${geistMono.variable}`}>
					{children}
				</body>
			</html>
		</SocketProvider>
	);
}
