import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import CardsMovement from '../components/ui/CardsMovement';
import { getDeckMovement } from '@/services/services'; 

// Mock de la función getDeckMovement
vi.mock('@/services/services', () => ({
  getDeckMovement: vi.fn(),
}));

// Mock del hook useUpdateCardsMovementSocket
vi.mock('@/components/hooks/used-update-cards_movement-socket', () => ({
  useUpdateCardsMovementSocket: vi.fn(),
}));

describe('CardsMovement Component', () => {
  const mockGameId = '1';
  const mockPlayer = { id: '1', name: 'Player 1' };
  const mockCards = [
    { id: '1', type: 'LINEAL_CONT', used: false },
    { id: '2', type: 'DIAGONAL_CONT', used: false },
    { id: '3', type: 'EN_L_DERECHA', used: true }, // Carta marcada como usada
  ];
  const mocksetSelectedMovementCard = vi.fn();
  const mockCurrentTurn = mockPlayer.id;
  const mockResetFigureSelection = vi.fn();

  // Test para verificar el estado de carga inicial
  it('renders loading state initially', async () => {
    // Mock de la promesa pendiente
    getDeckMovement.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <CardsMovement 
        gameId={mockGameId} 
        playerId={mockPlayer.id} 
        setSelectedMovementCard={mocksetSelectedMovementCard} 
        currentTurn={mockCurrentTurn}
        resetFigureSelection={mockResetFigureSelection}
      />
    );

    // Verifica que se muestre el mensaje de carga
    expect(screen.getByText('Cargando cartas de movimiento...')).toBeInTheDocument();

    // Resuelve la promesa del mock con las cartas mockeadas
    getDeckMovement.mockResolvedValueOnce(mockCards);
  });

  // Test para verificar que las cartas se rendericen correctamente
  it('renders movement cards correctly', async () => {
    // Configura el mock para devolver las cartas mockeadas
    getDeckMovement.mockResolvedValueOnce(mockCards);

    render(
      <CardsMovement 
        gameId={mockGameId} 
        playerId={mockPlayer.id} 
        setSelectedMovementCard={mocksetSelectedMovementCard} 
        currentTurn={mockCurrentTurn} 
        resetFigureSelection={mockResetFigureSelection}
      />
    );
    
    // Espera hasta que se rendericen las cartas no usadas
    await waitFor(() => {
      expect(screen.getAllByTestId('notUsedMovementCardId')).toHaveLength(2); // Verifica solo las cartas no usadas
      expect(screen.getByTestId('UsedMovementCardId')).toBeInTheDocument(); // Verifica que la carta usada también está presente
    });
  });

  // Test para verificar la selección de cartas
  it('allows selecting a card if it is the current player\'s turn and the card is not used', async () => {
    getDeckMovement.mockResolvedValueOnce(mockCards);

    render(
      <CardsMovement 
        gameId={mockGameId} 
        playerId={mockPlayer.id} 
        setSelectedMovementCard={mocksetSelectedMovementCard} 
        currentTurn={mockCurrentTurn}
        resetFigureSelection={mockResetFigureSelection}
      />
    );

    // Espera hasta que se rendericen las cartas
    await waitFor(() => {
      expect(screen.getAllByTestId('notUsedMovementCardId')).toHaveLength(2);
    });

    const firstCard = screen.getAllByTestId('notUsedMovementCardId')[0];

    // Simula el clic en la primera carta
    fireEvent.click(firstCard);

    // Verifica que la función setSelectedMovementCard fue llamada con la carta correcta
    expect(mocksetSelectedMovementCard).toHaveBeenCalledWith(mockCards[0]);
  });

  // Test para verificar que no se puede seleccionar una carta si no es el turno del jugador
  it('does not allow selecting a card if it is not the current player\'s turn', async () => {
    const mocksetSelectedMovementCard = vi.fn();
  
    // Configura el mock para devolver las cartas mockeadas
    getDeckMovement.mockResolvedValueOnce(mockCards);
  
    // Renderiza el componente y pasa una función mock para setSelectedMovementCard
    render(
      <CardsMovement
        gameId={mockGameId}
        playerId={mockPlayer.id}
        currentTurn={'2'} // No es el turno del jugador
        setSelectedMovementCard={mocksetSelectedMovementCard}
        resetFigureSelection={mockResetFigureSelection}
      />
    );
  
    // Espera hasta que las cartas se rendericen
    await waitFor(() => {
      expect(screen.getAllByTestId('notUsedMovementCardId')).toHaveLength(2);
    });
  
    // Obtiene todas las cartas no usadas
    const firstCard = screen.getAllByTestId('notUsedMovementCardId')[0];
  
    // Simula el click en la primera carta no usada
    fireEvent.click(firstCard);
  
    // Verifica que setSelectedMovementCard no fue llamado ya que no es el turno del jugador
    expect(mocksetSelectedMovementCard).not.toHaveBeenCalled();
  });

  // Test para verificar que no se puede seleccionar una carta si no es el turno del jugador
  it('does not allow selecting a card if it is not the current player\'s turn', async () => {
    const mocksetSelectedMovementCard = vi.fn();
  
    // Configura el mock para devolver las cartas mockeadas
    getDeckMovement.mockResolvedValueOnce(mockCards);
  
    // Renderiza el componente y pasa una función mock para setSelectedMovementCard
    render(
      <CardsMovement
        gameId={mockGameId}
        playerId={mockPlayer.id}
        currentTurn={'2'} // No es el turno del jugador
        setSelectedMovementCard={mocksetSelectedMovementCard}
        resetFigureSelection={mockResetFigureSelection}
      />
    );
  
    // Espera hasta que las cartas se rendericen
    await waitFor(() => {
      expect(screen.getAllByTestId('notUsedMovementCardId')).toHaveLength(2);
    });
  
    // Obtiene todas las cartas con el data-testid 'notUsedMovementCardId'
    const cards = screen.getAllByTestId('notUsedMovementCardId');
  
    // Simula el click en la primera carta no usada
    fireEvent.click(cards[0]);
  
    // Verifica que setSelectedMovementCard no fue llamado ya que no es el turno del jugador
    expect(mocksetSelectedMovementCard).not.toHaveBeenCalled();
  });
});
