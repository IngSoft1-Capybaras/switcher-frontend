import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGameContext } from '@/context/GameContext';
import CardsFigure from '../components/ui/cardsFigure';
import CardsMoviment from '../components/ui/cardsMoviment';
import Board from '../components/ui/board';
import PlayerPanel from '@/components/ui/playerPanel';

const ActiveGame = () => {
  const { gameId, playerId, setGameState } = useGameContext(); // Asegúrate de tener estos valores en tu contexto
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [movementCards, setMovementCards] = useState([]);
  const [figureCards, setFigureCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener jugadores
        const playersResponse = await axios.get(`/players/${gameId}`);
        setPlayers(playersResponse.data);

        // Obtener cartas de movimiento y figura para cada jugador
        const movementPromises = playersResponse.data.map(async (player) => {
          const movementResponse = await axios.get(`/deck/movement/${gameId}/${player.id}`);
          return { ...player, movementCards: movementResponse.data };
        });

        const figurePromises = playersResponse.data.map(async (player) => {
          const figureResponse = await axios.get(`/deck/figure/${gameId}/${player.id}`);
          return { ...player, figureCards: figureResponse.data };
        });

        const playersWithMovementCards = await Promise.all(movementPromises);
        const playersWithFigureCards = await Promise.all(figurePromises);

        // Combina los datos
        const updatedPlayers = playersWithMovementCards.map((player, index) => ({
          ...player,
          figureCards: playersWithFigureCards[index].figureCards,
        }));

        setPlayers(updatedPlayers);
        setLoading(false);

        // Establecer el estado del juego en el contexto
        const currentPlayer = updatedPlayers.find(player => player.turn);
        setGameState({
          players: updatedPlayers,
          currentTurn: currentPlayer,
        });

      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchData();
  }, [gameId, setGameState]);

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
                  isVisible={card.isVisible} />
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
