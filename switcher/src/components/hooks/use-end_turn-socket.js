import { useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";

export function useEndTurnSocket(gameId, playerId, setIsButtonActive, getTurnInfo) {
    const { socket } = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        const handleNextTurnEvent = (event) => {
            const data = JSON.parse(event.data);

            
            if (data.type === `${gameId}:NEXT_TURN`) {
            
                // if (data.nextPlayerId === playerId) {
                //     setIsButtonActive(true);
                // } else {
                //     setIsButtonActive(false);
                // }
                getTurnInfo();
            }
        };

        
        socket.addEventListener("message", handleNextTurnEvent);

        
        return () => {
            socket.removeEventListener("message", handleNextTurnEvent);
        };
    }, [socket, gameId, playerId, setIsButtonActive]);
}
