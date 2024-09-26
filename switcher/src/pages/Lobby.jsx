import React, { useEffect, useState } from 'react';
import PlayersList from '../components/ui/PlayersList';
import { useNavigate, useParams } from 'react-router-dom';
import StartButton from '../components/ui/activeButton';
import { useGameContext } from '@/context/GameContext';
import { getPlayers, getGameInfo, getPlayer, startGame } from '../services/services';
import { useLobbySocket } from '@/components/hooks/use-lobby-socket';

export default function Lobby() {
    const {gameId} = useParams();
    const {players, setPlayers, playerId} = useGameContext();
    const [iniciateActive, setIniciateActive] = useState(false); // para activar el boton de iniciar partida
    const [maxPlayers, setMaxPlayers] = useState(0);
    const [minPlayers, setMinPlayers] = useState(Infinity);
    const navigate = useNavigate();

    const fetchGameInfo =async  (gameId) => {
        const  fetchedPlayers = await getPlayers(gameId);
        setPlayers(fetchedPlayers); //actualizo los jugadores
        
        if (players.length >= minPlayers) {
            const fetchedPlayer = await getPlayer(gameId, playerId);
            if (fetchedPlayer.host) {
                // activo el boton para iniciar partida
                setIniciateActive(true);
            }
        }
    }

    const onStartClick = async () => {
        startGame(gameId)
        .then((res) => {
            navigate(`/games/ongoing/${gameId}`);
        })
        .catch((err) => {
            console.error(`Error: ${err}`);
        })
    }

    useEffect(() => {
        getGameInfo(gameId)
        .then(res=> {
            setMaxPlayers(res.maxPlayers); // seteo el maximo de jugadores para el componente que lo necesite
            setMinPlayers(res.minPlayers);
        })
        .catch((err) => console.error(`Error: No se pudieron obtener los datos basicos de la partida. ${err}`));

        fetchGameInfo(gameId); // fetch inicial (obtengo los datos apenas entro a la partida)
    }, []);

    useLobbySocket(gameId, fetchGameInfo); // me suscribo a los eventos correspondientes para obtener datos a medida que vayan cambiando
    
    return (
        <div>
            <h1>Lobby</h1>
            <PlayersList players={players} minPlayers={minPlayers}/>
            <StartButton isActive={iniciateActive} onClick={onStartClick}>Comenzar partida</StartButton>
             
             <p>Hay {players.length} de {maxPlayers} </p>
        </div>
    );
}


