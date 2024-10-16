import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { getPlayers, getBoard } from '@/services/services';
import { useActiveGameSocket } from '@/components/hooks/use-active_game-socket';
import { useUpdateBoardSocket } from '@/components/hooks/use-update_board-socket';
import { fetchTurnInfo } from '@/services/services';
import { motion } from 'framer-motion';
import CardsMovement from '../components/ui/CardsMovement';
import CardsFigure from '../components/ui/CardsFigure';
import PlayerPanel from '../components/ui/PlayerPanel';
import Board from '../components/ui/GameBoard';
import { useTurnInfoSocket } from '@/components/hooks/use-turn_info-socket';

import EndTurnButton from '@/components/ui/EndShiftButton';
import LeaveButton from '@/components/ui/LeaveButton';
import UndoButton from '@/components/ui/undoButton';
import ClaimFigureButton from '@/components/ui/claimFigureButton';
import ConfirmMovementButton from '@/components/ui/ConfirmButton';


export default function ActiveGame() {
  const { gameId } = useParams();
  const { players, setPlayers, playerId, currentTurn, setCurrentTurn } = useGameContext();
  const [boxes, setBoxes] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedMovementCard, setSelectedMovementCard] = useState(null);
  const [selectedMovementPositions, setSelectedMovementPositions] = useState([]);
  const [blockedColor, setBlockedColor] = useState(null);
  const [selectedBoardFigure, setSelectedBoardFigure ] = useState([]);
  const [selectedCardFigure, setSelectedCardFigure] = useState(null);
  const [figuresFormed, setFiguresFormed] = useState([]);

  const resetFigureSelection = () => {
    // reset selected figure states
    setSelectedBoardFigure([]);
    setSelectedCardFigure(null);
  }

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
      // console.log(err);
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
      console.log(res);
      setFiguresFormed(res.formed_figures);
    } catch (err) {
      console.error("Error fetching board:", err);
    }
  }, [gameId, setBoxes]);

  // Función para resetear el estado de las cartas y posiciones seleccionadas
  const resetMovement = useCallback(() => {
    setSelectedMovementCard(null);
    setSelectedMovementPositions([]);
  }, []);

  // Resetear estados cuando cambie el turno del jugador
  useEffect(() => {
    if (currentTurn !== playerId && gameId) {
      resetMovement();  // Resetea si cambia el turno
    }
  }, [gameId, currentTurn, playerId, resetMovement]);

  useEffect(() => {
    fetchPlayers();
    fetchBoard();
    getTurnInfo();
  }, [fetchPlayers, fetchBoard, getTurnInfo]);


  useActiveGameSocket(gameId, fetchPlayers);
  useUpdateBoardSocket(gameId, fetchBoard);
  useTurnInfoSocket(gameId, setCurrentTurn);

  if (loading) return <div>Loading game...</div>;

  const otherPlayers = players.filter(p => p.id !== playerId);

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Other Player Panels */}
      <div className="flex flex-row w-full text-white  justify-center ">
        {otherPlayers.map((player) => (
          <div key={player.id} className="relative w-[600px] mx-10">
            <PlayerPanel
              game={gameId}
              player={player.id}
              name={player.name}
              setSelectedCardFigure={setSelectedCardFigure}
              selectedCardFigure={selectedCardFigure}

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
          <div className="relative">
            {boxes?
             <Board
             boxes={boxes} blockedColor={blockedColor}
             currentTurn={currentTurn} playerId={playerId}
             selectedCardFigure={selectedCardFigure}
             selectedBoardFigure={selectedBoardFigure}
             setSelectedBoardFigure={setSelectedBoardFigure}
             selectedMovementCard={selectedMovementCard}
             setSelectMovementPosition={setSelectedMovementPositions}
             selectedMovementPositions={selectedMovementPositions}
             figuresFormed={figuresFormed}
             />


            :<>Loading...</>}
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
              <CardsMovement
                gameId={gameId}
                playerId={playerId}
                setSelectedMovementCard={setSelectedMovementCard}
                selectedMovementCard={selectedMovementCard}
                currentTurn={currentTurn}
                />
            </div>
            <div className="flex-grow">
              <CardsFigure
                gameId={gameId}
                playerId={playerId}
                setSelectedCardFigure={setSelectedCardFigure}
                selectedCardFigure={selectedCardFigure}
              />
            </div>
          </div>
        </div>
      </div>


      {currentTurn === playerId && (
        <motion.div
          className="fixed bottom-[4rem] left-0 right-0 bg-green-500 h-2 z-40"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 120 }}
        />
      )}

      <motion.div
        className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-zinc-800 p-4 z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >

        <EndTurnButton gameId={gameId} currentTurn={currentTurn} getTurnInfo={getTurnInfo} resetFigureSelection={resetFigureSelection} resetMovement={resetMovement}/>
        <ClaimFigureButton gameId={gameId} cardId={selectedCardFigure ? selectedCardFigure.id : null} figure={selectedBoardFigure}/>
        <UndoButton gameId={gameId} currentTurn={currentTurn} />
        <LeaveButton gameId={gameId} />
        <ConfirmMovementButton gameId={gameId} playerId={playerId} currentTurn={currentTurn}
          selectedCard={selectedMovementCard} selectedPositions={selectedMovementPositions}
          resetMov={resetMovement}
          />
      </motion.div>
    </div>
  );
}
