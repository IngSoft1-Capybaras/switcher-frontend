import GamesList from '../components/ui/GamesList';
import { useGameSocket } from '../components/hooks/use-games-socket';
import { getGames } from '../services/services'
import React, { useState, useEffect, useCallback } from 'react';

const Games = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    try {
      const data = await getGames(); // Call the function from service.js
      setGames(data); // Update the games state with fetched data
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
    <div className="w-full h-screen flex flex-col justify-center items-center bg-black space-y-20">
      <h1 className="text-5xl font-bold mb-6 text-white">Lista de partidas</h1>
      <div className="w-1/3 text-white">
        < GamesList games={games} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} loading={loading}/>
      </div>
    </div>
  );
};

export default Games;
