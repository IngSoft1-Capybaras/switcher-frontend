import React, { useEffect, useState } from "react";
import { Button } from "./button"; // Asegúrate de que esta importación sea correcta.
import { playMovementCard } from "@/services/services";

export default function ConfirmButton({ gameId, selectedCard, selectedPositions, playerId, currentTurn, resetMov}) {
    const [error, setError] = useState(null);
    const [isButtonActive, setIsButtonActive] = useState(false);

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
            } catch (error) {
                console.error("Error al confirmar el movimiento:", error.message); // Manejo de errores en la consola
            }
        }
    };
    
    return (
        <div>
            <Button onClick={onConfirmMove} disabled={!isButtonActive}>
                Hacer movimiento
            </Button>
        </div>
    );
}
