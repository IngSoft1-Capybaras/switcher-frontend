// src/components/cardsMoviment.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import CardsMoviment from '../components/ui/cardsMoviment';

describe('CardsMoviment', () => {
  it('debe mostrar la carta de movimiento cuando no está usada', () => {
    render(<CardsMoviment type="test-card" used={false} />);
    const img = screen.getByAltText('Carta de movimiento');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('test-card')); // Verifica que la imagen tiene el tipo correcto
  });

  it('debe mostrar "Carta Usada" cuando la carta está usada', () => {
    render(<CardsMoviment type="test-card" used={true} />);
    const usedText = screen.getByText('Carta Usada');
    expect(usedText).toBeInTheDocument();
  });

  it('debe tener clase "opacity-50" cuando la carta está usada', () => {
    const { container } = render(<CardsMoviment type="test-card" used={true} />);
    expect(container.firstChild).toHaveClass('opacity-50');
  });
});
