import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { useGameContext } from "@/context/GameContext"; 
import { useSocketContext } from "@/context/SocketContext"; 
import { pathEndTurn } from "@/services/services";


const EndTurnButton = ({gameId, currentTurn}) => {
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { playerId } = useGameContext(); // Obtener el ID del jugador actual
  const { socket } = useSocketContext(); // Obtener el socket del contexto

  useEffect(() => {
    console.log("HOLAAAAAA");
    console.log(currentTurn);
    console.log(playerId);

    if (currentTurn==playerId) {
      setIsButtonActive(true);
    }
  }, [currentTurn]);

  // Escuchar el evento "siguiente-turno" a través del WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleNextTurnEvent = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === `${gameId}:NEXT_TURN` && data.nextPlayerId === playerId) {
        setIsButtonActive(true);
      } else {
        setIsButtonActive(false);
      }
    };

    // Suscribirse al evento "message" del socket
    socket.addEventListener("message", handleNextTurnEvent);

    return () => {
      socket.removeEventListener("message", handleNextTurnEvent); // Limpiar el listener
    };
  }, [socket, playerId]);

  // Manejar la lógica para terminar el turno
  const handleEndTurn = async () => {
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
      variant="default"
      disabled={!isButtonActive || loading} // Deshabilitar si no es el turno del jugador o está cargando
      onClick={handleEndTurn}
    >
      {loading ? "Terminando..." : "Terminar Turno"}
    </Button>
  );
};

export default EndTurnButton;
