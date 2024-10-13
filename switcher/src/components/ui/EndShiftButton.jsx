import React, { useEffect, useState } from "react";
import { useGameContext } from "@/context/GameContext";
import { pathEndTurn } from "@/services/services";
import { useEndTurnSocket } from "../hooks/use-end_turn-socket";
import {FaCheck} from 'react-icons/fa'

const EndTurnButton = ({gameId, currentTurn, getTurnInfo, resetFigureSelection}) => {
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { playerId } = useGameContext();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (currentTurn==playerId) {
      setIsButtonActive(true);
    }
  }, [currentTurn, playerId]);

  // Conexion con socket
  useEndTurnSocket(gameId, playerId, setIsButtonActive);

  // Manejar la lógica para terminar el turno
  const onHandleEndTurn = async () => {
    resetFigureSelection();
    setLoading(true);
    try {
      const res = await pathEndTurn(gameId); // Llama al endpoint para finalizar el turno
      if (!res) {
        console.error("Error actualizando el turno");
      }
      console.log("Turno finalizado", res);
      setIsButtonActive(false); // Desactiva el botón después de terminar el turno
    } catch (error) {
      console.error("Error al terminar el turno", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button data-testid='endTurnButtonId' onClick={onHandleEndTurn} onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)} className={`text-white ${isButtonActive ? 'hover:scale-110 transition-transform' : 'opacity-50'}`}
      disabled={!isButtonActive || loading}>
            <FaCheck size={28} />
      </button>
      {showTooltip && (
        <div className="absolute bottom-full w-fit mb-2 z-50 p-2 text-sm bg-gray-700 text-white rounded">
            Finalizar turno
        </div>
      )}
    </div>
  );
};

export default EndTurnButton;
