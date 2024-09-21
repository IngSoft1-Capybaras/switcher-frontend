import GamesList from '../components/ui/GamesList';
import { useGameSocket } from '../components/hooks/use-games-socket';
import { getGames } from '../services/services'
import React, { useState, useEffect, useCallback } from 'react';

const Games = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);


  const fetchGames = useCallback(async (page) => {
    setLoading(true);
    //Mock API or WebSocket response
    const gamesRes = await getGames();
    if (gamesRes) {
      setGames(gamesRes.games);
      setTotalPages(gamesRes.totalPages);
    }
    setLoading(false);
});

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
