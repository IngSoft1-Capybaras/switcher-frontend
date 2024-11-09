import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaPlay } from 'react-icons/fa';
import GamesList from '../components/ui/GamesList';
import { useGameSocket } from '../components/hooks/use-games-socket';
import { getGames, joinGame } from '../services/services';
import { useGameContext } from '@/context/GameContext';
import { PageFilter } from '@/components/ui/pageFilter';
import { MdOutlineCleaningServices } from "react-icons/md";

const Games = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [loading, setLoading] = useState(true);
  const { setPlayerId, username, setToken } = useGameContext();
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
          setToken(res.token)
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
    <div className="w-full h-screen flex flex-col justify-center items-center bg-zinc-950 text-white">
      <h1 className="w-full text-6xl text-center mb-10 text-white">Lista de partidas</h1>

      <div className="sm:w-3/4 md:w-[700px] lg:1/2">
        <div className="flex justify-between mb-4 items-center">
          {/* Create Game Button */}
          <button
            onClick={handleCreateGame}
            className="text-white py-2 px-4 text-4xl rounded hover:text-gray-500 transition-all duration-200 flex items-center"
          >
            <FaPlus size={30} className="mr-2" />
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

            {/* Undo Filter Button */}
            <button
              disabled={!isFiltering}
              onClick={handleRemoveFilter}
              className={`py-2 px-4 rounded transition-all duration-200 flex items-center ${
                isFiltering
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <MdOutlineCleaningServices size={30} className="mr-2" />
            </button>
          </div>
          {/* Join Game Button */}
          <button
            onClick={handleJoinGame}
            disabled={!selectedGame}
            className={`py-2 px-4 rounded transition-all duration-200 flex items-center ${
              selectedGame
                ? 'text-green-600 hover:text-green-700'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <FaPlay size={30} className="mr-2" />
          </button>
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
