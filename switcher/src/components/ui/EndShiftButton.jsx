import React, { useEffect, useState } from "react";
import { useGameContext } from "@/context/GameContext";
import { calculateFigures, pathEndTurn } from "@/services/services";
import { useEndTurnSocket } from "../hooks/use-end_turn-socket";
import {FaCheck} from 'react-icons/fa'

const EndTurnButton = ({gameId, currentTurn, getTurnInfo, resetFigureSelection, resetMovement }) => {
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { playerId } = useGameContext();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (currentTurn===playerId) {
      // console.log("ES MI TURNO");
      setIsButtonActive(true);
    }
  }, [currentTurn, playerId]);

  // Conexion con socket
  useEndTurnSocket(gameId, playerId, setIsButtonActive);

  // Manejar la lógica para terminar el turno
  const onHandleEndTurn = async () => {
    resetFigureSelection();
    resetMovement();
    setLoading(true);
    
     pathEndTurn(gameId).then((res) => {

       if (!res) {
         console.error("Error actualizando el turno");
       }
       if (res.reverted_movements) {
          console.log(res.reverted_movements)
          calculateFigures(gameId);
       }
       // console.log("Turno finalizado", res);
       setIsButtonActive(false); // Desactiva el botón después de terminar el turno
     }).catch(error => {

       console.error("Error al terminar el turno", error);
       
      }).finally(() => {
       setLoading(false);
     })

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
