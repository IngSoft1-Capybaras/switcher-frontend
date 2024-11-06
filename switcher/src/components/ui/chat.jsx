import React, { useRef, useState, useEffect } from 'react';
import { useSocketContext } from '@/context/SocketContext';
import { useGameContext } from '@/context/GameContext';
import { useChatSocket } from '../hooks/use-chat-socket';
import { Button } from './button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { IoIosSend, IoIosChatboxes } from "react-icons/io";
import { FaMinus } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const colors = ["red-500", "blue-500", "green-500", "yellow-500"];

export default function Chat ({gameId}) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const { socket } = useSocketContext();
  const { username, players } = useGameContext();
  const [isMinimized, setIsMinimized] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const viewportRef = useRef(null);

  const getPlayerColor = (index) => {
    return colors[index % colors.length];
  };

  const handleChatClick = () => {
    setIsMinimized(false);
    setShouldAutoScroll(true);
  };

  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const position = viewport.scrollTop + viewport.clientHeight;
    const height = viewport.scrollHeight;
    const enableAutoScroll = height - position <= 50;
    setShouldAutoScroll(enableAutoScroll);
  };

  useEffect(() => {
    if (!isMinimized) {
      const viewport = document.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewportRef.current = viewport;
        viewport.addEventListener('scroll', handleScroll);
      }
    }

    return () => {
      if (viewportRef.current) viewportRef.current.removeEventListener('scroll', handleScroll);
    };
  }, [isMinimized]);

  useEffect(() => {
    if (shouldAutoScroll && viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [chat, isMinimized]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (message.trim()) {
      const formattedMessage = `${username}: ${message}`;
      const formattedType = `${gameId}:CHAT_MESSAGE`;
      socket.send(JSON.stringify({ type: formattedType, message: formattedMessage }));
    }
    setMessage('');
  };

  useChatSocket(gameId, chat, setChat);

  return (
    <AnimatePresence>
      {!isMinimized ? (
        <motion.div
          className="w-full md:w-[32rem] max-w-[32rem] bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-800"
          key="expanded"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h3 className="text-3xl font-semibold text-white">Chat</h3>
            <Button
              onClick={() => setIsMinimized(true)}
              className="text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
            >
              <FaMinus />
            </Button>
          </div>

          <ScrollArea id="chatScrollArea" className="h-96 mb-4 pr-4">
            {chat.map((msg, index) => {
              const isChatMessage = msg.includes(':');
              const sender = msg.split(':')[0];
              const msgContent = msg.split(':')[1];
              const playerIndex = players.findIndex((player) => player.name === sender);
              const isCurrentUser = sender === username;
              const showSenderName = isChatMessage && (index === 0 || chat[index - 1].split(':')[0] !== sender);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  <div>
                    {showSenderName && (
                      <span className="text-lg text-zinc-200 block mb-1">
                        {!isCurrentUser ? sender : "Tú"}
                      </span>
                    )}
                    <div
                      className={`text-zinc-300 p-3 rounded-lg break-words w-fit bg-${getPlayerColor(playerIndex)}`}
                    >
                      <p className={`${isChatMessage ? "text-xl" : "text-lg"} whitespace-pre-wrap text-white`}>
                        {msgContent}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="flex items-stretch">
            <input
              type="text"
              className="flex-1 bg-zinc-800 text-white text-lg rounded-l-full px-4 py-2 focus:outline-none"
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              type="submit"
              className="rounded-r-full p-4 bg-gray-500 hover:bg-gray-700 transition-colors h-auto"
            >
              <IoIosSend className="w-6 h-6" />
            </Button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          key="minimized"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Button
            onClick={handleChatClick}
            className="w-full md:w-[32rem] p-5 justify-between hover:bg-zinc-800 rounded-lg bg-zinc-900 border border-zinc-800"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <IoIosChatboxes className="w-6 h-6 shrink-0" />
              <span className="text-lg truncate">
                {chat.length > 0 ? chat[chat.length - 1] : "Abrir chat"}
              </span>
            </div>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
