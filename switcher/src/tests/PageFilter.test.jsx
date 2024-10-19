import { PageFilter } from "@/components/ui/pageFilter";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from '@testing-library/react';


vi.mock('@/services/services', () => ({
  getGames: vi.fn(),
}));

const setIsFilteringMock = vi.fn();
const setFormDataMock = vi.fn();
const fetchGamesMock = vi.fn();

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
    fetchGamesMock.mockResolvedValue(mockedData); // Mock the API response
  });

  it('renders filter component, opens and closes Popover on click', () => {
    render(<PageFilter setIsFiltering={setIsFilteringMock} formData={{ name: '', players: '' }} setFormData={setFormDataMock} fetchGames={fetchGamesMock} />);

    const triggerButton = screen.getByTestId('triggerButton');
    expect(triggerButton).toBeInTheDocument();
    fireEvent.click(triggerButton);

    const popOver = screen.getByTestId('popOverId');
    expect(popOver).toBeInTheDocument();

    const submit = screen.getByTestId('submitButtonId');
    expect(submit).toBeInTheDocument();
    fireEvent.click(submit);

    expect(popOver).not.toBeInTheDocument();

  });

});


