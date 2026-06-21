import React from 'react';
import { MonitorSmartphone } from 'lucide-react';

interface ViewportWarningModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export const ViewportWarningModal: React.FC<ViewportWarningModalProps> = ({ isOpen, onDismiss }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 lg:p-8 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <MonitorSmartphone className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Desktop Recommended</h2>
          <p className="text-slate-600 mb-8">
            This examination interface is optimized for desktop and larger screens. You may experience layout issues or have less screen real estate on mobile devices or small tablets.
          </p>
          <div className="flex w-full">
            <button
              onClick={onDismiss}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-500/20"
            >
              I Understand, Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
