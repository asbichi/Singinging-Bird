import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, X, Minus, Plus, Delete, Equal } from 'lucide-react';

interface JambCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JambCalculator: React.FC<JambCalculatorProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isReset, setIsReset] = useState(true);

  const handleNum = (num: string) => {
    if (isReset || display === '0' || display === 'Error') {
      setDisplay(num);
      setIsReset(false);
    } else {
      setDisplay(prev => prev + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setIsReset(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setIsReset(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(prev => prev.slice(0, -1));
    } else {
      setDisplay('0');
      setIsReset(true);
    }
  };

  const handleCalculate = () => {
    if (!equation) return;
    try {
      const fullExpression = equation + display;
      // Sanitize input: only digits, spaces, and operators
      if (!/^[0-9.+\-*/\s]+$/.test(fullExpression)) {
        throw new Error('Invalid elements');
      }
      // Simple safe evaluation
      const result = Function(`"use strict"; return (${fullExpression})`)();
      if (typeof result === 'number' && !isNaN(result)) {
        // Handle floating points neatly
        const rounded = Number(result.toFixed(8));
        setDisplay(String(rounded));
      } else {
        setDisplay('Error');
      }
    } catch (e) {
      setDisplay('Error');
    }
    setEquation('');
    setIsReset(true);
  };

  const handleSqrt = () => {
    try {
      const val = parseFloat(display);
      if (val < 0) {
        setDisplay('Error');
      } else {
        const result = Math.sqrt(val);
        setDisplay(String(Number(result.toFixed(8))));
      }
    } catch {
      setDisplay('Error');
    }
    setIsReset(true);
  };

  const handleSquare = () => {
    try {
      const val = parseFloat(display);
      const result = val * val;
      setDisplay(String(Number(result.toFixed(8))));
    } catch {
      setDisplay('Error');
    }
    setIsReset(true);
  };

  const handlePercent = () => {
    try {
      const val = parseFloat(display);
      const result = val / 100;
      setDisplay(String(Number(result.toFixed(8))));
    } catch {
      setDisplay('Error');
    }
    setIsReset(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-24 left-6 z-50 pointer-events-none md:max-w-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="w-72 bg-gradient-to-b from-slate-800 to-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 overflow-hidden pointer-events-auto"
      >
        {/* Header (Draggable visual) */}
        <div className="bg-slate-950 p-3 flex justify-between items-center select-none border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <Calculator className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">JAMB Standard Calculator</span>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Display Screen */}
        <div className="bg-emerald-950/40 p-4 font-mono text-right border-b border-slate-800 h-24 flex flex-col justify-end">
          <div className="text-slate-500 text-xs truncate min-h-4 tracking-wider leading-none">
            {equation}
          </div>
          <div className="text-2xl font-bold text-amber-400 truncate tracking-wide select-all">
            {display}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="p-3 grid grid-cols-4 gap-1.5 bg-slate-900 font-mono text-sm">
          {/* Row 1 */}
          <button 
            type="button" 
            onClick={handleClear} 
            className="col-span-2 h-10 rounded bg-red-600 hover:bg-red-700 text-white font-bold transition-colors cursor-pointer"
          >
            CLEAR
          </button>
          <button 
            type="button" 
            onClick={handleBackspace} 
            className="h-10 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors flex items-center justify-center cursor-pointer"
            title="Backspace"
          >
            <Delete className="h-4 w-4" />
          </button>
          <button 
            type="button" 
            onClick={() => handleOperator('/')} 
            className="h-10 rounded bg-slate-700 hover:bg-slate-600 text-amber-400 font-bold transition-colors cursor-pointer"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button 
            type="button" 
            onClick={handleSqrt} 
            className="h-10 rounded bg-slate-800 hover:bg-slate-700 text-amber-500 transition-colors cursor-pointer"
            title="Square Root"
          >
            √
          </button>
          <button 
            type="button" 
            onClick={handleSquare} 
            className="h-10 rounded bg-slate-800 hover:bg-slate-700 text-amber-500 transition-colors cursor-pointer"
            title="Square"
          >
            x²
          </button>
          <button 
            type="button" 
            onClick={handlePercent} 
            className="h-10 rounded bg-slate-800 hover:bg-slate-700 text-amber-500 transition-colors cursor-pointer"
            title="Percentage"
          >
            %
          </button>
          <button 
            type="button" 
            onClick={() => handleOperator('*')} 
            className="h-10 rounded bg-slate-700 hover:bg-slate-600 text-amber-400 font-bold transition-colors cursor-pointer"
          >
            ×
          </button>

          {/* Row 3 */}
          <button 
            type="button" 
            onClick={() => handleNum('7')} 
            className="h-10 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            7
          </button>
          <button 
            type="button" 
            onClick={() => handleNum('8')} 
            className="h-10 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            8
          </button>
          <button 
            type="button" 
            onClick={() => handleNum('9')} 
            className="h-10 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            9
          </button>
          <button 
            type="button" 
            onClick={() => handleOperator('-')} 
            className="h-10 rounded bg-slate-700 hover:bg-slate-600 text-amber-400 font-bold transition-colors flex items-center justify-center cursor-pointer"
          >
            <Minus className="h-4 w-4" />
          </button>

          {/* Row 4 */}
          <button 
            type="button" 
            onClick={() => handleNum('4')} 
            className="h-10 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            4
          </button>
          <button 
            type="button" 
            onClick={() => handleNum('5')} 
            className="h-10 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            5
          </button>
          <button 
            type="button" 
            onClick={() => handleNum('6')} 
            className="h-10 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            6
          </button>
          <button 
            type="button" 
            onClick={() => handleOperator('+')} 
            className="h-10 rounded bg-slate-700 hover:bg-slate-600 text-amber-400 font-bold transition-colors flex items-center justify-center cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>

          {/* Row 5 */}
          <button 
            type="button" 
            onClick={() => handleNum('1')} 
            className="h-10 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            1
          </button>
          <button 
            type="button" 
            onClick={() => handleNum('2')} 
            className="h-10 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            2
          </button>
          <button 
            type="button" 
            onClick={() => handleNum('3')} 
            className="h-10 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            3
          </button>
          <button 
            type="button" 
            onClick={handleCalculate} 
            className="row-span-2 h-[5.5rem] rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-colors flex items-center justify-center cursor-pointer"
            title="Result"
          >
            <Equal className="h-5 w-5" />
          </button>

          {/* Row 6 */}
          <button 
            type="button" 
            onClick={() => handleNum('0')} 
            className="col-span-2 h-10 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            0
          </button>
          <button 
            type="button" 
            onClick={() => handleNum('.')} 
            className="h-10 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            .
          </button>
        </div>
      </motion.div>
    </div>
  );
};
