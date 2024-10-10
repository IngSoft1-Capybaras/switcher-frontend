const apiUrl = import.meta.env.VITE_API_URL;

console.log(import.meta.env);
export async function getGames(currentPage) {
    const url = `${apiUrl}/games?page=${currentPage}&limit=5`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    return data;
}

// Obtener jugadores
export async function getPlayers(gameId) {
    const url = `${apiUrl}/players/${gameId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    return data;
}

// Obtener cartas de movimiento y figura para cada jugador
export async function getDeckMovement(gameId, player) {
    console.log("gameIDMov: ", gameId);
    console.log("playerMov: ", player);
    const url = `${apiUrl}/deck/movement/${gameId}/${player}`;

    const response = await fetch(url);
    console.log(response);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    console.log("cardsMOV: ", data);
    return data;
}

// Obtener cartas de figura para cada jugador
export async function getDeckFigure(gameId, player) {
    console.log("gameIDFig: ", gameId);
    console.log("playerFig: ", player);
    const url = `${apiUrl}/deck/figure/${gameId}/${player}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    console.log("cardsFIG: ", data);
    return data;
}


export async function getGameInfo(gameId) {
    const url = `${apiUrl}/games/${gameId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    return data;
}

export async function getPlayer(gameId, playerId) {
    const url = `${apiUrl}/players/${gameId}/${playerId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    return data;
}

export async function startGame(gameId) {
    const url = `${apiUrl}/game_state/start/${gameId}`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    return data;
}


export async function joinGame(gameId, playerName) {
    const url = `${apiUrl}/players/join/${gameId}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'player_name': playerName
        })
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    return data;
}
// Finalizar turno
export async function pathEndTurn(gameId) {
    try {
      const response = await fetch(`${apiUrl}/game_state/${gameId}/finish_turn`, {
        method: 'PATCH',  // Método PATCH para actualizar el turno
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al finalizar el turno');
      }

      return await response.json(); // Asumiendo que devuelve algún JSON como respuesta
    } catch (error) {
      console.error('Error al llamar al endpoint de finalizar turno:', error);
      throw error; // Propaga el error para manejarlo en el componente
    }
  }

  // Obtener el estado del juego
export async function getGameStatus(gameId) {
    const url = `${apiUrl}/game_status/${gameId}/status`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error al obtener el estado del juego: ${response.status}`);
      }

      const data = await response.json();
      return data.state; // Suponiendo que la respuesta contiene { state: "FINISHED" | "PLAYING" | "WAITING" }
    } catch (error) {
      console.error('Error en la llamada a getGameStatus:', error);
      throw error;
    }
  }

  export async function getBoard(gameId) {
    const url = `${apiUrl}/board/${gameId}`;

    try {
      const response = await fetch(url);


      if (!response.ok) {
        throw new Error('Error al obtener tablero');
      }

      return await response.json(); // Asumiendo que devuelve algún JSON como respuesta
    } catch (error) {
      console.error('Error al obtener turno:', error);
      throw error; // Propaga el error para manejarlo en el componente
    }
  }

export const fetchTurnInfo = async (activeGameId) => {
    try {
        const response = await fetch(`${apiUrl}/game_state/${activeGameId}/current_turn`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error("Error al obtener información del turno");
    }
}

export const undoMovement = async (gameId, playerId) => {
  try {
      const response = await fetch(`${apiUrl}/deck/movement/undo_move`,
          {
              method:`PATCH`,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ gameID: gameId, playerID: playerId })
          }
      )
      if (!response.ok){
          const errorMessage = await response.text();
          throw new Error(`Error al deshacer movimiento: ${errorMessage}`);
      }
  }
  catch (error) {
    throw new Error(`Error al deshacer movimiento: ${error.message}`);
  }
}

export const submitForm = async (data, username) => {
  const body = {
    game: {
      name: data.name,
      max_players: data.playersRange[1],
      min_players: data.playersRange[0],
    },
    player: {
      name: username,
      host: true,
      turn: "PRIMERO",
    },
  };

  return await fetch(`${apiUrl}/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message || 'Error al crear la partida.');
        });
      }
      return response.json();
    });
}

export const leaveGame = async (playerId, gameId) => {
  try {
    const response = await fetch(`${apiUrl}/players/${playerId}/leave?game_id=${gameId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error al abandonar la partida: ${errorMessage}`);
    }
  }
  catch (error) {
    throw new Error(`Error al abandonar la partida: ${error.message}`);
  }
}