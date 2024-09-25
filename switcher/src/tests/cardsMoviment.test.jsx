import { render, screen, waitFor } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import CardsMoviment from '../components/ui/cardsMoviment'; // Ajusta la ruta según tu estructura de carpetas
import { getDeckMovement } from '@/services/services'; // Asegúrate de que esta importación coincida con tu estructura

// Mock de la función getDeckMovement
vi.mock('@/services/services', () => ({
  getDeckMovement: vi.fn(), // Mockea la función correctamente
}));

describe('CardsMoviment Component', () => {
  const mockGameId = '1';
  const mockPlayer = { id: '1', name: 'Player 1' }; // Mock del jugador para la prueba
  const mockCards = [
    { id: '1', type: 'linealContiguo', used: false },
    { id: '2', type: 'diagonalContiguo', used: false },
    { id: '3', type: 'cruceEnLDerecha', used: true }, // Carta marcada como usada
  ];

  // Test para verificar el estado de carga inicial
  it('renders loading state initially', async () => {
    // Mock de la promesa pendiente
    getDeckMovement.mockImplementationOnce(() => new Promise(() => {}));

    render(<CardsMoviment gameId={mockGameId} playerId={mockPlayer.id} />);

    // Verifica que se muestre el mensaje de carga
    expect(screen.getByText('Cargando cartas de movimiento...')).toBeInTheDocument();

    // Resuelve la promesa del mock con las cartas mockeadas
    getDeckMovement.mockResolvedValueOnce(mockCards);
  });

  // Test para verificar que las cartas se rendericen correctamente
  it('renders movement cards correctly', async () => {
    // Configura el mock para devolver las cartas mockeadas
    getDeckMovement.mockResolvedValueOnce(mockCards);

    render(<CardsMoviment gameId={mockGameId} playerId={mockPlayer.id} />);
    
    // Espera hasta que se rendericen las cartas no usadas
    await waitFor(() => {
      expect(screen.getAllByAltText('Carta de movimiento')).toHaveLength(2); // Verifica solo las cartas no usadas
    });
  });

  // // Test para verificar el manejo de errores
  // it('handles error when fetching movement cards fails', async () => {
  //   // Mock que simula una llamada fallida con un error
  //   getDeckMovement.mockRejectedValueOnce(new Error('Error al obtener las cartas de movimiento'));

  //   render(<CardsMoviment gameId={mockGameId} playerId={mockPlayer.id} />);

  //   // Usa una función para hacer la coincidencia de texto más flexible
  //   await waitFor(() => {
  //     expect(screen.getByText((content) => content.includes('Error al obtener las cartas de movimiento'))).toBeInTheDocument();
  //   });
  // });
});
