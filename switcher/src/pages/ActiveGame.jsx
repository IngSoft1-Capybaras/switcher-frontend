import React, { useCallback, useEffect, useState } from 'react'
import { useGameContext } from '../context/GameContext'
import CardsMovement from '../components/ui/CardsMovement'
import CardsFigure from '../components/ui/CardsFigure'
import { useParams } from 'react-router-dom'
import { getPlayers, getBoard } from '@/services/services'
import PlayerPanel from '../components/ui/PlayerPanel'
import Board from '../components/ui/GameBoard'
import { useActiveGameSocket } from '@/components/hooks/use-active_game-socket'
import { fetchTurnInfo } from '@/services/services'
import { useUpdateBoardSocket } from '@/components/hooks/use-update_board-socket'
import { motion } from 'framer-motion';
import EndTurnButton from '@/components/ui/EndShiftButton'
import LeaveButton from '@/components/ui/LeaveButton'
import UndoButton from '@/components/ui/undoButton'

export default function ActiveGame() {
  const { gameId } = useParams();
  const [boxes, setBoxes] = useState();
  const { players, setPlayers, playerId, currentTurn, setCurrentTurn } = useGameContext();
  const [loading, setLoading] = useState(false);
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [blockedColor, setBlockedColor] = useState(null);

  const getTurnInfo = useCallback(async () => {
    try {
      const newTurnData = await fetchTurnInfo(gameId);
      if (newTurnData.current_player_id) {
        setCurrentTurn(newTurnData.current_player_id);
        setBlockedColor(newTurnData.blocked_color);
      } else {
        console.error("Received an undefined player ID.");
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }, [setCurrentTurn, gameId]);

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedPlayers = await getPlayers(gameId);
      setPlayers(fetchedPlayers);
    } catch (err) {
      console.error("Error fetching players:", err);
    } finally {
      setLoading(false);
    }
  }, [gameId, setPlayers]);

  const fetchBoard = useCallback(async () => {
    try {
      const res = await getBoard(gameId);
      setBoxes(res.boxes);
    } catch (err) {
      console.error("Error fetching board:", err);
    }
  }, [gameId, setBoxes]);

  useEffect(() => {
    fetchPlayers();
    fetchBoard();
    getTurnInfo();
  }, [fetchPlayers, fetchBoard, getTurnInfo]);

  useActiveGameSocket(gameId, fetchPlayers);
  useUpdateBoardSocket(gameId, fetchBoard);

  if (loading) return <div>Loading game...</div>;

  const otherPlayers = players.filter(p => p.id !== playerId);

  return (
    <div className="flex flex-col h-screen bg-zinc-950">

      {/* Other Player Panels */}
      <div className="flex flex-row w-full text-white p-4 justify-center">
        {otherPlayers.map((player) => (
          <div key={player.id} className="relative w-full">
            <PlayerPanel
              game={gameId}
              player={player.id}
              name={player.name}
              setSelectedFigure={setSelectedFigure}
              selectedFigure={selectedFigure}
            />
            {currentTurn === player.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-white h-1"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 120 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Board and Turn Info */}
      <div className="flex flex-col md:flex-row w-full text-white p-4 justify-center space-y-4 md:space-y-0">

        {/* Board */}
        <div className="flex flex-col justify-around items-end mr-5 p-4 md:w-1/2">
          {/* "Your Turn" indicator above the board */}
          <div className="relative">
            <Board boxes={boxes} blockedColor={'RED'} />
            
            {/* Show overlay only if it's another player's turn */}
            {currentTurn !== playerId && currentTurn && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl">
                {`${players.find(p => p.id === currentTurn)?.name}'s Turn`}
              </div>
            )}
          </div>        
        </div>

        {/* Right-side Panel: Turn Info and Your Cards */}
        <div className="md:w-1/2 h-full flex flex-col p-4 justify-center items-start ml-5">
          <div className="border-2 border-zinc-700 bg-zinc-900 text-white p-4 rounded-md flex flex-col h-full w-[600px]">
            <h2 className="text-xl text-center mb-10">Tus cartas</h2>
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
            
            {/* Time Indicator for Player's Own Turn */}
            {currentTurn === playerId && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-green-500 h-1"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 120 }}  // Adjust this to the time limit
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-row w-[600px] justify-between space-x-3 mt-10">
            <EndTurnButton />
            <UndoButton />
            <LeaveButton />
          </div>
        </div>
      </div>
    </div>
  );
}
