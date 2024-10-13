import React, {useState, useEffect} from "react";

const mockData = {
  boxes: [
    [
      { pos_x: 0, pos_y: 0, color: "RED", highlighted: true },
      { pos_x: 1, pos_y: 0, color: "RED", highlighted: true },
      { pos_x: 2, pos_y: 0, color: "RED", highlighted: true },
      { pos_x: 3, pos_y: 0, color: "BLUE", highlighted: false },
      { pos_x: 4, pos_y: 0, color: "YELLOW", highlighted: false },
      { pos_x: 5, pos_y: 0, color: "GREEN", highlighted: false }
    ],
    [
      { pos_x: 0, pos_y: 1, color: "GREEN", highlighted: false },
      { pos_x: 1, pos_y: 1, color: "YELLOW", highlighted: false },
      { pos_x: 2, pos_y: 1, color: "RED", highlighted: true },
      { pos_x: 3, pos_y: 1, color: "BLUE", highlighted: false },
      { pos_x: 4, pos_y: 1, color: "GREEN", highlighted: false },
      { pos_x: 5, pos_y: 1, color: "RED", highlighted: false }
    ],
    [
      { pos_x: 0, pos_y: 2, color: "BLUE", highlighted: true },
      { pos_x: 1, pos_y: 2, color: "YELLOW", highlighted: false },
      { pos_x: 2, pos_y: 2, color: "GREEN", highlighted: false },
      { pos_x: 3, pos_y: 2, color: "RED", highlighted: false },
      { pos_x: 4, pos_y: 2, color: "YELLOW", highlighted: false },
      { pos_x: 5, pos_y: 2, color: "GREEN", highlighted: false }
    ],
    [
      { pos_x: 0, pos_y: 3, color: "BLUE", highlighted: true },
      { pos_x: 1, pos_y: 3, color: "RED", highlighted: false },
      { pos_x: 2, pos_y: 3, color: "GREEN", highlighted: false },
      { pos_x: 3, pos_y: 3, color: "YELLOW", highlighted: false },
      { pos_x: 4, pos_y: 3, color: "BLUE", highlighted: false },
      { pos_x: 5, pos_y: 3, color: "RED", highlighted: false }
    ],
    [
      { pos_x: 0, pos_y: 4, color: "BLUE", highlighted: true },
      { pos_x: 1, pos_y: 4, color: "BLUE", highlighted: true },
      { pos_x: 2, pos_y: 4, color: "RED", highlighted: false },
      { pos_x: 3, pos_y: 4, color: "YELLOW", highlighted: false },
      { pos_x: 4, pos_y: 4, color: "GREEN", highlighted: false },
      { pos_x: 5, pos_y: 4, color: "YELLOW", highlighted: false }
    ],
    [
      { pos_x: 0, pos_y: 5, color: "GREEN", highlighted: false },
      { pos_x: 1, pos_y: 5, color: "YELLOW", highlighted: false },
      { pos_x: 2, pos_y: 5, color: "RED", highlighted: false },
      { pos_x: 3, pos_y: 5, color: "BLUE", highlighted: false },
      { pos_x: 4, pos_y: 5, color: "GREEN", highlighted: false },
      { pos_x: 5, pos_y: 5, color: "RED", highlighted: false }
    ]
  ],
  figuresFormed: [
    [
      { pos_x: 0, pos_y: 2, color: "BLUE", highlighted: true },
      { pos_x: 0, pos_y: 3, color: "BLUE", highlighted: true },
      { pos_x: 0, pos_y: 4, color: "BLUE", highlighted: true },
      { pos_x: 1, pos_y: 4, color: "BLUE", highlighted: true }
    ],
  ]
};


const getColorBox = (color) => {
  switch (color) {
    case 'GREEN':
      return 'bg-gradient-to-br from-green-400 to-green-600';
    case 'BLUE':
      return 'bg-gradient-to-br from-blue-400 to-blue-600';
    case 'RED':
      return 'bg-gradient-to-br from-red-400 to-red-600';
    case 'YELLOW':
      return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
    default:
      return 'bg-gradient-to-br from-gray-400 to-gray-600';
  }
};


export default function GameBoard({boxes, blockedColor, selectedCardFigure, currentTurn, playerId, selectedCardMovement, setSelectedBoardFigure, selectedBoardFigure}) {

  const handleSelectFigure = (box) => {
    let boxFound = null;
    let indexFigureFound = -1;


    mockData.figuresFormed.forEach((figure, index) => {
      boxFound = figure.find(
        (elem) => {
          const isMatch = elem.pos_x === box.pos_x &&
                          elem.pos_y === box.pos_y &&
                          elem.color === box.color;
          return isMatch;
        }
      );

      if (boxFound) {
        indexFigureFound = index;
        return;
      }
    });
    //

    if (!boxFound) {
      console.error("Box does not belong to a valid formed figure");
      return;
    }

    setSelectedBoardFigure(mockData.figuresFormed[indexFigureFound]);
  };


  const handleSelectMovement = () => {
    console.log("Selecciono casilla para movimiento")
    // Armando's job
  }

  return (
    <div className="relative flex h-[600px] w-[600px] flex-col items-center justify-center rounded-md shadow-xl border-4 border-zinc-700 bg-zinc-800 p-4">
      <style jsx global>{`
        @keyframes glass-shine {
          0% {
            transform: translateX(-150%) translateY(-150%);
          }
          100% {
            transform: translateX(150%) translateY(150%);
          }
        }
        .shine-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 150%;
          height: 150%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0) 70%);
          transform: translateX(-150%) translateY(-150%);
          animation: glass-shine 5s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes fast-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-fast-pulse {
          animation: fast-pulse 0.3s ease-in-out 3;
        }
      `}</style>
      <div className="grid grid-cols-6 grid-rows-6 gap-2 w-full h-full">
        {mockData.boxes.length > 0 &&
          mockData.boxes.map((row, rowIndex) =>
            row.map((box, colIndex) => {
              // Check if the current box is in the selectedBoardFigure
              const isSelectedFigure = selectedBoardFigure.some(
                (selectedBox) =>
                  selectedBox.pos_x === box.pos_x &&
                  selectedBox.pos_y === box.pos_y &&
                  selectedBox.color === box.color
              );

        return (
          <button
            onClick={(selectedCardFigure && !selectedCardMovement) ? () => handleSelectFigure(box) : () => handleSelectMovement(box)}
            data-testid={`box-${box.pos_x}-${box.pos_y}`}
            key={`${rowIndex}-${colIndex}`}
            className={`relative overflow-hidden rounded w-full h-full ${blockedColor==box.color ? 'bg-gradient-to-br from-gray-400 to-gray-600' : getColorBox(box.color)} ${(box.highlighted && blockedColor!=box.color && !isSelectedFigure && currentTurn==playerId) ? 'shine-effect' : ''} ${isSelectedFigure ? 'animate-pulse' : ''}`}
            style={{ gridColumn: box.pos_x + 1, gridRow: box.pos_y + 1 }}
            disabled={!((currentTurn==playerId) && selectedCardFigure && box.highlighted)}
          >
          </button>
        );
      })
    )}
</div>
    </div>
  );
}
