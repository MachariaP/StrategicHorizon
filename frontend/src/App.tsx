// src/App.tsx - Fixed version
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
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

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsChecking(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl animate-pulse" />
            <div className="relative text-6xl mb-4 animate-bounce-slow">🌟</div>
          </div>
          <p className="text-purple-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/app/*"
          element={
            <PrivateRoute>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex min-h-screen"
              >
                <Sidebar />
                <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 overflow-hidden relative">
                  {/* Animated background elements */}
                  <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
                  </div>
                  
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      <Routes location={location} key={location.pathname}>
                        <Route path="/" element={
                          <PageTransition>
                            <Dashboard />
                          </PageTransition>
                        } />
                        <Route path="/vision" element={
                          <PageTransition>
                            <VisionPage />
                          </PageTransition>
                        } />
                        <Route path="/goals" element={
                          <PageTransition>
                            <GoalsPage />
                          </PageTransition>
                        } />
                        <Route path="/kpis" element={
                          <PageTransition>
                            <KPIsPage />
                          </PageTransition>
                        } />
                        <Route path="/non-negotiables" element={
                          <PageTransition>
                            <NonNegotiablesPage />
                          </PageTransition>
                        } />
                        <Route path="/systems" element={
                          <PageTransition>
                            <SystemsPage />
                          </PageTransition>
                        } />
                        <Route path="/people" element={
                          <PageTransition>
                            <PeoplePage />
                          </PageTransition>
                        } />
                        <Route path="/executions" element={
                          <PageTransition>
                            <ExecutionsPage />
                          </PageTransition>
                        } />
                        <Route path="/obstacles" element={
                          <PageTransition>
                            <ObstaclesPage />
                          </PageTransition>
                        } />
                        <Route path="/reflections" element={
                          <PageTransition>
                            <ReflectionsPage />
                          </PageTransition>
                        } />
                      </Routes>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </PrivateRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;