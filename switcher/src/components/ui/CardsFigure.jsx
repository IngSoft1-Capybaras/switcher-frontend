import React, { useEffect, useState, useCallback} from 'react'
import { cn } from "@/lib/utils"
import { cardImg } from '../utils/getCardImg'
import { getDeckFigure } from '@/services/services'
import { AnimatedGroup } from './animated-group'
import { useFigureCardsSocket } from "../hooks/use-figure_cards-socket";

export default function CardsFigure({gameId, playerId, setSelectedCardFigure, selectedCardFigure, name, resetMovement}) {

  const [loading, setLoading] = useState(true)
  const [figureCards, setFigureCards] = useState([])

  const handleSelectedFigure = (figure) => {
    // console.log(figure);
    console.log('CartaFigure seleccionada:', figure);
    setSelectedCardFigure(figure);
    resetMovement();
  }

  const fetchFigureCards = useCallback(async () => {
    try {
      const cards = await getDeckFigure(gameId, playerId)
      setFigureCards(cards)
    } catch (error) {
      console.error('Error fetching figure cards', error)
    } finally {
      setLoading(false)
    }
  }, [gameId, playerId, getDeckFigure, setFigureCards, setLoading]);

  useEffect(() => {
    fetchFigureCards()
  }, [])

  useFigureCardsSocket(gameId, fetchFigureCards);

  if (loading) return <div data-testid='loadingDiv'>Loading figure cards...</div>

  return (
    <div className={`flex flex-col mt-3 justify-center items-center w-full h-full mb-10`}>
      {name && <h2 className="text-m text-center mb-5">{name}'s figures</h2>}
      <AnimatedGroup
        className="flex justify-center items-center space-x-5 w-full"
        preset="scale"
      >
        {figureCards.slice(0, 3).map((card) => {
          const isSelected = selectedCardFigure && selectedCardFigure.id === card.id

          return (
            <button
              key={card.id}
              className={cn(
                "relative size-32 aspect-square rounded-lg overflow-hidden transition-transform",
                isSelected ? 'scale-125 ' : 'hover:scale-110',
                !card.show ? "opacity-100" : ""
              )}
              onClick={() => handleSelectedFigure(card)}
            >
              
             
              {!card.show ? 
                <img data-testid='blockedCard'
                src={cardImg("DORSO_FIG")}
                alt={`Dorso de carta de movimiento`}
                className="absolute inset-0  opacity-100 flex items-center justify-center"
                // className={cn("object-contain w-full h-full", !card.show && "opacity-50")}
              />
            : 
              <img data-testid='figureCard'
              src={cardImg(card.type)}
              alt={`Figure card ${card.type}`}
              className={cn("object-contain w-full h-full", !card.show && "opacity-0")}
            />
          }
            </button>
          )
        })}
      </AnimatedGroup>
    </div>
  )
}
