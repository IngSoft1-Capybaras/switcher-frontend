import React from 'react';
import { cn } from "@/lib/utils"; // Asegúrate de importar cn desde el mismo lugar que en CardsFigure
import { cardImg } from '../utils/getCardImg';

/* Se encarga de representar una carta de movimiento en la interfaz del juego */
const CardsMoviment = ({ type, used }) => {
  return (
    <div className={cn("relative w-35 h-48 border rounded", used ? "opacity-50" : "")}>
      {used ? (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white">Carta Usada</span>
        </div>
      ) : (
        <img src={cardImg(type)} alt="Carta de movimiento" className="object-cover w-full h-full" />
      )}
    </div>
  );
};

export default CardsMoviment;