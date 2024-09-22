import React from 'react';
import CardsFigure from '../components/ui/cardsFigure';
import CardsMoviment from '../components/ui/cardsMoviment';
import Board from '../components/ui/board';
import PlayerPanel from '@/components/ui/playerPanel';
import dorso from '../assets/images/dorso.jpeg';

const ActiveGame = () => {
  const players2 = [{ name: "Jugador 2", cartas: [{ image: dorso, isBlocked: false }, { image: dorso, isBlocked: false }, { image: dorso, isBlocked: false }] }];
  const players3 = [{ name: "Jugador 3", cartas: [{ image: dorso, isBlocked: false }, { image: dorso, isBlocked: false }, { image: dorso, isBlocked: false }] }];
  const players4 = [{ name: "Jugador 4", cartas: [{ image: dorso, isBlocked: false }, { image: dorso, isBlocked: false }, { image: dorso, isBlocked: false }] }];

  const figureCards = [
    { id: 1, image: dorso, isBlocked: false },
    { id: 2, image: dorso, isBlocked: false },
    { id: 3, image: dorso, isBlocked: false },
  ];

  const movimentCards = [
    { id: 1, image: dorso, isVisible: true },
    { id: 2, image: dorso, isVisible: true },
    { id: 3, image: dorso, isVisible: true },
  ];

  return (
    <div className="p-4 flex flex-col justify-start min-h-screen">
      <div className="flex flex-row justify-start space-x-20">
        {/* Tablero */}
        <div className="">
          <Board rows={6} cols={6} />
        </div>

        {/* Panel de jugadores */}
        <div className="flex flex-col space-y- ml-4">
          {players2.map((player, index) => (
            <PlayerPanel key={index} playerName={player.name} cartas={player.cartas} />
          ))}
          {players3.map((player, index) => (
            <PlayerPanel key={index} playerName={player.name} cartas={player.cartas} />
          ))}
          {players4.map((player, index) => (
            <PlayerPanel key={index} playerName={player.name} cartas={player.cartas} />
          ))}
        </div>
      </div>

      {/* Cartas del jugador de turno (debajo del tablero) */}
      <div className="Jugador_de_turno mt-4">
        <div className="flex space-x-8">
          {/* Cartas de movimiento */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold mb-2">Cartas de Movimientos</h3>
            <div className="flex space-x-4">
              {movimentCards.map((card) => (
                <CardsMoviment key={card.id} image={card.image} isVisible={card.isVisible} />
              ))}
            </div>
          </div>
          {/* Cartas de figura */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold mb-2">Cartas de Figuras</h3>
            <div className="flex space-x-4">
              {figureCards.map((card) => (
                <CardsFigure key={card.id} image={card.image} isBlocked={card.isBlocked} />
              ))}
            </div>
          </div>
        </div>
        {/* <div className="flex space-x-4">
          {movimentCards.map((card) => (
            <CardsMoviment key={card.id} image={card.image} isVisible={card.isVisible} />
          ))}
          {figureCards.map((card) => (
            <CardsFigure key={card.id} image={card.image} isBlocked={card.isBlocked} />
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default ActiveGame;
