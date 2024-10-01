import React, { useEffect, useState } from 'react';
import { useSocketContext } from "@/context/SocketContext";
import { fetchTurnInfo } from "../../services/services";

const colors = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500'];

export default function TurnInformation({ players, activeGameId, currentTurn, setCurrentTurn }) {
  const { socket } = useSocketContext();
  const [colorClass, setColorClass] = useState('');

  useEffect(() => {
    if (!socket) return;

    const handleNextTurnEvent = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === `${activeGameId}:NEXT_TURN`) {
        const newTurnData = await fetchTurnInfo(activeGameId);

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

  useEffect(() => {
    // Assign a random color to the current player's name whenever currentTurn changes
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColorClass(randomColor);
  }, [currentTurn]);

  const currentPlayer = players.length > 0 ? players.find(player => player.id === currentTurn) : null;

  return (
    <div className="bg-zinc-900 text-white p-6 rounded-lg shadow-md border border-zinc-700">
      <h2 className="text-2xl font-bold mb-4">Información del Turno</h2>
      <p className="text-md mb-2">
        Jugadores en la partida: <span className="font-semibold">{players.length}</span>
      </p>
      <p className="text-md">
        Turno de:  
        <span className={`font-semibold ml-2 ${colorClass}`}>
          {currentPlayer ? currentPlayer.name : "Cargando..."}
        </span>
      </p>
    </div>
  );
}
