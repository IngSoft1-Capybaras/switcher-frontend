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
    <div className="flex flex-col h-screen bg-zinc-950">
      
      {/* Other Player Panels */}
      <div className="flex flex-row w-full text-white p-4 justify-center">
        {otherPlayers.map((player) => (
          <PlayerPanel
            game={gameId}
            player={player.id}
            name={player.name}
            setSelectedFigure={setSelectedFigure}
            selectedFigure={selectedFigure}
          />
        ))}
      </div>
  
      {/* Board and Turn Info */}
      <div className="flex flex-row w-full text-white p-4 justify-center">
        
        {/* Board */}
        <div className="flex flex-col justify-around items-center p-4 md:w-1/2">
          {boxes ? (
            <div className="relative bg-gray-800 p-4 shadow-lg rounded-lg">
              <Board boxes={boxes} />
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
  
        {/* Right-side Panel: Turn Info and Your Cards */}
        <div className="md:w-1/2 h-full flex flex-col p-4 space-y-4 justify-around">
          <TurnInfo players={players} activeGameId={gameId} currentTurn={currentTurn} setCurrentTurn={setCurrentTurn} />
  
          <div className="border-2 border-zinc-700 bg-zinc-900 text-white p-4 rounded-md flex flex-col h-full">
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
    </div>
  )
  
}
