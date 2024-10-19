import { useGameContext } from "@/context/GameContext";
import { useSocketContext } from "@/context/SocketContext";
import {useEffect} from "react";

export function useUpdateBoardSocket(activeGameId, fetchBoard, currentTurn, playerId) {
    const {socket} = useSocketContext();

    useEffect(() => {
        if (!socket || !activeGameId || !fetchBoard) return;

        const handleUptadeBoard = async (event) => {
            const data = JSON.parse(event.data);
            console.log(playerId);
            console.log(currentTurn);

            if (data.type == `${activeGameId}:MOVEMENT_UPDATE`||((data.type === `${activeGameId}:BOARD_UPDATE`) && (currentTurn === playerId))) {
                // console.log("FETCHING BOARD...")
                await fetchBoard();
                
            }

        }
        socket.addEventListener("message", handleUptadeBoard);
        return () => {
            socket.removeEventListener("message", handleUptadeBoard);
        };    
    }, [socket, activeGameId, fetchBoard, playerId, currentTurn])
}