import React, { useState } from 'react'
import { useSocketContext } from '@/context/SocketContext';
import { useGameContext } from '@/context/GameContext';
import { useChatSocket } from '../hooks/use-chat-socket';
import { Button } from './button';
import { ScrollArea } from "@/components/ui/scroll-area"
import { IoIosSend } from "react-icons/io";


const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"];


export default function Chat ({gameId}) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const {socket} = useSocketContext();
  const {username, players} = useGameContext();

  const getPlayerColor = (index) => {
    return colors[index % colors.length];
  };


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

      <ScrollArea className="h-60 mb-2 pr-3">
        {chat.map((msg, index) => {
          const sender = msg.split(':')[0];
          const playerIndex = players.findIndex((player) => player.name === sender);
          const isCurrentUser = sender === username;

          return (
            <div key={index} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}>
              <div
                className={`text-zinc-300 p-2 rounded-lg max-w-[75%] overflow-wrap break-words
                            ${getPlayerColor(playerIndex)}`}
              >
                {isCurrentUser ? msg.split(': ')[1] : msg}
              </div>
            </div>
          );
        })}
      </ScrollArea>

      <div className='flex items-stretch'>
        <input
          type="text"
          className="flex-1 bg-zinc-800 text-white rounded-l-full px-4 py-2 focus:outline-none "
          placeholder="Escribe tu mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Button
          onClick={handleSendMessage}
          className={`rounded-r-full p-3 bg-gray-500 hover:bg-gray-700 transition-colors h-auto`}
        >
          <IoIosSend className='w-5 h-5'/>
        </Button>
      </div>
    </div>
  );
}
