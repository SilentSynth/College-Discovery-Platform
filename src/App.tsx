import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { CollegeDetailPage } from './pages/CollegeDetailPage';
import { CollegeListingPage } from './pages/CollegeListingPage';
import { ComparePage } from './pages/ComparePage';
import { PredictorPage } from './pages/PredictorPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<CollegeListingPage />} />
        <Route path="/college/:id" element={<CollegeDetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/predictor" element={<PredictorPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}