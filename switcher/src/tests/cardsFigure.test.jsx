import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, afterEach, expect } from 'vitest';
import CardsFigure from '../components/ui/CardsFigure'; // Ajusta la ruta según tu estructura
import { getDeckFigure } from '@/services/services';

// Mock de la función getDeckFigure
vi.mock('@/services/services', () => ({
  getDeckFigure: vi.fn(),
}));

describe('CardsFigure', () => {
  const gameId = 'testGameId';
  const playerId = 'testPlayerId';
  const mockFigureCards = [
    {
      id: 1,
      type: "FIGE01",
      show: false,
      difficulty: "EASY",
      player_id: 1,
      game_id: 101,
    },
    {
      id: 2,
      type: "FIGE02",
      show: true,
      difficulty: "HARD",
      player_id: 1,
      game_id: 101,
    },
    {
      id: 3,
      type: "FIGE03",
      show: true,
      difficulty: "EASY",
      player_id: 1,
      game_id: 101,
    },
    {
      id: 4,
      type: "FIGE04",
      show: true,
      difficulty: "EASY",
      player_id: 1,
      game_id: 101,
    },
    {
      id: 5,
      type: "FIGE05",
      show: true,
      difficulty: "EASY",
      player_id: 1,
      game_id: 101,
    },
    {
      id: 6,
      type: "FIGE06",
      show: true,
      difficulty: "HARD",
      player_id: 1,
      game_id: 101,
    },
  ];

  afterEach(() => {
    vi.clearAllMocks(); // Limpia los mocks después de cada test
  });

  // Test para verificar que se renderiza el estado de carga inicialmente
  test('renders loading state initially', () => {
    getDeckFigure.mockReturnValue(new Promise(() => {})); // Simula una llamada en espera

    render(<CardsFigure gameId={gameId} playerId={playerId} />);
    
    // Verifica que el estado de carga se muestra inicialmente
    expect(screen.getByText(/Cargando cartas de movimiento.../i)).toBeInTheDocument();
  });

  // Test para verificar que no se renderiza el mensaje de error cuando falla la obtención
  test('does not render error message when fetching fails', async () => {
    // Simula un error en la obtención de las cartas
    getDeckFigure.mockRejectedValue(new Error('Error al obtener las cartas de figura'));
  
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // Mock de console.error
  
    render(<CardsFigure gameId={gameId} playerId={playerId} />);
  
    // Espera un tiempo para asegurarte de que el efecto se ejecute
    await waitFor(() => {
      // Verifica que no haya mensaje de error en la interfaz
      expect(screen.queryByText(/Error al obtener las cartas de figura/i)).not.toBeInTheDocument();
    });
  
    // Ahora verifica que el error se registró en la consola
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error al obtener las cartas de figura'),
      expect.any(Error) // Verifica que también se pase un objeto de error
    );
  
    consoleErrorSpy.mockRestore(); // Limpia el spy después de la prueba
  });
  
  // Test para verificar que se renderizan las cartas de figura cuando se obtienen correctamente
  test('renders figure cards when fetched successfully', async () => {
    getDeckFigure.mockResolvedValue(mockFigureCards); // Simula una respuesta exitosa
  
    render(<CardsFigure gameId={gameId} playerId={playerId} />);
  
    await waitFor(() => {
      // Verifica que se rendericen las imágenes de las cartas que se muestran
      expect(screen.getAllByRole('img')).toHaveLength(3); // Solo esperamos 3 cartas
    });
  
    // Verifica que el texto de la dificultad se renderiza para cada carta
    mockFigureCards.slice(0, 3).forEach((card) => {
      const elements = screen.getAllByText(card.difficulty);
      expect(elements.length).toBeGreaterThan(0); // Asegúrate de que al menos un elemento está presente
      expect(elements[0]).toBeInTheDocument(); // Verifica que el primer elemento esté en el documento

      if (!card.show) { // Verifica si está bloqueada
        expect(screen.getByText(/Bloqueada/i)).toBeInTheDocument(); // Asegúrate de que se muestra "Bloqueada"
      }
    });
  });
});
