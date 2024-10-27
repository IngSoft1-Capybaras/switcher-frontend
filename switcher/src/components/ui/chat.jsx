import React, { useEffect, useState} from 'react'
import { useSocketContext } from '@/context/SocketContext';
import { useGameContext } from '@/context/GameContext';
import { useChatSocket } from '../hooks/use-chat-socket';

export default function Chat (gameId) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const {socket} = useSocketContext();
  const {username} = useGameContext();

  const handleSendMessage = () => {
    const formattedMessage = `${username}: ${message}`;

    socket.send(JSON.stringify(
      {
        type: `${gameId}:CHAT_MESSAGE`,
        message: formattedMessage
      }
    ))
    setMessage('');
  }


  useChatSocket(gameId, chat, setChat);


  return (
    <div className="w-full md:w-2/3 md:ml-4 bg-zinc-900 p-4 rounded-lg shadow-md border border-zinc-800">
      <h3 className="text-xl font-bold text-white mb-2">Chat</h3>

      <div>
        {chat.map((msg, index) => (
          <div className="text-zinc-300 mb-1" key={index}>{msg}</div>
        ))}
      </div>

      <div>
        <input
          type="text"
          className="w-full p-2 bg-zinc-900 text-zinc-300 rounded"
          placeholder="Escribe tu mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={handleSendMessage}>
          Enviar
        </button>
      </div>
    </div>
  );
}
