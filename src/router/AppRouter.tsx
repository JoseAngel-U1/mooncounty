import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import HomePage from '../pages/HomePage/HomePage';
import LevelSelectPage from '../pages/LevelSelectPage/LevelSelectPage';
import GamePage from '../pages/GamePage/GamePage';
import MoonJourneyPage from '../pages/MoonJourneyPage/MoonJourneyPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/levels" element={<LevelSelectPage />} />
          <Route path="/game/:levelId" element={<GamePage />} />
          <Route path="/moon-journey" element={<MoonJourneyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
