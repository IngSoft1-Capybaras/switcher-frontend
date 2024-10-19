import GamesList from '../components/ui/GamesList';
import { useGameSocket } from '../components/hooks/use-games-socket';
import { getGames } from '../services/services';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '@/context/GameContext';
import { joinGame } from '../services/services';
import { PageFilter } from '@/components/ui/pageFilter';

const Games = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null); // Store selected game
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [loading, setLoading] = useState(true);
  const { setPlayerId, username } = useGameContext();

  // Estado para que no se actualice si es que estoy filtrando, a ver si se soluciona
  const [isFiltering, setIsFiltering] = useState(false);

  const handleCreateGame = () => {
    navigate('/games/create');
  };

  const handleRemoveFilter =  async () => {
    setIsFiltering(false);
  }

  const fetchGames = async (page) => {
    try {
      const data = await getGames(page);
      console.log('Check is filtering');
      console.log(isFiltering);
      if(!isFiltering){
        setGames(data.games);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error("Couldn't fetch games");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = () => {
    if (selectedGame) {
      joinGame(selectedGame.id, username)
        .then((res) => {
          // console.log(res)
          setPlayerId(res.player_id);
          navigate(`/games/lobby/${selectedGame.id}`);
        })
        .catch((err) => console.error("Error entrando al juego"));
    }
  };

  // games socket connection
  useGameSocket(fetchGames, currentPage);

  // initial fetch
  useEffect(() => {
    if (!isFiltering) {
      fetchGames(currentPage);
    }
  }, [currentPage, isFiltering]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-black space-y-20 text-white">
      <h1 className="text-5xl font-bold text-white mb-6">Lista de partidas</h1>

      <div className="w-1/3">
        <div className="flex justify-between mb-4">
          <button
            onClick={handleCreateGame}
            className="bg-blue-600 text-white py-2 px-4 rounded mb-6 hover:bg-blue-500 transition-all duration-200"
          >
            Crear partida
          </button>

          <button
                onClick={handleJoinGame}
                disabled={!selectedGame || selectedGame.players_count >= selectedGame.max_players}
                className={`text-white py-3 px-8 rounded mb-6 transition-all duration-200 ${
                  selectedGame
                    ? selectedGame.players_count >= selectedGame.max_players
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-500'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Jugar
          </button>

          <div className="flex flex-col space-y-4">
            <PageFilter setGames={setGames} setTotalPages={setTotalPages} setIsFiltering={setIsFiltering} />
            <button
              disabled={!isFiltering}
              onClick={handleRemoveFilter}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 transition-all duration-200"
            >
              Deshacer Filtros
            </button>
            </div>


        </div>
        <GamesList
          games={games}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          loading={loading}
          selectedGame={selectedGame}
          setSelectedGame={setSelectedGame}
        />
      </div>
    </div>
  );
};

export default Games;
