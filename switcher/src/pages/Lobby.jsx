import React from 'react';
import PlayersList from '../components/PlayersList';
import { useParams } from 'react-router-dom';
import StartButton from '@/components/ui/StartButton';


export default function Lobby() {
    const {gameId} = useParams();
    return (
        <div>
        <h1>Lobby</h1>
        <PlayersList gameId={gameId} />        
        <StartButton gameId={gameId} />
        {/* boton abandonar */}
        </div>
    );
}
