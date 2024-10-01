import React from "react";

const GameBoard = ({ boxes }) => {

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

  return (
    <div className="grid grid-cols-6 grid-rows-6 gap-2 w-full h-full">
      {boxes.length > 0 &&
        boxes.map((row, rowIndex) => (
          row.map((box, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              data-testid={`box-${box.pos_x}-${box.pos_y}`}
              className={`rounded w-full h-full ${getColorClass(box.color)}`}
              style={{ gridColumn: box.pos_x + 1, gridRow: box.pos_y + 1 }}
            >
            </div>
          ))
        ))
      }
    </div>
  );
};

export default GameBoard;
