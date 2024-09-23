export const cardImg = (caseImg) => {
    switch (caseImg) {
        case "analisis":    /* depende de la definicion del back */
          return '/src/assets/images/analisis.png';
        case "aterrador":
          return '/src/assets/images/aterrador.png';
        default:
          throw new Error('Tipo de carta no válido');
      }
}