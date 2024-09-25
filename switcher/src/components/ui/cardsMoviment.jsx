import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { cardImg } from '../utils/getCardImg';
import { getDeckMovement } from '@/services/services'; // Asegúrate de importar tu función para obtener las cartas
import { mockMovementCards } from '@/lib/mockGameState';

/* Componente que representa las cartas de movimiento */
const CardsMoviment = ({ gameId, playerId }) => {
  const [movementCards, setMovementCards] = useState([]); // Estado para las cartas de movimiento
  const [loading, setLoading] = useState(true); // Estado para la carga
  const [error, setError] = useState(null); // Estado para errores

  // Efecto que se ejecuta al montar el componente y cuando cambian las dependencias
  useEffect(() => {
    const fetchMovementCards = async () => {
      try {
        // const cards = await getDeckMovement(gameId, playerId); // Obtiene las cartas de movimiento getDeckMovement(gameId, playerId)
        // setMovementCards(cards); // Actualiza el estado con las cartas
        setMovementCards(mockMovementCards); // Actualiza el estado con las cartas
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
    <div className="flex space-x-4"> {/* Cambia esto para el layout según tu diseño */}
      {movementCards.map((card) => (
        <div key={card.id} className={cn("relative w-35 h-48 border rounded", card.used ? "opacity-50" : "")}>
          {card.used ? (
            <div className="w-full h-full flex items-center justify-center">
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

export default CardsMoviment;
