import { useNavigate } from 'react-router-dom';


export default function GamesList({games, currentPage, setCurrentPage, totalPages, loading}) {
    const navigate = useNavigate();
    
    const handleGameSelect = (gameId) => {
        navigate(`/games/${gameId}`);
    };

    return(
        <>
            {loading ? (
            <div className="text-center"> Loading...</div>
            ) : ( (games.length===0) ? <div className="h-1/2 text-center justify-center flex flex-col gap-4 bg-zinc-950"> No hay partidas en creadas aun.</div> : 
            <div>
                <ul className="flex flex-col gap-4 bg-zinc-950 ">
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

                
            </div>
            )}
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
        </>
    );
}