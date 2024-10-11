import React from "react";

const GameBoard = ({ boxes, onSelectMovementPosition, selectMovementCard, selectedMovementPositions }) => {
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
    if (!selectMovementCard) {
      console.log("Debes seleccionar una carta de movimiento primero");
      return;
    }
  
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
  
    console.log("Casillas seleccionadas:", newSelectedMovementPositions);
    onSelectMovementPosition(newSelectedMovementPositions); // Pasar las posiciones seleccionadas a ActiveGame
  };

  return (
    <div className="grid grid-cols-6 grid-rows-6 gap-2 w-full h-full">
      {boxes.length > 0 &&
        boxes.map((row, rowIndex) =>
          row.map((box, colIndex) => {
            const isSelectedMovement = selectedMovementPositions.some(
              (pos) => pos.x === box.pos_x && pos.y === box.pos_y
            );

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                data-testid={`box-${box.pos_x}-${box.pos_y}`}
                className={`rounded w-full h-full ${getColorClass(box.color)} ${isSelectedMovement ? 'brightness-75 animate-pulse' : 'brightness-100'} cursor-pointer`}
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
