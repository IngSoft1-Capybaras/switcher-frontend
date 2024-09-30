import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import TurnInformation from '@/components/ui/TurnInfo';
import { useGameContext } from '@/context/GameContext';
import { useSocketContext } from '@/context/SocketContext';

// Mock de los contextos
vi.mock('@/context/GameContext', () => ({
  useGameContext: vi.fn(),
}));

vi.mock('@/context/SocketContext', () => ({
  useSocketContext: vi.fn(),
}));

describe('TurnInformation component', () => {
  const mockSetCurrentTurn = vi.fn();
  const mockSocket = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };

  const mockPlayers = [
    { id: 1, name: 'Jugador 1' },
    { id: 2, name: 'Jugador 2' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useGameContext.mockReturnValue({
      currentTurn: 1,
      setCurrentTurn: mockSetCurrentTurn,
    });
    useSocketContext.mockReturnValue({
      socket: mockSocket,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render player count and current player name', () => {
    const mockPlayers = [
        { id: 1, name: 'Jugador 1' },
        { id: 2, name: 'Jugador 2' }
    ];

    render(<TurnInformation players={mockPlayers} activeGameId="123" />);

    expect(screen.getByText((content, element) => {
        return content.includes('Cantidad de jugadores en la partida:') && 
               element.textContent.includes('2');
    })).toBeInTheDocument();

    expect(screen.getByText((content, element) => {
        return content.includes('Es el turno de:') && 
               element.textContent.includes('Jugador 1');
    })).toBeInTheDocument();
});


  it('should show loading text when there is no current player', () => {
    useGameContext.mockReturnValue({
      currentTurn: null,
      setCurrentTurn: mockSetCurrentTurn,
    });

    render(<TurnInformation players={mockPlayers} activeGameId="123" />);

    expect(screen.getByText((content, element) => {
        return content.includes('Es el turno de:') && 
               element.textContent.includes('Cargando turno...');
    })).toBeInTheDocument();
    
  });

  it('should call fetchTurnInfo on NEXT_TURN event and update currentTurn', async () => {
    const mockFetchResponse = {
      current_player_id: 2,
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFetchResponse),
      })
    );

    render(<TurnInformation players={mockPlayers} activeGameId="123" />);

    const mockEvent = {
      data: JSON.stringify({
        type: '123:NEXT_TURN',
      }),
    };

    // Simula el evento de WebSocket
    const handleNextTurnEvent = mockSocket.addEventListener.mock.calls[0][1];
    handleNextTurnEvent(mockEvent);

    // Espera a que se actualice el turno
    await waitFor(() => {
      expect(mockSetCurrentTurn).toHaveBeenCalledWith(2);
    });

    // Verifica que fetch fue llamado con la URL correcta
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/game_state/123/current_turn',
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
  });

  it('should remove event listener on cleanup', () => {
    const { unmount } = render(<TurnInformation players={mockPlayers} activeGameId="123" />);

    // Llamada inicial para agregar el listener
    expect(mockSocket.addEventListener).toHaveBeenCalled();

    // Desmonta el componente para ejecutar el cleanup
    unmount();

    // Verifica que se haya removido el listener
    expect(mockSocket.removeEventListener).toHaveBeenCalled();
  });
});
