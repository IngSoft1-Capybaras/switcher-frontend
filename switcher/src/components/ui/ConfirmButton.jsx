import React, { useEffect, useState } from "react";
import { calculateFigures, playMovementCard } from "@/services/services";
import { IoMdMove } from "react-icons/io";


export default function ConfirmButton({ gameId, selectedCard, selectedPositions, playerId, currentTurn, resetMov, setLoadingFig, setSyncEffect }) {
    const [error, setError] = useState(null);
    const [isButtonActive, setIsButtonActive] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);  
    // const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Habilita el botón solo si es el turno del jugador actual y hay una carta seleccionada y dos posiciones.
        if (currentTurn === playerId && selectedCard && selectedPositions.length === 2) {
            setIsButtonActive(true);
        } else {
            setIsButtonActive(false);
        }
    }, [currentTurn, playerId, selectedCard, selectedPositions]);

    const onConfirmMove = async () => {

        // Aquí puedes manejar la lógica para confirmar el movimiento
        const [posFrom, posTo] = selectedPositions;

        // Se asume que playMovementCard maneja errores internamente
        if (gameId && playerId && selectedCard && selectedPositions.length >= 2) {
            setSyncEffect(false); // reset del effecto shiny de las figuras formadas, porque pueden no estar mas
            playMovementCard({
                gameId: gameId,
                playerId: playerId,
                cardId: selectedCard.id,
                posFrom: posFrom,
                posTo: posTo,
            
            })
            .then((res) => {
                setLoadingFig(true);
                calculateFigures(gameId)
                .then((res) => {
                    setLoadingFig(false);
                    setSyncEffect(true);
                    return;
                })
                 // Espera la respuesta de calculateFigures
                return;
            })
            .then((res) => {
                resetMov();
                setError(null);
                return;
            })
            .catch(error=>{
                console.error("Error al confirmar el movimiento:", error.message);
                setError("Movimiento invalido. Por favor, intenta de nuevo."); // Muestra un mensaje de error al usuario
                setShowError(true); // Muestra el mensaje de error
                // Oculta el mensaje de error después de 1 segundo
                setTimeout(() => {
                    setShowError(false);
                    setError(null); // Limpiar el mensaje de error
                }, 1000)

                return;
            })
            // .then((res) => {
            //     setLoadingFig(false);
            //     return;
            // }) // Espera la respuesta de calculateFigures
        }
    };
    

    return (
        <div className="relative">
            <button
                data-testid = 'claimButtonTestId'
                onClick={onConfirmMove} 
                disabled={!isButtonActive}
                className={`text-white ${((playerId == currentTurn) && isButtonActive) ? 'animate-bounce' : 'opacity-50'}`}

                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <IoMdMove size={28}/>
            </button>

            {showTooltip && (
                <div className="absolute bottom-full w-fit mb-2 z-50 p-2 text-sm bg-gray-700 text-white rounded">
                    Hacer Movimiento
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
