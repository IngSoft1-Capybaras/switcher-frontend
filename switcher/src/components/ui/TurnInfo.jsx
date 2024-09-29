import React, { useEffect, useState } from 'react';
import { useGameContext } from "@/context/GameContext"; 
import { useSocketContext } from "@/context/SocketContext"; 

export default function TurnInformation() {
    const { players, activeGameId, currentTurn, setCurrentTurn } = useGameContext();
    const [turnData, setTurnData] = useState(null);
    const {socket} = useSocketContext();

    const fetchTurnInfo = async (activeGameId) => {
        try {
            const response = await fetch(`http://localhost:8000/game_state/${activeGameId}/current_turn`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
    
            const data = await response.json();
            return data;
        } 
        catch (error) {
            console.error("Error al obtener información del turno:", error);
            throw new Error("Error al obtener información del turno");
        }
    }


    useEffect(() => {
        if (!socket || !activeGameId) return;

        const handleNextTurnEvent = async (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "NEXT_TURN") {
                
                // seteamos nuevo turno en GameContext
                setCurrentTurn(data.nextPlayerId);
                
                // Get de la informacion del nuevo turno
                const newTurnData = await fetchTurnInfo(activeGameId);
                
                // Actualizamos el turno actual
                setTurnData(newTurnData); 
            }
        };

        socket.addEventListener("message", handleNextTurnEvent);

        return () => {
          socket.removeEventListener("message", handleNextTurnEvent);
        };
      }, [socket, activeGameId, setCurrentTurn]);
    
    return (
        <div className="turn-info">
            <h2>Información del Turno</h2>
            <p>Cantidad de jugadores en la partida: {players.length}</p>
            <p>Es el turno del jugador: {currentTurn}</p>
            {/*siguiente turno*/}
            {/*color bloqueado*/}
        </div>
    )
};
