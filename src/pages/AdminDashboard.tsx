import React, { useState, useEffect } from 'react';
import { Upload, Activity, Users, Settings, LogOut, Video, Music, Image as ImageIcon, ShoppingCart, MessageSquare, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { defaultCanaries } from './Market';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    // Basic protection using local token
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row pt-20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-white p-6 flex flex-col min-h-[50vh] md:min-h-[calc(100vh-80px)]">
        <h2 className="text-2xl font-heading font-bold text-secondary mb-8">Admin Panel</h2>
        
        <nav className="flex-1 space-y-2">
          <SidebarLink active={activeTab === 'overview'} icon={<Activity size={20}/>} label="Overview" onClick={() => setActiveTab('overview')} />
          <SidebarLink active={activeTab === 'upload'} icon={<Upload size={20}/>} label="Manage Media" onClick={() => setActiveTab('upload')} />
          <SidebarLink active={activeTab === 'market'} icon={<ShoppingCart size={20}/>} label="Manage Market Sales" onClick={() => setActiveTab('market')} />
          <SidebarLink active={activeTab === 'members'} icon={<Users size={20}/>} label="Manage Members" onClick={() => setActiveTab('members')} />
          <SidebarLink active={activeTab === 'messages'} icon={<MessageSquare size={20}/>} label="View Messages" onClick={() => setActiveTab('messages')} />
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 text-nature-100 hover:text-white hover:bg-primary-dark rounded-xl transition-colors mt-8"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'upload' && <UploadForm />}
        {activeTab === 'market' && <MarketSales />}
        {activeTab === 'members' && <MembersManagement />}
        {activeTab === 'messages' && <MessagesManagement />}
      </main>
    </div>
  );
};


// Overview Tab Component
const OverviewTab = () => {
  const [stats, setStats] = useState({ members: 0, media: 0, market: 0, messages: 0, videos: 0, audios: 0, images: 0 });

  useEffect(() => {
    const s_members = JSON.parse(localStorage.getItem('sba_members') || '[]');
    const s_media = JSON.parse(localStorage.getItem('sba_media') || '[]');
    const s_market_raw = localStorage.getItem('sba_market');
    const s_market = s_market_raw ? JSON.parse(s_market_raw) : defaultCanaries;
    const s_messages = JSON.parse(localStorage.getItem('sba_messages') || '[]');

    setStats({
      members: s_members.length,
      media: s_media.length,
      market: s_market.length,
      messages: s_messages.length,
      videos: s_media.filter((m: any) => m.type === 'video').length,
      audios: s_media.filter((m: any) => m.type === 'audio').length,
      images: s_media.filter((m: any) => m.type === 'image').length,
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Uploads" value={stats.media} icon={<Upload className="text-primary" />} />
        <StatCard title="Active Members" value={stats.members} icon={<Users className="text-secondary-dark" />} />
        <StatCard title="Market Listings" value={stats.market} icon={<ShoppingCart className="text-accent" />} />
        <StatCard title="Messages" value={stats.messages} icon={<MessageSquare className="text-blue-500" />} />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4">Media Content Breakdown</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
             <div className="flex items-center gap-3"><Video className="text-primary"/> <span>Videos</span></div>
             <span className="font-bold">{stats.videos}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
             <div className="flex items-center gap-3"><Music className="text-secondary-dark"/> <span>Audios</span></div>
             <span className="font-bold">{stats.audios}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
             <div className="flex items-center gap-3"><ImageIcon className="text-accent"/> <span>Images</span></div>
             <span className="font-bold">{stats.images}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <h4 className="text-gray-500 text-sm mb-1">{title}</h4>
      <div className="text-3xl font-heading font-black text-gray-800">{value}</div>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
    <div className="w-12 h-12 rounded-full bg-nature-50 flex items-center justify-center">
      {icon}
    </div>
  </div>
);

// Upload Form Component
const UploadForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'Harz Roller', type: 'audio', description: '', thumbnail: '' });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const saved = localStorage.getItem('sba_media');
      const mediaList = saved ? JSON.parse(saved) : [];
      const newMedia = {
        _id: Date.now().toString(),
        title: formData.title,
        description: formData.description || 'Uploaded by Admin',
        type: formData.type,
        category: formData.category,
        thumbnail: formData.thumbnail
      };
      
      mediaList.unshift(newMedia);
      localStorage.setItem('sba_media', JSON.stringify(mediaList));

      setLoading(false);
      setFormData({ title: '', category: 'Harz Roller', type: 'audio', description: '', thumbnail: '' });
      alert("Media uploaded successfully!");
    }, 500);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-primary max-w-2xl">
      <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Upload className="text-primary" /> Post New Bird Content
      </h2>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content Title</label>
          <input 
            type="text" 
            className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary outline-none"
            placeholder="e.g. Morning Song - Harz Roller"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
            <select 
              className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary outline-none"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="audio">Audio (Song)</option>
              <option value="video">Video (Clip)</option>
              <option value="image">Image (Gallery)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bird Category</label>
            <select 
              className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary outline-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Harz Roller">Harz Roller</option>
              <option value="Spanish Timbrado">Spanish Timbrado</option>
              <option value="Malinois Waterslager">Malinois Waterslager</option>
              <option value="Local Cross-breeds">Local Cross-breeds</option>
              <option value="General">General / Care</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
          <textarea 
            className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary outline-none"
            placeholder="Brief description of the media..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={2}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Media URL (External Link)</label>
          <input 
            type="text" 
            className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary outline-none"
            placeholder="e.g. https://example.com/video.mp4 or Image URL"
            value={formData.thumbnail}
            onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
            required
          />
          <p className="text-xs text-gray-500 mt-1">Please provide a valid URL for the video, audio or image content.</p>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full mt-6 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl transition-all flex justify-center items-center gap-2"
        >
          {loading ? 'Processing...' : 'Publish Content'}
        </button>
      </form>
    </div>
  );
};

export interface SaleItem {
  id: string;
  name: string;
  price: string;
  phone: string;
  mediaType: string;
  mediaUrl: string;
  description: string;
}

// Market Sales Component
const MarketSales = () => {
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SaleItem>({ id: '', name: '', price: '', phone: '', mediaType: 'image', mediaUrl: '', description: '' });

  useEffect(() => {
    const saved = localStorage.getItem('sba_market');
    if (saved) {
      setSales(JSON.parse(saved));
    } else {
      setSales(defaultCanaries);
      localStorage.setItem('sba_market', JSON.stringify(defaultCanaries));
    }
  }, []);

  const saveSales = (newSales: SaleItem[]) => {
    setSales(newSales);
    localStorage.setItem('sba_market', JSON.stringify(newSales));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      saveSales([{ ...formData, id: Date.now().toString() }, ...sales]);
      setFormData({ id: '', name: '', price: '', phone: '', mediaType: 'image', mediaUrl: '', description: '' });
      setLoading(false);
      alert('Sale listed successfully!');
    }, 500);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this canary from the market?')) {
      saveSales(sales.filter(s => s.id !== id));
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-accent max-w-4xl">
      <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6 flex items-center gap-2">
        <ShoppingCart className="text-accent" /> Manage Market Sales
      </h2>

      <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-xl mb-8 space-y-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Add Canary for Sale</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Canary Name/Breed</label>
            <input 
              type="text" 
              className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-accent outline-none"
              placeholder="e.g. Yellow Harz Roller"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Price / Amount (NGN)</label>
             <input 
               type="text" 
               className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-accent outline-none"
               placeholder="e.g. 150000"
               value={formData.price}
               onChange={(e) => setFormData({...formData, price: e.target.value})}
               required
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Seller Phone Number</label>
             <input 
               type="tel" 
               className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-accent outline-none"
               placeholder="e.g. +234 800 000 0000"
               value={formData.phone}
               onChange={(e) => setFormData({...formData, phone: e.target.value})}
               required
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
             <select 
               className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-accent outline-none"
               value={formData.mediaType}
               onChange={(e) => setFormData({...formData, mediaType: e.target.value})}
             >
               <option value="image">Image</option>
               <option value="video">Video</option>
             </select>
          </div>

          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1">Media URL (Video or Image Link)</label>
             <input 
               type="text" 
               className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-accent outline-none"
               placeholder="https://example.com/media.jpg"
               value={formData.mediaUrl}
               onChange={(e) => setFormData({...formData, mediaUrl: e.target.value})}
               required
             />
          </div>

          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1">Quick Description</label>
             <input 
               type="text" 
               className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-accent outline-none"
               placeholder="Briefly describe the canary..."
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
               required
             />
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-lg transition-all"
          >
            {loading ? 'Adding...' : 'List in Market'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-bold font-heading text-gray-800 mb-4 border-b pb-2">Listed Canaries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sales.map((sale) => (
             <div key={sale.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl shadow-sm bg-gray-50 flex-col sm:flex-row">
                <div className="w-full sm:w-24 h-24 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                  {sale.mediaType === 'image' ? (
                    <img src={sale.mediaUrl} alt={sale.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs">Video</div>
                  )}
                </div>
                <div className="flex-1">
                   <h4 className="font-bold text-gray-800">{sale.name}</h4>
                   <p className="text-accent font-bold text-lg">₦{Number(sale.price).toLocaleString()}</p>
                   <p className="text-sm text-gray-500 mt-1 line-clamp-2">{sale.description}</p>
                   <p className="text-sm mt-1"><strong>Phone:</strong> {sale.phone}</p>
                   <div className="mt-3 flex gap-2">
                      <button onClick={() => handleDelete(sale.id)} className="text-red-500 text-sm bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors">Remove Listed Item</button>
                   </div>
                </div>
             </div>
          ))}
          {sales.length === 0 && <p className="text-gray-500 italic text-sm md:col-span-2">No canaries are currently listed for sale.</p>}
        </div>
      </div>
    </div>
  );
};

import { Member } from './Members';

// Members Management Component
const MembersManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Member>({ id: '', name: '', role: '', type: 'general', image: '' });

  useEffect(() => {
    const saved = localStorage.getItem('sba_members');
    if (saved) {
      setMembers(JSON.parse(saved));
    }
  }, []);

  const saveMembers = (newMembers: Member[]) => {
    setMembers(newMembers);
    localStorage.setItem('sba_members', JSON.stringify(newMembers));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (isEditing) {
        saveMembers(members.map(m => m.id === formData.id ? formData : m));
      } else {
        saveMembers([...members, { ...formData, id: Date.now().toString() }]);
      }
      setFormData({ id: '', name: '', role: '', type: 'general', image: '' });
      setIsEditing(false);
      setLoading(false);
      alert('Member saved successfully!');
    }, 500);
  };

  const handleEdit = (member: Member) => {
    setFormData(member);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      saveMembers(members.filter(m => m.id !== id));
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-secondary max-w-4xl">
      <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Users className="text-secondary" /> Manage Members & Executives
      </h2>

      <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-xl mb-8 space-y-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{isEditing ? 'Edit Member' : 'Add New Member'}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-secondary outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Member Type</label>
             <select 
               className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-secondary outline-none"
               value={formData.type}
               onChange={(e) => setFormData({...formData, type: e.target.value as 'executive' | 'general'})}
             >
               <option value="general">General Member</option>
               <option value="executive">Executive Committee</option>
             </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role/Position</label>
            <input 
              type="text" 
              className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-secondary outline-none"
              placeholder="e.g. Member, President, Secretary"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Upload Picture</label>
             <input 
               type="file" 
               accept="image/*"
               onChange={handleImageChange}
               className="w-full p-2 rounded-lg border border-gray-200 focus:border-secondary outline-none bg-white"
               required={!isEditing && !formData.image}
             />
             {formData.image && (
                <div className="mt-2 text-sm text-green-600 truncate flex items-center gap-2">
                   <img src={formData.image} alt="Preview" className="w-8 h-8 rounded-full object-cover shadow-sm" /> 
                   <span>Image ready</span>
                </div>
             )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            type="submit"
            disabled={loading}
            className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2.5 px-6 rounded-lg transition-all"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Member' : 'Add Member'}
          </button>
          
          {isEditing && (
             <button 
               type="button"
               onClick={() => { setIsEditing(false); setFormData({ id: '', name: '', role: '', type: 'general', image: '' }); }}
               className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-6 rounded-lg transition-all"
             >
               Cancel Edit
             </button>
          )}
        </div>
      </form>

      <div className="space-y-6">
         <div>
            <h3 className="text-xl font-bold font-heading text-gray-800 mb-4 border-b pb-2">Executives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {members.filter(m => m.type === 'executive').map(member => (
                  <div key={member.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl shadow-sm bg-gray-50">
                     <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                     <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{member.name}</h4>
                        <p className="text-sm text-primary font-medium">{member.role}</p>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => handleEdit(member)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-md transition-colors text-sm">Edit</button>
                        <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors text-sm">Delete</button>
                     </div>
                  </div>
               ))}
               {members.filter(m => m.type === 'executive').length === 0 && <p className="text-gray-500 italic text-sm">No executives added yet.</p>}
            </div>
         </div>

         <div>
            <h3 className="text-xl font-bold font-heading text-gray-800 mb-4 border-b pb-2 mt-8">General Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {members.filter(m => m.type === 'general').map(member => (
                  <div key={member.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl shadow-sm bg-gray-50">
                     <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                     <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{member.name}</h4>
                        <p className="text-sm text-gray-500">{member.role}</p>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => handleEdit(member)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-md transition-colors text-sm">Edit</button>
                        <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors text-sm">Delete</button>
                     </div>
                  </div>
               ))}
               {members.filter(m => m.type === 'general').length === 0 && <p className="text-gray-500 italic text-sm">No general members added yet.</p>}
            </div>
         </div>
      </div>
    </div>
  );
};

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

const MessagesManagement = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sba_messages');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const updatedMessages = messages.filter(m => m.id !== id);
      setMessages(updatedMessages);
      localStorage.setItem('sba_messages', JSON.stringify(updatedMessages));
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-primary max-w-4xl">
      <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MessageSquare className="text-primary" /> Contact Form Messages
      </h2>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No messages found.</p>
            <p className="text-sm text-gray-400">Messages sent via the Contact form will appear here.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="relative p-6 border border-gray-100 rounded-xl shadow-sm bg-gray-50 transition-shadow hover:shadow-md">
              <button 
                onClick={() => handleDelete(msg.id)} 
                className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors bg-white p-2 rounded-full shadow-sm"
                title="Delete Message"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="mb-4 pr-12">
                <h4 className="font-bold text-gray-800 text-lg">{msg.name}</h4>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-sm mt-1">
                  <a href={`mailto:${msg.email}`} className="text-primary hover:underline">{msg.email}</a>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                  <span className="text-gray-500">{new Date(msg.date).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const SidebarLink = ({ active, icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${active ? 'bg-white/20 text-secondary' : 'text-nature-100 hover:bg-white/10 hover:text-white'}`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default AdminDashboard;
