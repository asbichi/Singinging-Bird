import React, { useState, useEffect } from 'react';
import { Filter, Music, Video, Image as ImageIcon } from 'lucide-react';
import MediaCard, { MediaItem } from './MediaCard';

const dummyData: MediaItem[] = [
  { _id: '1', title: 'Morning Song - Harz Roller', description: 'Deep bass notes recorded at sunrise', type: 'audio', category: 'Harz Roller' },
  { _id: '2', title: 'Kaduna Exhibition Highlights', description: 'Best moments from 2024 showcase', type: 'video', category: 'General', thumbnail: 'https://images.unsplash.com/photo-1543372990-bc10cfbe9fac?auto=format&fit=crop&q=80&w=600' },
  { _id: '3', title: 'Spanish Timbrado - Champion', description: 'Multi-variety notes from our premium breeder', type: 'audio', category: 'Spanish Timbrado' },
  { _id: '4', title: 'Yellow Canary Pair', description: 'Breeding pair looking healthy', type: 'image', category: 'Breeding', thumbnail: 'https://images.unsplash.com/photo-1550853024-fae8cd4be47f?auto=format&fit=crop&q=80&w=600' },
  { _id: '5', title: 'Malinois Waterslager', description: 'Incredible water notes', type: 'audio', category: 'Malinois Waterslager' },
  { _id: '6', title: 'Diet prep for competition', description: 'How to feed your bird', type: 'video', category: 'Care', thumbnail: 'https://images.unsplash.com/photo-1522926193341-e9eb1b36bb86?auto=format&fit=crop&q=80&w=600' },
  { _id: '7', title: 'Beautiful Canary', description: 'Close up view of canary', type: 'image', category: 'General', thumbnail: 'https://i.ibb.co/chyx8Cp2/1c6f772b-8a1d-49e7-aed4-63596c0d7b00.jpg' },
];

const FilterButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon?: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
      active ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'
    }`}
  >
    {icon} {label}
  </button>
);

const MediaGrid = ({ defaultFilter = 'all' }: { defaultFilter?: string }) => {
  const [filter, setFilter] = useState(defaultFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sba_media');
    if (saved) {
      setMediaItems(JSON.parse(saved));
    } else {
      setMediaItems(dummyData);
      localStorage.setItem('sba_media', JSON.stringify(dummyData));
    }
  }, []);

  const filteredItems = mediaItems.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex bg-white shadow-sm rounded-full p-1 border border-nature-100 overflow-x-auto w-full md:w-auto">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
          <FilterButton active={filter === 'video'} onClick={() => setFilter('video')} icon={<Video size={16}/>} label="Videos" />
          <FilterButton active={filter === 'audio'} onClick={() => setFilter('audio')} icon={<Music size={16}/>} label="Singing" />
          <FilterButton active={filter === 'image'} onClick={() => setFilter('image')} icon={<ImageIcon size={16}/>} label="Gallery" />
        </div>
        
        <input 
          type="text"
          placeholder="Search birds (e.g. Canary)..."
          className="px-6 py-2 rounded-full border-2 border-nature-100 focus:border-accent outline-none w-full md:w-64"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.map(item => (
          <MediaCard key={item._id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl font-heading">No birds found in this category.</p>
        </div>
      )}
    </section>
  );
};

export default MediaGrid;
