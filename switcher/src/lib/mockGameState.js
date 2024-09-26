// src/lib/mockData.js
// src/lib/mockData.js
export const mockPlayers = [
  {
    id: 1,
    name: "Jugador 1",
    turn: "PRIMERO", // Enum de turnos
    game_id: 101,
    game_state_id: 201,
    host: true,
  },
  {
    id: 2,
    name: "Jugador 2",
    turn: "SEGUNDO",
    game_id: 101,
    game_state_id: 201,
    host: false,
  },
  {
    id: 3,
    name: "Jugador 3",
    turn: "TERCERO",
    game_id: 101,
    game_state_id: 201,
    host: false,
  },
  {
    id: 4,
    name: "Jugador 4",
    turn: "CUARTO",
    game_id: 101,
    game_state_id: 201,
    host: false,
  },
];

export const mockMovementCards = [
  {
    id: 1,
    type: "linealContiguo",
    description: "Mueve en línea recta de forma continua",
    used: false,
    player_id: 1,
    game_id: 101,
  },
  {
    id: 2,
    type: "diagonalContiguo",
    description: "Mueve en diagonal, solo a espacios específicos",
    used: false,
    player_id: 1,
    game_id: 101,
  },
  {
    id: 3,
    type: "cruceEnLDerecha",
    description: "Mueve en forma de 'L' hacia la derecha",
    used: false,
    player_id: 1,
    game_id: 101,
  }
];

// Mock de cartas de figura basado en FigureCardSchema
export const mockFigureCards = [
  {
    id: 1,
    type: "analisis",
    show: false,
    difficulty: "EASY", // Ajustar según los valores de DifficultyEnum si los conoces
    player_id: 1,
    game_id: 101,
  },
  {
    id: 2,
    type: "aterrador",
    show: true,
    difficulty: "HARD",
    player_id: 1,
    game_id: 101,
  },
  {
    id: 3,
    type: "analisis",
    show: true,
    difficulty: "EASY",
    player_id: 1,
    game_id: 101,
  },
  {
    id: 4,
    type: "aterrador",
    show: true,
    difficulty: "EASY",
    player_id: 1,
    game_id: 101,
  },
  {
    id: 5,
    type: "analisis",
    show: true,
    difficulty: "EASY",
    player_id: 1,
    game_id: 101,
  },
];
//==========================================
// [{
//   id: 1,
//   type: "linealContiguo",
//   description: "Mueve en línea recta de forma continua",
//   used: false,
//   player_id: 1,
//   game_id: 1,
// },
// {
//   id: 2,
//   type: "diagonalContiguo",
//   description: "Mueve en diagonal, solo a espacios específicos",
//   used: false,
//   player_id: 1,
//   game_id: 1,
// },
// {
//   id: 3,
//   type: "diagonalContiguo",
//   description: "Mueve en forma de 'L' hacia la derecha",
//   used: false,
//   player_id: 1,
//   game_id: 1,
// }]
//==========================================

// export const mockCardsFigure = [
//   { id: 101, type: "aterrador", show: true, difficulty: "EASY" },
//   { id: 105, type: "analisis", show: true, difficulty: "EASY" },
//   { id: 106, type: "aterrador", show: true, difficulty: "EASY" },
//   { id: 102, type: "analisis", show: true, difficulty: "HARD" },
//   { id: 107, type: "analisis", show: true, difficulty: "EASY" },
//   { id: 108, type: "aterrador", show: true, difficulty: "EASY" },
//   { id: 103, type: "analisis", show: true, difficulty: "HARD" },
//   { id: 109, type: "aterrador", show: true, difficulty: "EASY" },
//   { id: 1010, type: "aterrador", show: true, difficulty: "EASY" },
//   { id: 104, type: "analisis", show: true, difficulty: "HARD" }
// ];

// export const mockCardsMovement = [
//   { id: 201, type: "cruceEnLDerecha", description: "Analiza la situación", used: false },
//   { id: 205, type: "cruceEnLIzquierda", description: "Analiza la situación", used: false },
//   { id: 206, type: "linealContiguo", description: "Analiza la situación", used: false },
//   { id: 202, type: "cruceEnLDerecha", description: "Analiza la situación", used: false },
//   { id: 207, type: "diagonalContiguo", description: "Analiza la situación", used: false },
//   { id: 208, type: "linealEspaciado", description: "Analiza la situación", used: false },
//   { id: 203, type: "cruceEnLIzquierda", description: "Analiza la situación", used: false },
//   { id: 209, type: "diagonalEspaciado", description: "Analiza la situación", used: false },
//   { id: 210, type: "linealEspaciado", description: "Analiza la situación", used: false },
//   { id: 204, type: "cruceEnLDerecha", description: "Analiza la situación", used: false }
// ];


// export const mockGameState = {
//   id: 1,
//   state: "PLAYING",
//   current_player: 2,
//   players: [
//     {
//       id: 1,
//       name: "Jugador 1",
//       turn: false,
//       figure_cards: [
//         { id: 101, type: "aterrador", show: true, difficulty: "EASY"},
//         { id: 105, type: "analisis", show: true, difficulty: "EASY"},
//         { id: 106, type: "aterrador", show: true, difficulty: "EASY"}
//       ],
//       movement_cards: [
//         { id: 201, type: "cruceEnLDerecha", description: "Analiza la situación", used: false },
//         { id: 205, type: "cruceEnLIzquierda", description: "Analiza la situación", used: false },
//         { id: 206, type: "linealContiguo", description: "Analiza la situación", used: false }
//       ]
//     },
//     {
//       id: 2,
//       name: "Jugador 2",
//       turn: true,
//       figure_cards: [
//         { id: 102,type: "analisis", show: true, difficulty: "HARD" },
//         { id: 107, type: "analisis", show: true, difficulty: "EASY"},
//         { id: 108, type: "aterrador", show: true, difficulty: "EASY"}
//       ],
//       movement_cards: [
//         { id: 202, type: "cruceEnLDerecha", description: "Analiza la situación", used: false },
//         { id: 207, type: "diagonalContiguo", description: "Analiza la situación", used: false },
//         { id: 208, type: "linealEspaciado", description: "Analiza la situación", used: false }
//       ]
//     },
//     {
//       id: 3,
//       name: "Jugador 3",
//       turn: false,
//       figure_cards: [
//         { id: 103,type: "analisis", show: true, difficulty: "HARD" },
//         { id: 109, type: "aterrador", show: true, difficulty: "EASY"},
//         { id: 1010, type: "aterrador", show: true, difficulty: "EASY"}
//       ],
//       movement_cards: [
//         { id: 203, type: "cruceEnLIzquierda", description: "Analiza la situación", used: false },
//         { id: 209, type: "diagonalEspaciado", description: "Analiza la situación", used: false },
//         { id: 210, type: "linealEspaciado", description: "Analiza la situación", used: false }
//       ]
//     },
//     {
//       id: 4,
//       name: "Jugador 4",
//       turn: false,
//       figure_cards: [
//         { id: 104,type: "analisis", show: true, difficulty: "HARD" },
//         { id: 107, type: "analisis", show: true, difficulty: "EASY"},
//         { id: 108, type: "aterrador", show: true, difficulty: "EASY"}
//       ],
//       movement_cards: [
//         { id: 204, type: "cruceEnLDerecha", description: "Analiza la situación", used: false },
//         { id: 209, type: "diagonalContiguo", description: "Analiza la situación", used: false },
//         { id: 210, type: "linealEspaciado", description: "Analiza la situación", used: false }
//       ]
//     }
//   ]
// };

// export const mockPlayers = [
//   {
//     id: 1,
//     name: "Jugador 1",
//     turn: true,
//     figure_cards: [
//       { id: 101, type: "aterrador", show: true, difficulty: "EASY" },
//       { id: 105, type: "analisis", show: true, difficulty: "EASY" },
//       { id: 106, type: "aterrador", show: true, difficulty: "EASY" }
//     ],
//     movement_cards: [
//       { id: 201, type: "cruceEnLDerecha", description: "Analiza la situación", used: false },
//       { id: 205, type: "cruceEnLIzquierda", description: "Analiza la situación", used: false },
//       { id: 206, type: "linealContiguo", description: "Analiza la situación", used: false }
//     ]
//   },
//   {
//     id: 2,
//     name: "Jugador 2",
//     turn: false,
//     figure_cards: [
//       { id: 102, type: "analisis", show: true, difficulty: "HARD" },
//       { id: 107, type: "analisis", show: true, difficulty: "EASY" },
//       { id: 108, type: "aterrador", show: true, difficulty: "EASY" }
//     ],
//     movement_cards: [
//       { id: 202, type: "cruceEnLDerecha", description: "Analiza la situación", used: false },
//       { id: 207, type: "diagonalContiguo", description: "Analiza la situación", used: false },
//       { id: 208, type: "linealEspaciado", description: "Analiza la situación", used: false }
//     ]
//   },
//   {
//     id: 3,
//     name: "Jugador 3",
//     turn: false,
//     figure_cards: [
//       { id: 103, type: "analisis", show: true, difficulty: "HARD" },
//       { id: 109, type: "aterrador", show: true, difficulty: "EASY" },
//       { id: 1010, type: "aterrador", show: true, difficulty: "EASY" }
//     ],
//     movement_cards: [
//       { id: 203, type: "cruceEnLIzquierda", description: "Analiza la situación", used: false },
//       { id: 209, type: "diagonalEspaciado", description: "Analiza la situación", used: false },
//       { id: 210, type: "linealEspaciado", description: "Analiza la situación", used: false }
//     ]
//   },
//   {
//     id: 4,
//     name: "Jugador 4",
//     turn: false,
//     figure_cards: [
//       { id: 104, type: "analisis", show: true, difficulty: "HARD" },
//       { id: 107, type: "analisis", show: true, difficulty: "EASY" },
//       { id: 108, type: "aterrador", show: true, difficulty: "EASY" }
//     ],
//     movement_cards: [
//       { id: 204, type: "cruceEnLDerecha", description: "Analiza la situación", used: false },
//       { id: 209, type: "diagonalContiguo", description: "Analiza la situación", used: false },
//       { id: 210, type: "linealEspaciado", description: "Analiza la situación", used: false }
//     ]
//   }
// ];
