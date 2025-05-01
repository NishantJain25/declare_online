import { useContext } from "react";
import { GameContext } from "../context/gameContext";


export default function useGameState() {
    const consumer = useContext(GameContext);

    if (!consumer)
        throw new Error("useGameState must be used within a GameProvider");

    return consumer;
}
