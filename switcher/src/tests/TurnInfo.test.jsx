import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TurnInformation from '@/components/ui/TurnInfo';
import { useSocketContext } from "@/context/SocketContext"; 
import { fetchTurnInfo } from "../services/services";

vi.mock('@/context/SocketContext', () => ({
  useSocketContext: vi.fn(),
}));

// Mock the entire services module
vi.mock("../services/services" ,() => ({
  fetchTurnInfo: vi.fn(),
}));

describe('TurnInformation component', () => {
  const mockSetCurrentTurn = vi.fn();
  const players = [
      { id: 1, name: 'Jugador 1' },
      { id: 2, name: 'Jugador 2' },
  ];

  const mockSocket = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
};

beforeEach(() => {
  useSocketContext.mockReturnValue({ socket: mockSocket });
  fetchTurnInfo.mockResolvedValue({ current_player_id: 2 });
});

  afterEach(() => {
      vi.clearAllMocks();
  });

  it('should render player count and current player name', () => {
      render(<TurnInformation players={players} activeGameId="123" currentTurn={1} setCurrentTurn={mockSetCurrentTurn} />);

      expect(screen.getByText(/Jugadores en la partida:/)).toBeInTheDocument();
      expect(screen.getByText(/2/)).toBeInTheDocument();
      expect(screen.getByText(/Turno de:/)).toBeInTheDocument();
      expect(screen.getByText(/Jugador 1/)).toBeInTheDocument();
  });

  it('should show loading text when there is no current player', () => {
    render(<TurnInformation players={players} activeGameId="123" currentTurn={null} setCurrentTurn={mockSetCurrentTurn} />);

    expect(screen.getByText((content, element) => {
      return content.includes('Turno de:') &&
             element.textContent.includes('Cargando...');
    })).toBeInTheDocument();
});

  it('should call fetchTurnInfo on NEXT_TURN event and update currentTurn', async () => {
      const mockSocket = {
          addEventListener: vi.fn((event, callback) => {
              // Simulate the NEXT_TURN event
              if (event === 'message') {
                  callback({ data: JSON.stringify({ type: '123:NEXT_TURN' }) });
              }
          }),
          removeEventListener: vi.fn(),
      };

      useSocketContext.mockReturnValue({ socket: mockSocket });

      render(<TurnInformation players={players} activeGameId="123" currentTurn={1} setCurrentTurn={mockSetCurrentTurn} />);

      await waitFor(() => {
          expect(fetchTurnInfo).toHaveBeenCalledWith("123");
          expect(mockSetCurrentTurn).toHaveBeenCalledWith(2);
      });
  });

    it('should remove event listener on cleanup', () => {
      const { unmount } = render(<TurnInformation players={players} activeGameId="123" currentTurn={1} setCurrentTurn={mockSetCurrentTurn} />);

      // Llamada inicial para agregar el listener
      expect(mockSocket.addEventListener).toHaveBeenCalled();

      // Desmonta el componente para ejecutar el cleanup
      unmount();

      // Verifica que se haya removido el listener
      expect(mockSocket.removeEventListener).toHaveBeenCalled();
  });
});
