import React, { useEffect, useState } from 'react';
import PlayersList from '../components/ui/PlayersList';
import { useParams } from 'react-router-dom';
import StartButton from '../components/ui/activeButton';
import { useGameContext } from '@/context/GameContext';
import { getPlayers, getGameInfo, getPlayer, startGame, calculateFigures } from '../services/services';
import { useLobbySocket } from '@/components/hooks/use-lobby-socket';
import BotonAbandonar from '@/components/ui/LeaveButton';
import Chat from '@/components/ui/chat';
import { useSocketContext } from '@/context/SocketContext';

// The improved lobby component
export default function Lobby() {
  const { gameId } = useParams();
  const { players, setPlayers, playerId, gameName, setGameName } = useGameContext();
  const [iniciateActive, setIniciateActive] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(0);
  const [minPlayers, setMinPlayers] = useState(Infinity);

  const [host, setHost] = useState(false);
  const { socket } = useSocketContext();

  const [previousPlayers, setPreviousPlayers] = useState(players);

  const fetchPlayersInfo = async () => {
    try {
      const fetchedPlayers = await getPlayers(gameId);
      setPlayers(fetchedPlayers);

      const isHost = fetchedPlayers.some(player => player.host && player.id === playerId);

      if (isHost) {
        // verifo que jugadores entraron
        const newPlayers = fetchedPlayers.filter(
          newPlayer => !previousPlayers.some(prevPlayer => prevPlayer.id === newPlayer.id)
        );

        // verifo que jugadores salieron
        const leftPlayers = previousPlayers.filter(
          prevPlayer => !fetchedPlayers.some(newPlayer => newPlayer.id === prevPlayer.id)
        );

        // envio mensajes por socket
        newPlayers.forEach(newPlayer => {
          if (socket) {
            socket.send(JSON.stringify({
              type: `${gameId}:CHAT_MESSAGE`,
              message: `${newPlayer.name} se ha unido al juego.`
            }));
          }
        });
        leftPlayers.forEach(leftPlayer => {
          if (socket) {
            socket.send(JSON.stringify({
              type: `${gameId}:CHAT_MESSAGE`,
              message: `${leftPlayer.name} se ha ido del juego.`
            }));
          }
        });

        setPreviousPlayers(fetchedPlayers);
      }
    } catch (err) {
      console.error("Error al obtener jugadores", err);
    }
  };
  const onStartClick = async () => {
    // navigate(`/games/ongoing/${gameId}`);
    // await manager.broadcast(message)
    // socket.send(JSON.stringify({"type":`${gameId}:GAME_STARTED`}));

    await startGame(gameId);
  };

  useEffect(() => {
    getGameInfo(gameId).then((res) => {
      setMaxPlayers(res.max_players);
      setMinPlayers(res.min_players);
      setGameName(res.name);
    }).catch((err) =>
      console.error(`Error: Unable to retrieve basic game data. ${err}`)
    );

    getPlayer(gameId, playerId).then((res) => {
      setHost(res.host);
    }).catch((err) =>
      console.error(`Error: Unable to retrieve player data. ${err}`)
    );

    fetchPlayersInfo(); // Initial fetch
  }, []);

  useEffect(() => {
    // Check if the button should be active
    if (players.length >= minPlayers && host) {
      setIniciateActive(true);
    } else {
      setIniciateActive(false);
    }
  }, [players, host, minPlayers]); // Run this effect whenever players, host, or minPlayers changes


  useLobbySocket(gameId, fetchPlayersInfo, host); // Subscribe to events for dynamic updates

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
  <h1 className="text-5xl font-extrabold text-center mb-8 text-white">{gameName}</h1>

  {/* Outer Container for status, player list, and chat */}
  <div className="max-w-4xl w-full bg-zinc-950 p-8 rounded-lg shadow-lg border border-zinc-900 flex flex-col">

    {/* Status Box occupying full row within the container */}
    <div className="w-full mb-4 p-4">
      {/* <h3 className="text-xl text-center font-bold text-white mb-2">Estado del Juego</h3> */}
      {players.length >= minPlayers ? (
        <p className="mt-4 text-center text-green-400">Todo listo para empezar!</p>
      ) : (
        <p className="mt-4 text-center text-gray-400">
          Deben entrar por lo menos {minPlayers} jugadores para empezar
        </p>
      )}
    </div>

    {/* Container for player list and chat in columns */}
    <div className="flex flex-col md:flex-row">
      {/* Player List Section */}
      <div className="w-full md:w-1/3 mb-4 md:mb-0">
        <PlayersList players={players} minPlayers={minPlayers} maxPlayers={maxPlayers} />
      </div>

      {/* Chat Section */}
      <Chat gameId={gameId}/>
    </div>
  </div>


  {/* Start Button */}
  <div className="flex justify-center mt-8 space-x-3">
  <BotonAbandonar gameId={gameId} />
  {host && (
      <StartButton
        isActive={iniciateActive}
        onClick={onStartClick}
        className={`${
          iniciateActive
            ? "bg-green-600 hover:bg-green-700"
            : "bg-zinc-500 cursor-not-allowed"
        } px-6 py-2 text-white font-bold rounded-md transition-all duration-300 ease-in-out`}
      >
        Comenzar partida
      </StartButton>
  )}
  </div>
</div>

  );
}
