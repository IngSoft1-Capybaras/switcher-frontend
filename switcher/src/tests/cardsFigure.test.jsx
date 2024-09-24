// src/components/cardsFigure.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import CardsFigure from '../components/ui/cardsFigure';

describe('CardsFigure', () => {
  it('debe mostrar la carta de figura cuando se muestra', () => {
    render(<CardsFigure type="test-figure" show={true} difficulty="EASY" />);
    const img = screen.getByAltText('Carta de figura test-figure');
    expect(img).toBeInTheDocument();
  });

  it('debe mostrar "Bloqueado" cuando la carta no se muestra', () => {
    render(<CardsFigure type="test-figure" show={false} difficulty="EASY" />);
    const blockedText = screen.getByText('Bloqueado');
    expect(blockedText).toBeInTheDocument();
  });

  it('debe mostrar la dificultad en la parte inferior de la carta', () => {
    render(<CardsFigure type="test-figure" show={true} difficulty="HARD" />);
    const difficultyText = screen.getByText('HARD');
    expect(difficultyText).toBeInTheDocument();
  });

  it('debe tener clase de dificultad correcta', () => {
    const { container } = render(<CardsFigure type="test-figure" show={true} difficulty="HARD" />);
    expect(container.firstChild).toHaveClass('border-red-500'); // Dificultad HARD
  });
});

// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import CardsFigure from '@/cardsFigure';
// import { cardImg } from '@/utils/getCardImg'; // Asegúrate de que la ruta sea correcta

// jest.mock('@/utils/getCardImg', () => ({
//   cardImg: jest.fn(),
// })); // Mockear la función

// describe('CardsFigure', () => {
//   beforeEach(() => {
//     jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
//   });

//   it('debe mostrar la carta de figura cuando se muestra', () => {
//     cardImg.mockReturnValue('/src/assets/images/analisis.png'); // Mock de la ruta de la imagen
//     render(<CardsFigure type="analisis" show={true} difficulty="EASY" />);
//     const img = screen.getByAltText('Carta de figura analisis');
//     expect(img).toBeInTheDocument();
//   });

//   it('debe mostrar "Bloqueado" cuando la carta no se muestra', () => {
//     render(<CardsFigure type="analisis" show={false} difficulty="EASY" />);
//     const blockedText = screen.getByText('Bloqueado');
//     expect(blockedText).toBeInTheDocument();
//   });

//   it('debe mostrar la dificultad en la parte inferior de la carta', () => {
//     render(<CardsFigure type="analisis" show={true} difficulty="HARD" />);
//     const difficultyText = screen.getByText('HARD');
//     expect(difficultyText).toBeInTheDocument();
//   });

//   it('debe tener clase de dificultad correcta', () => {
//     const { container } = render(<CardsFigure type="analisis" show={true} difficulty="HARD" />);
//     expect(container.firstChild).toHaveClass('border-red-500'); // Dificultad HARD
//   });
// });
