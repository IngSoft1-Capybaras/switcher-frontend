import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import { GameProvider } from './context/GameContext';

// const Home = lazy(() => import('./pages/Home'));
// const Games = lazy(() => import('./Games'));
const ActiveGame = lazy(() => import('./pages/ActiveGame'));

const Loader = () => <div>Loading...</div>;

const Main = () => (
  <GameProvider>
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/games" element={<Games />} /> */}
          {/* <Route path="/games/create" element={<CreateGame />} /> */}
          {/* <Route path="/games/lobby/:gameId" element={<Lobby />} /> */}
          <Route path="/games/ongoing/:gameId" element={<ActiveGame />} />
          {/* <Route path="/winner" element={<Winner />} /> */}
        </Routes>
      </Suspense>
    </Router>
  </GameProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
