import { useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";

export function useBlockCardsFigureSocket(gameId, getFigureCards) {
    const { socket } = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        const handleNextTurnEvent = (event) => {
            const data = JSON.parse(event.data);

            
            if (data.type === `${gameId}:BLOCK_CARD`) {
                getFigureCards();
            }
        };

        
        socket.addEventListener("message", handleNextTurnEvent);

        
        return () => {
            socket.removeEventListener("message", handleNextTurnEvent);
        };
    }, [socket, gameId, getFigureCards]);
}
