import React from 'react';
import PlayersList from '../components/PlayersList';
import { useParams } from 'react-router-dom';
import StartButton from '../components/StartButton';

export default function Lobby() {
    const { gameId } = useParams();
    const [minPlayers, setMinPlayers] = useState(0);
    const [players, setPlayers] = useState([]);

    const updatePlayersInfo = (newPlayers, gameInfo) => {
        setPlayers(newPlayers);
        setMinPlayers(gameInfo.minPlayers);
    };

    return (
        <div>
            <h1>Lobby</h1>
            <PlayersList gameId={gameId} onUpdate={updatePlayersInfo} />
            {players.length >= minPlayers && <StartButton gameId={gameId} />}
        </div>
    );
}

