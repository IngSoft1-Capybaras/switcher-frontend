import React from 'react';
import { cn } from "@/lib/utils"; // Asegúrate de que "cn" esté en utils
import { cardImg } from '../utils/getCardImg';

/* Se encarga de representar una carta figura en la interfaz del juego */
const CardsFigure = ({ type, show, difficulty }) => {
  // Asignar un color o borde según la dificultad
  const difficultyStyle = difficulty === "HARD" ? "border-red-500" : "border-green-500";

  return (
    <div className={cn(
      "relative w-35 h-48 border rounded",
      !show ? "opacity-50" : "", // Si no se muestra (show es false), aplicar opacidad
      difficultyStyle // Agregar estilo basado en dificultad
    )}>
      {show ? (
        <img src={cardImg(type)} alt={`Carta de figura ${type}`} className="object-cover w-full h-full" />
      ) : (
        <div className="absolute inset-0 bg-gray-800 opacity-70 flex items-center justify-center">
          <span className="text-white">Bloqueado</span>
        </div>
      )}

      {/* Mostrar la dificultad si es necesario */}
      <div className="absolute bottom-0 left-0 bg-white text-black px-2 py-1 text-xs">
        {difficulty}
      </div>
    </div>
  );
};

export default CardsFigure;


// const CardsFigure = ({ type, isBlocked }) => {
//   return (
//     <div className={cn("relative w-35 h-48 border rounded", isBlocked ? "opacity-50" : "")}>
//       <img src={cardImg(type)} alt="Carta de figura" className="object-cover w-full h-full" />
//       {isBlocked && (
//         <div className="absolute inset-0 bg-gray-800 opacity-70 flex items-center justify-center">
//           <span className="text-white">Bloqueado</span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CardsFigure;
