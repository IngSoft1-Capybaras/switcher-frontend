import React, { useEffect, useState } from 'react';
import { cardImg } from '../utils/getCardImg';
import { getDeckMovement } from '@/services/services'; 
import { useUpdateCardsMovementSocket } from '@/components/hooks/used-update-cards_movement-socket';

// Componente que representa las cartas de movimiento 
const CardsMovement = ({ gameId, playerId, onSelectCard, selectedMovementCard, currentTurn }) => {
  const [movementCards, setMovementCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovementCards = async () => {
    try {
      const cards = await getDeckMovement(gameId, playerId);
      setMovementCards(cards);
    } catch (error) {
      setError("Error al obtener las cartas de movimiento");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Obtiene las cartas de movimiento al montar el componente
  useEffect(() => {
    fetchMovementCards();
  }, [gameId, playerId]);

  // Maneja la selección de cartas
  const handleCardSelect = (card) => {
    if (playerId === currentTurn && !card.used) {
      onSelectCard(card); // Pasamos la carta seleccionada al componente padre
    }
  };
  
  // Escucha el socket de actualización de cartas de movimiento (card.used y undo_move)
  useUpdateCardsMovementSocket(gameId, playerId, fetchMovementCards);

  if (loading) return <div>Cargando cartas de movimiento...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center">
      {movementCards.map((card) => {
        const isSelected = selectedMovementCard?.id === card.id;

        return (
          <div 
            key={card.id} 
            className={`relative w-full h-full aspect-[2/3] border rounded ${isSelected ? 'scale-105 border-blue-500' : 'scale-100'} transition-transform duration-300 ease-in-out`} // Agregamos transición
            onClick={() => handleCardSelect(card)}
            style={{ cursor: playerId === currentTurn ? 'pointer' : 'not-allowed', opacity: playerId === currentTurn ? 1 : 0.5 }}
          >
            {card.used ? (
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-white">Carta Usada</span>
              </div>
            ) : (
              <img src={cardImg(card.type)} alt="Carta de movimiento" className="object-cover w-full h-full" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CardsMovement;
