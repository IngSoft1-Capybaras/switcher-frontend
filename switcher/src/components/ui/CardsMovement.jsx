import React, { useEffect, useState } from 'react';
import { cardImg } from '../utils/getCardImg';
import { getDeckMovement } from '@/services/services'; 


// Componente que representa las cartas de movimiento 
const CardsMovement = ({gameId, playerId}) => {
  const [movementCards, setMovementCards] = useState([]); // Estado para las cartas de movimiento
  const [loading, setLoading] = useState(true); // Estado para la carga
  const [error, setError] = useState(null); // Estado para errores


  // Efecto que se ejecuta al montar el componente y cuando cambian las dependencias
  useEffect(() => {
    const fetchMovementCards = async () => {
      try {
        const cards = await getDeckMovement(gameId, playerId); // Obtiene las cartas de movimiento getDeckMovement(gameId, playerId)
        setMovementCards(cards); // Actualiza el estado con las cartas
      } catch (error) {
        setError("Error al obtener las cartas de movimiento");
        console.error(error); // Loguea el error
      } finally {
        setLoading(false); // Cambia el estado de carga a false
      }
    };
    
    fetchMovementCards();
  }, [gameId, playerId]); // Dependencias para volver a ejecutar el efecto si cambian

  // renderizado condicional según el estado de carga y errores
  if (loading) return <div>Cargando cartas de movimiento...</div>; // Mensaje de carga
  if (error) return <div>{error}</div>; // Muestra error si hay

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center">
    {movementCards.map((card) => (
        <div key={card.id} className="relative w-full h-full aspect-[2/3] rounded">
            {card.used ? (
                <div className="flex items-center justify-center w-full h-full">
                    <span className="text-white">Carta Usada</span>
                </div>
            ) : (
                <img src={cardImg(card.type)} alt="Carta de movimiento" className="object-cover w-full h-full" />
            )}
        </div>
    ))}
  </div>
  );
};

export default CardsMovement;
