import React from 'react';
import PlayersList from '../components/PlayersList';
import { useParams } from 'react-router-dom';
import StartButton from '@/components/ui/StartButton';

//const {gameId} = useParams();
//const gameId = '1234';

export default function Lobby(gameId) {
    return (
        <div>
        <h1>Lobby</h1>


        <PlayersList gameId={gameId} />
        
        <StartButton gameId={gameId} />
        {/* boton abandonar */}
        </div>
    );
}
