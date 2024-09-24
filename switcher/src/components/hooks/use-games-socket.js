import { useSocketContext } from '@/context/SocketContext';
import { useEffect } from 'react';

export function useGameSocket(fetchGames) {
  const { socket } = useSocketContext();  // Get WebSocket instance

  useEffect(() => {
    if (!socket) return;

    // Define a function to handle incoming messages
    const handleGamesListUpdate = (event) => {
      const data = JSON.parse(event.data);  // Assuming server sends JSON data
      if (data.type === "GAMES_LIST_UPDATE") {
        fetchGames(data.payload);  // Use the fetched games payload
      }
    };

    // Subscribe to WebSocket message events
    socket.addEventListener("message", handleGamesListUpdate);

    return () => {
      // Unsubscribe from WebSocket message events on cleanup
      socket.removeEventListener("message", handleGamesListUpdate);
    };
  }, [socket, fetchGames]);  // Dependency array includes socket and fetchGames
}
