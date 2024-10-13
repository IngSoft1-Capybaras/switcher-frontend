import React, { useState, useEffect } from "react";
import { FaUndo } from 'react-icons/fa';
import { useGameContext } from "@/context/GameContext";
import { undoMovement } from "@/services/services";

export default function UndoButton({ gameId, currentTurn }) {
    const { playerId } = useGameContext();
    const [error, setError] = useState(null);
    const [isButtonActive, setIsButtonActive] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        if (currentTurn === playerId) {
            setIsButtonActive(true);
        } else {
            setIsButtonActive(false);
        }
    }, [currentTurn, playerId]);

    const onUndoMovement = async () => {
        if (!gameId || !playerId) {
            setError(`Error al deshacer movimiento:`);
            return;
        }

        try {
            await undoMovement(gameId, playerId);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="relative"> {/* This ensures the tooltip is positioned relative to this button */}
            <button
                data-testid='undoButtonId'
                onClick={onUndoMovement}
                disabled={!isButtonActive}
                className={`text-white ${ isButtonActive ? 'hover:scale-110 transition-transform':'opacity-50'}`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <FaUndo size={28} />
            </button>

            {showTooltip && (
                <div className="absolute bottom-full w-fit mb-2 z-50 p-2 text-sm bg-gray-700 text-white rounded">
                    Deshacer movimiento
                </div>
            )}

            {error && <p>{error}</p>}
        </div>
    );
}
