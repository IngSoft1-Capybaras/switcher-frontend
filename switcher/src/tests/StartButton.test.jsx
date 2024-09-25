import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import StartButton from '../components/ui/StartButton';


global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
  })
);

describe('StartButton', () => {
  const gameId = '123';

  it('calls on start when onClick', async () => {
    render(<StartButton gameId={gameId} />);

    const button = screen.getByRole('button', { name: /comenzar/i });

    fireEvent.click(button);

  
    expect(fetch).toHaveBeenCalledWith(`/games/start/${gameId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });

    const consoleSpy = vi.spyOn(console, 'log');
    await fireEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith('Juego iniciado con éxito.');

    consoleSpy.mockRestore();
  });
});
