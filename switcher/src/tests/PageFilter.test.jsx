import { PageFilter } from "@/components/ui/pageFilter";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from '@testing-library/react';
import { getGames } from "@/services/services";

vi.mock('@/services/services', () => ({
  getGames: vi.fn(),
}));

const setGamesMock = vi.fn();
const setTotalPagesMock = vi.fn();
const setIsFilteringMock = vi.fn();
const setFormDataMock = vi.fn();
const fetchGamesMock = vi.fn();

const mockedData = {
  total_pages: 1,
  games: [
    { id: 1, players_count: '4', max_players: 4, min_players: 2, name: 'testName1', is_private: false },
    { id: 2, players_count: '4', max_players: 4, min_players: 2, name: 'testName2', is_private: false }
  ]
};

describe('Page Filter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getGames.mockResolvedValue(mockedData); // Mock the API response
  });

  it('renders filter component and opens Popover on click', () => {
    render(<PageFilter setGames={setGamesMock} setTotalPages={setTotalPagesMock} setIsFiltering={setIsFilteringMock} formData={{ name: '', players: '' }} setFormData={setFormDataMock} fetchGames={fetchGamesMock} />);

    const triggerButton = screen.getByTestId('triggerButton');
    expect(triggerButton).toBeInTheDocument();
    fireEvent.click(triggerButton);

    const popOver = screen.getByTestId('popOverId');
    expect(popOver).toBeInTheDocument();
  });

  it('calls the filtering function on form submit with valid inputs', async () => {
    render(<PageFilter setGames={setGamesMock} setTotalPages={setTotalPagesMock} setIsFiltering={setIsFilteringMock} formData={{ name: '', players: '' }} setFormData={setFormDataMock} fetchGames={fetchGamesMock} />);

    const triggerButton = screen.getByTestId('triggerButton');
    fireEvent.click(triggerButton);

    const nameInput = screen.getByLabelText('Nombre');
    const playersInput = screen.getByLabelText('N° jugadores');

    fireEvent.change(nameInput, { target: { value: 'testName' } });
    fireEvent.change(playersInput, { target: { value: '4' } });

    const submitButton = await screen.findByTestId('submitButtonId');
    fireEvent.click(submitButton);

    expect(setIsFilteringMock).toHaveBeenCalledWith(true);
    expect(fetchGamesMock).toHaveBeenCalledWith(1, { name: 'testName', players: '4' });
    expect(setGamesMock).toHaveBeenCalledWith(mockedData.games);
    expect(setTotalPagesMock).toHaveBeenCalledWith(mockedData.total_pages);
  });

  it('does not call fetchGames if both inputs are empty', async () => {
    render(<PageFilter setGames={setGamesMock} setTotalPages={setTotalPagesMock} setIsFiltering={setIsFilteringMock} formData={{ name: '', players: '' }} setFormData={setFormDataMock} fetchGames={fetchGamesMock} />);

    const triggerButton = screen.getByTestId('triggerButton');
    fireEvent.click(triggerButton);

    const submitButton = await screen.findByTestId('submitButtonId');
    fireEvent.click(submitButton);

    expect(setIsFilteringMock).toHaveBeenCalledWith(false); // Should reset filtering
    expect(fetchGamesMock).not.toHaveBeenCalled(); // fetchGames should not be called
  });

  it('sets the form data correctly on input change', () => {
    render(<PageFilter setGames={setGamesMock} setTotalPages={setTotalPagesMock} setIsFiltering={setIsFilteringMock} formData={{ name: '', players: '' }} setFormData={setFormDataMock} fetchGames={fetchGamesMock} />);

    const triggerButton = screen.getByTestId('triggerButton');
    fireEvent.click(triggerButton);

    const nameInput = screen.getByLabelText('Nombre');
    const playersInput = screen.getByLabelText('N° jugadores');

    fireEvent.change(nameInput, { target: { value: 'testName' } });
    expect(setFormDataMock).toHaveBeenCalledWith(expect.objectContaining({ name: 'testName' }));

    fireEvent.change(playersInput, { target: { value: '4' } });
    expect(setFormDataMock).toHaveBeenCalledWith(expect.objectContaining({ players: '4' }));
  });
});
