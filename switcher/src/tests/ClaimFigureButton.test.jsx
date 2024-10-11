import ClaimFigureButton from "@/components/ui/claimFigureButton";
import userEvent from "@testing-library/user-event";
import { useGameContext } from "@/context/GameContext";
import{ render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";


// disabled={!(figure.length!==0 && (playerId == currentTurn) && cardId)}

describe('Claim Figure Button', () => {

  const mockPlayerId = '1';
  const mockGameId = '5';
  const mockCardId = '10';
  const mockFigure = [
    { pos_x: 0, pos_y: 2, color: "BLUE", highlighted: true },
    { pos_x: 0, pos_y: 3, color: "BLUE", highlighted: true },
    { pos_x: 0, pos_y: 4, color: "BLUE", highlighted: true },
    { pos_x: 1, pos_y: 4, color: "BLUE", highlighted: true }
  ]

  vi.mock('@/context/GameContext', () => ({
    useGameContext: vi.fn(),
  }));

  afterEach(() => {
    vi.clearAllMocks();
  });

  it(`Should render de ClaimButton`, () => {
    useGameContext.mockReturnValue({ playerId: mockPlayerId, currentTurn: '1' });
    render(<ClaimFigureButton gameId={mockGameId} cardId={mockCardId} figure={mockFigure}/>);
    const claimButton = screen.getByTestId('claimButtonTestId');
    expect(claimButton).toBeInTheDocument();
  });

  it('Should be enabled when (figure.length!==0 && (playerId == currentTurn) && cardId)', () => {
    useGameContext.mockReturnValue({ playerId: mockPlayerId, currentTurn: '1' });
    render(<ClaimFigureButton gameId={mockGameId} cardId={mockCardId} figure={mockFigure}/>);
    const claimButton = screen.getByTestId('claimButtonTestId');
    expect(claimButton).toBeEnabled();
  })

  it('Should not be enabled when (figure.length!==0 && (playerId == currentTurn) && !cardId)', () => {
    useGameContext.mockReturnValue({ playerId: mockPlayerId, currentTurn: '1' });
    render(<ClaimFigureButton gameId={mockGameId} figure={mockFigure}/>);
    const claimButton = screen.getByTestId('claimButtonTestId');
    expect(claimButton).toBeDisabled();
  })

  it('Should be not enabled when (figure.length!==0 && !(playerId == currentTurn) && cardId)', () => {
    useGameContext.mockReturnValue({ playerId: mockPlayerId, currentTurn: '2' });
    render(<ClaimFigureButton gameId={mockGameId} cardId={mockCardId} figure={mockFigure}/>);
    const claimButton = screen.getByTestId('claimButtonTestId');
    expect(claimButton).toBeDisabled();
  })


  // checking tooltip

})