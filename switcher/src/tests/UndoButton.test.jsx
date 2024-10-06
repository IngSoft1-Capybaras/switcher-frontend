import UndoButton from "@/components/ui/undoButton";
import userEvent from "@testing-library/user-event";
import { useGameContext } from "@/context/GameContext";
import{ render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe(`Undo Button`, () => {

    const mockGameId = `123`;
    const mockPlayerId = `1`;


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


    it(`Should render de UndoButton Component`, () => {
        render(<UndoButton gameId={mockGameId}/>);
        expect(screen.getByText(`Deshacer movimiento`)).toBeInTheDocument();
    });

    it(`Should call fetch on Undo Movement when clicking`, async () => {
        render(<UndoButton gameId={mockGameId}/>);
        const mockUndoButton = screen.getByText(`Deshacer movimiento`);
        fetch.mockResolvedValueOnce({ ok : true, })

        await userEvent.click(mockUndoButton);

        await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
        await waitFor(() => expect(fetch).toHaveBeenCalledWith(
            `http://localhost:8000/deck/movement/undo_move`,
            expect.objectContaining(
                {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gameID: mockGameId, playerID: mockPlayerId })
                }
            )
        ));
    });

    it(`Should handle null values for gameId and playerId`, async () => {

        useGameContext.mockReturnValue({ playerId: null });
        const nullGameId = null;
        
        render(<UndoButton gameId={nullGameId}/>);

        const undoButton = screen.getByText(`Deshacer movimiento`);
        await userEvent.click(undoButton);

        await waitFor(() => expect(fetch).not.toHaveBeenCalled());

        expect(await screen.findByText(/Error al deshacer movimiento/)).toBeInTheDocument();
    });

});