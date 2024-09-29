import React, { useEffect, useState } from 'react';
import { useGameContext } from "@/context/GameContext"; 
import { useSocketContext } from "@/context/SocketContext"; 

export default function TurnInformation() {
    const { playerId, activeGameId, currentTurn, setCurrentTurn } = useGameContext();
    
    const fetchTurnInfo = async (activeGameId) => {
        try {
            const response = await fetch(`http://localhost:8000/game_state/${activeGameId}/current_turn`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
    
            const data = await response.json();
            return data;
        } 
        catch (error) {
            console.error("Error al obtener información del turno:", error);
            throw new Error("Error al obtener información del turno");
        }
    }

}