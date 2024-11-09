import React from 'react'
import CardsFigure from './CardsFigure'
import OthersCardsMovement from './OthersCardsMovement'

export default function PlayerPanel({ game, player, name, setSelectedCardFigure, selectedCardFigure, turnBorder, selectedBlockCard, setSelectedBlockCard, resetMovement, resetFigureSelection, resetBlock }) {
  return (
    <>
    {/* <h2 className="text-xl text-center mb-5">{name}'s figures</h2> */}
    <CardsFigure 
      name={name}
      gameId={game} 
      playerId={player} 
      setSelectedCardFigure={setSelectedCardFigure} 
      selectedCardFigure={selectedCardFigure} 
      resetMovement={resetMovement}
      selectedBlockCard={selectedBlockCard}
      setSelectedBlockCard={setSelectedBlockCard}
      resetFigureSelection={resetFigureSelection}
      resetBlock={resetBlock}
    />
    <OthersCardsMovement
      gameId={game}
      playerId={player}
    />

    </>
  )
}