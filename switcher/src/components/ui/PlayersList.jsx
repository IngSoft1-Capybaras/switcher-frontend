import { useState, useEffect } from "react";
import React from "react";

export function PlayersList({ gameId, onUpdate }) {
    const [players, setPlayers] = useState([]);
    const [gameInfo, setGameInfo] = useState({ minPlayers: 0, maxPlayers: 0 });

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch(`/players/${gameId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setPlayers(data);
            } 
            catch (error) {
                console.error(`Error al obtener los jugadores: ${error}`);
            }
        };

        const fetchGameInfo = async () => {
            try {
                const response = await fetch(`/games/${gameId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setGameInfo({ minPlayers: data.minPlayers, maxPlayers: data.maxPlayers });
            } 
            catch (error) {
                console.error(`Error al obtener la información del juego: ${error}`);
            }
        };

        fetchPlayers();
        fetchGameInfo();
    }, [gameId]);

    
    useEffect(() => {
        if (players.length > 0 || gameInfo.minPlayers > 0) {
            onUpdate(players, gameInfo);
        }
    }, [players, gameInfo, onUpdate]);

    return (
        <div>
            <h2>Jugadores</h2>
            <ul>
                {players.map(player => (
                    <li key={player.id}>
                        {player.name}
                    </li>
                ))}
            </ul>
            <p>Jugadores necesarios para comenzar: {gameInfo.minPlayers}</p>
        </div>
    );
}
