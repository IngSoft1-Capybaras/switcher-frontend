import React from "react";

const GameBoard = ({ boxes }) => {

  const getColorClass = (color) => {
    switch (color) {
      case 'Green':
        return 'bg-green-500';
      case 'Blue':
        return 'bg-blue-500';
      case 'Red':
        return 'bg-red-500';
      case 'Yellow':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-6 grid-rows-6 gap-2 w-full h-full">
      {boxes.length > 0 &&
        boxes.map((row, rowIndex) => (
          row.map((box, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              data-testid={`box-${box.posX}-${box.posY}`}
              className={`rounded w-full h-full ${getColorClass(box.color)}`}
              style={{ gridColumn: box.posX + 1, gridRow: box.posY + 1 }}
            >
            </div>
          ))
        ))
      }
    </div>
  );
};

export default GameBoard;
