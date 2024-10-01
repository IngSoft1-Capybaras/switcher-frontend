import { render, screen } from "@testing-library/react";
import GameBoard from "@/components/ui/GameBoard";  // Adjust this to your actual component path
import { MemoryRouter } from "react-router-dom";

const mockBoxes = [
  [{"pos_x": 0, "pos_y": 0, "color": "RED"}, {"pos_x": 1, "pos_y": 0, "color": "GREEN"}, {"pos_x": 2, "pos_y": 0, "color": "BLUE"}, {"pos_x": 3, "pos_y": 0, "color": "YELLOW"}, {"pos_x": 4, "pos_y": 0, "color": "RED"}, {"pos_x": 5, "pos_y": 0, "color": "GREEN"}],
  [{"pos_x": 0, "pos_y": 1, "color": "BLUE"}, {"pos_x": 1, "pos_y": 1, "color": "YELLOW"}, {"pos_x": 2, "pos_y": 1, "color": "GREEN"}, {"pos_x": 3, "pos_y": 1, "color": "RED"}, {"pos_x": 4, "pos_y": 1, "color": "YELLOW"}, {"pos_x": 5, "pos_y": 1, "color": "BLUE"}],
  [{"pos_x": 0, "pos_y": 2, "color": "YELLOW"}, {"pos_x": 1, "pos_y": 2, "color": "RED"}, {"pos_x": 2, "pos_y": 2, "color": "GREEN"}, {"pos_x": 3, "pos_y": 2, "color": "BLUE"}, {"pos_x": 4, "pos_y": 2, "color": "RED"}, {"pos_x": 5, "pos_y": 2, "color": "GREEN"}],
  [{"pos_x": 0, "pos_y": 3, "color": "GREEN"}, {"pos_x": 1, "pos_y": 3, "color": "YELLOW"}, {"pos_x": 2, "pos_y": 3, "color": "RED"}, {"pos_x": 3, "pos_y": 3, "color": "BLUE"}, {"pos_x": 4, "pos_y": 3, "color": "YELLOW"}, {"pos_x": 5, "pos_y": 3, "color": "RED"}],
  [{"pos_x": 0, "pos_y": 4, "color": "RED"}, {"pos_x": 1, "pos_y": 4, "color": "BLUE"}, {"pos_x": 2, "pos_y": 4, "color": "GREEN"}, {"pos_x": 3, "pos_y": 4, "color": "YELLOW"}, {"pos_x": 4, "pos_y": 4, "color": "BLUE"}, {"pos_x": 5, "pos_y": 4, "color": "RED"}],
  [{"pos_x": 0, "pos_y": 5, "color": "GREEN"}, {"pos_x": 1, "pos_y": 5, "color": "RED"}, {"pos_x": 2, "pos_y": 5, "color": "YELLOW"}, {"pos_x": 3, "pos_y": 5, "color": "BLUE"}, {"pos_x": 4, "pos_y": 5, "color": "GREEN"}, {"pos_x": 5, "pos_y": 5, "color": "YELLOW"}]
];


describe('Creación del tablero', () => {
  it('Si le llegan 36 casillas en el formato pactado, las renderiza', () => {
    render(
      <MemoryRouter>
        <GameBoard boxes={mockBoxes} />
      </MemoryRouter>
    );

    mockBoxes.flat().forEach((box, i) => {
      const boxElement = screen.getByTestId(`box-${box.pos_x}-${box.pos_y}`);
      expect(boxElement).toBeInTheDocument();
    });
  });
});
