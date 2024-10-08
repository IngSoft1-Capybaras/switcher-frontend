import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils"; 
import { cardImg } from '../utils/getCardImg';
import { getDeckFigure } from '@/services/services'; 


/* Componente que representa las cartas de figura */
const CardsFigure = ({gameId, playerId}) => {
  const [figureCards, setFigureCards] = useState([]); // Estado para las cartas de figura
  const [loading, setLoading] = useState(true); // Estado para la carga
  const [error, setError] = useState(null); // Estado para errores
  console.log("gameId: ", gameId);
  console.log("cardsFIGplayerId: ", playerId);

  // Efecto que se ejecuta al montar el componente y cuando cambian las dependencias
  useEffect(() => {
    const fetchFigureCards = async () => {
      try {                 
        const cards = await getDeckFigure(gameId, playerId); // Obtiene las cartas de figura getDeckFigure(gameId, playerId)
        setFigureCards(cards); // Actualiza el estado con las cartas
      } catch (error) {
        console.error('Error al obtener las cartas de figura', error); // Loguea el error
      } finally {
        setLoading(false); // Cambia el estado de carga a false
      }
    };

    fetchFigureCards();
  }, [gameId, playerId]); // Dependencias para volver a ejecutar el efecto si cambian
  
  // Renderizado condicional según el estado de carga y errores
  if (loading) return <div>Cargando cartas de movimiento...</div>; // Mensaje de carga
 

  return (
    <div className="flex space-x-4"> 
      {figureCards.slice(0, 3).map((card) => { // Solo toma las primeras 3 cartas
        // Asignar un color o borde según la dificultad
        const difficultyStyle = card.difficulty === "HARD" ? "border-red-500" : "border-green-500";
        
        return (
          <div key={card.id} className={cn(
            "relative w-full h-full aspect-[3/3] border rounded overflow-hidden",
            !card.show ? "opacity-50" : "", // Si no se muestra (show es false), aplicar opacidad
            difficultyStyle // Agregar estilo basado en dificultad
          )}>
            <img 
              src={cardImg(card.type)} 
              alt={`Carta de figura ${card.type}`} 
              className={`object-cover w-full h-full ${!card.show ? "opacity-50" : ""}`} 
            />
            
            {/* Mostrar la superposición de bloqueado si la carta está oculta */}
            {!card.show && (
              <div className="absolute inset-0 bg-gray-800 opacity-70 flex items-center justify-center">
                <span className="text-white">Bloqueada</span>
              </div>
            )}

            {/* Mostrar la dificultad si es necesario */}
            <div className="absolute bottom-0 left-0 bg-white text-black px-2 py-1 text-xs">
              {card.difficulty}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardsFigure;
