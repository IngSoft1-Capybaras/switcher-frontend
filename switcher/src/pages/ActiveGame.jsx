import React, { useCallback, useEffect, useState } from 'react'
import { useGameContext } from '../context/GameContext'
import CardsMovement from '../components/ui/CardsMovement'
import CardsFigure from '../components/ui/CardsFigure'
import { useParams } from 'react-router-dom'
import { getPlayers, getBoard } from '@/services/services'
import PlayerPanel from '../components/ui/PlayerPanel'
import Board from '../components/ui/GameBoard'
import EndTurnButton from '../components/ui/EndShiftButton'
import LeaveGameButton from '../components/ui/LeaveButton'
import { useActiveGameSocket } from '@/components/hooks/use-active_game-socket'
import TurnInfo from '@/components/ui/TurnInfo'
import { fetchTurnInfo } from '@/services/services'
import { useUpdateBoardSocket } from '@/components/hooks/use-update_board-socket'
import UndoButton from '@/components/ui/undoButton'
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
  CarouselNavigation,
} from '@/components/ui/carousel'

export default function ActiveGame() {
  const { gameId } = useParams()
  const [boxes, setBoxes] = useState()
  const { players, setPlayers, playerId, currentTurn, setCurrentTurn } = useGameContext()
  const [loading, setLoading] = useState(false)
  const [selectedFigure, setSelectedFigure] = useState(null)

  const getTurnInfo = useCallback(async () => {
    try {
      const newTurnData = await fetchTurnInfo(gameId)
      if (newTurnData.current_player_id) {
        setCurrentTurn(newTurnData.current_player_id)
      } else {
        console.error("Received an undefined player ID.")
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }, [setCurrentTurn, gameId])

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true)
      const fetchedPlayers = await getPlayers(gameId)
      setPlayers(fetchedPlayers)
    } catch (err) {
      console.error("Error fetching players:", err)
    } finally {
      setLoading(false)
    }
  }, [gameId, setPlayers])

  const fetchBoard = useCallback(async () => {
    try {
      const res = await getBoard(gameId)
      setBoxes(res.boxes)
    } catch (err) {
      console.error("Error fetching board:", err)
    }
  }, [gameId, setBoxes])

  useEffect(() => {
    fetchPlayers()
    fetchBoard()
    getTurnInfo()
  }, [fetchPlayers, fetchBoard, getTurnInfo])

  useActiveGameSocket(gameId, fetchPlayers)
  useUpdateBoardSocket(gameId, fetchBoard)

  if (loading) return <div>Loading game...</div>

  const otherPlayers = players.filter(p => p.id !== playerId)

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-950">
      {/* Game Board Section with Action Buttons */}
      <div className="flex-grow flex flex-col justify-around items-center p-4 md:w-3/5">
        {boxes ? (
          <div className="relative bg-gray-800 p-4 shadow-lg rounded-lg">
            <Board boxes={boxes} />
          </div>
        ) : (
          <div>Loading...</div>
        )}

        {/* Action Buttons Below Game Board */}
        <div className="flex w-full justify-around space-x-3">
          <LeaveGameButton gameId={gameId} className=" bg-red-500 text-white px-4 py-2 rounded text-sm" />
          <EndTurnButton gameId={gameId} currentTurn={currentTurn} className="bg-green-500 text-white px-4 py-2 rounded text-sm" />
          <UndoButton gameId={gameId} currentTurn={currentTurn} className="bg-blue-500 text-white px-4 py-2 rounded text-sm" />
        </div>
      </div>

      {/* Right-side Panel */}
      <div className="md:w-2/5 w-full flex flex-col p-4 space-y-4">
        {/* Turn Info */}
        <TurnInfo players={players} activeGameId={gameId} currentTurn={currentTurn} setCurrentTurn={setCurrentTurn} />

        {/* Other Players' Cards */}
        <div className="h-1/4 text-white rounded-md relative">
          <Carousel className="w-full h-full">
            <CarouselContent className="w-full h-full">
              {otherPlayers.map((player) => (
                <PlayerPanel
                  game={gameId}
                  player={player.id}
                  name={player.name}
                  setSelectedFigure={setSelectedFigure}
                  selectedFigure={selectedFigure}
                />
              ))}
            </CarouselContent>
            <CarouselNavigation className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 w-full" />
            <CarouselIndicator />
          </Carousel>
        </div>

        {/* Player's Own Cards */}
        <div className="h-2/4 border-2 border-zinc-700 bg-zinc-900 text-white p-4 rounded-md flex flex-col">
          <h2 className="text-xl text-center mb-5">Your cards</h2>
          <div className="flex-grow">
            <CardsMovement gameId={gameId} playerId={playerId} />
          </div>
          <div className="flex-grow">
            <CardsFigure
              gameId={gameId}
              playerId={playerId}
              setSelectedFigure={setSelectedFigure}
              selectedFigure={selectedFigure}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
