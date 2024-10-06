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
        render(<UndoButton gameId={mockGameId}/>);
      });
    
    afterEach(() => {
        vi.clearAllMocks();
    });


    it(`Should render de UndoButton Component`, () => {
        expect(screen.getByText(`Deshacer movimiento`)).toBeInTheDocument();
    });

    it(`Should call fetch on Undo Movement when clicking`, async () => {
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
})