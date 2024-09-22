import { useSocketContext } from '@/context/SocketContext';
import { useEffect } from 'react';

export function useGameSocket(fetchGames) {
  const {socket} = useSocketContext();

  useEffect(() => {
    // subscribe to socket events
    socket.on("GAMES_LIST_UPDATE", fetchGames);

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off("GAMES_LIST_UPDATE", () => {console.log("Bye bye!")});
    };
  }, [socket, fetchGames]);
  
}