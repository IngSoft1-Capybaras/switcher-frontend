import { useGameContext } from '@/context/GameContext';
import { useNavigate } from 'react-router-dom';
import {joinGame} from '../../services/services';

export default function GamesList({ games, currentPage, setCurrentPage, totalPages, loading }) {
  const {setPlayerId, userName} = useGameContext();
  const navigate = useNavigate();

  const handleGameSelect = (gameId) => {
    joinGame(gameId, userName)
    .then((res)=> {
      setPlayerId(res.playerId);
    })
    .catch((err) => console.error("Error entrando al juego"));

    navigate(`/games/lobby/${gameId}`);
  };

  return (
    <>
      {loading ? (
        <div className="text-center text-zinc-200">Loading...</div>
      ) : (
        (games && games.length === 0) ? (
            <div className='bg-zinc-950 p-8 rounded-lg shadow-lg border border-zinc-900'>
                <div className="h-1/2 text-center justify-center flex flex-col gap-4 bg-zinc-950 text-zinc-300">
                    No hay partidas creadas aun.
                </div>

            </div>
        ) : (
          <div className="bg-zinc-950 p-8 rounded-lg shadow-lg border border-zinc-900">
            <ul className="flex flex-col gap-4">
              {games.map((game) => (
                <li
                  key={game.id}
                  className="group rounded-lg p-6 shadow bg-zinc-900 border border-zinc-800 hover:bg-zinc-700 relative flex items-center justify-between transition-all duration-300"
                >
                  {/* Game details displayed horizontally */}
                  <div className="flex gap-8 w-full">
                    {/* Game Name */}
                    <div className="flex flex-col">
                      <span className="text-xl font-semibold text-zinc-100">{game.name}</span>
                    </div>

                    {/* Number of Players */}
                    <div className="flex flex-col">
                      <span className="text-zinc-300">
                        {game.currentPlayers} de {game.maxPlayers} jugadores
                      </span>
                    </div>

                    {/* Game Status: Public or Private */}
                    <div className="flex flex-col">
                      <span className="text-zinc-300">
                        {game.isPrivate ? 'Privada' : 'Pública'}
                      </span>
                    </div>
                  </div>

                  {/* Button that shows on hover */}
                  <button
                    onClick={() => handleGameSelect(game.id)}
                    className="bg-green-600 text-white py-1 px-4 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Jugar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-zinc-600 text-white py-2 px-4 rounded disabled:opacity-50 hover:bg-zinc-500 transition-all duration-200"
        >
          Anterior
        </button>

        <span className="text-zinc-300">Página {currentPage} de {totalPages}</span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-zinc-600 text-white py-2 px-4 rounded disabled:opacity-50 hover:bg-zinc-500 transition-all duration-200"
        >
          Siguiente
        </button>
      </div>
    </>
  );
}
