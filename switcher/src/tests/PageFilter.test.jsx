import { PageFilter } from "@/components/ui/pageFilter";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from '@testing-library/react';



const setGamesMock = vi.fn();
const setTotalPagesMock = vi.fn();
const setIsFilteringMock = vi.fn();

describe('Page Filter', () => {
  it('renders filter component and opens Popover on click', () => {
    render(<PageFilter setGames={setGamesMock} setTotalPages={setTotalPagesMock} setIsFiltering={setIsFilteringMock}/>);


    const filterButton = screen.getByTestId('triggerButton');
    expect(filterButton).toBeInTheDocument();
    fireEvent.click(filterButton);

    const popOver = screen.getByTestId('popOverId');
    expect(popOver).toBeInTheDocument();
  });
});
