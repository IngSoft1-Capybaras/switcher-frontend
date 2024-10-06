import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { useGameContext } from "@/context/GameContext"; 
import { useSocketContext } from "@/context/SocketContext"; 
import { pathEndTurn } from "@/services/services";
import { useEndTurnSocket } from "../hooks/use-end_turn-socket";


const EndTurnButton = ({gameId, currentTurn}) => {
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { playerId } = useGameContext();
  const { socket } = useSocketContext();

  useEffect(() => {
    if (currentTurn==playerId) {
      setIsButtonActive(true);
    }
  }, [currentTurn]);

  // Conexion con socket
  useEndTurnSocket(gameId, playerId, setIsButtonActive);
  
  // Manejar la lógica para terminar el turno
  const onHandleEndTurn = async () => {
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
    <Button
      className="bg-green-500 hover:bg-green-600"
      disabled={!isButtonActive || loading} // Deshabilitar si no es el turno del jugador o está cargando
      onClick={onHandleEndTurn}
    >
      {loading ? "Terminando..." : "Terminar Turno"}
    </Button>
  );
};

export default EndTurnButton;
