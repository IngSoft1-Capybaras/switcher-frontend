import React, { useEffect, useState } from 'react';
import { cardImg } from '../utils/getCardImg';
import { getDeckMovement } from '@/services/services'; 
import { AnimatedGroup } from './animated-group';


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
    // <div className="">
     <AnimatedGroup
      className='flex flex-row justify-center items-center h-full w-full space-x-6'
      variants={{
        container: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
            },
          },
        },
        item: {
          hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
          visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
              duration: 1.2,
              type: 'spring',
              bounce: 0.3,
            },
          },
        },
      }}
    >
    {movementCards.map((card,index) => (
        <div key={card.id} className={`relative h-44 w-auto rounded ${(index==0 && movementCards.length!=1) ? '-rotate-12': (index==movementCards.length-1 && movementCards.length!=1) ? 'rotate-12' : '-translate-y-5'}`}>
            {card.used ? (
                <div className="flex items-center justify-center w-full h-full">
                    <span className="text-white">Carta Usada</span>
                </div>
            ) : (
                <img src={cardImg(card.type)} alt="Carta de movimiento" className="object-cover w-full h-full" />
            )}
        </div>
    ))}
  </AnimatedGroup>
  // </div>

  );
};

export default CardsMovement;
