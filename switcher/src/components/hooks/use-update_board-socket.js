import { useGameContext } from "@/context/GameContext";
import { useSocketContext } from "@/context/SocketContext";
import { calculateFigures } from "@/services/services";
import {useEffect} from "react";

export function useUpdateBoardSocket(activeGameId, fetchBoard, setSyncEffect, setLoadingFig, setIsWaitingBoard) {
    const {socket} = useSocketContext();
    const { currentTurn, playerId } = useGameContext();

    useEffect(() => {
        if (!socket || !activeGameId || !fetchBoard) return;

        const handleUptadeBoard = async (event) => {
            const data = JSON.parse(event.data);
            // console.log(playerId);
            // console.log(currentTurn);

            if (data.type === `${activeGameId}:MOVEMENT_UPDATE`) {
                console.log("FETCHING BOARD MOV")
                fetchBoard().then((res) => {

                    if (currentTurn===playerId) {
                        setSyncEffect(false);
                        setLoadingFig(true);
                        setIsWaitingBoard(true);
                        calculateFigures(activeGameId).then((res) => {
                            setSyncEffect(true)
                            setLoadingFig(false);
                            //setIsWaitingBoard(false);
                        })
                    }
                })

            }
            if (((data.type === `${activeGameId}:BOARD_UPDATE`) && (currentTurn === playerId))) {
                console.log("FETCHING BOARD FIG CALC")
                console.log(`current Turn board update: ${currentTurn}`)
                fetchBoard().then((res) => {
                    setLoadingFig(false);
                    setIsWaitingBoard(false);
                    setSyncEffect(true);
                })
            }

        }
        socket.addEventListener("message", handleUptadeBoard);
        return () => {
            socket.removeEventListener("message", handleUptadeBoard);
        };
    }, [socket, activeGameId, fetchBoard, playerId, currentTurn])
}