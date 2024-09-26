import React, { useState } from 'react';
import PlayersList from '../components/ui/PlayersList';
import { useParams } from 'react-router-dom';
import StartButton from '../components/ui/StartButton';

export default function Lobby() {
    // const { gameId } = useParams();
    const gameId = '123';
    const [minPlayers, setMinPlayers] = useState(0);
    const [players, setPlayers] = useState([]);

    const updatePlayersInfo = (newPlayers, gameInfo) => {
        setPlayers(newPlayers);
        setMinPlayers(gameInfo.minPlayers);
    };

    
    console.log('players:', players);
    console.log('minPlayers:', minPlayers);
    return (
        <div>
            <h1>Lobby</h1>
            <PlayersList gameId={gameId} onUpdate={updatePlayersInfo} />
            {players.length >= minPlayers && (
                <StartButton gameId={gameId} />
            )}
        </div>
    );
}


