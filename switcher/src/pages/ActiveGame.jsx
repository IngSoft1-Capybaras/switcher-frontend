import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useGameContext } from '../context/GameContext'; 
import CardsMovement from '../components/ui/CardsMovement';
import CardsFigure from '../components/ui/CardsFigure';
import { useParams } from 'react-router-dom';
import { getPlayers, getBoard } from '@/services/services';
import PlayerPanel from '../components/ui/PlayerPanel';
import Board from '../components/ui/GameBoard';
import EndTurnButton from '../components/ui/EndShiftButton';
import LeaveGameButton from '../components/ui/LeaveButton';
import { useActiveGameSocket } from '@/components/hooks/use-active_game-socket';

const ActiveGame = () => {
  const { gameId } = useParams();
  const [boxes, setBoxes] = useState();
  const { players, setPlayers, playerId } = useGameContext(); // Assuming playerId is for the current player
  const [loading, setLoading] = useState(false);
  
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
    } catch (err) {
      console.error("Error fetching board:", err);
    }
  }, [gameId, setBoxes]);

  useEffect(() => {
    fetchPlayers();
    fetchBoard();
  }, [fetchPlayers]);

  useActiveGameSocket(gameId, fetchPlayers); // Re-fetch players when a socket event occurs

  if (loading) return <div>Loading game...</div>;

  // Separate current player from other players
  const otherPlayers = players.filter(p => p.id !== playerId);


  return (
    <div className="flex h-screen space-x-4 p-4">
      {/* Left section: Board and current player's cards */}
      <div className="flex flex-col space-y-4 w-2/3">
        {/* Game board */}
        {boxes ?<div style={{ height: '40rem', width: '40rem' }}className='h-96 w-96'> <Board boxes={boxes}/> </div>: <div> Loading ...</div> }
        
        {/* Current player's cards */}
          <h3 className='text-center '>Mis cartas</h3>
        <div className="flex justify-center space-x-4">
          <CardsMovement gameId={gameId} playerId={playerId} />
          <CardsFigure gameId={gameId} playerId={playerId} />
        </div>

        {/* Buttons for current player */}
        <div className="flex justify-between">
          <LeaveGameButton gameId={gameId} />
          <EndTurnButton gameId={gameId} playerId={playerId} />
        </div>
      </div>

      {/* Right section: Other players' cards */}
      <div className="flex flex-col w-1/3 space-y-4">
        {otherPlayers.map((player) => (
          <PlayerPanel key={player.id} game={gameId} player={player.id} name={player.name} />
        ))}
      </div>
    </div>
  );
};

export default ActiveGame;
