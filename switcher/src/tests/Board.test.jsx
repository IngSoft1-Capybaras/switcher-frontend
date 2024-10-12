import { render, screen } from "@testing-library/react";
import GameBoard from "@/components/ui/GameBoard";
import { MemoryRouter } from "react-router-dom";

const mockData = {
  boxes: [
    [
      { pos_x: 0, pos_y: 0, color: "RED", highlighted: true },
      { pos_x: 1, pos_y: 0, color: "RED", highlighted: true },
      { pos_x: 2, pos_y: 0, color: "RED", highlighted: true },
      { pos_x: 3, pos_y: 0, color: "BLUE", highlighted: false },
      { pos_x: 4, pos_y: 0, color: "YELLOW", highlighted: false },
      { pos_x: 5, pos_y: 0, color: "GREEN", highlighted: false }
    ],
    [
      { pos_x: 0, pos_y: 1, color: "GREEN", highlighted: false },
      { pos_x: 1, pos_y: 1, color: "YELLOW", highlighted: false },
      { pos_x: 2, pos_y: 1, color: "RED", highlighted: true },
      { pos_x: 3, pos_y: 1, color: "BLUE", highlighted: false },
      { pos_x: 4, pos_y: 1, color: "GREEN", highlighted: false },
      { pos_x: 5, pos_y: 1, color: "RED", highlighted: false }
    ],
    [
      { pos_x: 0, pos_y: 2, color: "BLUE", highlighted: true },
      { pos_x: 1, pos_y: 2, color: "YELLOW", highlighted: false },
      { pos_x: 2, pos_y: 2, color: "GREEN", highlighted: false },
      { pos_x: 3, pos_y: 2, color: "RED", highlighted: false },
      { pos_x: 4, pos_y: 2, color: "YELLOW", highlighted: false },
      { pos_x: 5, pos_y: 2, color: "GREEN", highlighted: false }
    ],
    [
      { pos_x: 0, pos_y: 3, color: "BLUE", highlighted: true },
      { pos_x: 1, pos_y: 3, color: "RED", highlighted: false },
      { pos_x: 2, pos_y: 3, color: "GREEN", highlighted: false },
      { pos_x: 3, pos_y: 3, color: "YELLOW", highlighted: false },
      { pos_x: 4, pos_y: 3, color: "BLUE", highlighted: false },
      { pos_x: 5, pos_y: 3, color: "RED", highlighted: false }
    ],
    [
      { pos_x: 0, pos_y: 4, color: "BLUE", highlighted: true },
      { pos_x: 1, pos_y: 4, color: "BLUE", highlighted: true },
      { pos_x: 2, pos_y: 4, color: "RED", highlighted: false },
      { pos_x: 3, pos_y: 4, color: "YELLOW", highlighted: false },
      { pos_x: 4, pos_y: 4, color: "GREEN", highlighted: false },
      { pos_x: 5, pos_y: 4, color: "YELLOW", highlighted: false }
    ],
    [
      { pos_x: 0, pos_y: 5, color: "GREEN", highlighted: false },
      { pos_x: 1, pos_y: 5, color: "YELLOW", highlighted: false },
      { pos_x: 2, pos_y: 5, color: "RED", highlighted: false },
      { pos_x: 3, pos_y: 5, color: "BLUE", highlighted: false },
      { pos_x: 4, pos_y: 5, color: "GREEN", highlighted: false },
      { pos_x: 5, pos_y: 5, color: "RED", highlighted: false }
    ]
  ],
  figuresFormed: [
    [
      { pos_x: 0, pos_y: 2, color: "BLUE", highlighted: true },
      { pos_x: 0, pos_y: 3, color: "BLUE", highlighted: true },
      { pos_x: 0, pos_y: 4, color: "BLUE", highlighted: true },
      { pos_x: 1, pos_y: 4, color: "BLUE", highlighted: true }
    ],
  ]
};


describe('Creación del tablero', () => {
  it('Si le llegan 36 casillas en el formato pactado, las renderiza', () => {
    render(
      <MemoryRouter>
        <GameBoard boxes={mockData.boxes} selectedBoardFigure={mockData.figuresFormed[0]}/>
      </MemoryRouter>
    );

    mockData.boxes.flat().forEach((box, i) => {
      const boxElement = screen.getByTestId(`box-${box.pos_x}-${box.pos_y}`);

      // verifico que se haya renderizado
      expect(boxElement).toBeInTheDocument();

      // verifico que si esta highlighted -> tenga la className 'shine-effect'
      if(boxElement.highlighted){
        expect(boxElement).toHaveClass('shine-effect');
      }

       // verifico que si esta no esta highlighted -> no tenga la className 'shine-effect'
       if(boxElement.highlighted){
        expect(divElement.classList.length).toBe(6);
      }
    });
  });
});
