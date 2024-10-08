import React, { useState } from "react";

const GameBoard = ({ boxes, onSelectPosition }) => {
  const [selectedPositions, setSelectedPositions] = useState([]);

  const getColorClass = (color) => {
    switch (color) {
      case 'GREEN':
        return 'bg-green-500';
      case 'BLUE':
        return 'bg-blue-500';
      case 'RED':
        return 'bg-red-500';
      case 'YELLOW':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleBoxClick = (box) => {
    const position = { x: box.pos_x, y: box.pos_y };

    if (selectedPositions.length < 2) {
      const newSelectedPositions = [...selectedPositions, position];
      setSelectedPositions(newSelectedPositions);
      console.log("Casillas seleccionadas:", newSelectedPositions);
      onSelectPosition(newSelectedPositions); // Pasar las posiciones seleccionadas a ActiveGame
    } else {
      console.log("Ya has seleccionado dos posiciones", selectedPositions);
    }
  };

  return (
    <div className="grid grid-cols-6 grid-rows-6 gap-2 w-full h-full">
      {boxes.length > 0 &&
        boxes.map((row, rowIndex) =>
          row.map((box, colIndex) => {
            const isSelected = selectedPositions.some(
              (pos) => pos.x === box.pos_x && pos.y === box.pos_y
            );
            const borderColor = isSelected ? 'border-yellow-500' : '';

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                data-testid={`box-${box.pos_x}-${box.pos_y}`}
                className={`rounded w-full h-full border-2 ${borderColor} ${getColorClass(box.color)}`}
                style={{ gridColumn: box.pos_x + 1, gridRow: box.pos_y + 1 }}
                onClick={() => handleBoxClick(box)} // Manejar clic en las casillas
              />
            );
          })
        )}
    </div>
  );
};

export default GameBoard;
