import React from 'react';
import { useGameContext } from '../context/GameContext'; 
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo_switcher.png';
import analisis from '../assets/images/analisis.png';
import aterrador from '../assets/images/aterrador.png';
import diagonalContiguo from '../assets/images/cruceDiagonalContiguo.png';
import Lizquierda from '../assets/images/cruceEnLIzquierda.png';

const Winner = () => {
  const { activeGameId, playerId } = useGameContext(); // Obtener gameId y playerId del contexto
  const navigate = useNavigate();

  const handleGoToGames = () => {
    navigate('/games');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      {/* Logo izquierdo */}
      <div className="w-1/4 flex justify-center">
        <img className="h-80 w-auto" src={logo} alt="Logo" />
      </div>

      {/* Columna central con logo, cuadro e imágenes */}
      <div className="flex flex-col items-center mx-8 space-y-10">
        {/* Imágenes al lado del logo */}
        <div className="flex items-center space-x-4 mb-4">
          <img className="h-32 w-auto" src={analisis} alt="Análisis" />
          <img className="h-32 w-auto" src={logo} alt="Logo" />
          <img className="h-32 w-auto" src={Lizquierda} alt="Lizquierda" />
        </div>

        {/* Cuadro central */}
        <div className="p-8 bg-gray-800 rounded-lg text-center">
          <h1 className="text-6xl font-bold mb-20">Winner</h1>
          <div className="mb-20">
            <h2 className="text-6xl">Partida: {"Capybaras"}</h2>
            <h2 className="text-6xl">Ganador: {"Armand"}</h2>
          </div>
          <Button onClick={handleGoToGames} className="mt-4">
            Volver al inicio
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <img className="h-32 w-auto" src={diagonalContiguo} alt="Análisis" />
          <img className="h-32 w-auto" src={logo} alt="Logo" />
          <img className="h-32 w-auto" src={aterrador} alt="Lizquierda" />
        </div>
      </div>

      {/* Logo derecho */}
      <div className="w-1/4 flex justify-center">
        <img className="h-80 w-auto" src={logo} alt="Logo" />
      </div>
    </div>
  );
};

export default Winner;
