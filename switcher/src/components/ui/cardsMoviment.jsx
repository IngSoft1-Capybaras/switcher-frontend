import React from 'react';
import { cn } from "@/lib/utils"; // Asegúrate de importar cn desde el mismo lugar que en CardsFigure

const CardsMoviment = ({ image, isVisible }) => {
  return (
    <div className={cn("relative w-35 h-48 border rounded", !isVisible ? "bg-gray-500" : "")}>
      {isVisible ? (
        <img src={image} alt="Carta de movimiento" className="object-cover w-full h-full" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white">Carta Oculta</span>
        </div>
      )}
    </div>
  );
};

export default CardsMoviment;
