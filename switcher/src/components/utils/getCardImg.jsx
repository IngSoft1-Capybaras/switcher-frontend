export const cardImg = (caseImg) => {
    switch (caseImg) {
      // Casos para las cartas de figuras
        case "TYPE_1":
          return '/src/assets/images/TYPE1.png';
        case "TYPE_2":
          return '/src/assets/images/TYPE2.png';
        case "TYPE_3":
          return '/src/assets/images/TYPE3.png';
        case "TYPE_4":
          return '/src/assets/images/TYPE4.png';
        case "TYPE_5":
          return '/src/assets/images/TYPE5.png';
        case "TYPE_6":
          return '/src/assets/images/TYPE6.png';      

      // Casos para las cartas de movimiento
        case "LINEAL_CONT":
          return '/src/assets/images/cruceLinealContiguo.png';
        case "LINEAL_ESP":
          return '/src/assets/images/cruceLinealEspaciado.png';
        case "DIAGONAL_CONT":
          return '/src/assets/images/cruceDiagonalContiguo.png';
        case "DIAGONAL_ESP":
          return '/src/assets/images/cruceDiagonalEspaciado.png';
        case "EN_L_DER":
          return '/src/assets/images/cruceEnLDerecha.png';
        case "EN_L_IZQ":
          return '/src/assets/images/cruceEnLIzquierda.png';
        case "LINEAL_AL_LAT":
          return '/src/assets/images/cruceLinealLateral.png';
        default:
          throw new Error('Tipo de carta no válido');
      }
}