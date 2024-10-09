import React from 'react'
import CardsFigure from './CardsFigure'
import { CarouselItem } from './carousel'

export default function PlayerPanel({ game, player, name, setSelectedFigure, selectedFigure }) {
  return (
    <CarouselItem  className="w-full h-full flex flex-col items-center justify-center">
      {/* <div className="flex-grow flex items-center justify-center"> */}
      
        <CardsFigure 
          name={name}
          gameId={game} 
          playerId={player} 
          setSelectedFigure={setSelectedFigure} 
          selectedFigure={selectedFigure} 
        />
      {/* </div> */}
    </CarouselItem>
  )
}