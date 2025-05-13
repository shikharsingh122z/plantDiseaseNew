import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLeaf, FaChevronDown, FaBars, FaTimes, FaUser, FaHistory, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="container">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <FaLeaf className={`text-2xl ${isScrolled ? 'text-primary-600' : 'text-white'}`} />
            <span className={`${isScrolled ? 'text-gray-900' : 'text-white'}`}>PlantG</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" label="Home" isScrolled={isScrolled} isActive={isActive('/')} />
            <NavLink to="/about" label="About" isScrolled={isScrolled} isActive={isActive('/about')} />
            <NavLink to="/features" label="Features" isScrolled={isScrolled} isActive={isActive('/features')} />
            {isAuthenticated && (
              <>
                <NavLink to="/analysis" label="Plant Analysis" isScrolled={isScrolled} isActive={isActive('/analysis')} />
                <NavLink to="/history" label="History" isScrolled={isScrolled} isActive={isActive('/history')} />
              </>
            )}
            <NavLink to="/contact" label="Contact" isScrolled={isScrolled} isActive={isActive('/contact')} />
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  className={`${
                    isScrolled 
                      ? 'text-gray-700 hover:text-primary-600' 
                      : 'text-white/90 hover:text-white'
                  } font-medium transition-colors`}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className={`btn ${
                    isScrolled 
                      ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                      : 'bg-white hover:bg-gray-100 text-primary-600'
                  } px-5 py-2`}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  } font-medium`}
                >
                  <span>Hello, {user?.name}</span>
                  <FaChevronDown className="text-xs" />
                </button>
                
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
                  >
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaTachometerAlt className="mr-2" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/history"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaHistory className="mr-2" />
                      <span>History</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                    >
                      <FaSignOutAlt className="mr-2" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen 
              ? <FaTimes className={isScrolled ? 'text-gray-900' : 'text-white'} size={24} /> 
              : <FaBars className={isScrolled ? 'text-gray-900' : 'text-white'} size={24} />
            }
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="container py-4">
            <div className="flex flex-col space-y-4">
              <MobileNavLink to="/" label="Home" isActive={isActive('/')} onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink to="/about" label="About" isActive={isActive('/about')} onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink to="/features" label="Features" isActive={isActive('/features')} onClick={() => setIsMobileMenuOpen(false)} />
              {isAuthenticated && (
                <>
                  <MobileNavLink to="/analysis" label="Plant Analysis" isActive={isActive('/analysis')} onClick={() => setIsMobileMenuOpen(false)} />
                  <MobileNavLink to="/dashboard" label="Dashboard" isActive={isActive('/dashboard')} onClick={() => setIsMobileMenuOpen(false)} />
                  <MobileNavLink to="/history" label="History" isActive={isActive('/history')} onClick={() => setIsMobileMenuOpen(false)} />
                </>
              )}
              <MobileNavLink to="/contact" label="Contact" isActive={isActive('/contact')} onClick={() => setIsMobileMenuOpen(false)} />
              
              <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col space-y-3">
                {!isAuthenticated ? (
                  <>
                    <Link 
                      to="/login" 
                      className="text-gray-700 hover:text-primary-600 font-medium w-full py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="btn bg-primary-500 hover:bg-primary-600 text-white w-full py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center text-gray-700 hover:text-primary-600 font-medium w-full py-2"
                  >
                    <FaSignOutAlt className="mr-2" />
                    <span>Logout ({user?.name})</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

interface NavLinkProps {
  to: string;
  label: string;
  isScrolled: boolean;
  isActive: boolean;
}

const NavLink = ({ to, label, isScrolled, isActive }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={`relative font-medium transition-colors ${
        isActive
          ? isScrolled ? 'text-primary-600' : 'text-white'
          : isScrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white/90 hover:text-white'
      }`}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className={`absolute -bottom-1 left-0 right-0 h-0.5 ${isScrolled ? 'bg-primary-500' : 'bg-white'}`}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  )
}

interface MobileNavLinkProps {
  to: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const MobileNavLink = ({ to, label, isActive, onClick }: MobileNavLinkProps) => {
  return (
    <Link
      to={to}
      className={`py-2 block transition-colors ${
        isActive ? 'text-primary-600 font-medium' : 'text-gray-700 hover:text-primary-600'
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  )
}

export default Navbar 