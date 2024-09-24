import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ActiveGame from '@/pages/ActiveGame'; // Ajusta la ruta según tu estructura
import * as services from '@/services/services';

// Mock de las funciones de servicio
const getPlayersMock = jest.fn();
const getDeckMovementMock = jest.fn();
const getDeckFigureMock = jest.fn();

jest.mock('../services/services', () => ({
  getPlayers: getPlayersMock,
  getDeckMovement: getDeckMovementMock,
  getDeckFigure: getDeckFigureMock,
}));

const mockPlayers = [
  {
    id: 1,
    name: "Jugador 1",
    turn: true,
    figure_cards: [{ id: 1, type: "tipo1", show: true, difficulty: "EASY" }],
    movement_cards: [{ id: 1, type: "movimiento1", description: "Descripción", used: false }],
  },
  {
    id: 2,
    name: "Jugador 2",
    turn: false,
    figure_cards: [{ id: 2, type: "tipo2", show: true, difficulty: "MEDIUM" }],
    movement_cards: [{ id: 2, type: "movimiento2", description: "Descripción", used: false }],
  },
];

describe('ActiveGame Component', () => {
  beforeEach(() => {
    // Configurar el mock para devolver jugadores
    getPlayersMock.mockResolvedValue(mockPlayers);
    getDeckMovementMock.mockResolvedValue(mockPlayers[0].movement_cards);
    getDeckFigureMock.mockResolvedValue(mockPlayers[0].figure_cards);
  });

  it('debería renderizar "Loading..." mientras se obtienen los datos', () => {
    render(
      <MemoryRouter initialEntries={['/game/1']}>
        <ActiveGame />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('debería mostrar el tablero y el panel de jugadores después de cargar los datos', async () => {
    render(
      <MemoryRouter initialEntries={['/game/1']}>
        <ActiveGame />
      </MemoryRouter>
    );

    // Esperar a que los jugadores se carguen
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Verificar que el tablero y el panel de jugadores se rendericen
    expect(screen.getByRole('heading', { name: /Cartas de Movimientos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Tarjetas de Figuras/i })).toBeInTheDocument();

    // Verificar que los jugadores se muestren correctamente
    expect(screen.getByText("Jugador 2")).toBeInTheDocument();
  });

  it('debería mostrar las cartas del jugador de turno', async () => {
    render(
      <MemoryRouter initialEntries={['/game/1']}>
        <ActiveGame />
      </MemoryRouter>
    );

    // Esperar a que los jugadores se carguen
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Verificar que las cartas del jugador de turno se muestren
    expect(screen.getByText(/tipo1/i)).toBeInTheDocument(); // tipo de carta de figura
    expect(screen.getByText(/movimiento1/i)).toBeInTheDocument(); // tipo de carta de movimiento
  });
});
