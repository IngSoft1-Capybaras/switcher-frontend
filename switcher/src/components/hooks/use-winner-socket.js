import { useSocketContext } from '@/context/SocketContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '@/context/GameContext';

export function useWinnerSocket(gameId) {
  const { socket } = useSocketContext(); // Obtén la instancia del WebSocket
  const { setGameName, setWinnerName } = useGameContext(); // Obtén las funciones para actualizar el contexto
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    // Define una función para manejar los mensajes entrantes
    const handleGameMessage = (event) => {
      const data = JSON.parse(event.data); // Asumiendo que el servidor envía datos en formato JSON

      if (data.type === 'PLAYER_WINNER') {
        setGameName(data.gameName); // Asegúrate de que el backend envíe este dato
        setWinnerName(data.winnerName); // Asegúrate de que el backend envíe este dato
        navigate(`/winner/${gameId}`); // Redirige a la página del ganador
      }
    };

    // Suscríbete a los eventos de mensajes del WebSocket
    socket.addEventListener('message', handleGameMessage);

    return () => {
      // Desuscribirse de los eventos de mensajes del WebSocket en la limpieza
      socket.removeEventListener('message', handleGameMessage);
    };
  }, [socket, gameId, navigate, setGameName, setWinnerName]); // Las dependencias incluyen socket, gameId y navigate
}
