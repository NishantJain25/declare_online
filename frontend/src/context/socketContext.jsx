import { createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(undefined);

export default function SocketProvider({ children }) {
	const socketRef = useRef(null);
	useEffect(() => {
		if (!socketRef.current || socketRef.current.readyState === 0) {
			const socket = io("http://localhost:8080");
			socketRef.current = socket;
		}
		return () => {
			if (socketRef.current.readyState === 1) socketRef.current.close();
		};
	}, []);
	return (
		<SocketContext.Provider value={{ socket: socketRef }}>
			{children}
		</SocketContext.Provider>
	);
}
