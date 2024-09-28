import React, { useContext, useEffect, useState } from 'react';
import { useGameContext } from '../context/GameContext'; 
import CardsMovement from '../components/ui/CardsMovement';
import CardsFigure from '../components/ui/cardsFigure';
import { useParams } from 'react-router-dom';
import { getPlayers } from '@/services/services';  // Importa la función que obtiene los jugadores
// import PlayerPanel from '../components/ui/playerPanel';
// import Board from '../components/ui/board';
// import EndTurnButton from '../components/ui/endShiftButton';

const ActiveGame = () => {
  const { gameId } = useParams();  // Obtén el ID del juego desde la URL
  const { players, setPlayers } = useGameContext(); // Usa el contexto para la lista de jugadores
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  // Efecto para obtener los jugadores al montar el componente
  useEffect(() => {
    console.log("ActiveGamegameId: ", gameId);
    console.log("ActiveGamePlayers: ", players);
    if (gameId && players.length === 0) {  // Si aún no tienes jugadores, haz la petición
      getPlayers(gameId)
        .then((fetchedPlayers) => {
          setPlayers(fetchedPlayers);  // Guarda los jugadores en el contexto
        })
        .catch((err) => {
          console.error("Error al obtener jugadores:", err);
        })
        .finally(() => {
          setLoading(false);  // Finaliza el estado de carga
        });
    } else {
      setLoading(false);  // Si ya tienes los jugadores, termina la carga
    }
  }, [gameId, players, setPlayers]);

  // Renderiza mientras carga los datos
  if (loading) return <div>Cargando datos de los jugadores...</div>;

  return (
    <div>
      <h1>Juego Activo</h1>
      
      {/* Muestra las cartas de cada jugador */}
      <div className="flex flex-col space-y-8">
        {players.map((player) => (
          <div key={player.id} className="space-y-4">
            <h2>Jugador: {player.name}</h2>

            {/* Renderiza las cartas de movimiento del jugador */}
            <div className="flex space-x-4">
              <h3>Cartas de Movimiento</h3>
              <CardsMovement gameId={gameId} playerId={player.id} />
            </div>

            {/* Renderiza las cartas de figura del jugador */}
            <div className="flex space-x-4">
              <h3>Cartas de Figura</h3>
              <CardsFigure gameId={gameId} playerId={player.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // return (
  //   <div className="p-4 flex flex-col justify-start min-h-screen bg-black">
  //     <div className="flex flex-row justify-start space-x-20">
  //       <div>
  //         {/* <GameBoard boxes={mockBoard} /> */}
  //         <Board />
  //       </div>
  //       {/* Panel de Jugadores */}
  //       <div className="flex flex-col space-y-1 ml-4 h-1/3 text-white">
  //         {players.map((player) => (
  //           !(player.turn=="PRIMERO") && (
  //             <PlayerPanel key={player.id} game={gameId} player={player.name} />
  //           )
  //         ))}
  //       </div>
  //     </div>
  //     {/* Cartas de jugador de turno */}
  //     <div className="Jugador_de_turno mt-1 text-white">
  //       <div className="flex space-x-8">
  //         <div className="flex flex-col items-center">
  //           <h3 className="font-bold mb-2">Cartas de Movimientos</h3>
  //           <div className="flex space-x-4">
  //             <CardsMovement gameId={gameId} playerId={players.player} />
  //           </div>
  //         </div>
  //         <div className="flex flex-col items-center">
  //           <h3 className="font-bold mb-2">Tarjetas de Figuras</h3>
  //           <div className="flex space-x-4">
  //             <CardsFigure game={gameId} playerId={players.player} />
  //           </div>
  //         </div>
  //         {/* Boton terminar turno */}
  //         <div className="flex items-center">
  //           <EndTurnButton />
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

};

export default ActiveGame;
