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
  const mockPlayerId = '1';
  const mockCards = [
    { id: '1', type: 'LINEAL_CONT', used: false },
    { id: '2', type: 'DIAGONAL_CONT', used: false },
    { id: '3', type: 'EN_L_DERECHA', used: true },
  ];


  it('renders loading state initially', async () => {
    getDeckMovement.mockImplementationOnce(() => new Promise(() => {}));
    render(<CardsMovement gameId={mockGameId} playerId={mockPlayerId} movementCards={[]} setMovementCards={vi.fn()} />);
    expect(screen.getByText('Cargando cartas de movimiento...')).toBeInTheDocument();
  });


  it('renders movement cards correctly', async () => {
    getDeckMovement.mockResolvedValueOnce(mockCards);

    const setMovementCards = vi.fn();


    render(<CardsMovement gameId={mockGameId} playerId={mockPlayerId} movementCards={mockCards} setMovementCards={setMovementCards} />);

    await waitFor(() => {
      expect(setMovementCards).not.toHaveBeenCalledWith(mockCards);
    });


    await waitFor(() => {
      expect(screen.getAllByAltText('Carta de movimiento')).toHaveLength(2);
      expect(screen.getByTestId('UsedMovementCardId')).toBeInTheDocument();
    });

    expect(screen.getAllByTestId('notUsedMovementCardId')).toHaveLength(2);
  });

  it('renders error message on fetch failure', async () => {
    getDeckMovement.mockRejectedValueOnce(new Error('Fetch error'));

    const setMovementCards = vi.fn();

    render(<CardsMovement gameId={mockGameId} playerId={mockPlayerId} movementCards={[]} setMovementCards={setMovementCards} />);

    await waitFor(() => {
      expect(screen.getByText('Error al obtener las cartas de movimiento')).toBeInTheDocument();
    });
  });
});


