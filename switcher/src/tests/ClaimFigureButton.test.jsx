import ClaimFigureButton from "@/components/ui/claimFigureButton";
import userEvent from "@testing-library/user-event";
import { useGameContext } from "@/context/GameContext";
import{ render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";


//disabled={!((currentTurn==playerId) && selectedCardFigure && box.highlighted)}

describe('Claim Figure Button', () => {

  mockPlayerId = 1;
  mockGameId = 5;
  mockCardId = 10;
  mockFigure = [
    { pos_x: 0, pos_y: 2, color: "BLUE", highlighted: true },
    { pos_x: 0, pos_y: 3, color: "BLUE", highlighted: true },
    { pos_x: 0, pos_y: 4, color: "BLUE", highlighted: true },
    { pos_x: 1, pos_y: 4, color: "BLUE", highlighted: true }
  ]

  vi.mock('@/context/GameContext', () => ({
    useGameContext: vi.fn(),
  }));


  beforeAll(() => {
    useGameContext.mockReturnValue({ playerId: mockPlayerId });
  })
  afterEach(() => {
    vi.clearAllMocks();
  });

  it(`Should render de ClaimButton`, () => {
    render(<ClaimFigureButton gameId={mockGameId} cardId={mockCardId} figure={mockFigure}/>);
    const claimButton = screen.getByTestId('claimButtonTestId');
    expect(claimButton).toBeInTheDocument();
  });






})