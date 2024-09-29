import React, { useContext, useEffect, useState } from 'react';
import { useGameContext } from '../context/GameContext'; 
import CardsMovement from '../components/ui/CardsMovement';
import CardsFigure from '../components/ui/cardsFigure';
import { useParams } from 'react-router-dom';
import { getPlayers } from '@/services/services';  // Importa la función que obtiene los jugadores
import PlayerPanel from '../components/ui/playerPanel';
import Board from '../components/ui/board';
import EndTurnButton from '../components/ui/endShiftButton';
import LeaveGameButton from '../components/ui/LeaveButton';

const ActiveGame = () => {
  const { gameId } = useParams();  // Obtén el ID del juego desde la URL
  const { players, setPlayers } = useGameContext(); // Usa el contexto para la lista de jugadores
  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const currentPlayerId ="PRIMERO"

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
    <div className="p-4 flex flex-col justify-start min-h-screen bg-black">
      <div className="flex flex-row justify-start space-x-20">
        <div>
          <Board />
        </div>
        {/* Panel de Jugadores */}
        <div className="flex flex-col space-y-1 ml-4 h-1/3 text-white">
          {players.map((player) => (
            // Muestra los jugadores que no son de turno
            player.turn !== currentPlayerId && (
              <div key={player.id}>
                <PlayerPanel game={gameId} player={player.id} name={player.name}/>
              </div>
            )
          ))}
        </div>
      </div>
      {/* Cartas de jugador de turno */}
      <div className="Jugador_de_turno mt-1 text-white">
        <div className="flex space-x-8">
          {/* cartas de movimiento */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold mb-2">Cartas de Movimientos</h3>
            <div className="flex space-x-4">
              {players.map((player) => (
                player.turn === currentPlayerId && (
                  <CardsMovement key={player.id} gameId={gameId} playerId={player.id} />
                )
              ))}
            </div>
          </div>
          {/* cartas de figuras */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold mb-2">Tarjetas de Figuras</h3>
            <div className="flex space-x-4">
              {players.map((player) => (
                player.turn === currentPlayerId && (
                  <CardsFigure key={player.id} gameId={gameId} playerId={player.id} />
                )
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Botones de fin de turno y abandonar partida */}
      <div className="absolute bottom-4 right-4 space-y-2">
        {players.some(player => player.turn === currentPlayerId) && (
          <EndTurnButton gameId={gameId} isCurrentPlayer={false} />
        )}
        <LeaveGameButton gameId={gameId}/>
      </div>
      {/* informacion de turno */}
      <div className="absolute top-20 right-40 text-white">
        <h3 className="font-bold text-3xl">Turno de:</h3>
        <p className="text-3xl">{players.find(player => player.turn === currentPlayerId).name}</p>
      </div>
    </div>
  );
};

export default ActiveGame;