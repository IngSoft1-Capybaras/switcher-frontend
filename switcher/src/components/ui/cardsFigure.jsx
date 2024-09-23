import React from 'react';
import { cn } from "@/lib/utils"; // Asegúrate de que "cn" esté en utils
import { cardImg } from '../utils/getCardImg';

/* Se encarga de representar una carta figura en la interfaz del juego */
const CardsFigure = ({ type, isBlocked }) => {
  return (
    <div className={cn("relative w-35 h-48 border rounded", isBlocked ? "opacity-50" : "")}>
      <img src={cardImg(type)} alt="Carta de figura" className="object-cover w-full h-full" />
      {isBlocked && (
        <div className="absolute inset-0 bg-gray-800 opacity-70 flex items-center justify-center">
          <span className="text-white">Bloqueado</span>
        </div>
      )}
    </div>
  );
};

export default CardsFigure;
