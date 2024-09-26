import React from "react";

export default function PlayersList({ players, minPlayers }) {    

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
            <p>Jugadores necesarios para comenzar: {minPlayers}</p>
        </div>
    );
}

