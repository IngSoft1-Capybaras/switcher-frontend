const apiUrl = import.meta.env.VITE_API_URL;

console.log(import.meta.env);
export async function getGames(currentPage, totalPages) {
    const url = `${apiUrl}/games`; // TODO: coordinar con back

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    
    return data;
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
        body: {
            'player_name': playerName
        }
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    
    return data;
}
