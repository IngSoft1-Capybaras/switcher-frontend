import { render, screen, waitFor, act } from "@testing-library/react";
import { vi, describe, beforeEach, it, expect } from "vitest"; // Asegúrate de tener vi para los mocks
import EndTurnButton from "@/components/ui/EndShiftButton"; // Asegúrate de que la ruta sea correcta
import { useGameContext } from "@/context/GameContext";
import { useSocketContext } from "@/context/SocketContext";

// Mockear el contexto del juego
vi.mock("@/context/GameContext", () => ({
  useGameContext: vi.fn(),
}));

// Mockear el contexto del socket
vi.mock("@/context/SocketContext", () => ({
  useSocketContext: vi.fn(),
}));

describe("EndTurnButton", () => {
  const mockSocket = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };

  beforeEach(() => {
    // Reiniciar los mocks antes de cada prueba
    vi.clearAllMocks();

    // Configurar el contexto simulado
    useGameContext.mockReturnValue({
      playerId: "player1",
      activeGameId: "game1",
    });

    useSocketContext.mockReturnValue({
      socket: mockSocket,
    });
  });

  // Prueba para verificar que el botón se deshabilite cuando no es el turno del jugador
  it("activates the button when it's the player's turn", async () => {
    render(<EndTurnButton />);

    // Simular el evento del socket
    const eventData = JSON.stringify({ type: "NEXT_TURN", nextPlayerId: "player1" });

    // Usar act para manejar la actualización del estado
    await act(async () => {
      // Simular la llamada al manejador de eventos
      mockSocket.addEventListener.mock.calls[0][1]({ data: eventData });
    });

    // Asegurarse de que el estado del componente se haya actualizado
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Terminar Turno/i })).toBeEnabled();
    });
  });
  
  it("disables the button when it's not the player's turn", async () => {
    render(<EndTurnButton />);

    // Simular el evento del socket con un jugador diferente
    const eventData = JSON.stringify({ type: "NEXT_TURN", nextPlayerId: "player2" });

    // Usar act para manejar la actualización del estado
    await act(async () => {
      // Simular la llamada al manejador de eventos
      mockSocket.addEventListener.mock.calls[0][1]({ data: eventData });
    });

    // Asegurarse de que el botón sigue deshabilitado
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Terminar Turno/i })).toBeDisabled();
    });
  });

  // hagamos un print de la pantalla para ver si el botón está habilitado
    it("displays the button as enabled", async () => {
        render(<EndTurnButton />);
    
        // Asegurarse de que el botón está deshabilitado inicialmente
        expect(screen.getByRole("button", { name: /Terminar Turno/i })).toBeDisabled();
    
        // Simular el evento del socket
        const eventData = JSON.stringify({ type: "NEXT_TURN", nextPlayerId: "player1" });
    
        // Usar act para manejar la actualización del estado
        await act(async () => {
        // Simular la llamada al manejador de eventos
        mockSocket.addEventListener.mock.calls[0][1]({ data: eventData });
        });
    
        // Asegurarse de que el botón está habilitado después de la actualización
        await waitFor(() => {
        expect(screen.getByRole("button", { name: /Terminar Turno/i })).toBeEnabled();
        });
    });
});
