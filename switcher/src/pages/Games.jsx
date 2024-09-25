import GamesList from '../components/ui/GamesList';
import { useGameSocket } from '../components/hooks/use-games-socket';
import { getGames } from '../services/services'
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Games = () => {
  const navigate=useNavigate();
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const handleCreateGame = () => {
    navigate('/games/create');
  };

  const fetchGames = async () => {
    try {
      const data = await getGames(); // Call the function from service.js
      setGames(data.games); // Update the games state with fetched data
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Couldn't fetch games")
    } finally {
      setLoading(false); // Set loading to false after the fetch completes
    }
  };

  // games socket connection
  useGameSocket(fetchGames);
    
  // initial fetch
  useEffect(() => {
      fetchGames(currentPage);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-black space-y-20 text-white">
      <h1 className="text-5xl font-bold mb-6 text-white">Lista de partidas</h1>

      <div className="w-1/3">
        <button
              onClick={handleCreateGame}
              className="bg-blue-500 text-white py-2 px-4 rounded mb-6"
              >
              Crear partida
        </button>
        < GamesList games={games} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} loading={loading}/>
      </div>
    </div>
  );
};

export default Games;
