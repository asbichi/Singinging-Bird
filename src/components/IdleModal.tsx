import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface IdleModalProps {
  isOpen: boolean;
  onContinue: () => void;
}

export const IdleModal: React.FC<IdleModalProps> = ({ isOpen, onContinue }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 lg:p-8 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Are you still there?</h2>
          <p className="text-slate-600 mb-8">
            We haven't detected any activity for 5 minutes. Please confirm you are still active to continue your exam.
          </p>
          <div className="flex w-full">
            <button
              onClick={onContinue}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-500/20"
            >
              I'm Still Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
