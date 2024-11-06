import React, { useRef, useState, useEffect } from 'react'
import { useSocketContext } from '@/context/SocketContext';
import { useGameContext } from '@/context/GameContext';
import { useChatSocket } from '../hooks/use-chat-socket';
import { Button } from './button';
import { ScrollArea } from "@/components/ui/scroll-area"
import { IoIosSend, IoIosChatboxes } from "react-icons/io";
import { FaMinus } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"];


export default function Chat ({gameId, lobby}) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const {socket} = useSocketContext();
  const {username, players} = useGameContext();
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
    // scrollTop representa el número de píxeles que el contenido de un elemento se ha desplazado hacia arriba. (es 0 si esta en el tope)
    // es decir, es la distancia desde la parte superior de viewport hasta el punto donde empieza el área visible.
    // clientHeight es la altura de esa área visible.

    // para calcular la position sumamos desde donde empieza el area visible, para tener en cuenta todo lo que esta por encima
    // la altura total de lo visible
    const position = viewport.scrollTop + viewport.clientHeight;

    // scrollHeight incluye la altura total (visible + overflow)
    const height = viewport.scrollHeight;

    // verificamos que el area que queda por desplazar sea menor que el delta*
    // tomamos un delta arbitrario ya que height toma todo el tamano del elemento, incluyendo padding, border, etc*
    const enableAutoScroll = height - position <= 50;

    enableAutoScroll ? setShouldAutoScroll(true) : setShouldAutoScroll(false);
  }

  // efecto para obtener la referencia al viewport mientras se scrollea
  useEffect(() => {
        if (!isMinimized) {
          // buscamos la ref a el viewport del scrollarea a traves de su data-attribute (identificador), el id no me funciona
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

  // efecto para auto scrollear si debemos
  useEffect(() => {
    const scrollIfNewMessage = () => {
    if (!viewportRef.current || !shouldAutoScroll) return;
      const viewport = viewportRef.current;
      viewport.scrollTop = viewport.scrollHeight;
    }

    scrollIfNewMessage();
  }, [chat, isMinimized]) // se ejecuta cada vez que el chat se abre o llegan nuevos mensajes


  const handleSendMessage = (e) => {
    e?.preventDefault();
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
    <>
    {
      lobby ? 
      <AnimatePresence>
      {!isMinimized ? (
        <motion.div
          className="w-full md:w-[32rem] max-w-[32rem] bg-zinc-900 p-4 rounded-lg shadow-md border border-zinc-800"
          key="expanded"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between p-2 border-b border-zinc-800">
            <h3 className="text-2xl  text-white">Chat</h3>
            <Button
              onClick={() => setIsMinimized(true)}
              className="text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
            >
              <FaMinus />
            </Button>
          </div>

          <ScrollArea id='chatScrollArea' className="h-80 mb-2 pr-3">
            {chat.map((msg, index) => {
              const isChatMessage = msg.includes(':');
              const sender = msg.split(':')[0];
              const msgContent = msg.split(':')[1];
              const playerIndex = players.findIndex((player) => player.name === sender);
              const isCurrentUser = sender === username;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}
                >
                  <div
                    className={`text-zinc-300 p-2 rounded-lg max-w-[85%] break-words
                      ${getPlayerColor(playerIndex)}`}
                  >
                    {!isCurrentUser && isChatMessage && (
                      <span className="text-sm text-zinc-400 block mb-1">
                        {sender}
                      </span>
                    )}
                    <p className="sm:text-sm md:text-lg text-white whitespace-pre-wrap">
                      {msgContent || msg}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </ScrollArea>

          <form onSubmit={handleSendMessage} className='flex items-stretch'>
            <input
              type="text"
              className="flex-1 bg-zinc-800 text-white rounded-l-full px-4 py-2 focus:outline-none"
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              type="submit"
              className="rounded-r-full p-3 bg-gray-500 hover:bg-gray-700 transition-colors h-auto"
            >
              <IoIosSend className='w-5 h-5'/>
            </Button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          key="minimized"
          initial={{ opacity: 0, y: 20}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Button
            onClick={handleChatClick}
            className="w-full md:w-[32rem] p-4 justify-between hover:bg-zinc-800 rounded-lg bg-zinc-900 border border-zinc-800"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <IoIosChatboxes className="w-5 h-5 shrink-0" />
              <span className="sm:text-sm md:text-lg truncate">
                {chat.length > 0 ? (chat[chat.length - 1]) : "Abrir chat"}
              </span>
            </div>
          </Button>
        </motion.div>
      )}
     </AnimatePresence>      
    
    : // ACTIVE GAMES CHAT

      <AnimatePresence>
      {!isMinimized ? (
        <motion.div
          className="absolute bottom-20 right-0 bg-zinc-900 z-50 w-[600px] p-4 rounded-lg shadow-md border border-zinc-800"
          key="expanded"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between p-2 border-b border-zinc-800">
          <h3 className="text-2xl  text-white">Chat</h3>
            <Button
              onClick={() => setIsMinimized(true)}
              className="text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
            >
              <FaMinus />
            </Button>
          </div>

          <ScrollArea id='chatScrollArea' className="h-80 mb-2 pr-3">
            {chat.map((msg, index) => {
              const isChatMessage = msg.includes(':');
              const sender = msg.split(':')[0];
              const msgContent = msg.split(':')[1];
              const playerIndex = players.findIndex((player) => player.name === sender);
              const isCurrentUser = sender === username;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}
                >
                  <div
                    className={`text-zinc-300 p-2 rounded-lg max-w-[85%] break-words
                      ${getPlayerColor(playerIndex)}`}
                  >
                    {!isCurrentUser && isChatMessage && (
                      <span className="text-sm text-zinc-400 block mb-1">
                        {sender}
                      </span>
                    )}
                    <p className="sm:text-sm md:text-lg text-white whitespace-pre-wrap">
                      {msgContent || msg}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </ScrollArea>

          <form onSubmit={handleSendMessage} className='flex items-stretch'>
            <input
              type="text"
              className="flex-1 bg-zinc-800 text-white rounded-l-full px-4 py-2 focus:outline-none"
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              type="submit"
              className="rounded-r-full p-3 bg-gray-500 hover:bg-gray-700 transition-colors h-auto"
            >
              <IoIosSend className='w-5 h-5'/>
            </Button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          className='mb-2 w-fit  absolute bottom-20 right-0 bg-zinc-950'
          key="minimized"
          initial={{ opacity: 0, y: 20}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Button
            onClick={handleChatClick}
            

            className="w-full p-4 justify-end  rounded-lg  bg-zinc-950"

          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="sm:text-sm md:text-lg truncate">
                {chat.length > 0 ? (chat[chat.length - 1]) : "Abrir chat"}
              </span>
              <IoIosChatboxes className="w-5 h-5 shrink-0 ml-2" />
            </div>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>

    }
    </>
    
  );
};
