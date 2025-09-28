// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Loader from './components/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy loading con tipado
const Home = lazy<React.FC>(() => import('./pages/Home'));
const ProductDetail = lazy<React.FC>(() => import('./pages/ProductDetail'));
const Cart = lazy<React.FC>(() => import('./pages/Cart'));
const Login = lazy<React.FC>(() => import('./pages/Login'));
const Register = lazy<React.FC>(() => import('./pages/Register'));
const About = lazy<React.FC>(() => import('./pages/About'));
const Compra = lazy<React.FC>(() => import('./pages/Compra'));
const Contact = lazy<React.FC>(() => import('./pages/Contact'));
const Missing = lazy<React.FC>(() => import('./pages/Missing'));

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
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
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
};

export default App;
