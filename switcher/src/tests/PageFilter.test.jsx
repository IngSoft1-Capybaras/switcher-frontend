import { PageFilter } from "@/components/ui/pageFilter";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from '@testing-library/react';
import { filterGames } from "@/services/services";

vi.mock('@/services/services', () => ({
  filterGames: vi.fn(),
}));

const setGamesMock = vi.fn();
const setTotalPagesMock = vi.fn();
const setIsFilteringMock = vi.fn();

const mockedData = {
  total_pages: 1,
  games: [
    {
      id: 1,
      players_count: '4',
      max_players: 4,
      min_players: 2,
      name: 'testName1',
      is_private: false
    },
    {
      id: 2,
      players_count: '4',
      max_players: 4,
      min_players: 2,
      name: 'testName2',
      is_private: false
    }
  ]
};

describe('Page Filter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    filterGames.mockResolvedValue(mockedData);
  });

  it('renders filter component and opens Popover on click', () => {
    render(<PageFilter setGames={setGamesMock} setTotalPages={setTotalPagesMock} setIsFiltering={setIsFilteringMock} />);

    const triggerButton = screen.getByTestId('triggerButton');
    expect(triggerButton).toBeInTheDocument();
    fireEvent.click(triggerButton);

    const popOver = screen.getByTestId('popOverId');
    expect(popOver).toBeInTheDocument();
  });

  it('calls the filtering function on form submit with valid inputs', async () => {
    render(<PageFilter setGames={setGamesMock} setTotalPages={setTotalPagesMock} setIsFiltering={setIsFilteringMock} />);

    const triggerButton = screen.getByTestId('triggerButton');
    fireEvent.click(triggerButton);

    const nameInput = screen.getByLabelText('Nombre');
    const playersInput = screen.getByLabelText('N° jugadores');

    fireEvent.change(nameInput, { target: { value: 'testName' } });
    fireEvent.change(playersInput, { target: { value: '4' } });

    const submitButton = screen.getByText('Filtrar');
    fireEvent.click(submitButton);


    // await para esperar que se complete la funcion de filtergames
    await screen.findByText('Filtrar');

    expect(setIsFilteringMock).toHaveBeenCalledWith(true);
    expect(setGamesMock).toHaveBeenCalledWith(mockedData.games);
    expect(setTotalPagesMock).toHaveBeenCalledWith(mockedData.total_pages);
  });
});
