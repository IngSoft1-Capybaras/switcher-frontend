import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const mockGames = {
    games: [
      {
        id: 1,
        name: 'Game 1',
        description: 'Description for Game 1',
        currentPlayers: 3,
        maxPlayers: 5,
        isPrivate: false
      },
      {
        id: 2,
        name: 'Game 2',
        description: 'Description for Game 2',
        currentPlayers: 2,
        maxPlayers: 4,
        isPrivate: true
      }
    ],
    totalPages: 3
  };
  

export default function GamesList() {
    const [games, setGames] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const socketRef = useRef(null);

    const fetchGames = async (page) => {
        setLoading(true);
        try {

        // TODO: conectar con back (hacer fetch al endpoint y utilizar listado real)
        setGames(mockGames.games);
        setTotalPages(mockGames.totalPages);
        } catch (error) {
        console.error('Error setting mock games:', error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames(currentPage);
    }, [currentPage]);

    useEffect(() => {
        socketRef.current = new WebSocket('ws://localhost:3000/games'); // Adjust URL as necessary

        socketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'update') {
            fetchGames(currentPage);
        }
        };

        return () => {
        if (socketRef.current) {
            socketRef.current.close();
        }
        };
    }, [currentPage]);

    const handleGameSelect = (gameId) => {
        navigate(`/games/${gameId}`);
    };

    const handleCreateGame = () => {
        navigate('/games/create');
    };

    return(
        <>
            <button
            onClick={handleCreateGame}
            className="bg-yellow-500 text-white py-2 px-4 rounded mb-6"
            >
            Crear partida
            </button>

            {loading ? (
            <div className="text-center">Loading games...</div>
            ) : (
            <div>
                <ul className="flex flex-col gap-4 bg-zinc-900 ">
                {games.map((game) => (
                    <li
                    key={game.id}
                    className="group rounded-lg p-4 shadow hover:bg-zinc-700 relative flex items-center justify-between"
                    >
                    {/* Game details displayed horizontally */}
                    <div className="flex gap-8 w-full">
                        {/* Game Name */}
                        <div className="flex flex-col">
                        <span className="text-xl font-semibold">{game.name}</span>
                        </div>

                        {/* Number of Players */}
                        <div className="flex flex-col">
                        <span>
                            {game.currentPlayers} de {game.maxPlayers}  jugadores
                        </span>
                        </div>

                        {/* Game Status: Public or Private */}
                        <div className="flex flex-col">
                        <span>{game.isPrivate ? 'Privada' : 'Pública'}</span>
                        </div>
                    </div>

                    {/* Button that shows on hover */}
                    <button
                        onClick={() => handleGameSelect(game.id)}
                        className="bg-green-600 text-white py-1 px-4 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Jugar
                    </button>
                    </li>
                ))}
                </ul>

                <div className="flex justify-between items-center mt-6">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-zinc-600 py-2 px-4 rounded disabled:opacity-50"
                >
                    Anterior
                </button>

                <span>Página {currentPage} de {totalPages}</span>

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-zinc-600 py-2 px-4 rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
                </div>
            </div>
            )}
        </>
    );
}