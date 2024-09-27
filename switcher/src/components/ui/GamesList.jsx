import React from "react";

export default function GamesList({ games, currentPage, setCurrentPage, totalPages, loading, selectedGame, setSelectedGame,  }) {

  const handleGameSelect = (game) => {
    if (game.currentPlayers < game.maxPlayers) { 
      setSelectedGame(game); // Select the game if it's not full
    }
  };

  return (
    <>
      {loading ? (
        <div className="text-center text-zinc-200">Loading...</div>
      ) : games && games.length === 0 ? (
        <div className="bg-zinc-950 p-8 rounded-lg shadow-lg border border-zinc-900">
          <div className="h-1/2 text-center justify-center flex flex-col gap-4 bg-zinc-950 text-zinc-300">
            No hay partidas creadas aun.
          </div>
        </div>
      ) : (
        <div className="relative">
          
          

          <div className="bg-zinc-950 p-8 rounded-lg shadow-lg border border-zinc-900">
            <ul className="flex flex-col gap-4">
              {games.map((game) => {
                console.log(game);
                console.log(selectedGame);
                const isFull = game.currentPlayers >= game.maxPlayers;
                const isSelected = selectedGame?.id === game.id;

                return (
                  <li
                    key={game.id}
                    onClick={() => handleGameSelect(game)}
                    className={`group rounded-lg p-6 shadow border border-zinc-800 relative transition-all duration-300 cursor-pointer ${
                      isFull
                        ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed opacity-50'
                        : isSelected
                        ? ' border-blue-500'
                        : ''
                    }`}
                  >
                    {/* Game details spread out with space-between */}
                    <div className="flex justify-between w-full">
                      <div className="flex flex-col">
                        <span className="text-xl font-semibold text-zinc-100">{game.name}</span>
                      </div>

                      
                        <span className="text-zinc-300">
                          {game.currentPlayers} de {game.maxPlayers} jugadores
                        </span>
                        <span className="text-zinc-300">
                          {game.isPrivate ? 'Privada' : 'Pública'}
                        </span>
                      
                    </div>

                    {/* Full game indicator: Dimmed card and icon */}
                    {isFull && (
                      <div className="absolute top-2 right-2 text-red-600">
                        <i className="fas fa-ban"></i> {/* Optional: FontAwesome icon */}
                        <span className="ml-1 text-xs">Juego lleno</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
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
