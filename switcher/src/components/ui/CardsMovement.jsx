import React, { useEffect, useState } from 'react';
import { cardImg } from '../utils/getCardImg';
import { getDeckMovement } from '@/services/services'; 


// Componente que representa las cartas de movimiento 
const CardsMovement = ({gameId, playerId, onSelectCard, selectedMovementCard}) => {
  const [movementCards, setMovementCards] = useState([]); // Estado para las cartas de movimiento
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [selectedCard, setSelectedCard] = useState(null);

  // Efecto que se ejecuta al montar el componente y cuando cambian las dependencias
  useEffect(() => {
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
    
    fetchMovementCards();
  }, [gameId, playerId]); // Dependencias para volver a ejecutar el efecto si cambian
  
  // // Envia la carta selecciona a ActiveGame
  // const handleCardSelect = (card) => {
  //   if(!card.used) {
  //     setSelectedCard(card.id);
  //     console.log("CARTA SELECCIONADA: ", card);
  //     onSelectCard(card); // paso la carta seleccionada al componente padre
  //   }
  // }

  const handleCardSelect = (card) => {
    if (!card.used) {
      console.log("CARTA SELECCIONADA: ", card);
      onSelectCard(card); // Pasamos la carta seleccionada al componente padre
    }
  };
  

  // renderizado condicional según el estado de carga y errores
  if (loading) return <div>Cargando cartas de movimiento...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center">
      {movementCards.map((card) => {
        const isSelected = selectedMovementCard?.id === card.id; // Verifica si la carta está seleccionada

        return (
          <div 
            key={card.id} 
            className={`relative w-full h-full aspect-[2/3] border rounded ${isSelected ? 'border-blue-500' : ''}`} // Aplica clase de resaltado si está seleccionada
            onClick={() => handleCardSelect(card)} // Maneja el clic en la carta
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