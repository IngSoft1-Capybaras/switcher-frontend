import UndoButton from "@/components/ui/undoButton";
import userEvent from "@testing-library/user-event";
import { useGameContext } from "@/context/GameContext";
import { undoMovement } from "@/services/services";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe('Undo Button', () => {

    const mockGameId = '123';
    const mockPlayerId = '1';
    const mockNextPlayerId = '2';

    vi.mock('@/context/GameContext', () => ({
        useGameContext: vi.fn(),
    }));

    vi.mock('@/services/services', () => ({
        undoMovement: vi.fn(),
    }));

    beforeEach(() => {
        useGameContext.mockReturnValue({ playerId: mockPlayerId });
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    // Test para verificar que el botón de deshacer movimiento se renderiza correctamente
    it('Should render the UndoButton component and be enabled when it is player\'s turn', () => {
        render(<UndoButton gameId={mockGameId} currentTurn={mockPlayerId} />);
        const undoButton = screen.getByTestId('undoButtonId');
        expect(undoButton).toBeInTheDocument();
        expect(undoButton).not.toBeDisabled();
    });

    // Test para verificar que el botón de deshacer movimiento no se habilita cuando no es el turno del jugador
    it('Should not enable the button when it is not the player\'s turn', () => {
        render(<UndoButton gameId={mockGameId} currentTurn={mockNextPlayerId} />);
        const undoButton = screen.getByTestId('undoButtonId');
        expect(undoButton).toBeDisabled();
    });
    
    // Test para verificar que se muestra un mensaje de error cuando no se pasa gameId o playerId
    it('Should handle null values for gameId and playerId', async () => {
        useGameContext.mockReturnValue({ playerId: null });
        render(<UndoButton gameId={null} currentTurn={null} resetFigureSelection={vi.fn()} resetMov={vi.fn()} />);
    
        const undoButton = screen.getByTestId('undoButtonId');
        await userEvent.click(undoButton);
    
        await waitFor(() => expect(undoMovement).not.toHaveBeenCalled());
        expect(await screen.findByText(/Error al deshacer movimiento: \(!gameId \|\| !playerId\)/)).toBeInTheDocument();
    });
    
    // Test para verificar que se muestra un mensaje de error cuando no se pasa gameId o playerId y son undefined
    it('Should handle undefined values for gameId and playerId', async () => {
        useGameContext.mockReturnValue({ playerId: undefined });
        render(<UndoButton gameId={undefined} currentTurn={undefined} resetFigureSelection={vi.fn()} resetMov={vi.fn()} />);
    
        const undoButton = screen.getByTestId('undoButtonId');
        await userEvent.click(undoButton);
    
        await waitFor(() => expect(undoMovement).not.toHaveBeenCalled());
        expect(await screen.findByText(/Error al deshacer movimiento: \(!gameId \|\| !playerId\)/)).toBeInTheDocument();
    });
    
    // Test para verificar que se muestra un mensaje de error cuando no se pasa gameId o playerId y son vacíos
    it('Should show error when response is not ok', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        undoMovement.mockRejectedValueOnce(new Error('Error en la petición'));

        render(<UndoButton gameId={mockGameId} currentTurn={mockPlayerId} resetFigureSelection={vi.fn()} resetMov={vi.fn()} />);
        const mockUndoButton = screen.getByTestId('undoButtonId');

        await userEvent.click(mockUndoButton);
        await waitFor(() => expect(undoMovement).toHaveBeenCalledOnce());

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error al deshacer movimiento: Error en la petición');
        expect(await screen.findByText(/Error al deshacer movimiento: Error en la petición/)).toBeInTheDocument();
    });

    // Test para verificar que se muestra un mensaje de error cuando undoMovement lanza una excepción
    it('Should show error when undoMovement throws one', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        undoMovement.mockRejectedValueOnce(new Error('Network error'));
    
        const resetFigureSelection = vi.fn();
        const resetMov = vi.fn();
    
        render(<UndoButton gameId={mockGameId} currentTurn={mockPlayerId} resetFigureSelection={resetFigureSelection} resetMov={resetMov} />);
        const undoButton = screen.getByTestId('undoButtonId');
        await userEvent.click(undoButton);
    
        await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalledWith('Error al deshacer movimiento: Network error'));
        expect(await screen.findByText(/Error al deshacer movimiento: Network error/)).toBeInTheDocument();
    });
});
