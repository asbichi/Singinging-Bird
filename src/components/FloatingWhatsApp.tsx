import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-4 border border-gray-100 w-64 origin-bottom-right transition-all">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="font-bold text-gray-800">Chat with us on WhatsApp</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3">
            <a 
              href="https://wa.me/2348069771954" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full bg-[#25D366] text-white p-3 rounded-xl hover:bg-[#128C7E] transition-colors"
            >
              <MessageCircle size={20} />
              <span className="font-bold text-sm">0806 977 1954</span>
            </a>
            <a 
              href="https://wa.me/2348039197650" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full bg-[#25D366] text-white p-3 rounded-xl hover:bg-[#128C7E] transition-colors"
            >
              <MessageCircle size={20} />
              <span className="font-bold text-sm">0803 919 7650</span>
            </a>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'scale-0' : 'scale-100'} bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center`}
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle size={32} />
      </button>
    </div>
  );
};

export default FloatingWhatsApp;
