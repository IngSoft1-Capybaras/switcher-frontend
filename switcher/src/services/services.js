const apiUrl = import.meta.env.VITE_API_URL;

console.log(import.meta.env);
export async function getGames(currentPage) {
    const url = `${apiUrl}/games?page=${currentPage}&limit=5`; // TODO: coordinar con back
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    
    return data;
    // } catch (error) {
        
    //     throw error;
    // }
    return response;
}

// Obtener jugadores
export async function getPlayers(gameId) {
    const url = `${apiUrl}/players/${gameId}`; // TODO: coordinar con back

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    
    return data;
}

// Obtener cartas de movimiento y figura para cada jugador
export async function getDeckMovement(gameId, player) {
    const url = `${apiUrl}/deck/movement/${gameId}/${player.id}`; // TODO: coordinar con back

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    
    return data;
}

// Obtener cartas de figura para cada jugador
export async function getDeckFigure(gameId, player) {
    const url = `${apiUrl}/deck/figure/${gameId}/${player.id}`; // TODO: coordinar con back

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    
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
      const response = await fetch(`/game_status/${gameId}/finish_turn`, {
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
  
