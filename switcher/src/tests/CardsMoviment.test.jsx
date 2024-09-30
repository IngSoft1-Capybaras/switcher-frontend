import { render, screen, waitFor } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import CardsMovement from '../components/ui/CardsMovement';
import { getDeckMovement } from '@/services/services'; 

// Mock de la función getDeckMovement
vi.mock('@/services/services', () => ({
  getDeckMovement: vi.fn(), 
}));

describe('CardsMovement Component', () => {
  const mockGameId = '1';
  const mockPlayer = { id: '1', name: 'Player 1' }; // Mock del jugador para la prueba
  const mockCards = [
    { id: '1', type: 'LINEAL_CONT', used: false },
    { id: '2', type: 'DIAGONAL_CONT', used: false },
    { id: '3', type: 'EN_L_DERECHA', used: true }, // Carta marcada como usada
  ];

  // Test para verificar el estado de carga inicial
  it('renders loading state initially', async () => {
    // Mock de la promesa pendiente
    getDeckMovement.mockImplementationOnce(() => new Promise(() => {}));

    render(<CardsMovement gameId={mockGameId} playerId={mockPlayer.id} />);

    // Verifica que se muestre el mensaje de carga
    expect(screen.getByText('Cargando cartas de movimiento...')).toBeInTheDocument();

    // Resuelve la promesa del mock con las cartas mockeadas
    getDeckMovement.mockResolvedValueOnce(mockCards);
  });

  // Test para verificar que las cartas se rendericen correctamente
  it('renders movement cards correctly', async () => {
    // Configura el mock para devolver las cartas mockeadas
    getDeckMovement.mockResolvedValueOnce(mockCards);

    render(<CardsMovement gameId={mockGameId} playerId={mockPlayer.id} />);
    
    // Espera hasta que se rendericen las cartas no usadas
    await waitFor(() => {
      expect(screen.getAllByAltText('Carta de movimiento')).toHaveLength(2); // Verifica solo las cartas no usadas
    });
  });
});
