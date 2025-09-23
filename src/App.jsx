import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { UserCartProvider } from './context/UserCartContext'; // ✅ Context global

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
    <UserCartProvider>
      <div className="min-h-screen flex flex-col bg-gradient-radial from-gray-800 to-gray-950 text-white">
        <Router>
          {/* Navbar único */}
          <Navbar />

          <main className="flex-1">
            <Suspense fallback={<div className="p-8 text-white">Cargando...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/compra" element={<Compra />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Missing />} />
              </Routes>
            </Suspense>
          </main>

          {/* Footer único */}
          <Footer />
        </Router>
      </div>
    </UserCartProvider>
  );
}

export default App;
