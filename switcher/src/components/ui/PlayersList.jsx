import { useState, useEffect } from "react";
import React from "react";

export function PlayersList({ gameId }) {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch(`/players/${gameId}`,
                    {
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

        fetchPlayers();
    }, []);

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
        </div>
    );
}
