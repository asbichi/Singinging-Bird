import { useState } from 'react';
import { Music, Bird, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = ['HOME', 'ABOUT', 'GALLERY', 'MEDIA', 'MARKET', 'MEMBERS', 'CONTACT'];

  const isActive = (item: string) => {
    const path = item === 'HOME' ? '/' : `/${item.toLowerCase()}`;
    return location.pathname === path;
  };

  return (
    <nav className="absolute top-0 w-full z-50 bg-white/40 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Music className="text-secondary" size={24} />
          </div>
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center ml-1">
            <Bird className="text-white" size={24} />
          </div>
          <span className="font-heading font-bold text-primary text-xl tracking-tight uppercase ml-2">SBA <span className="text-accent">Kaduna</span></span>
        </Link>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 font-semibold text-primary/80 items-center">
          {navItems.map((item) => (
            <Link 
              key={item} 
              to={item === 'HOME' ? '/' : `/${item.toLowerCase()}`} 
              className={`hover:text-primary transition-colors relative py-1 ${
                isActive(item) ? 'text-primary font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary' : ''
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Hamburger Buttons for Mobile */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-primary hover:bg-white/30 rounded-xl transition-colors focus:outline-none relative w-10 h-10 flex items-center justify-center"
          aria-label="Toggle Navigation Menu"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute flex items-center justify-center"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </button>
      </div>

      {/* Mobile Nav Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-b border-primary/5 shadow-xl absolute w-full left-0 z-50 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-4 font-semibold text-primary/80">
              {navItems.map((item) => (
                <Link 
                  key={item} 
                  to={item === 'HOME' ? '/' : `/${item.toLowerCase()}`} 
                  onClick={() => setIsOpen(false)}
                  className={`py-2.5 px-4 rounded-xl hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-between group ${
                    isActive(item) ? 'bg-primary/10 text-primary font-bold' : ''
                  }`}
                >
                  <span>{item}</span>
                  {isActive(item) && (
                    <motion.div 
                      layoutId="activeIndicatorMobile"
                      className="w-1.5 h-1.5 rounded-full bg-accent"
                    />
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
