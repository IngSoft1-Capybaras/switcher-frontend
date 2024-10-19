import { useSocketContext } from "@/context/SocketContext";
import {useEffect} from "react";
import { fetchTurnInfo } from "@/services/services";

export function useTurnInfoSocket(activeGameId, setCurrentTurn, fetchBoard){
    const { socket } = useSocketContext();

    useEffect(() => {
        if (!socket) return;
    
        const handleNextTurnEvent = async (event) => {
          const data = JSON.parse(event.data);
    
          if (data.type === `${activeGameId}:NEXT_TURN`) {
            const newTurnData = await fetchTurnInfo(activeGameId);
            await fetchBoard();
            if (newTurnData.current_player_id) {
              setCurrentTurn(newTurnData.current_player_id);
            } else {
              console.error("Received an undefined player ID.");
            }
          }
        };
    
        socket.addEventListener("message", handleNextTurnEvent);
    
        return () => {
          socket.removeEventListener("message", handleNextTurnEvent);
        };
      }, [socket, activeGameId, setCurrentTurn]);
}