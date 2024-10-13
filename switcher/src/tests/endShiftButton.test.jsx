import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import EndTurnButton from "@/components/ui/EndShiftButton";
import { useGameContext } from "@/context/GameContext";
import { useSocketContext } from "@/context/SocketContext";
import { pathEndTurn } from "@/services/services";

vi.mock("@/context/GameContext", () => ({
  useGameContext: vi.fn(),
}));

vi.mock("@/context/SocketContext", () => ({
  useSocketContext: vi.fn(),
}));

vi.mock("@/services/services", () => ({
  pathEndTurn: vi.fn(),
}));

describe("EndTurnButton", () => {
  const mockSocket = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };

  const mockResetFigureSelection = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useGameContext.mockReturnValue({
      playerId: "player1",
      activeGameId: "game1",
    });

    useSocketContext.mockReturnValue({
      socket: mockSocket,
    });
  });


  it("activates the button when it's the player's turn", async () => {
    render(<EndTurnButton gameId="game1" currentTurn="player1" resetFigureSelection={mockResetFigureSelection}/>);

    const eventData = JSON.stringify({ type: "game1:NEXT_TURN", nextPlayerId: "player1" });

    // Usar act para manejar la actualización del estado
    await act(async () => {
      // Simular la llamada al manejador de eventos
      mockSocket.addEventListener.mock.calls[0][1]({ data: eventData });
    });

    // Asegurarse de que el estado del componente se haya actualizado
    await waitFor(() => {
      expect(screen.getByTestId('endTurnButtonId')).toBeEnabled();
    });
  });

  // Prueba para verificar que el botón esté deshabilitado cuando no es el turno del jugador
  it("disables the button when it's not the player's turn", async () => {
    render(<EndTurnButton gameId="game1" currentTurn="player2" resetFigureSelection={mockResetFigureSelection} />);

    // Simular el evento del socket con un jugador diferente
    const eventData = JSON.stringify({ type: "game1:NEXT_TURN", nextPlayerId: "player2" });

    // Usar act para manejar la actualización del estado
    await act(async () => {
      // Simular la llamada al manejador de eventos
      mockSocket.addEventListener.mock.calls[0][1]({ data: eventData });
    });

    // Asegurarse de que el botón sigue deshabilitado
    await waitFor(() => {
      expect(screen.getByTestId('endTurnButtonId')).toBeDisabled();
    });
  });


  it("calls pathEndTurn when the button is clicked", async () => {
    // Mockear la respuesta de pathEndTurn
    pathEndTurn.mockResolvedValue(true);

    render(<EndTurnButton gameId="game1" currentTurn="player1" resetFigureSelection={mockResetFigureSelection}/>);

    // Asegurarse de que el botón esté habilitado
    await waitFor(() => {
        expect(screen.getByTestId('endTurnButtonId')).toBeEnabled();
    });

    // Simular el clic en el botón usando fireEvent
    await act(async () => {
        fireEvent.click(screen.getByTestId('endTurnButtonId'));
    });

    // Verificar que pathEndTurn haya sido llamada
    expect(pathEndTurn).toHaveBeenCalledWith("game1");
  });
});
