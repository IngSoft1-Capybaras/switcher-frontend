import {useEffect} from "react";
import { useSocketContext } from "@/context/SocketContext";



export function useEndTurnSocket(gameId, playerId, setIsButtonActive) {
    const {socket} = useSocketContext();

    // Escuchar el evento "siguiente-turno" a través del WebSocket
    useEffect(() => {
        if (!socket) return;

        const handleNextTurnEvent = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === `${gameId}:NEXT_TURN` && data.nextPlayerId === playerId) {
            setIsButtonActive(true);
        } else {
            setIsButtonActive(false);
        }
        };

        // Suscribirse al evento "message" del socket
        socket.addEventListener("message", handleNextTurnEvent);

        return () => {
        socket.removeEventListener("message", handleNextTurnEvent); // Limpiar el listener
        };
    }, [socket, playerId]);    
}
