import { render, screen } from "@testing-library/react";
import GameBoard from "@/components/ui/GameBoard";  // Adjust this to your actual component path
import { MemoryRouter } from "react-router-dom";

const mockBoxes = [
    [{"posX": 0, "posY": 0, "color": "Red"}, {"posX": 1, "posY": 0, "color": "Green"}, {"posX": 2, "posY": 0, "color": "Blue"}, {"posX": 3, "posY": 0, "color": "Yellow"}, {"posX": 4, "posY": 0, "color": "Red"}, {"posX": 5, "posY": 0, "color": "Green"}],
    [{"posX": 0, "posY": 1, "color": "Blue"}, {"posX": 1, "posY": 1, "color": "Yellow"}, {"posX": 2, "posY": 1, "color": "Green"}, {"posX": 3, "posY": 1, "color": "Red"}, {"posX": 4, "posY": 1, "color": "Yellow"}, {"posX": 5, "posY": 1, "color": "Blue"}],
    [{"posX": 0, "posY": 2, "color": "Yellow"}, {"posX": 1, "posY": 2, "color": "Red"}, {"posX": 2, "posY": 2, "color": "Green"}, {"posX": 3, "posY": 2, "color": "Blue"}, {"posX": 4, "posY": 2, "color": "Red"}, {"posX": 5, "posY": 2, "color": "Green"}],
    [{"posX": 0, "posY": 3, "color": "Green"}, {"posX": 1, "posY": 3, "color": "Yellow"}, {"posX": 2, "posY": 3, "color": "Red"}, {"posX": 3, "posY": 3, "color": "Blue"}, {"posX": 4, "posY": 3, "color": "Yellow"}, {"posX": 5, "posY": 3, "color": "Red"}],
    [{"posX": 0, "posY": 4, "color": "Red"}, {"posX": 1, "posY": 4, "color": "Blue"}, {"posX": 2, "posY": 4, "color": "Green"}, {"posX": 3, "posY": 4, "color": "Yellow"}, {"posX": 4, "posY": 4, "color": "Blue"}, {"posX": 5, "posY": 4, "color": "Red"}],
    [{"posX": 0, "posY": 5, "color": "Green"}, {"posX": 1, "posY": 5, "color": "Red"}, {"posX": 2, "posY": 5, "color": "Yellow"}, {"posX": 3, "posY": 5, "color": "Blue"}, {"posX": 4, "posY": 5, "color": "Green"}, {"posX": 5, "posY": 5, "color": "Yellow"}]
];

describe('Creación del tablero', () => {
  it('Si le llegan 36 casillas en el formato pactado, las renderiza', () => {
    render(
      <MemoryRouter>
        <GameBoard boxes={mockBoxes} />
      </MemoryRouter>
    );

    mockBoxes.flat().forEach((box, i) => {
      const boxElement = screen.getByTestId(`box-${box.posX}-${box.posY}`);
      expect(boxElement).toBeInTheDocument();
    });
  });
});
