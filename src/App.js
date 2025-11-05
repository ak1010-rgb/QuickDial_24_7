import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { providers } from './data/providers';
import ServiceCard from './components/ServiceCard';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/Unauthorized';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import ForgotPassword from './pages/ForgotPassword';
import ProviderDetails from "./pages/ProviderDetails";
import ReviewPage from "./pages/ReviewPage";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:category" element={<CategoryPage key={location.pathname} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/provider/:uid" element={<ProviderDetails />} />
        <Route path="/review/:uid" element={<ReviewPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gray-100 p-6">
              <div className="max-w-6xl mx-auto px-4 py-6">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-blue-700">
                  Available Service Providers
                </h1>
                <div className="flex flex-wrap gap-4 justify-center">
                  {providers.map((p) => (
                    <div key={p.id}>
                      <ServiceCard {...p} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={4000} pauseOnHover theme="colored" />
    </Router>
  );
}

export default App;
