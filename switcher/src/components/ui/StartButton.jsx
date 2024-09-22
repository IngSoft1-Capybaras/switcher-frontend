import React from 'react';
import {Button} from './button';

async function onStart(gameId) {
  try {
    const response = await fetch(`/games/start/${gameId}`,  
 {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
    });

    if (response.ok) {
      console.log('Juego iniciado con éxito.');
    }
    else {
      console.error('Falló al intentar iniciar el juego.');
    }
  } 
  catch (error) {
    console.error(`Error al comenzar la partida: ${error}`);
  }
}

const StartButton = ({ gameId }) => {
  return (
    <Button onClick={() => onStart(gameId)} color="primary">
      Comenzar
    </Button>
  );
};

export default StartButton;
