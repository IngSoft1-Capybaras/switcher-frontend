import React, {useState} from "react";
import { Button } from "./button";
import { useGameContext } from "@/context/GameContext";

export default function UndoButton({gameId}) {
    const [error, setError] = useState(null);
    const { playerId } = useGameContext();

    const onUndoMovement = async () => {
        if (!gameId || !playerId) {
            setError(`Error al deshacer movimiento:`);
        return 
        }

        try {
            const response = await fetch(`http://localhost:8000/deck/movement/undo_move`,
                {
                    method:`PATCH`,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ gameID: gameId, playerID: playerId })
                }
            )
            if (!await response.ok){
                const errorMessage = await response.text();
                setError(`Error al deshacer movimiento: ${errorMessage}`);
            }
        } 
        catch (error) {
            setError(`Error al deshacer movimiento: ${error.message}`);
        }
    }

    return(
        <div>
            <Button onClick={onUndoMovement}>
                Deshacer movimiento
            </Button>
            {error && <p>{error}</p>}
        </div>
    )
}