import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VisionPage from './pages/VisionPage';
import GoalsPage from './pages/GoalsPage';
import KPIsPage from './pages/KPIsPage';
import NonNegotiablesPage from './pages/NonNegotiablesPage';
import SystemsPage from './pages/SystemsPage';
import PeoplePage from './pages/PeoplePage';
import ExecutionsPage from './pages/ExecutionsPage';
import ObstaclesPage from './pages/ObstaclesPage';
import ReflectionsPage from './pages/ReflectionsPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/vision" element={<VisionPage />} />
                    <Route path="/goals" element={<GoalsPage />} />
                    <Route path="/kpis" element={<KPIsPage />} />
                    <Route path="/non-negotiables" element={<NonNegotiablesPage />} />
                    <Route path="/systems" element={<SystemsPage />} />
                    <Route path="/people" element={<PeoplePage />} />
                    <Route path="/executions" element={<ExecutionsPage />} />
                    <Route path="/obstacles" element={<ObstaclesPage />} />
                    <Route path="/reflections" element={<ReflectionsPage />} />
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
