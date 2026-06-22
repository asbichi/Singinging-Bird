import React, { useState, useEffect } from 'react';
import { ShoppingBag, PhoneCall, Video, Image as ImageIcon, Search } from 'lucide-react';
import { SaleItem } from './AdminDashboard';

export const defaultCanaries: SaleItem[] = [
  {
    id: 'c1',
    name: 'Harz Roller Canary',
    price: '35000',
    phone: '0806 977 1954',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=600',
    description: 'A champion singing breed famous for its deep, closed-mouth rolling song with a soft, warm timbre. Healthy yellow/greenish variegated plumage.'
  },
  {
    id: 'c2',
    name: 'Spanish Timbrado Canary',
    price: '40000',
    phone: '0803 919 7650',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=600',
    description: 'An energetic Spanish breed that produces bright metallic, bell-like chimes and rolling notes. High-output singer descended from wild canaries.'
  },
  {
    id: 'c3',
    name: 'Red Factor Canary',
    price: '55000',
    phone: '0806 977 1954',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1522926193341-e9eb1b36bb86?auto=format&fit=crop&q=80&w=600',
    description: 'A prized color-bred variety boasting magnificent deep red and bright orange feathers. Highly vibrant specimen raised on beta-carotene-rich nutrients.'
  },
  {
    id: 'c4',
    name: 'Gloster Canary (Crested Corona)',
    price: '48000',
    phone: '0803 919 7650',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1550853024-fae8cd4be47f?auto=format&fit=crop&q=80&w=600',
    description: 'Adorable compact shape featuring a distinct crested cap (the "Corona") that sweeps gracefully over its head. Excellent posture and calm disposition.'
  },
  {
    id: 'c5',
    name: 'Malinois Waterslager Canary',
    price: '42000',
    phone: '0806 977 1954',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
    description: 'Acclaimed singing champion whose liquid notes beautifully mimic the soft sound of cascading or bubbling water. Solid golden-yellow plumage.'
  },
  {
    id: 'c6',
    name: 'Lizard Canary (Spangled)',
    price: '50000',
    phone: '0803 919 7650',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1516233758813-a38d024919c5?auto=format&fit=crop&q=80&w=600',
    description: 'An ancient variety featuring elegant dark spangles down its back mimicking the intricate scale patterns of lizards, complete with clear body caps.'
  },
  {
    id: 'c7',
    name: 'Fife Fancy Canary',
    price: '30000',
    phone: '0806 977 1954',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&q=80&w=600',
    description: 'A delightful petite variety bred for shape and posture. Very active, cheerful character, clear ringing chirps, making it outstanding for beginners.'
  },
  {
    id: 'c8',
    name: 'Stafford Canary',
    price: '52000',
    phone: '0803 919 7650',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30ebd3?auto=format&fit=crop&q=80&w=600',
    description: 'A beautiful modern breed displaying rich peach, rose, and frosted red plumage with soft crest lines. Excellent singer with high curiosity.'
  }
];

const Market = () => {
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('sba_market');
    if (saved) {
      setSales(JSON.parse(saved));
    } else {
      setSales(defaultCanaries);
      localStorage.setItem('sba_market', JSON.stringify(defaultCanaries));
    }
  }, []);

  const filteredSales = sales.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 bg-nature-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-black text-primary mb-4">Canary Market & Species Guide</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Browse beautiful, verified canary species listed by our professional breeders and members. Contact sellers directly to purchase.
          </p>
          
          <div className="mt-8 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search canary breeds (e.g., Gloster)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-white shadow-sm font-sans"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        {filteredSales.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <ShoppingBag className="mx-auto text-gray-300 w-16 h-16 mb-4" />
            <p className="text-gray-500 text-xl font-heading">No matching canaries found.</p>
            <p className="text-gray-400 mt-2">Try searching for other species like 'Roller', 'Timbrado', or 'Factor'.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSales.map((sale) => (
              <div key={sale.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  {sale.mediaType === 'image' ? (
                     <img 
                       src={sale.mediaUrl} 
                       alt={sale.name}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                       referrerPolicy="no-referrer"
                     />
                  ) : (
                     <video 
                       src={sale.mediaUrl} 
                       controls
                       className="w-full h-full"
                     />
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 flex items-center gap-1 shadow-sm">
                     {sale.mediaType === 'video' ? <Video size={14} className="text-accent"/> : <ImageIcon size={14} className="text-accent"/>}
                     {sale.mediaType === 'video' ? 'Video Available' : 'Canary Breed'}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold font-heading text-gray-800">{sale.name}</h3>
                    <span className="text-xl font-bold text-primary">₦{Number(sale.price).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">{sale.description}</p>
                  
                  <a 
                     href={`tel:${sale.phone}`}
                     className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                     <PhoneCall size={18} />
                     Contact Seller
                  </a>
                  <p className="text-center text-xs text-gray-400 mt-3">{sale.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;
