import { Button } from "@/components/ui/button"
import { useGameContext } from '../../context/GameContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';

export default function LeaveButton({gameId}) {
  const { playerId } = useGameContext();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onAbandon = async () => {
    try {
      console.log(playerId);
      console.log(gameId);
      // recordatorio, cambiar localhost:8000 por variable de entorno.
      const response = await fetch(`http://localhost:8000/players/${playerId}/leave?game_id=${gameId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({ gameId: gameId })
      });

      if (response.ok) {
        console.log('Haz abandonado la partida');
        navigate('/games');
      } 
      else {
        const errorMessage = await response.text();
        setError(`Error al abandonar la partida: ${errorMessage}`);
      }
    } 
    catch (error) {
      setError(`Error al abandonar la partida: ${error.message}`);
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
