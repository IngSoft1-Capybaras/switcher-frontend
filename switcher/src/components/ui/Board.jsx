import React, { useState } from 'react';

const Board = ({ rows = 6, cols = 6, onSelectPosition }) => {
  const cells = Array.from({ length: rows * cols });
  const [selectedPositions, setSelectedPositions] = useState([]); // Guardar las posiciones seleccionadas
  
  // Manejar clics en las celdas
  const handleCellClick = (index) => {
    const row = Math.floor(index / cols); // Calcula la fila de la celda
    const col = index % cols; // Calcula la columna de la celda
    const position = { x: col, y: row };

    // Si hay dos posiciones seleccionadas, no hacer nada más
    if (selectedPositions.length >= 2) return;

    const newSelectedPositions = [...selectedPositions, position];
    setSelectedPositions(newSelectedPositions);

    // Llamar la función `onSelectPosition` pasada como prop para notificar a ActiveGame
    if (onSelectPosition) {
      onSelectPosition(newSelectedPositions);
    }
  };

  return (
    <div
      className="flex flex-wrap"
      style={{
        width: `${cols * 40}px`,
        height: `${rows * 40}px`,
      }}
    >
      {cells.map((_, index) => {
        const colorIndex = index % 4; // Alternar entre los colores
        const isSelected = selectedPositions.some(
          (pos) => pos.x === index % cols && pos.y === Math.floor(index / cols)
        ); // Verificar si la celda está seleccionada
        const borderColor = isSelected ? 'border-yellow-500' : '';

        return (
          <div
            key={index}
            className={`w-10 h-10 ${borderColor} border-2 ${colorIndex === 0 ? 'bg-red-500' : colorIndex === 1 ? 'bg-blue-500' : colorIndex === 2 ? 'bg-green-500' : 'bg-yellow-500'} flex-shrink-0`}
            onClick={() => handleCellClick(index)} // Manejar clic en la celda
          />
        );
      })}
    </div>
  );
};

export default Board;
