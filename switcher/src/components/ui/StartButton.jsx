import React from 'react';
import { Button } from './button';
import { useNavigate } from "react-router-dom";

const StartButton = ({ gameId }) => {
  const navigate = useNavigate();

  const onStart = async () => {
    // try {
    //   const response = await fetch(`http://localhost:8000/games/start/${gameId}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //   });

    //   if (response.ok) {
    //     console.log('Juego iniciado con éxito.');
    //     navigate(`/game`); // Navegar después de iniciar el juego
    //   } else {
    //     console.error('Falló al intentar iniciar el juego.');
    //   }
    // } 
    // catch (error) {
    //   console.error(`Error al comenzar la partida: ${error}`);
    // }
    navigate(`/games/ongoing/:gameId`); 
  };

  return (
    <Button onClick={onStart} color="primary">
      Comenzar
    </Button>
  );
};

export default StartButton;