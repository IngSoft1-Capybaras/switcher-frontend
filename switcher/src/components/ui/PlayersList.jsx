import React from "react";

// Array of colors for player names
const colors = ["text-red-400", "text-blue-400", "text-green-400", "text-yellow-400"];

export default function PlayersList({ players, maxPlayers }) {
  // Function to assign a color based on the player's index
  const getPlayerColor = (index) => {
    return colors[index % colors.length]; // Cycle through the colors array
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-800">
      {/* Heading with zinc color */}
      <h2 className="text-2xl font-extrabold text-zinc-200 mb-4">
        Jugadores ({players.length}/{maxPlayers})
      </h2>

      <ul className="space-y-2">
        {players.map((player, index) => (
          <li
            key={player.id}
            className={`p-3 rounded-lg bg-zinc-800 text-white flex items-center justify-between transition-colors duration-200 hover:bg-zinc-700`}
          >
            <span className={`font-medium ${getPlayerColor(index)}`}>{player.name}</span>
            {player.isHost && (
              <span className="bg-blue-500 text-xs text-white font-bold py-1 px-2 rounded-md">
                Host
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
