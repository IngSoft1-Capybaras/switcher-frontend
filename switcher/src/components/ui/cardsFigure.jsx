import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils"; // Asegúrate de que "cn" esté en utils
import { cardImg } from '../utils/getCardImg';
import { getDeckFigure } from '@/services/services'; // Asegúrate de importar tu función para obtener las cartas
import { mockFigureCards } from '@/lib/mockGameState';

/* Componente que representa las cartas de figura */
const CardsFigure = ({ gameId, playerId }) => {
  const [figureCards, setFigureCards] = useState([]); // Estado para las cartas de figura
  const [loading, setLoading] = useState(true); // Estado para la carga
  const [error, setError] = useState(null); // Estado para errores

  // Efecto que se ejecuta al montar el componente y cuando cambian las dependencias
  useEffect(() => {
    const fetchFigureCards = async () => {
      try {                 
        const cards = await getDeckFigure(gameId, playerId); // Obtiene las cartas de figura getDeckFigure(gameId, playerId)
        setFigureCards(cards); // Actualiza el estado con las cartas
        // setFigureCards(mockFigureCards); // Actualiza el estado con las cartas
      } catch (error) {
        // setError("Error al obtener las cartas de figura");
        console.error('Error al obtener las cartas de figura', error); // Loguea el error
      } finally {
        setLoading(false); // Cambia el estado de carga a false
      }
    };

    fetchFigureCards();
  }, [gameId, playerId]); // Dependencias para volver a ejecutar el efecto si cambian
  
  // Renderizado condicional según el estado de carga y errores
  if (loading) return <div>Cargando cartas de movimiento...</div>; // Mensaje de carga
  // if (error) return <div>{error}</div>; // Muestra error si hay

  return (
    <div className="flex space-x-4"> {/* Cambia esto para el layout según tu diseño */}
      {figureCards.slice(0, 3).map((card) => { // Solo toma las primeras 3 cartas
        // Asignar un color o borde según la dificultad
        const difficultyStyle = card.difficulty === "HARD" ? "border-red-500" : "border-green-500";
        
        return (
          <div key={card.id} className={cn(
            "relative w-35 h-48 border rounded",
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
