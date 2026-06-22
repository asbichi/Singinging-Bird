import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Download, Volume2, SkipBack } from 'lucide-react';

const BirdAudioPlayer = ({ audioUrl, birdName }: { audioUrl: string; birdName: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState('0:00');
  const [currentTime, setCurrentTime] = useState('0:00');

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize WaveSurfer
    waveSurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#4FC3F7', // Sky Blue (Accent)
      progressColor: '#1B5E20', // Forest Green (Primary)
      cursorColor: '#FDD835', // Canary Yellow (Secondary)
      barWidth: 3,
      barRadius: 3,
      height: 80,
      normalize: true, // Makes quiet songs look better
    });

    // Load the bird song
    waveSurferRef.current.load(audioUrl);

    // Event Listeners
    waveSurferRef.current.on('ready', () => {
      if(waveSurferRef.current) {
        const totalTime = waveSurferRef.current.getDuration();
        setDuration(formatTime(totalTime));
      }
    });

    waveSurferRef.current.on('audioprocess', () => {
      if(waveSurferRef.current) {
        const current = waveSurferRef.current.getCurrentTime();
        setCurrentTime(formatTime(current));
      }
    });

    waveSurferRef.current.on('error', (err) => {
      console.warn('WaveSurfer error:', err);
    });

    waveSurferRef.current.on('finish', () => setIsPlaying(false));

    // Cleanup on unmount
    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
      }
    };
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayPause = () => {
    if (waveSurferRef.current) {
      waveSurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-nature-100 w-full max-w-2xl mx-auto mb-8 relative z-10">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-primary font-heading font-bold text-lg">{birdName}</h4>
          <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Kaduna Singing Selection</span>
        </div>
        <a 
          href={audioUrl} 
          download 
          className="p-2 bg-nature-50 hover:bg-nature-100 rounded-full text-primary transition-colors"
          title="Download Song"
        >
          <Download size={20} />
        </a>
      </div>

      {/* The Waveform Canvas */}
      <div ref={containerRef} className="mb-4" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => waveSurferRef.current?.stop()} 
            className="p-2 text-gray-400 hover:text-primary transition-colors"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/20"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          
          <div className="text-sm font-mono font-bold text-gray-600">
            {currentTime} <span className="text-gray-300">/</span> {duration}
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <Volume2 size={18} />
          <input 
            type="range" 
            min="0" max="1" step="0.1" 
            className="w-20 accent-primary" 
            onChange={(e) => waveSurferRef.current?.setVolume(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default BirdAudioPlayer;
