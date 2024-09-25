import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import CreateGameForm from '../components/ui/CreateGameForm'; 
import { expect, it, describe, vi } from 'vitest';

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    MemoryRouter: ({ children }) => <div>{children}</div>, // Mock MemoryRouter
    useNavigate: vi.fn(), // Mock useNavigate as a function
  };
});

describe('Create Game Form v1', () => { 
  it('renders the form component', () => {
    render(<MemoryRouter><CreateGameForm /></MemoryRouter>);
    
    expect(screen.getByTestId('formComponent')).toBeInTheDocument();
  });

  it('renders the form components', () => {
    render(<MemoryRouter><CreateGameForm /></MemoryRouter>);

    expect(screen.getByPlaceholderText('Ingrese el nombre de la partida')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese una contraseña (opcional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear/i })).toBeInTheDocument();
    expect(screen.getByTestId('players-slider')).toBeInTheDocument();
  });

  it('submits the form with valid name and password', async () => {
    render(<MemoryRouter><CreateGameForm /></MemoryRouter>);

    const nameInput = screen.getByPlaceholderText('Ingrese el nombre de la partida');
    const passwordInput = screen.getByPlaceholderText('Ingrese una contraseña (opcional)');
    const submitButton = screen.getByRole('button', { name: /crear/i });

    fireEvent.change(nameInput, { target: { value: 'Partida de Prueba' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(nameInput.value).toBe('Partida de Prueba');
    expect(passwordInput.value).toBe('password123');

    const nameError = screen.queryByText('El nombre de la partida es obligatorio');
    const passwordError = screen.queryByText('La contraseña debe tener entre 8 y 16 caracteres.');
    expect(nameError).toBeNull(); 
    expect(passwordError).toBeNull();

    fireEvent.click(submitButton);
  });

  it('shows error messages when trying to submit with invalid data', async () => {
    render(<MemoryRouter><CreateGameForm /></MemoryRouter>);

    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    const nameError = await screen.findByText('El nombre de la partida es obligatorio');
    expect(nameError).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText('Ingrese una contraseña (opcional)');
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    const passwordError = await screen.findByText('La contraseña debe tener entre 8 y 16 caracteres.');
    expect(passwordError).toBeInTheDocument();
  });

  it('does not call onSubmit when form is invalid', async () => {
    const mockOnSubmit = vi.fn();
    render(<MemoryRouter><CreateGameForm onSubmit={mockOnSubmit} /></MemoryRouter>);

    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
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
