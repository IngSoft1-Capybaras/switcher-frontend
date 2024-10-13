import React, { useEffect, useState } from "react";
import { Button } from "./button"; // Asegúrate de que esta importación sea correcta.
import { playMovementCard } from "@/services/services";

export default function ConfirmButton({ gameId, selectedCard, selectedPositions, playerId, currentTurn, resetMov}) {
    const [error, setError] = useState(null);
    const [isButtonActive, setIsButtonActive] = useState(false);
    const [showError, setShowError] = useState(false); // Estado para mostrar el error


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
            try {
                await playMovementCard({
                    gameId: gameId,
                    playerId: playerId,
                    cardId: selectedCard.id,
                    posFrom: posFrom,
                    posTo: posTo,
                });
                resetMov(); // Llama a resetMov si la jugada es exitosa
                setError(null);
            } catch (error) {
                console.error("Error al confirmar el movimiento:", error.message);
                setError("Movimiento invalido. Por favor, intenta de nuevo."); // Muestra un mensaje de error al usuario
                setShowError(true); // Muestra el mensaje de error
                // Oculta el mensaje de error después de 1 segundo
                setTimeout(() => {
                    setShowError(false);
                    setError(null); // Limpiar el mensaje de error
                }, 1000)
            }
        }
    };
    
    return (
        <div>
            <Button onClick={onConfirmMove} disabled={!isButtonActive}>
                Hacer movimiento
            </Button>

            {showError && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-4 rounded shadow-md z-50">
                    {error}
                </div>
            )}
        </div>
    );
}
