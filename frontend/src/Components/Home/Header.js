"use client"

import { useState } from "react"
import { Menu, X } from "react-feather"
import { motion } from "framer-motion"

const Header = ({ scrollToTransaction }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.header 
      className="bg-[#33363d] shadow-lg sticky top-0 z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src="/logos/logo.png" alt="Logo" className="h-16 w-auto" />
            <div className="text-2xl font-extrabold text-white">Coin Control</div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Home', 'Features', 'Transactions', 'Support', 'Profile'].map((item, index) => (
              <motion.a 
                key={item} 
                href="#" 
                className="text-white hover:text-gray-400 transition-all duration-300 font-medium transform hover:scale-105"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={(e) => item === 'Transactions' ? (e.preventDefault(), scrollToTransaction()) : null}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-6">
            <motion.button 
              className="text-white hover:text-gray-400 font-medium focus:outline-none transition-all duration-200"
              whileHover={{ scale: 1.1 }}
            >
              Sign In
            </motion.button>
            <motion.button 
              className="bg-gray-700 text-white font-medium py-2 px-6 rounded-full hover:bg-gray-600 transition-colors focus:outline-none"
              whileHover={{ scale: 1.1 }}
            >
              Register
            </motion.button>
          </div>

          {/* Mobile Navigation Button */}
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-gray-400 transition-all duration-300">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden bg-[#33363d] bg-opacity-90 py-6 px-4 shadow-xl rounded-lg absolute top-0 left-0 right-0 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <nav className="flex flex-col items-center space-y-6">
            {['Home', 'Features', 'Transactions', 'Support', 'Profile'].map((item, index) => (
              <motion.a 
                key={item} 
                href="#" 
                className="text-white hover:text-gray-400 transition-all duration-300 font-medium transform hover:scale-105"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={(e) => item === 'Transactions' ? (e.preventDefault(), scrollToTransaction(), setIsOpen(false)) : setIsOpen(false)}
              >
                {item}
              </motion.a>
            ))}
            <div className="flex flex-col space-y-6 pt-6 border-t border-gray-700">
              <motion.button 
                className="text-white hover:text-gray-400 font-medium py-2 focus:outline-none"
                whileHover={{ scale: 1.1 }}
              >
                Sign In
              </motion.button>
              <motion.button 
                className="bg-gray-700 text-white font-medium py-2 px-6 rounded-full hover:bg-gray-600 transition-colors focus:outline-none"
                whileHover={{ scale: 1.1 }}
              >
                Register
              </motion.button>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}

export default Header 