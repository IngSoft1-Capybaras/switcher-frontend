import GamesList from '../components/ui/GamesList';
import { useGameSocket } from '../components/hooks/use-games-socket';
import { getGames } from '../services/services';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Games = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const handleCreateGame = () => {
    navigate('/games/create');
  };

  const fetchGames = async () => {
    try {
      const data = await getGames();
      setGames(data);
      // Update total pages logic as necessary
    } catch (error) {
      console.error("Couldn't fetch games");
    } finally {
      setLoading(false);
    }
  };

  // games socket connection
  useGameSocket(fetchGames);

  // initial fetch
  useEffect(() => {
    fetchGames(currentPage);
  }, [currentPage]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-black space-y-20 text-white">
      <h1 className="text-5xl font-bold text-white mb-6">Lista de partidas</h1>

      <div className="w-1/3">
        <button
          onClick={handleCreateGame}
          className="bg-blue-500 text-white py-2 px-4 rounded mb-6 hover:bg-blue-600 transition-all duration-200"
        >
          Crear partida
        </button>

        <GamesList
          games={games}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Games;
