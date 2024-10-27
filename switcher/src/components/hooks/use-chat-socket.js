import { useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";

export function useChatSocket(gameId, chat, setChat) {
  const { socket } = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        const handleNextTurnEvent = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === `${gameId}:CHAT_MESSAGE`) {
              setChat(chat => [data.message, ...chat])
            }
        };


        socket.addEventListener("message", handleNextTurnEvent);


        return () => {
            socket.removeEventListener("message", handleNextTurnEvent);
        };
    }, [socket, gameId, setChat]);
}