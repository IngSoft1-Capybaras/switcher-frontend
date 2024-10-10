import { useGameContext } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { leaveGame } from "@/services/services";
import { FaSignOutAlt } from 'react-icons/fa';

export default function LeaveButton({ gameId }) {
  const { playerId } = useGameContext();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const onAbandon = async () => {
    try {
      await leaveGame(playerId, gameId);
      navigate('/games'); 
    } 
    catch (error) {
      // setError(error.message); 
      console.error(error);
    }
  }

  return (
    <div className="relative"> {/* This ensures the tooltip is positioned relative to this button */}
      <button
        onClick={onAbandon}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="text-white hover:scale-110 transition-transform"

      >
        <FaSignOutAlt size={28} />
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
