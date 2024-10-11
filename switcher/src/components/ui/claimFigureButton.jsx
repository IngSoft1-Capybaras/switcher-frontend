import React, { useState, useEffect, useCallback } from "react";
import { useGameContext } from "@/context/GameContext";
import { claimFigure } from "@/services/services";
import { FiCheckSquare } from 'react-icons/fi';


export default function ClaimFigureButton({ gameId, cardId, figure}) {
    const { playerId, currentTurn } = useGameContext();
    const [showTooltip, setShowTooltip] = useState(false);

    const handleClaimFigure = async () => {
        if (!gameId || !playerId) {
            console.error("No gameId or playerId")
            return;
        }
        fetchFigureCards
        try {
            const res = await claimFigure(gameId, playerId, cardId, figure);

            if (!res) console.error(res)
        }
        catch (error) {
            // setError(error.message);
            console.error(error)
        }
    };


    return (
        <div className="relative">
            <button
                data-testid = 'claimButtonTestId'
                onClick={handleClaimFigure}
                disabled={!(figure.length!==0 && (playerId == currentTurn) && cardId)}
                className={`text-white ${(figure.length!==0 && (playerId == currentTurn) && cardId) ? 'animate-bounce' : 'opacity-50'}`}

                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <FiCheckSquare size={28} />
            </button>

            {showTooltip && (
                <div className="absolute bottom-full w-fit mb-2 z-50 p-2 text-sm bg-gray-700 text-white rounded">
                    Reclamar figura
                </div>
            )}
        </div>
    );
}
