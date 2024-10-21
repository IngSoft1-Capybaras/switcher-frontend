import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, expect, it, describe, afterEach } from 'vitest';
import ConfirmButton from '@/components/ui/ConfirmButton';
import { playMovementCard } from '@/services/services';

vi.mock('@/services/services', () => ({
  playMovementCard: vi.fn(),
}));

describe('ConfirmButton Component', () => {
  const mockResetMov = vi.fn();
  const mockSetLoading = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

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

  it('should call playMovementCard with correct parameters on button click', async () => {
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
});
