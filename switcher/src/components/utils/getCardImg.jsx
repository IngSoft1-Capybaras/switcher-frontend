export const cardImg = (caseImg) => {
    switch (caseImg) {
      // Casos para las cartas de figuras
        case "TYPE_1":
          return '/src/assets/images/fige01.svg';
        case "TYPE_2":
          return '/src/assets/images/fige02.svg';
        case "TYPE_3":
          return '/src/assets/images/fige03.svg';
        case "TYPE_4":
          return '/src/assets/images/fig01.svg';
        case "TYPE_5":
          return '/src/assets/images/fig02.svg';
        case "TYPE_6":
          return '/src/assets/images/fig03.svg';

      // Casos para las cartas de movimiento
        case "LINEAL_CONT":
          return '/src/assets/images/cruceLinealContiguo.svg';
        case "LINEAL_ESP":
          return '/src/assets/images/cruceLinealEspaciado.svg';
        case "DIAGONAL_CONT":
          return '/src/assets/images/cruceDiagonalContiguo.svg';
        case "DIAGONAL_ESP":
          return '/src/assets/images/cruceDiagonalEspaciado.svg';
        case "EN_L_DER":
          return '/src/assets/images/cruceEnLDerecha.svg';
        case "EN_L_IZQ":
          return '/src/assets/images/cruceEnLIzquierda.svg';
        case "LINEAL_AL_LAT":
          return '/src/assets/images/cruceLinealLateral.svg';
        default:
          throw new Error('Tipo de carta no válido');
      }
}