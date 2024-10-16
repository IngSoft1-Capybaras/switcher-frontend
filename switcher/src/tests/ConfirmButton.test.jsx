import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, expect, it, describe, afterEach } from 'vitest'; // Importa vi de Vitest
import ConfirmButton from '@/components/ui/ConfirmButton'; // Asegúrate de que esta importación sea correcta.
import { playMovementCard } from '@/services/services'; // Importa la función

vi.mock('@/services/services', () => ({
  playMovementCard: vi.fn(), // Mockea la función playMovementCard
}));

describe('ConfirmButton Component', () => {
  const mockResetMov = vi.fn(); // Mock para la función resetMov

  afterEach(() => {
    vi.clearAllMocks(); // Limpia los mocks después de cada prueba
  });

  // Test para verificar que el botón esté habilitado cuando es el turno del jugador actual, hay una carta y dos posiciones seleccionadas
  it('should enable the button when it is the current player\'s turn and there are selected card and positions', () => {
    render(
      <ConfirmButton 
        gameId="game1"
        selectedCard={{ id: 'card1' }}
        selectedPositions={['A1', 'B2']}
        playerId="player1"
        currentTurn="player1"
        resetMov={mockResetMov}
      />
    );

    const button = screen.getByRole('button', { name: /Hacer movimiento/i });
    expect(button).toBeEnabled(); // Verifica que el botón esté habilitado
  });

    // Test para verificar que el botón esté deshabilitado cuando no es el turno del jugador actual
  it('should disable the button when it is not the current player\'s turn', () => {
    render(
      <ConfirmButton 
        gameId="game1"
        selectedCard={{ id: 'card1' }}
        selectedPositions={['A1', 'B2']}
        playerId="player1"
        currentTurn="player2"
        resetMov={mockResetMov}
      />
    );

    const button = screen.getByRole('button', { name: /Hacer movimiento/i });
    expect(button).toBeDisabled(); // Verifica que el botón esté deshabilitado
  });

    // Test para verificar que el botón esté deshabilitado cuando no hay una carta seleccionada
    it('should not display an error message when information is missing', async () => {
        render(
            <ConfirmButton 
                gameId="game1"
                selectedCard={null} // Sin carta seleccionada
                selectedPositions={[]} // Sin posiciones seleccionadas
                playerId="player1"
                currentTurn="player1"
                resetMov={mockResetMov}
            />
        );
    
        const button = screen.getByRole('button', { name: /Hacer movimiento/i });
        fireEvent.click(button); // Simula el clic en el botón
    
        // Verifica que el mensaje de error no aparezca
        expect(screen.queryByText(/Error al confirmar el movimiento: falta información necesaria/i)).not.toBeInTheDocument();
    });
      
    // Test para verificar que se llame a playMovementCard con los parámetros correctos al hacer clic en el botón
  it('should call playMovementCard with correct parameters on button click', async () => {
    render(
      <ConfirmButton 
        gameId="game1"
        selectedCard={{ id: 'card1' }}
        selectedPositions={['A1', 'B2']}
        playerId="player1"
        currentTurn="player1"
        resetMov={mockResetMov}
      />
    );

    const button = screen.getByRole('button', { name: /Hacer movimiento/i });
    fireEvent.click(button); // Simula el clic en el botón

    await waitFor(() => {
      expect(playMovementCard).toHaveBeenCalledWith({
        gameId: 'game1',
        playerId: 'player1',
        cardId: 'card1',
        posFrom: 'A1',
        posTo: 'B2',
      }); // Verifica que playMovementCard fue llamado con los parámetros correctos
    });
  });
});
