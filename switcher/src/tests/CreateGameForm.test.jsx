import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CreateGameForm from '@/components/ui/CreateGameForm';
import { useGameContext } from '@/context/GameContext';
import { useNavigate } from 'react-router-dom';

// Mocking dependencies
vi.mock('@/context/GameContext', () => ({
  useGameContext: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('CreateGameForm', () => {
  const mockNavigate = vi.fn();
  const mockFetch = vi.fn();
  const apiUrl = 'http://localhost:8000'; // Mock apiUrl

  beforeEach(() => {
    // Mock useGameContext to return a username
    useGameContext.mockReturnValue({ username: 'testUser' });

    // Mock useNavigate
    useNavigate.mockReturnValue(mockNavigate);

    // Mock fetch
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.resetAllMocks(); // Resets mocks after each test
  });

  test('renders the form correctly', () => {
    render(<CreateGameForm />);

    expect(screen.getByPlaceholderText('Ingrese el nombre de la partida')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese una contraseña (opcional)')).toBeInTheDocument();
    expect(screen.getByTestId('players-slider')).toBeInTheDocument();
  });

  test('does not submit the form when the name is missing', async () => {
    render(<CreateGameForm />);

    // Simulate form submission without filling the name field
    fireEvent.click(screen.getByRole('button', { name: /crear/i }));

    // Wait for the validation error message
    await waitFor(() => {
      expect(screen.getByText('El nombre de la partida es obligatorio')).toBeInTheDocument();
    });

    // Ensure fetch is not called
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('submits the form with correct data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ game: { id: '123' } }),
    });

    render(<CreateGameForm />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Ingrese el nombre de la partida'), {
      target: { value: 'Test Game' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /crear/i }));

    // Ensure fetch is called with correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${apiUrl}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: {
            name: 'Test Game',
            maxPlayers: 4,
            minPlayers: 2,
          },
          player: {
            name: 'testUser',
            host: true,
            turn: 'PRIMERO',
          },
        }),
      });
    });

    // Ensure navigation is called after successful creation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('games/ongoing/123');
    });
  });

  test('shows an error message when the fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Error al crear la partida.' }),
    });

    render(<CreateGameForm />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Ingrese el nombre de la partida'), {
      target: { value: 'Test Game' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /crear/i }));

    // Wait for the error message to show
    await waitFor(() => {
      expect(screen.getByText('Error al crear la partida.')).toBeInTheDocument();
    });


    // Ensure navigation is not called on failure
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('Create Game Form v2', () => { 
  beforeEach(() => {
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  it('submits the form and calls fetch with correct data', async () => {
    const mockResponse = { id: '12345' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(<MemoryRouter><CreateGameForm gameId="12345" /></MemoryRouter>);


    const nameInput = screen.getByPlaceholderText('Ingrese el nombre de la partida');
    const passwordInput = screen.getByPlaceholderText('Ingrese una contraseña (opcional)');
    const submitButton = screen.getByRole('button', { name: /crear/i });

    fireEvent.change(nameInput, { target: { value: 'Partida de Prueba' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_URL}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Partida de Prueba',
          password: 'password123',
          playersRange: [2, 4],
        }),
      });
      
      expect(mockNavigate).toHaveBeenCalledWith('/games/lobby/12345');
    });
  });


  it('shows an error message when fetch fails', async () => {
    // Mocking fetch to simulate a failed response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Error al crear la partida.' }), 
    });
  
    render(<MemoryRouter><CreateGameForm /></MemoryRouter>);
  
    const nameInput = screen.getByPlaceholderText('Ingrese el nombre de la partida');
    const submitButton = screen.getByRole('button', { name: /crear/i });
  
    fireEvent.change(nameInput, { target: { value: 'Partida de Prueba' } });
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(screen.getByText('Error al crear la partida.')).toBeInTheDocument();
    });
  });
});
