import React, { useEffect } from 'react';
import { useGameContext } from "@/context/GameContext"; 
import { useSocketContext } from "@/context/SocketContext"; 

export default function TurnInformation({ players, activeGameId }) {
    const { currentTurn, setCurrentTurn } = useGameContext();
    const { socket } = useSocketContext();

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
            throw new Error("Error al obtener información del turno");
        }
    }

    useEffect(() => {
        if (!socket) return;

        const handleNextTurnEvent = async (event) => {
            const data = JSON.parse(event.data);

            if (data.type === `${activeGameId}:NEXT_TURN`) {
                
                const newTurnData = await fetchTurnInfo(activeGameId);
                
                if (newTurnData.current_player_id) {
                    setCurrentTurn(newTurnData.current_player_id);
                } 
                else {
                    console.error("Received an undefined player ID.");
                }
            }
        };

        socket.addEventListener("message", handleNextTurnEvent);

        return () => {
            socket.removeEventListener("message", handleNextTurnEvent);
        };
    }, [socket, activeGameId, setCurrentTurn]);


    const currentPlayer = players.length > 0 ? players.find(player => player.id === currentTurn) : null;

    return (
        <div className="bg-zinc-900 text-white p-4 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4">Información del Turno</h2>
            <p className="text-lg mb-2">
                Cantidad de jugadores en la partida: <span className="font-semibold">{players.length}</span>
            </p>
            <p className="text-lg">
                Es el turno de:  
                <span className="font-semibold">
                    {currentPlayer ? currentPlayer.name : "Cargando turno..."}
                </span>
            </p>
        </div>
    );
}