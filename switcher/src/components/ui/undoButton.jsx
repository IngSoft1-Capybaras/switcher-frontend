import React, { useState, useEffect } from "react";
import { FaUndo } from 'react-icons/fa';
import { useGameContext } from "@/context/GameContext";
import { undoMovement } from "@/services/services";
import { calculateFigures } from "@/services/services";

export default function UndoButton({ gameId, currentTurn, setLoadingFig, resetFigureSelection,setSyncEffect,resetMov}) {
    const { playerId } = useGameContext();
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [isButtonActive, setIsButtonActive] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        if (currentTurn === playerId) {
            setIsButtonActive(true);
        } else {
            setIsButtonActive(false);
        }
    }, [currentTurn, playerId]);

    const handleError = (errorMessage) => {
        console.error(errorMessage);
        setError(errorMessage);
        setShowError(true);
        setTimeout(() => {
            setShowError(false);
            setError(null);
        }, 1000)
    }

    const onUndoMovement = async () => {
        resetFigureSelection();
        resetMov();
        
        if (!gameId || !playerId) {
            handleError(`Error al deshacer movimiento: (!gameId || !playerId)`);
            return;
        }
        setSyncEffect(false); // reset del effecto shiny de las figuras formadas, porque pueden no estar mas
        setLoadingFig(true);
        
        undoMovement(gameId, playerId).then((res) => {
            return calculateFigures(gameId);
        }).catch(err=> {
            handleError(`Error al deshacer movimiento: ${err.message}`);
        }).finally(() => {
            setLoadingFig(false);
            setSyncEffect(true);
        });
        
    };
    
    return (
        <div className="relative">
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

            {showError && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-4 rounded shadow-md z-50">
                    {error}
                </div>
            )}
        </div>
    );
}
