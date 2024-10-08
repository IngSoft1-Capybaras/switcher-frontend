import React, { useEffect, useState } from "react";
import { Button } from "./button"; // Asegúrate de que esta importación sea correcta.
import { playMovementCard } from "@/services/services";

export default function ConfirmButton({ gameId, selectedCard, selectedPositions, playerId, currentTurn }) {
    const [error, setError] = useState(null);
    const [isButtonActive, setIsButtonActive] = useState(false);

    useEffect(() => {
        if (currentTurn === playerId && selectedCard && selectedPositions.length === 2) {
            setIsButtonActive(true);
        } else {
            setIsButtonActive(false);
        }
    }, [currentTurn, playerId, selectedCard, selectedPositions]);

    const onConfirmMove = async () => {
        if (!gameId || !playerId || !selectedCard || selectedPositions.length < 2) {
            setError("Error al confirmar el movimiento: falta información necesaria.");
            return;
        }

        const [posFrom, posTo] = selectedPositions;

        try {
            await playMovementCard({
                game_id: gameId,
                player_id: playerId,
                card_id: selectedCard.id,
                pos_from: posFrom,
                pos_to: posTo,
            });
            // Aquí puedes manejar la respuesta de éxito, si es necesario
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <Button onClick={onConfirmMove} disabled={!isButtonActive}>
                Confirmar
            </Button>
            {error && <p>{error}</p>}
        </div>
    );
}
