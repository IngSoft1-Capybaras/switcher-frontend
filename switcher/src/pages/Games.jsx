import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaPlay, FaUndo, FaFilter } from 'react-icons/fa';
import GamesList from '../components/ui/GamesList';
import { useGameSocket } from '../components/hooks/use-games-socket';
import { getGames, joinGame } from '../services/services';
import { useGameContext } from '@/context/GameContext';
import { PageFilter } from '@/components/ui/pageFilter';

const Games = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [loading, setLoading] = useState(true);
  const { setPlayerId, username } = useGameContext();
  const [formData, setFormData] = useState({ name: '', players: '' });
  const [isFiltering, setIsFiltering] = useState(false);

  const handleCreateGame = () => {
    navigate('/games/create');
  };

  const handleRemoveFilter = async () => {
    setIsFiltering(false);
    fetchGames(currentPage, {});
  };

  const fetchGames = async (page, formData) => {
    try {
      const data = await getGames(page, formData, isFiltering);
      setGames(data.games);
      setTotalPages(data.total_pages);
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
          setPlayerId(res.player_id);
          navigate(`/games/lobby/${selectedGame.id}`);
        })
        .catch((err) => console.error("Error entrando al juego"));
    }
  };

  useGameSocket(fetchGames, currentPage, isFiltering, formData);

  useEffect(() => {
    fetchGames(currentPage, formData);
  }, [currentPage, isFiltering]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-black space-y-8 text-white">
      <h1 className="text-5xl font-bold text-white mb-6">Lista de partidas</h1>

      <div className="w-1/3">
        <div className="flex justify-between mb-4 items-center">
          {/* Create Game Button */}
          <button
            onClick={handleCreateGame}
            className="text-white py-2 px-4 rounded hover:text-gray-500 transition-all duration-200 flex items-center"
          >
            <FaPlus className="mr-2" /> Crear
          </button>

          {/* Join Game Button */}
          <button
            onClick={handleJoinGame}
            disabled={!selectedGame || selectedGame.players_count >= selectedGame.max_players}
            className={`text-white rounded transition-all duration-200 flex items-center ${
              selectedGame
                ? selectedGame.players_count >= selectedGame.max_players
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-green-600 hover:text-green-700'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <FaPlay className="mr-2" /> Jugar
          </button>

          <div className="flex space-x-4 items-center">
            {/* Filter Button */}
            <PageFilter
              setGames={setGames}
              setTotalPages={setTotalPages}
              setIsFiltering={setIsFiltering}
              formData={formData}
              setFormData={setFormData}
              fetchGames={fetchGames}
            />

            {/* Filter Icon
            <button
              onClick={() => setIsFiltering(true)}
              className="text-white rounded hover:text-gray-400 transition-all duration-200 flex items-center"
            >
              <FaFilter className="mr-2" />
            </button> */}

            {/* Undo Filter Button */}
            <button
              disabled={!isFiltering}
              onClick={handleRemoveFilter}
              className={`text-white rounded hover:text-gray-500 transition-all duration-200 flex items-center ${
                !isFiltering ? 'cursor-not-allowed' : ''
              }`}
            >
              <FaUndo className="mr-2" />
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
