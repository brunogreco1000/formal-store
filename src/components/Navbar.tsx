// src/components/Navbar.tsx
import React, { useState } from 'react';
import { NavLink, Link, NavLinkProps } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserCart } from '../context/UserCartContext';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

const Navbar: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const { cart } = useUserCart();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  // Tipamos correctamente el parámetro de NavLink
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `hover:text-blue-400 transition ${isActive ? 'text-blue-400 font-semibold' : ''}`;

  return (
    <nav className="bg-gray-900/90 text-white p-4 fixed w-full z-50 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-widest">FormalStore</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <NavLink to="/" className={linkClasses}>Home</NavLink>
          <NavLink to="/about" className={linkClasses}>About</NavLink>
          <NavLink to="/contact" className={linkClasses}>Contact</NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/cart" className={linkClasses}>
                Cart ({cart?.length ?? 0})
              </NavLink>
              <NavLink to="/compra" className={linkClasses}>Compra</NavLink>
              <button
                onClick={logout}
                className="hover:text-red-500 transition font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClasses}>Login</NavLink>
              <NavLink to="/register" className={linkClasses}>Register</NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 mt-2 p-4 rounded shadow-lg flex flex-col gap-4">
          <NavLink to="/" className={linkClasses} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/about" className={linkClasses} onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" className={linkClasses} onClick={() => setMenuOpen(false)}>Contact</NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/cart" className={linkClasses} onClick={() => setMenuOpen(false)}>
                Cart ({cart?.length ?? 0})
              </NavLink>
              <NavLink to="/compra" className={linkClasses} onClick={() => setMenuOpen(false)}>Compra</NavLink>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="hover:text-red-500 transition font-semibold text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClasses} onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" className={linkClasses} onClick={() => setMenuOpen(false)}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
