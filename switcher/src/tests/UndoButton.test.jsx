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


    // Test para verificar que funcione bien cuando deberia

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


    // tests para handelear errores

    it(`Should handle null values for gameId and playerId`, async () => {
        useGameContext.mockReturnValue({ playerId: null });
        render(<UndoButton gameId={null}/>);

        const undoButton = screen.getByText(`Deshacer movimiento`);
        await userEvent.click(undoButton);

        await waitFor(() => expect(fetch).not.toHaveBeenCalled());

        expect(await screen.findByText(/Error al deshacer movimiento/)).toBeInTheDocument();
    });

    it(`Should handle undefined values for gameId and playerId`, async () => {
        useGameContext.mockReturnValue({ playerId: undefined });
        render(<UndoButton gameId={undefined}/>);

        const undoButton = screen.getByText(`Deshacer movimiento`);
        await userEvent.click(undoButton);

        await waitFor(() => expect(fetch).not.toHaveBeenCalled());

        expect(await screen.findByText(/Error al deshacer movimiento/)).toBeInTheDocument();
    });

    it(`Should show error when response is not ok`, async () => {
        fetch.mockResolvedValueOnce(
            { ok : false,
              text: () => Promise.resolve("Algo salió mal") // supongo mensaje que manda el back 
            });
        
        render(<UndoButton gameId={mockGameId}/>);
        const mockUndoButton = screen.getByText(`Deshacer movimiento`);
        
        await userEvent.click(mockUndoButton);
        await waitFor(() => expect(fetch).toHaveBeenCalledOnce());

        expect(await screen.findByText(/Error al deshacer movimiento: Algo salió mal/)).toBeInTheDocument();
    })

    it(`Should show error when fetch throws one`, async () => {
        fetch.mockRejectedValueOnce(new Error("Network error"));

        render(<UndoButton gameId={mockGameId} />);
        const undoButton = screen.getByText(`Deshacer movimiento`);
        await userEvent.click(undoButton);

        expect(await screen.findByText(/Error al deshacer movimiento: Network error/i)).toBeInTheDocument();
    })
});