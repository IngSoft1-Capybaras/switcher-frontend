import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameProvider } from '../context/GameContext';
import LeaveButton from '../components/botonAbandonar/LeaveButton';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom'; 

const mockNavigate = vi.fn();


vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate, 
  };
});


vi.mock('../context/GameContext', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      GameProvider: ({ children }) => <div>{children}</div>, 
      useGameContext: () => ({
        activeGameId: '123', 
        playerId: '456', 
      }),
    };
  });
  

global.fetch = vi.fn();

describe('Leave Button', () => {
  const history = createMemoryHistory();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();

    render(
      <GameProvider>
        <Router location={history.location} navigator={history}>
          <LeaveButton />
        </Router>
      </GameProvider>
    );
  });

  it('should render', () => {
    expect(screen.getByText('Abandonar')).toBeTruthy();
  });

  it('post with ok data and then navigate', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });

    userEvent.click(screen.getByText(/Abandonar/i));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/players/456/leave'), 
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: '123' }),
      })
    ));

    expect(mockNavigate).toHaveBeenCalledWith('/games');
  });


  it('post with error data', async () => {
    global.fetch.mockResolvedValueOnce({ok: false});
    
    userEvent.click(screen.getByText(/Abandonar/i));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(await screen.findByText(/Error al abandonar la partida/)).toBeInTheDocument();
    })
    
});

