import { useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";

export function useFigureCardsSocket(gameId, getFigureCards) {
    const { socket } = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        const handleNextTurnEvent = (event) => {
            const data = JSON.parse(event.data);

            
            if (data.type === `${gameId}:FIGURE_UPDATE` || data.type === `${gameId}:NEXT_TURN`) {
                getFigureCards();
            }
        };

        
        socket.addEventListener("message", handleNextTurnEvent);

        
        return () => {
            socket.removeEventListener("message", handleNextTurnEvent);
        };
    }, [socket, gameId, getFigureCards]);
}
