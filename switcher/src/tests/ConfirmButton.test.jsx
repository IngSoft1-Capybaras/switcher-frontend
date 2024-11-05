import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, expect, it, describe, afterEach } from 'vitest';
import ConfirmButton from '@/components/ui/ConfirmButton';
import { playMovementCard } from '@/services/services';
import { useSocketContext } from '@/context/SocketContext';
import { useGameContext } from '@/context/GameContext';

vi.mock('@/services/services', () => ({
  playMovementCard: vi.fn(),
}));

const mockSocketSend = vi.fn();

vi.mock('@/context/SocketContext', () => ({
  useSocketContext: () => ({
    socket: { send: mockSocketSend }
  })
}));

// Mock para el contexto de Game
vi.mock("@/context/GameContext", () => ({
  useGameContext: () => ({
      playerId: "player1",
      username: "Player1",
  })
}));

describe('ConfirmButton Component', () => {
  const mockResetMov = vi.fn();
  const mockSetLoading = vi.fn();



  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test para verificar que el botón se renderiza correctamente
  it('should enable the button when it is the current player\'s turn and there are selected card and positions', () => {
    render(
      <ConfirmButton
        gameId="game1"
        selectedCard={{ id: 'card1' }}
        selectedPositions={['A1', 'B2']}
        playerId="player1"
        currentTurn="player1"
        resetMov={mockResetMov}
        setLoading={mockSetLoading}
      />
    );

    const button = screen.getByTestId('claimButtonTestId');
    expect(button).toBeEnabled();
  });

  // Test para verificar que el botón se deshabilita cuando no es el turno del jugador
  it('should disable the button when it is not the current player\'s turn', () => {
    render(
      <ConfirmButton
        gameId="game1"
        selectedCard={{ id: 'card1' }}
        selectedPositions={['A1', 'B2']}
        playerId="player1"
        currentTurn="player2"
        resetMov={mockResetMov}
        setLoading={mockSetLoading}
      />
    );

    const button = screen.getByTestId('claimButtonTestId');
    expect(button).toBeDisabled();
  });

  // Test para verificar que se muestra un mensaje de error cuando falta información
  it('should not display an error message when information is missing', async () => {
      render(
          <ConfirmButton
              gameId="game1"
              selectedCard={null}
              selectedPositions={[]}
              playerId="player1"
              currentTurn="player1"
              resetMov={mockResetMov}
              setLoading={mockSetLoading}
          />
      );
      const button = screen.getByTestId('claimButtonTestId');
      fireEvent.click(button);
      expect(screen.queryByText(/Error al confirmar el movimiento: falta información necesaria/i)).not.toBeInTheDocument();
  });

  // Test para verificar que se llama a playMovementCard con los parámetros correctos al hacer clic en el botón
  it('should call playMovementCard with correct parameters on button click', async () => {
    // Asegúro de que `playMovementCard` devuelva una promesa.
    playMovementCard.mockResolvedValueOnce({ success: true }); // Mockea la respuesta

    render(
      <ConfirmButton
        gameId="game1"
        selectedCard={{ id: 'card1' }}
        selectedPositions={['A1', 'B2']}
        playerId="player1"
        currentTurn="player1"
        resetMov={mockResetMov}
        setLoading={mockSetLoading}
      />
    );

    const button = screen.getByTestId('claimButtonTestId');
    fireEvent.click(button);

    await waitFor(() => {
      expect(playMovementCard).toHaveBeenCalledWith({
        gameId: 'game1',
        playerId: 'player1',
        cardId: 'card1',
        posFrom: 'A1',
        posTo: 'B2',
      });
    });
  });

  it("should send a socket message when confirming a move", async () => {
    // Configuramos el mock de playMovementCard para que resuelva exitosamente
    playMovementCard.mockResolvedValueOnce({ success: true });

    render(<ConfirmButton
      gameId="game1"
        selectedCard={{ id: 'card1' }}
        selectedPositions={['A1', 'B2']}
        playerId="player1"
        currentTurn="player1"
        resetMov={mockResetMov}
        setLoading={mockSetLoading}
     />);

    const button = screen.getByTestId("claimButtonTestId");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSocketSend).toHaveBeenCalledWith(
        JSON.stringify({
          type: "game1:CHAT_MESSAGE",
          message: "Player1 realizo un movimiento."
        })
      );
    });

    // Verificamos que también se llamó a resetMov
    expect(mockResetMov).toHaveBeenCalled();
  });

});
