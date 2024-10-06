import React, {useState, useEffect} from "react";
import { Button } from "./button";
import { useGameContext } from "@/context/GameContext";
import { UndoMovement } from "@/services/services";

export default function UndoButton({gameId, currentTurn}) {
    const { playerId } = useGameContext();

    const [error, setError] = useState(null);
    const [isButtonActive, setIsButtonActive] = useState(false);

    useEffect(() => {
        if (currentTurn == playerId) {
          setIsButtonActive(true);
        }
        else{
            setIsButtonActive(false);
        }
      }, [currentTurn]);

    const onUndoMovement = async () => {
        if (!gameId || !playerId) {
            setError(`Error al deshacer movimiento:`);
        return 
        }

        UndoMovement(gameId, playerId, setError);
    }

    return(
        <div>
            <Button onClick={onUndoMovement} disabled={!isButtonActive}>
                Deshacer movimiento
            </Button>
            {error && <p>{error}</p>}
        </div>
    )
}