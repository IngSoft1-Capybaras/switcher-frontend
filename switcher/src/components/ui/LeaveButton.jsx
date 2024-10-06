import { Button } from "@/components/ui/button"
import { useGameContext } from '../../context/GameContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { leaveGame } from "@/services/services";

export default function LeaveButton({gameId}) {
  const { playerId } = useGameContext();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onAbandon = async () => {
    try {
      await leaveGame(playerId, gameId);
      navigate('/games'); 
    } 
    catch (error) {
      setError(error.message); 
    }
  }

  return (
    <div>
      <Button variant="destructive" onClick={onAbandon}>
        Abandonar
      </Button>
      {error && <p>{error}</p>} 
    </div>
  );
}
