import React, { useCallback, useEffect, useState } from 'react';
import { useGameContext } from '../context/GameContext'; 
import CardsMovement from '../components/ui/CardsMovement';
import CardsFigure from '../components/ui/CardsFigure';
import { useParams } from 'react-router-dom';
import { getPlayers, getBoard } from '@/services/services';
import PlayerPanel from '../components/ui/PlayerPanel';
import EndTurnButton from '../components/ui/EndShiftButton';
import LeaveGameButton from '../components/ui/LeaveButton';
import { useActiveGameSocket } from '@/components/hooks/use-active_game-socket';
import TurnInfo from '@/components/ui/TurnInfo'
import { fetchTurnInfo } from '@/services/services';
import { useUpdateBoardSocket } from '@/components/hooks/use-update_board-socket';
import UndoButton from '@/components/ui/undoButton';
import GameBoard from '@/components/ui/GameBoard';
import ConfirmButton from '@/components/ui/ConfirmButton';

const ActiveGame = () => {
  const { gameId } = useParams();
  const [boxes, setBoxes] = useState();
  const { players, setPlayers, playerId, currentTurn, setCurrentTurn } = useGameContext();
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedPositions, setSelectedPositions] = useState([]);

  const getTurnInfo = useCallback(async () => {
    try {
      const newTurnData = await fetchTurnInfo(gameId);
      if (newTurnData.current_player_id) {
        setCurrentTurn(newTurnData.current_player_id);
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
  }, []);

  useActiveGameSocket(gameId, fetchPlayers);
  useUpdateBoardSocket(gameId, fetchBoard);

  if (loading) return <div>Loading game...</div>;

  const otherPlayers = players.filter(p => p.id !== playerId);

  return (
    <div className="flex h-screen bg-zinc-950 text-white space-x-4 p-4">
      {/* Left section: Board and current player's cards */}
      <div className="w-3/5 flex flex-col">
        <div className="flex-grow m-auto">

          {/* Game board */}
          {boxes ? (
            <div
              className="h-96 w-96 sm:h-[30rem] sm:w-[30rem] md:h-[35rem] md:w-[35rem] lg:h-[40rem] lg:w-[40rem]"
            >
              <GameBoard boxes={boxes} onSelectPosition={setSelectedPositions} /> 
            </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>

          {/* Current player's cards */}
          <div className="p-4 h-full flex items-center justify-center">
            <div className="flex justify-center items-center space-x-4">
              <CardsMovement gameId={gameId} playerId={playerId} onSelectCard={setSelectedCard} />
              <CardsFigure gameId={gameId} playerId={playerId} />
            </div>
          </div>
      </div>

      <div className="w-2/5 flex flex-col">

        {/* Turn Info */}
        <div className="text-center p-4">

          <TurnInfo players={players} activeGameId={gameId} currentTurn={currentTurn} setCurrentTurn={setCurrentTurn} />
        </div>
          <div className="flex justify-around mt-4">
            <EndTurnButton gameId={gameId} currentTurn={currentTurn} className="bg-green-500 text-white px-4 py-2 rounded" />
            <LeaveGameButton gameId={gameId} className="bg-red-500 text-white px-4 py-2 rounded" />
            {/* <button onClick={handleConfirmMove} className="bg-green-500 text-white px-4 py-2 rounded">Confirmar</button> */}
            </div>
        {/* Right section: Other players' cards */}
        <div className="flex-grow p-4 overflow-y-auto">
          {otherPlayers.map((player) => (
            <PlayerPanel key={player.id} game={gameId} player={player.id} name={player.name} />
          ))}
        </div>
          {/* Buttons for current player */}
          <UndoButton gameId={gameId} currentTurn={currentTurn}/>
          <ConfirmButton 
              gameId={gameId} 
              selectedCard={selectedCard} 
              selectedPositions={selectedPositions} 
              playerId={playerId} 
              currentTurn={currentTurn} 
          />
      </div>
    </div>
  );
};

export default ActiveGame;