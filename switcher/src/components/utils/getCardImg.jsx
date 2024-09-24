export const cardImg = (caseImg) => {
    switch (caseImg) {
      // Casos para las cartas de figuras
        case "analisis":    /* depende de la definicion del back */
          return '/src/assets/images/analisis.png';
        case "aterrador":
          return '/src/assets/images/aterrador.png';

      // Casos para las cartas de movimiento
        case "linealContiguo":
          return '/src/assets/images/cruceLinealContiguo.png';
        case "linealEspaciado":
          return '/src/assets/images/cruceLinealEspaciado.png';
        case "diagonalContiguo":
          return '/src/assets/images/cruceDiagonalContiguo.png';
        case "diagonalEspaciado":
          return '/src/assets/images/cruceDiagonalEspaciado.png';
        case "cruceEnLDerecha":
          return '/src/assets/images/cruceEnLDerecha.png';
        case "cruceEnLIzquierda":
          return '/src/assets/images/cruceEnLIzquierda.png';
        case "cruceLinealLateral":
          return '/src/assets/images/cruceLinealLateral.png';
        default:
          throw new Error('Tipo de carta no válido');
      }
}