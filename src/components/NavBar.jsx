import React from 'react';
import { Link } from 'react-router-dom';
import { useUserCart } from '../context/UserCartContext';

const Navbar = () => {
  const { cart } = useUserCart(); // 👈 context

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900/80 text-white">
      <Link to="/" className="text-2xl font-bold tracking-widest">FormalStore</Link>
      <div className="space-x-6">
        <Link to="/cart" className="hover:text-blue-400 transition">
          Cart ({cart?.length ?? 0})  {/* 👈 protege contra undefined */}
        </Link>
        <Link to="/login" className="hover:text-blue-400 transition">Login</Link>
        <Link to="/register" className="hover:text-blue-400 transition">Register</Link>
        <Link to="/about" className="hover:text-blue-400 transition">About</Link>
        <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;
