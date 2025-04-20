import { useContext } from "react";
import { SocketContext } from "../context/socketContext.jsx";

export default function useSocket() {
	const consumer = useContext(SocketContext);

	if (!consumer)
		throw new Error("useSocket must be used within a SocketProvider");

	return consumer;
}
