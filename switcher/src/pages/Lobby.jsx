import React, { useEffect, useState } from 'react';
import PlayersList from '../components/ui/PlayersList';
import { useNavigate, useParams } from 'react-router-dom';
import StartButton from '../components/ui/activeButton';
import { useGameContext } from '@/context/GameContext';
import { getPlayers, getGameInfo, getPlayer, startGame } from '../services/services';
import { useLobbySocket } from '@/components/hooks/use-lobby-socket';

// The improved lobby component
export default function Lobby() {
  const { gameId } = useParams();
  const { players, setPlayers, playerId } = useGameContext();
  const [iniciateActive, setIniciateActive] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(0);
  const [minPlayers, setMinPlayers] = useState(Infinity);
  const [host, setHost] = useState(true);

  const navigate = useNavigate();

  const fetchGameInfo = async () => {
    getPlayers(gameId).then((fetchedPlayers) => {
      setPlayers(fetchedPlayers);
    }).catch((err) => {
      console.error("Error al obtener jugadores");
    });

    if (players.length >= minPlayers && host) {
      setIniciateActive(true);
    }
  };

  const onStartClick = async () => {
    startGame(gameId).then(() => {
      navigate(`/games/ongoing/${gameId}`);
    }).catch((err) => {
      console.error(`Error: ${err}`);
    });
  };

  useEffect(() => {
    getGameInfo(gameId).then((res) => {
      setMaxPlayers(res.maxPlayers);
      setMinPlayers(res.minPlayers);
    }).catch((err) =>
      console.error(`Error: Unable to retrieve basic game data. ${err}`)
    );

    getPlayer(gameId, playerId).then((res) => {
      setHost(res.host);
    }).catch((err) =>
      console.error(`Error: Unable to retrieve player data. ${err}`)
    );

    fetchGameInfo(); // Initial fetch
  }, []);

  useLobbySocket(gameId, fetchGameInfo); // Subscribe to events for dynamic updates

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-5xl font-extrabold text-center mb-8 text-white">Lobby</h1>

      {/* Container for player list and chat */}
      <div className="max-w-4xl w-full bg-zinc-950 p-8 rounded-lg shadow-lg border border-zinc-900 flex flex-col md:flex-row">
        {/* Player List Section */}
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <PlayersList players={players} minPlayers={minPlayers} maxPlayers={maxPlayers} />
        </div>

        {/* Chat de prueba (MOCK) */}
        <div className="w-full md:w-2/3 md:ml-4 bg-zinc-900 p-4 rounded-lg shadow-md border border-zinc-800">
          <h3 className="text-xl font-bold text-white mb-2">Chat</h3>
          <div className="h-64 overflow-y-auto mb-2 border border-zinc-800 p-2 rounded bg-zinc-900">
            <p className="text-zinc-400">Tus mensajes apareceran aqui...</p>
          </div>
          <input
            type="text"
            className="w-full p-2 bg-zinc-900 text-zinc-300 rounded"
            placeholder="Escribe tu mensaje..."
          />
        </div>
      </div>

      {/* Player Count Message */}
      {players.length >= minPlayers ? (
        <p className="mt-4 text-center text-green-400">Listo para empezar!</p>
      ) : (
        <p className="mt-4 text-center text-zinc-400">
          Deben entrar por lo menos {minPlayers} jugadores para empezar
        </p>
      )}

      {/* Start Button */}
      {host && (
        <div className="flex justify-center mt-8">
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
        </div>
      )}
    </div>
  );
}
