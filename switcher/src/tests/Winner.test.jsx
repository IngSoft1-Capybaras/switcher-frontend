import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import Winner from '../pages/Winner';
import { useSocketContext } from '@/context/SocketContext'; // Importar el hook
import { useGameContext } from '../context/GameContext'; // Importar el hook
import { MemoryRouter, useNavigate } from 'react-router-dom'; // Importa useNavigate

// Mock de imágenes
vi.mock('@/assets/logo_switcher.png', () => ({
  default: 'mocked-logo.png',
}));

vi.mock('../assets/images/analisis.png', () => ({
  default: 'mocked-analisis.png',
}));

vi.mock('../assets/images/aterrador.png', () => ({
  default: 'mocked-aterrador.png',
}));

// Mockear el hook useSocketContext
vi.mock('@/context/SocketContext', () => ({
  useSocketContext: vi.fn(),
}));

// Mockear el hook useGameContext
vi.mock('../context/GameContext', () => ({
  useGameContext: vi.fn(),
}));

// Mock parcial de react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal(); // Importa la versión original
  return {
    ...actual, // Retorna todo lo original
    useNavigate: vi.fn(), // Mockea useNavigate
  };
});

describe('Winner Component', () => {
  const mockGameContext = {
    winnerName: 'Game 1',
    playerName: 'Jugador 2',
  };

  const mockSocketContext = {
    socket: {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  };

  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    vi.clearAllMocks();

    // Simular el uso de los hooks
    useGameContext.mockReturnValue(mockGameContext);
    useSocketContext.mockReturnValue(mockSocketContext);
  });

  it('should render winner component correctly', () => {
    render(
      <MemoryRouter>
        <Winner />
      </MemoryRouter>
    );

    // Verifica que el texto del ganador se renderiza correctamente
    expect(screen.getByText(/Winner/i)).toBeInTheDocument();
    expect(screen.getByText(/Partida: Game 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Ganador: Jugador 2/i)).toBeInTheDocument();
  });

  it('should navigate to /games when button is clicked', () => {
    const mockNavigate = vi.fn(); // Mock de useNavigate

    // Asegúrate de que useNavigate devuelve el mock cuando se llama
    useNavigate.mockReturnValue(mockNavigate);

    // Renderiza el componente
    render(
      <MemoryRouter>
        <Winner />
      </MemoryRouter>
    );

    // Simular clic en el botón
    fireEvent.click(screen.getByRole('button', { name: /Volver al inicio/i }));

    // Verificar que el mockNavigate fue llamado con la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/games');
  });
});
