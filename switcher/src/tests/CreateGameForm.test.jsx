import { render, screen, fireEvent } from '@testing-library/react';
import CreateGameForm from '../components/form/CreateGameForm'; 
import { expect, it, describe } from 'vitest';

describe('Create Game Form', () => { 
  it('renders the form component', () => {
    render(<CreateGameForm />);
    
    expect(screen.getByTestId('formComponent')).toBeInTheDocument();
  });

  it('renders the form components', () => {
    render(<CreateGameForm />);

    // verify that all the components were rended
    expect(screen.getByPlaceholderText('Ingrese el nombre de la partida')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese una contraseña (opcional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear/i })).toBeInTheDocument();
    expect(screen.getByTestId('players-slider')).toBeInTheDocument();
});


  it('submits the form with valid name and password', async () => {
    render(<CreateGameForm />);

    // find inputs
    const nameInput = screen.getByPlaceholderText('Ingrese el nombre de la partida');
    const passwordInput = screen.getByPlaceholderText('Ingrese una contraseña (opcional)');
    const submitButton = screen.getByRole('button', { name: /crear/i });

    // data entry
    fireEvent.change(nameInput, { target: { value: 'Partida de Prueba' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // verify inputs
    expect(nameInput.value).toBe('Partida de Prueba');
    expect(passwordInput.value).toBe('password123');

    // verify no error messages
    const nameError = screen.queryByText('El nombre de la partida es obligatorio');
    const passwordError = screen.queryByText('La contraseña debe tener entre 8 y 16 caracteres.');
    expect(nameError).toBeNull(); 
    expect(passwordError).toBeNull();

    // send form
    fireEvent.click(submitButton);
  });

  it('submits the form just with name', async () => {
    render(<CreateGameForm />);

    // find inputs
    const nameInput = screen.getByPlaceholderText('Ingrese el nombre de la partida');
    const submitButton = screen.getByRole('button', { name: /crear/i });

    // data entry
    fireEvent.change(nameInput, { target: { value: 'Partida de Prueba' } });
    

    // verify input
    expect(nameInput.value).toBe('Partida de Prueba');
    
    // verify no error message
    const nameError = screen.queryByText('El nombre de la partida es obligatorio');
    expect(nameError).toBeNull(); 

    // send form
    fireEvent.click(submitButton);
  });

  
  it('shows error messages when trying to submit with invalid data', async () => {

    render(<CreateGameForm />);

    const submitButton = screen.getByRole('button', { name: /crear/i });

    fireEvent.click(submitButton);
    // verify name error message 
    const nameError = await screen.findByText('El nombre de la partida es obligatorio');
    expect(nameError).toBeInTheDocument();

    // password less than 8 chars
    const passwordInput = screen.getByPlaceholderText('Ingrese una contraseña (opcional)');
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    // verify password error message 
    const passwordError = await screen.findByText('La contraseña debe tener entre 8 y 16 caracteres.');
    expect(passwordError).toBeInTheDocument();
  });

  it('does not call onSubmit when form is invalid', async () => {
    // mock function
    const mockOnSubmit = vi.fn();
    render(<CreateGameForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    // Verify that function onSubmit hasnt been called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});

