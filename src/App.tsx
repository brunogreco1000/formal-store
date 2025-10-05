import React, { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Footer, PrivateRoute, Loader } from './components';
import LazyPage from './components/LazyPage';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy loading
const Home = lazy(() => import('./pages/Home'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const About = lazy(() => import('./pages/About'));
const Compra = lazy(() => import('./pages/Compra'));
const Contact = lazy(() => import('./pages/Contact'));
const Missing = lazy(() => import('./pages/Missing'));

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />

      <main className="flex-1 pt-20 min-h-screen bg-gradient-to-b from-gray-800 to-gray-950 text-white">
        <Routes>
          <Route path="/" element={<ErrorBoundary><LazyPage component={Home} /></ErrorBoundary>} />
          <Route path="/product/:id" element={<ErrorBoundary><LazyPage component={ProductDetail} /></ErrorBoundary>} />
          <Route path="/login" element={<ErrorBoundary><LazyPage component={Login} /></ErrorBoundary>} />
          <Route path="/register" element={<ErrorBoundary><LazyPage component={Register} /></ErrorBoundary>} />
          <Route path="/about" element={<ErrorBoundary><LazyPage component={About} /></ErrorBoundary>} />
          <Route path="/contact" element={<ErrorBoundary><LazyPage component={Contact} /></ErrorBoundary>} />

          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<ErrorBoundary><LazyPage component={Cart} /></ErrorBoundary>} />
            <Route path="/compra" element={<ErrorBoundary><LazyPage component={Compra} /></ErrorBoundary>} />
          </Route>

          <Route path="*" element={<ErrorBoundary><LazyPage component={Missing} /></ErrorBoundary>} />
        </Routes>
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </Router>
  );
};

export default App;
