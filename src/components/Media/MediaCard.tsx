import React from 'react';
import { Play, Image as ImageIcon, Music } from 'lucide-react';

export interface MediaItem {
  _id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'image';
  category: string;
  thumbnail?: string;
  audioUrl?: string; // only if audio
}

const MediaCard = ({ item }: { item: MediaItem, key?: React.Key }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-2 border border-nature-100">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img 
          src={item.thumbnail || 'https://images.unsplash.com/photo-1552727451-6fdeadaebaa7?auto=format&fit=crop&q=80&w=600'} 
          alt={item.title} 
          className="h-full w-full object-cover transition-transform group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
        <span className="absolute top-3 right-3 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
          {item.category}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-primary mb-2">
          {item.type === 'video' && <Play size={16} />}
          {item.type === 'audio' && <Music size={16} />}
          {item.type === 'image' && <ImageIcon size={16} />}
          <span className="text-xs uppercase font-semibold">{item.type}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{item.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</p>
      </div>
    </div>
  );
};

export default MediaCard;
