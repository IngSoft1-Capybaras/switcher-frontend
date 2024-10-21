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


export default function GameBoard({boxes, blockedColor, currentTurn, playerId,
                                  selectedCardFigure, selectedBoardFigure, setSelectedBoardFigure,
                                  selectedMovementCard, setSelectMovementPosition, selectedMovementPositions, figuresFormed, syncEffect}) {

  const handleSelectFigure = (box) => {
    let boxFound = null;
    let indexFigureFound = -1;
    // console.log(figuresFormed)

    figuresFormed.find((figure, index) => {
      boxFound = figure.find(
        (elem) => {
          const isMatch = elem.pos_x === box.pos_x &&
          elem.pos_y === box.pos_y &&
          elem.color === box.color;

          // console.log(`Comparing box->${JSON.stringify(box)} with \nelem->${JSON.stringify(elem)} from figure->${index} \nisMatch->${isMatch}\n`)
          return isMatch;
        }
      );

      indexFigureFound = index;
      return boxFound;
    });

    if (!boxFound) {
      console.error("Box does not belong to a valid formed figure");
      return;
    }
    // console.log("FIGURA SELECCIONADA:", figuresFormed[indexFigureFound]);
    setSelectedBoardFigure(figuresFormed[indexFigureFound]);
  };
  
  // Manejo de clic en las casillas
  const handleSelectMovement = (box) => {
    if (!selectedMovementCard) {
      // console.log("Debes seleccionar una carta de movimiento primero");
      return;
    }
    // console.log("CASILLA SELECCIONADA:", box);
    // Obtener la posición de la casilla seleccionada
    const position = { x: box.pos_x, y: box.pos_y };

    // Verificar si la casilla ya está seleccionada
    const isAlreadySelected = selectedMovementPositions.some(
      (pos) => pos.x === position.x && pos.y === position.y
    );

    let newSelectedMovementPositions; // Nuevas posiciones seleccionadas

    if (isAlreadySelected) {
      // Si la casilla ya está seleccionada, removerla
      newSelectedMovementPositions = selectedMovementPositions.filter(
        (pos) => pos.x !== position.x || pos.y !== position.y
      );
    } else if (selectedMovementPositions.length < 2) {
      // Si aún no se han seleccionado dos casillas, agregar la nueva casilla
      newSelectedMovementPositions = [...selectedMovementPositions, position];
    } else {
      // Si ya se han seleccionado dos casillas, reemplazar la más antigua (la primera)
      newSelectedMovementPositions = [
        selectedMovementPositions[1],
        position                      // nueva posicion seleccionada
      ];
    }
    // console.log("Casillas seleccionadas:", newSelectedMovementPositions);
    setSelectMovementPosition(newSelectedMovementPositions); // Pasar las posiciones seleccionadas a ActiveGame
  };

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
        }`}
      </style>
      <div className="grid grid-cols-6 grid-rows-6 gap-2 w-full h-full">
        {boxes.length > 0 &&
          boxes.map((row, rowIndex) =>
            row.map((box, colIndex) => {
              // Check if the current box is in the selectedBoardFigure
              const isSelectedFigure = selectedBoardFigure.some(
                (selectedBox) =>
                  selectedBox.pos_x === box.pos_x &&
                  selectedBox.pos_y === box.pos_y &&
                  selectedBox.color === box.color
              );

              // Check if the current box is in the selectedMovementPositions
              const isSelectedMovement = selectedMovementPositions.some(
                (pos) => pos.x === box.pos_x && pos.y === box.pos_y
              );

              return (
                <button
                  onClick={
                    (selectedCardFigure && !selectedMovementCard) ? () => handleSelectFigure(box) : () => handleSelectMovement(box)
                  }
                  data-testid={`box-${box.pos_x}-${box.pos_y}`}
                  key={`${rowIndex}-${colIndex}`}
                  className={`relative overflow-hidden rounded w-full h-full
                    ${blockedColor == box.color ? 'bg-gradient-to-br from-gray-400 to-gray-600' : getColorBox(box.color)}
                    ${(box.highlighted && blockedColor != box.color && !isSelectedFigure && currentTurn == playerId && syncEffect) ? 'shine-effect' : ''}
                    ${isSelectedFigure ? 'animate-pulse' : ''}
                    ${isSelectedMovement ? 'brightness-75 animate-pulse' : 'brightness-100'}
                    ${(!selectedCardFigure && !selectedMovementCard) ? 'cursor-default' : 'cursor-pointer'}`}
                  style={{ gridColumn: box.pos_x + 1, gridRow: box.pos_y + 1 }}
                >
                </button>

              );
            })
          )
        }
      </div>
    </div>
  );
}