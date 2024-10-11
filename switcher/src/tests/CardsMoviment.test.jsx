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
  const mockOnSelectCard = vi.fn();
  const mockCurrentTurn = mockPlayer.id;

  // Test para verificar el estado de carga inicial
  it('renders loading state initially', async () => {
    // Mock de la promesa pendiente
    getDeckMovement.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <CardsMovement 
        gameId={mockGameId} 
        playerId={mockPlayer.id} 
        onSelectCard={mockOnSelectCard} 
        currentTurn={mockCurrentTurn} 
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
        onSelectCard={mockOnSelectCard} 
        currentTurn={mockCurrentTurn} 
      />
    );
    
    // Espera hasta que se rendericen las cartas no usadas
    await waitFor(() => {
      expect(screen.getAllByAltText('Carta de movimiento')).toHaveLength(2); // Verifica solo las cartas no usadas
    });
  });

  // Test para verificar la selección de cartas
  it('allows selecting a card if it is the current player\'s turn and the card is not used', async () => {
    getDeckMovement.mockResolvedValueOnce(mockCards);

    render(
      <CardsMovement 
        gameId={mockGameId} 
        playerId={mockPlayer.id} 
        onSelectCard={mockOnSelectCard} 
        currentTurn={mockCurrentTurn} 
      />
    );

    // Espera hasta que se rendericen las cartas
    await waitFor(() => {
      expect(screen.getAllByAltText('Carta de movimiento')).toHaveLength(2);
    });

    const firstCard = screen.getAllByAltText('Carta de movimiento')[0];

    // Simula el clic en la primera carta
    fireEvent.click(firstCard);

    // Verifica que la función onSelectCard fue llamada con la carta correcta
    expect(mockOnSelectCard).toHaveBeenCalledWith(mockCards[0]);
  });

  // Test para verificar que no se puede seleccionar una carta si no es el turno del jugador
  it('does not allow selecting a card if it is not the current player\'s turn', async () => {
    const mockOnSelectCard = vi.fn();
  
    // Configura el mock para devolver las cartas mockeadas
    getDeckMovement.mockResolvedValueOnce(mockCards);
  
    // Renderiza el componente y pasa una función mock para onSelectCard
    render(
      <CardsMovement
        gameId={mockGameId}
        playerId={mockPlayer.id}
        currentTurn={'2'} // No es el turno del jugador
        onSelectCard={mockOnSelectCard}
      />
    );
  
    // Espera hasta que las cartas se rendericen
    await waitFor(() => {
      expect(screen.getAllByAltText('Carta de movimiento')).toHaveLength(2);
    });
  
    // Obtiene todas las cartas con el alt text 'Carta de movimiento'
    const cards = screen.getAllByAltText('Carta de movimiento');
  
    // Simula el click en la primera carta no usada
    fireEvent.click(cards[0]); // Cambia aquí para seleccionar la carta específica
  
    // Verifica que onSelectCard no fue llamado ya que no es el turno del jugador
    expect(mockOnSelectCard).not.toHaveBeenCalled();
  });
  
  
  // it('does not allow selecting a card if it is not the current player\'s turn', async () => {
  //   getDeckMovement.mockResolvedValueOnce(mockCards);

  //   render(
  //     <CardsMovement 
  //       gameId={mockGameId} 
  //       playerId={mockPlayer.id} 
  //       onSelectCard={mockOnSelectCard} 
  //       currentTurn={'2'} // Simula que el turno es de otro jugador
  //     />
  //   );

  //   // Espera hasta que se rendericen las cartas
  //   await waitFor(() => {
  //     expect(screen.getAllByAltText('Carta de movimiento')).toHaveLength(2);
  //   });

  //   const firstCard = screen.getAllByAltText('Carta de movimiento')[0];

  //   // Simula el clic en la primera carta
  //   fireEvent.click(firstCard);

  //   // Verifica que onSelectCard no fue llamado ya que no es el turno del jugador
  //   expect(mockOnSelectCard).not.toHaveBeenCalled();
  // });
});
