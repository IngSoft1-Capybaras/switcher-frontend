import React from 'react';
import { useGameContext } from '@/context/GameContext';
import CardsFigure from '../components/ui/cardsFigure';
import CardsMoviment from '../components/ui/cardsMoviment';
import Board from '../components/ui/board';
import PlayerPanel from '@/components/ui/playerPanel';

const ActiveGame = () => {
  // Obtener los jugadores desde el contexto
  const { players, currentPlayerID } = useGameContext();

  // Cartas de figura y de movimiento del jugador de turno
  const figureCards = Array(3).fill({ type:"analisis", isBlocked: false });
  const movimentCards = Array(3).fill({ type:"aterrador", isVisible: true });

  return (
    <div className="p-4 flex flex-col justify-start min-h-screen bg-black">
      <div className="flex flex-row justify-start space-x-20">
        {/* Tablero */}
        <div className="">
          <Board rows={6} cols={6} />
        </div>

        {/* Panel de jugadores */}
        <div className="flex flex-col space-y- ml-4 h-1/3 text-white">
          {players
          .filter(player => !player.isCurrent)
          .map((player, index) => (
            <PlayerPanel key={index} playerName={player.name} 
                         cartas={figureCards.slice(0, players.length)}  />
          ))}
        </div>
      </div>

      {/* Cartas del jugador de  turno (debajo del tablero) */}
      <div className="Jugador_de_turno mt-1 text-white">
        <div className="flex space-x-8">
          {/* Cartas de movimiento */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold mb-2 ">Cartas de Movimientos</h3>
            <div className="flex space-x-4">
              {movimentCards.map((card, index) => (
                <CardsMoviment key={index} type={card.type} isVisible={card.isVisible}/>
              ))}
            </div>
          </div>
          {/* Cartas de figura */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold mb-2">Cartas de Figuras</h3>
            <div className="flex space-x-4">
              {figureCards.map((card, index) => (
                <CardsFigure key={index} type={card.type} isBlocked={card.isBlocked} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveGame;
