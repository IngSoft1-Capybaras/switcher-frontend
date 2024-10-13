import { useSocketContext } from "@/context/SocketContext";
import {useEffect} from "react";

export function useUpdateBoardSocket(activeGameId, fetchBoard) {
    const {socket} = useSocketContext();

    useEffect(() => {
        if (!socket || !activeGameId || !fetchBoard) return;

        const handleUptadeBoard = async (event) => {
            const data = JSON.parse(event.data);

            if (data.type == `${activeGameId}:MOVEMENT_UPDATE`) {
                fetchBoard();
            }
        }
        socket.addEventListener("message", handleUptadeBoard);
        return () => {
            socket.removeEventListener("message", handleUptadeBoard);
        };    
    }, [socket, activeGameId, fetchBoard])
}