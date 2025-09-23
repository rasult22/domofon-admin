import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import queryClient from './queries/client';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { HomeScreen } from './screens/HomeScreen';
import ResidentsScreen from './screens/ResidentsScreen';
import ApartmentsScreen from './screens/ApartmentsScreen';
import GatesScreen from './screens/GatesScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import { NotFound } from './screens/NotFound';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <HomeScreen />
              </ProtectedRoute>
            } />
            <Route path="/residents" element={
              <ProtectedRoute>
                <ResidentsScreen />
              </ProtectedRoute>
            } />
            <Route path="/apartments" element={
              <ProtectedRoute>
                <ApartmentsScreen />
              </ProtectedRoute>
            } />
            <Route path="/gates" element={
              <ProtectedRoute>
                <GatesScreen />
              </ProtectedRoute>
            } />
            <Route path="/statistics" element={
              <ProtectedRoute>
                <StatisticsScreen />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
