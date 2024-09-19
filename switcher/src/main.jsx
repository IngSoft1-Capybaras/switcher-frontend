import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import { GameProvider } from './contexts/GameContext';

const Home = lazy(() => import('./pages/Home'));
// const Games = lazy(() => import('./Games'));

const Loader = () => <div>Loading...</div>;

const Main = () => (
  <GameProvider>
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          {/* <Route path="/games" element={<Games />} /> */}
          {/* <Route path="/games/:gameId" element={<ActiveGame />} /> */}
        </Routes>
      </Suspense>
    </Router>
  </GameProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
