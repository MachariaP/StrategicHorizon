import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import ExecutionsView from './pages/ExecutionsView';
import Login from './pages/Login';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route wrapper component
// Note: Token validity is checked by API interceptors on each request.
// Invalid/expired tokens will trigger 401 response and automatic redirect to login.
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/executions" element={<ExecutionsView />} />
            {/* Placeholder routes for other modules */}
            <Route path="/vision" element={<div className="p-6"><h2 className="text-2xl font-bold">Vision & Theme</h2><p>Coming soon...</p></div>} />
            <Route path="/goals" element={<div className="p-6"><h2 className="text-2xl font-bold">Goals</h2><p>Coming soon...</p></div>} />
            <Route path="/kpis" element={<div className="p-6"><h2 className="text-2xl font-bold">KPIs</h2><p>Coming soon...</p></div>} />
            <Route path="/non-negotiables" element={<div className="p-6"><h2 className="text-2xl font-bold">Non-Negotiables</h2><p>Coming soon...</p></div>} />
            <Route path="/systems" element={<div className="p-6"><h2 className="text-2xl font-bold">Systems</h2><p>Coming soon...</p></div>} />
            <Route path="/people" element={<div className="p-6"><h2 className="text-2xl font-bold">People</h2><p>Coming soon...</p></div>} />
            <Route path="/obstacles" element={<div className="p-6"><h2 className="text-2xl font-bold">Obstacles</h2><p>Coming soon...</p></div>} />
            <Route path="/reflections" element={<div className="p-6"><h2 className="text-2xl font-bold">Quarterly Reflections</h2><p>Coming soon...</p></div>} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
