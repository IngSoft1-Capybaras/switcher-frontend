import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGameContext } from '@/context/GameContext';
import CardsFigure from '../components/ui/cardsFigure';
import CardsMoviment from '../components/ui/cardsMoviment';
import Board from '../components/ui/board';
import PlayerPanel from '@/components/ui/playerPanel';
import { getPlayers, getDeckMovement, getDeckFigure } from '@/services/services';
import { mockPlayers } from '@/lib/mockGameState';

const ActiveGame = () => {
  const { gameState, setGameStatus } = useGameContext(); // Asegúrate de tener estos valores en tu contexto
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [movementCards, setMovementCards] = useState([]);
  const [figureCards, setFigureCards] = useState([]);
  const {gameId} = useParams();

  useEffect(() => {
    const player = getPlayers(gameId);
    setPlayers(players)
    players.map(async(player, index) => {

      const movCards = getDeckMovement(gameId, player);
      setMovementCards([...movementCards, movCards]);
      
      const figCards = getDeckFigure(gameId, player)
      setFigureCards([...figureCards, figCards]);
      
    } )

    setLoading(false);  // Cambiar a false cuando se carguen los datos

  }, [figureCards, gameId, movementCards, players]);

  // Renderizar si está cargando
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 flex flex-col justify-start min-h-screen bg-black">
      <div className="flex flex-row justify-start space-x-20">
        <div>
          <Board rows={6} cols={6} />
        </div>
        {/* Panel de Jugadores */}
        <div className="flex flex-col space-y- ml-4 h-1/3 text-white">
          {players.map((player) => (
            !player.turn && (
              <PlayerPanel 
                key={player.id} 
                playerName={player.name} 
                cartas={player.figureCards} 
              />
            )
          ))}
        </div>
      </div>
      {/* Cartas de jugador de turno */}
      <div className="Jugador_de_turno mt-1 text-white">
        <div className="flex space-x-8">
          <div className="flex flex-col items-center">
            <h3 className="font-bold mb-2">Cartas de Movimientos</h3>
            <div className="flex space-x-4">
              {players.find(p => p.turn)?.movementCards.map((card, index) => (
                <CardsMoviment 
                  key={index} 
                  type={card.type} 
                  used={card.used} />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-bold mb-2">Tarjetas de Figuras</h3>
            <div className="flex space-x-4">
              {players.find(p => p.turn)?.figureCards.map((card, index) => (
                <CardsFigure 
                  key={index} 
                  type={card.type} 
                  show={card.show} 
                  difficulty={card.difficulty} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveGame;
