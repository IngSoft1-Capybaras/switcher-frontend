import React, { useEffect, useState} from 'react'
import { useSocketContext } from '@/context/SocketContext';
import { useGameContext } from '@/context/GameContext';
import { useChatSocket } from '../hooks/use-chat-socket';
import { Button } from './button';

export default function Chat ({gameId}) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const {socket} = useSocketContext();
  const {username} = useGameContext();

  const handleSendMessage = () => {
    if(message.trim()){
      const formattedMessage = `${username}: ${message}`;
      const formattedType = `${gameId}:CHAT_MESSAGE`;
      socket.send(JSON.stringify(
        {
          type: formattedType,
          message: formattedMessage
        }
      ))
    }
    setMessage('');
  }


  useChatSocket(gameId, chat, setChat);


  return (
    <div className="w-full md:w-2/3 md:ml-4 bg-zinc-900 p-4 rounded-lg shadow-md border border-zinc-800">
      <h3 className="text-xl font-bold text-white mb-2">Chat</h3>

      <div className="h-60 overflow-y-auto mb-2">
        {chat.map((msg, index) => {
          const isCurrentUser = msg.startsWith(`${username}:`);
          return (
            <div key={index} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}>
              <div
                className={` text-zinc-300 p-2 rounded-lg ${isCurrentUser ? 'bg-blue-600' : 'bg-zinc-800'}` }>
                {isCurrentUser ? msg.split(': ')[1] : msg}
              </div>
            </div>
          );
        })}
      </div>

      <div className='flex'>
        <input
          type="text"
          className="flex-1 p-2 bg-zinc-900 text-zinc-300 rounded-l-lg border border-zinc-800 focus:outline-none"
          placeholder="Escribe tu mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Button onClick={handleSendMessage}>
          Enviar
        </Button>
      </div>
    </div>
  );
}
