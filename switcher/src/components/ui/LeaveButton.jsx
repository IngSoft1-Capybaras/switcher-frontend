import { useGameContext } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { calculateFigures, leaveGame } from "@/services/services";
import { MdLogout } from "react-icons/md";


export default function LeaveButton({ gameId, setLoadingOut }) {
  const { playerId } = useGameContext();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const onAbandon = async () => {
    
      leaveGame(playerId, gameId).then((res) => {
        // console.log(res)
        if (res.reverted_movements) {
          setLoadingOut(true);
          return calculateFigures(gameId);
        }
        navigate('/games');
      }).catch(error => {
        setError(error.message);
        console.error(error);
      }). finally(() => {
        setLoadingOut(false);
        navigate('/games');
      })

  }

  return (
    <div className="relative"> 
      <button
        data-testid='leaveButtonId'
        onClick={onAbandon}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="text-white hover:scale-110 transition-transform"

      >
        <MdLogout size={28} />
      </button>

      {showTooltip && (
        <div className="absolute bottom-full w-fit mb-2 z-50 p-2 text-sm bg-gray-700 text-white rounded">
            Abandonar
        </div>
      )}

      {error && <p>{error}</p>}
    </div>
  );
}
