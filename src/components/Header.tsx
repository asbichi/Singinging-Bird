import React, { useState, useEffect } from 'react';
import { Clock, Wifi, WifiOff, Maximize, AlertCircle } from 'lucide-react';
import { CandidateInfo } from '../types';

interface HeaderProps {
  candidate: CandidateInfo;
  formattedTime: string;
  isWarning: boolean;
  isCritical: boolean;
  isFullscreen: boolean;
  onToggleFullscreen?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    candidate, 
    formattedTime, 
    isWarning, 
    isCritical,
    isFullscreen,
    onToggleFullscreen
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
      };
  }, []);

  return (
    <header className="bg-slate-900 text-white flex-shrink-0 z-20 shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-stretch">
        
        {/* Candidate & Exam Info */}
        <div className="p-4 flex-1 border-b sm:border-b-0 sm:border-r border-slate-700/50 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-lg font-bold tracking-tight text-red-500">{candidate.examTitle}</h1>
                {!isOnline && (
                    <span className="inline-flex items-center text-xs font-bold text-red-100 bg-red-600 px-2.5 py-0.5 rounded-full shadow-sm animate-pulse border border-red-500">
                        <WifiOff className="w-3 h-3 mr-1" />
                        Offline Mode • Working Offline (Saved Locally)
                    </span>
                )}
            </div>
            <div className="flex items-center text-slate-400 text-sm mt-1 gap-3">
                <span className="font-medium text-slate-300">{candidate.name}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <span className="font-mono">{candidate.id}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <span>{candidate.subject}</span>
            </div>
        </div>

        {/* Live Timer */}
        <div className={`p-4 flex flex-col justify-center items-center font-mono tracking-wider border-b sm:border-b-0 sm:border-r border-slate-700/50 min-w-[200px] transition-colors ${isCritical ? 'bg-red-600 text-white' : isWarning ? 'bg-orange-500 text-white' : 'bg-slate-800'}`}>
            <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-sans uppercase tracking-widest font-semibold opacity-80">Time Remaining</span>
            </div>
            <span className="text-3xl font-bold">{formattedTime}</span>
        </div>

        {/* Status Indicators */}
        <div className="p-4 flex flex-col justify-center gap-3 min-w-[180px] bg-slate-800/50">
             <div className="flex items-center justify-between text-xs font-medium">
                 <span className="text-slate-400">Connection</span>
                 {isOnline ? (
                     <span className="flex items-center text-green-400 bg-green-400/10 px-2.5 py-0.5 rounded border border-green-500/20">
                         <Wifi className="w-3 h-3 mr-1.5 text-green-400" />
                         Live Connection
                     </span>
                 ) : (
                     <span className="flex items-center text-red-400 bg-red-400/10 px-2.5 py-0.5 rounded animate-pulse border border-red-500/30" title="Offline. Your answers are being securely saved & cached locally by the Service Worker.">
                         <WifiOff className="w-3 h-3 mr-1.5 text-red-400" />
                         Offline (Cached Locally)
                     </span>
                 )}
             </div>
             <div className="flex items-center justify-between text-xs font-medium">
                 <span className="text-slate-400">Security</span>
                 <div className="flex items-center gap-2">
                     {onToggleFullscreen && (
                         <button 
                             onClick={onToggleFullscreen} 
                             className="text-slate-400 hover:text-white transition-colors p-1"
                             title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                         >
                             <Maximize className="w-3 h-3" />
                         </button>
                     )}
                     {isFullscreen ? (
                         <span className="flex items-center text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                            <Maximize className="w-3 h-3 mr-1.5" />
                            Locked
                        </span>
                     ) : (
                         <span className="flex items-center text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded animate-pulse">
                            <AlertCircle className="w-3 h-3 mr-1.5" />
                            Exposed
                        </span>
                     )}
                 </div>
             </div>
        </div>

      </div>
    </header>
  );
};
