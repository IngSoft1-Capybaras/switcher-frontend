import React from 'react'
import CardsFigure from './CardsFigure'
import { CarouselItem } from './carousel'

export default function PlayerPanel({ game, player, name, setSelectedFigure, selectedFigure, turnBorder }) {
  return (
    <>
    {/* <h2 className="text-xl text-center mb-5">{name}'s figures</h2> */}
    <CardsFigure 
          name={name}
          gameId={game} 
          playerId={player} 
          setSelectedFigure={setSelectedFigure} 
          selectedFigure={selectedFigure} 
          turnBorder={turnBorder}
        />
    </>
  )
}