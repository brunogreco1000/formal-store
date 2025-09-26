// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { UserCartProvider } from './context/UserCartContext';
import PrivateRoute from './components/PrivateRoute';
import Loader from './components/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy loading de páginas
const Home = lazy(() => import('./pages/Home'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const About = lazy(() => import('./pages/About'));
const Compra = lazy(() => import('./pages/Compra'));
const Contact = lazy(() => import('./pages/Contact'));
const Missing = lazy(() => import('./pages/Missing'));

function App() {
  return (
    <AuthProvider>
      <UserCartProvider>
        <Router>
          {/* Navbar fijo */}
          <Navbar />

          {/* Main con padding-top para que el navbar no tape nada */}
          <main className="flex-1 pt-20 min-h-screen bg-gradient-radial from-gray-800 to-gray-950 text-white">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute>
                      <Cart />
                    </PrivateRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route
                  path="/compra"
                  element={
                    <PrivateRoute>
                      <Compra />
                    </PrivateRoute>
                  }
                />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Missing />} />
              </Routes>
            </Suspense>
          </main>

          {/* Footer siempre abajo */}
          <Footer />

          {/* Toast notifications */}
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </UserCartProvider>
    </AuthProvider>
  );
}

export default App;
