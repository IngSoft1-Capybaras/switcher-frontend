import React, { useEffect, useState, useCallback} from 'react'
import { cn } from "@/lib/utils"
import { cardImg } from '../utils/getCardImg'
import { getDeckFigure } from '@/services/services'
import { AnimatedGroup } from './animated-group'
import { useFigureCardsSocket } from "../hooks/use-figure_cards-socket";
import { useGameContext } from "@/context/GameContext";

export default function CardsFigure({gameId, playerId, setSelectedCardFigure, selectedCardFigure, name, resetMovement, selectedBlockCard, setSelectedBlockCard, resetFigureSelection, resetBlock}) {

  const { currentTurn } = useGameContext();
  const [loading, setLoading] = useState(true)
  const [figureCards, setFigureCards] = useState([])

  const handleSelectedFigure = (figure) => {
    console.log("figure.player_id",figure.player_id);
    console.log("currentTurn",currentTurn);
    console.log('CartaFigure seleccionada:', figure);
    setSelectedCardFigure(figure);
    resetMovement();
    resetBlock();
  }

  // Maneja la selección de una carta para bloquear
  const handleBlockCardFigure = (figure) => {
    console.log("figure.player_id",figure.player_id);
    console.log("currentTurn",currentTurn);
    console.log('Carta de bloqueo seleccionada:', figure);
    setSelectedBlockCard(figure);
    resetMovement();
    resetFigureSelection();
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
      {name && <span className="text-xl text-center mb-5">{name}</span>}
      <AnimatedGroup
        className="flex justify-center items-center space-x-5 w-full"
        preset="scale"
      >
        {figureCards.slice(0, 3).map((card) => {
          const isSelected = selectedCardFigure && selectedCardFigure.id === card.id;
          const isBlocked = selectedBlockCard && selectedBlockCard.id === card.id;

          return (
            <button
              key={card.id}
              className={cn(
                "relative size-32 aspect-square rounded-lg overflow-hidden transition-transform",
                isSelected ? "scale-125" : "hover:scale-110",
                isBlocked ? "scale-125" : "hover:scale-110",
                !card.show ? "opacity-100" : ""
              )}
              onClick={() =>
                card.player_id === currentTurn ? handleSelectedFigure(card): handleBlockCardFigure(card)}
            >
              
             
              {!card.show ? 
                <img data-testid='showCard'
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
