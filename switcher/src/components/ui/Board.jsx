import React from 'react';

const Board = ({ rows = 6, cols = 6 }) => {
  const cells = Array.from({ length: rows * cols });
  
  // Array con los colores usando clases de Tailwind
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

  return (
    <div
      className="flex flex-wrap" // Usamos flexbox para manejar la disposición
      style={{
        width: `${cols * 40}px`, // Ancho total del tablero basado en 96px por celda
        height: `${rows * 40}px`, // Alto total del tablero basado en 96px por celda
      }}
    >
      {cells.map((_, index) => {
        const colorIndex = index % colors.length; // Alternar entre los cuatro colores
        return (
          <div
            key={index}
            className={`w-10 h-10 ${colors[colorIndex]} flex-shrink-0`} // Hacemos que las celdas no se reduzcan
          />
        );
      })}
    </div>
  );
};

export default Board;
