import { createContext, useState } from "react";

const GameContext = createContext(undefined);

export const GameStateProvider = ({ children }) => {
	const [roomState, setRoomState] = useState(null);
	const value = {
		roomState,
		setRoomState,
	};
	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
