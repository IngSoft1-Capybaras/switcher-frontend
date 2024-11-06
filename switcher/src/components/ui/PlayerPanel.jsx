import React from 'react'
import CardsFigure from './CardsFigure'

export default function PlayerPanel({ game, panelOwner, name, setSelectedCardFigure, selectedCardFigure, turnBorder, currentTurn, playerId}) {
  return (
    <>
    {/* <h2 className="text-xl text-center mb-5">{name}'s figures</h2> */}
    <CardsFigure 
          name={name}
          gameId={game} 
          playerId={playerId} 
          setSelectedCardFigure={setSelectedCardFigure} 
          selectedCardFigure={selectedCardFigure} 
          turnBorder={turnBorder}
          currentTurn={currentTurn}
          panelOwner={panelOwner}
        />
    </>
  )
}