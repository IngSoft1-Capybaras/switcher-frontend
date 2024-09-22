import React from 'react';
import CardsFigure from './cardsFigure';

const PlayerPanel = ({ playerName, cartas }) => {
    return (
      <div className="flex flex-col items-center">
        <h2>{playerName}</h2>
        <div className="flex space-x-2">
          {cartas.map((carta, index) => (
            <CardsFigure key={index} image={carta.image} isBlocked={carta.isBlocked} />
          ))}
        </div>
      </div>
    );
  };
  
  export default PlayerPanel;
  