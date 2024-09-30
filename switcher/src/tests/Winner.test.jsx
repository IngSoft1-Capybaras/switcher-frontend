import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import Winner from '../pages/Winner';
import { useGameContext } from '../context/GameContext';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mock de imágenes
vi.mock('@/assets/logo_switcher.png', () => ({
  default: 'mocked-logo.png',
}));

vi.mock('../assets/images/fige01.svg', () => ({
  default: 'mocked-fige01.png',
}));

vi.mock('../assets/images/fige04.svg', () => ({
  default: 'mocked-fige04.png',
}));

vi.mock('../assets/images/cruceDiagonalContiguo.svg', () => ({
  default: 'mocked-cruceDiagonalContiguo.svg',
}));

vi.mock('../assets/images/cruceEnLIzquierda.svg', () => ({
  default: 'mocked-cruceEnLIzquierda.svg',
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
    gameName: 'Game 1', // Corregir a gameName según el código
    winnerName: 'Jugador 2', // Corregir a winnerName según el código
  };

  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    vi.clearAllMocks();

    // Simular el uso de los hooks
    useGameContext.mockReturnValue(mockGameContext);
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

    // Verifica que las imágenes se renderizan correctamente
    expect(screen.getByAltText('TYPE_1')).toBeInTheDocument();
    expect(screen.getByAltText('Lizquierda')).toBeInTheDocument();
    expect(screen.getByAltText('digonalContiguo')).toBeInTheDocument();
    expect(screen.getByAltText('TYPE_4')).toBeInTheDocument();
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
