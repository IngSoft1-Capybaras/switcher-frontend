import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils"
import { cardImg } from '../utils/getCardImg'
import { getDeckFigure } from '@/services/services'
import { AnimatedGroup } from './animated-group'

export default function CardsFigure({gameId, playerId, setSelectedFigure, selectedFigure, name}) {
  const [figureCards, setFigureCards] = useState([])
  const [loading, setLoading] = useState(true)

  const handleSelectedFigure = (figure) => {
    setSelectedFigure(figure)
  }

  useEffect(() => {
    const fetchFigureCards = async () => {
      try {                 
        const cards = await getDeckFigure(gameId, playerId)
        setFigureCards(cards)
      } catch (error) {
        console.error('Error fetching figure cards', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFigureCards()
  }, [gameId, playerId])

  if (loading) return <div>Loading figure cards...</div>

  return (
    <div className='flex flex-col justify-center items-center h-full w-full'>
      {name && <h2 className="text-xl text-center mb-5">{name}'s figures</h2>}
      <AnimatedGroup
        className="flex justify-center items-center space-x-5 h-full w-full"
        preset="scale"
      > 
        {figureCards.slice(0, 3).map((card) => {
          const isSelected = selectedFigure && selectedFigure.id === card.id

          return (
            <button 
              key={card.id}
              className={cn(
                "relative size-32 aspect-square rounded-lg overflow-hidden transition-transform",
                isSelected ? 'scale-125 ' : 'hover:scale-110',
                !card.show ? "opacity-50" : ""
              )}
              onClick={() => handleSelectedFigure(card)}
            >
              <img 
                src={cardImg(card.type)} 
                alt={`Figure card ${card.type}`} 
                className={cn("object-contain w-full h-full", !card.show && "opacity-50")}
              />
              {!card.show && (
                <div className="absolute inset-0 bg-gray-800 opacity-70 flex items-center justify-center">
                  <span className="text-white text-sm">Locked</span>
                </div>
              )}
            </button>
          )
        })}
      </AnimatedGroup> 
    </div>
  )
}
