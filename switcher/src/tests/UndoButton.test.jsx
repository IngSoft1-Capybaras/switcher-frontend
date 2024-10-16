import UndoButton from "@/components/ui/undoButton";
import userEvent from "@testing-library/user-event";
import { useGameContext } from "@/context/GameContext";
import{ render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe(`Undo Button`, () => {

    const mockGameId = `123`;
    const mockPlayerId = `1`;
    const mockNextPlayerId = `2`;

    vi.mock('@/context/GameContext', () => ({
        useGameContext: vi.fn(),
      }));

    beforeEach(() => {
        useGameContext.mockReturnValue({ playerId: mockPlayerId });
        global.fetch = vi.fn();
      });

    afterEach(() => {
        vi.clearAllMocks();
    });


    // Test para verificar que funcione bien cuando deberia

    it(`Should render de UndoButton Component and be enabled when it is player's turn `, () => {
        render(<UndoButton gameId={mockGameId} currentTurn={mockPlayerId}/>);
        const undoButton = screen.getByTestId('undoButtonId');

        expect(undoButton).toBeInTheDocument();
        expect(undoButton).not.toBeDisabled();
    });

    it("Should not enable the button when it is not the player's turn", () => {
        render(<UndoButton gameId={mockGameId} currentTurn={mockNextPlayerId} />);
        const undoButton = screen.getByTestId('undoButtonId');
        expect(undoButton).toBeDisabled();
      });


    it(`Should call fetch on Undo Movement when clicking`, async () => {
        render(<UndoButton gameId={mockGameId} currentTurn={mockPlayerId}/>);
        const mockUndoButton = screen.getByTestId('undoButtonId');
        fetch.mockResolvedValueOnce({ ok : true })

        await userEvent.click(mockUndoButton);

        await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
        await waitFor(() => expect(fetch).toHaveBeenCalledWith(
            `http://localhost:8000/deck/movement/${mockGameId}/${mockPlayerId}/undo_move`,
            expect.objectContaining(
                {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                }
            )
        ));
    });

    it("Should handle turn changes correctly", async () => {
        const { rerender } = render(<UndoButton gameId="123" currentTurn={mockPlayerId} />);

        let undoButton = screen.getByTestId('undoButtonId');
        expect(undoButton).toBeEnabled();


        rerender(<UndoButton gameId="123" currentTurn={mockNextPlayerId} />);
        undoButton = screen.getByTestId('undoButtonId');
        expect(undoButton).toBeDisabled();


        rerender(<UndoButton gameId="123" currentTurn={mockPlayerId} />);
        undoButton = screen.getByTestId('undoButtonId');
        expect(undoButton).toBeEnabled();
    });



    // tests para handelear errores

    it(`Should handle null values for gameId and playerId`, async () => {
        useGameContext.mockReturnValue({ playerId: null });
        render(<UndoButton gameId={null} currentTurn={null}/>);

        const undoButton = screen.getByTestId('undoButtonId');
        await userEvent.click(undoButton);

        await waitFor(() => expect(fetch).not.toHaveBeenCalled());

        expect(await screen.findByText(/Error al deshacer movimiento/)).toBeInTheDocument();
    });

    it(`Should handle undefined values for gameId and playerId`, async () => {
        useGameContext.mockReturnValue({ playerId: undefined });
        render(<UndoButton gameId={undefined} currentTurn={undefined}/>);

        const undoButton = screen.getByTestId('undoButtonId');
        await userEvent.click(undoButton);

        await waitFor(() => expect(fetch).not.toHaveBeenCalled());

        expect(await screen.findByText(/Error al deshacer movimiento/)).toBeInTheDocument();
    });

    it(`Should show error when response is not ok`, async () => {
        fetch.mockResolvedValueOnce(
            { ok : false,
              text: () => Promise.resolve("Algo salió mal") // supongo mensaje que manda el back
            });

        render(<UndoButton gameId={mockGameId} currentTurn={mockPlayerId}/>);
        const mockUndoButton = screen.getByTestId('undoButtonId');

        await userEvent.click(mockUndoButton);
        await waitFor(() => expect(fetch).toHaveBeenCalledOnce());

        expect(await screen.findByText(/Error al deshacer movimiento: Algo salió mal/)).toBeInTheDocument();
    })

    it(`Should show error when fetch throws one`, async () => {
        fetch.mockRejectedValueOnce(new Error("Network error"));

        render(<UndoButton gameId={mockGameId} currentTurn={mockPlayerId}/>);
        const undoButton = screen.getByTestId('undoButtonId');
        await userEvent.click(undoButton);

        expect(await screen.findByText(/Error al deshacer movimiento: Network error/i)).toBeInTheDocument();
    })
});