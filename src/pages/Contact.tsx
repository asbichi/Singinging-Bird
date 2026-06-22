import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = localStorage.getItem('sba_messages');
    const messages = saved ? JSON.parse(saved) : [];
    messages.unshift({
      id: Date.now().toString(),
      ...formData,
      date: new Date().toISOString()
    });
    localStorage.setItem('sba_messages', JSON.stringify(messages));
    setStatus('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-4xl font-heading font-black text-primary mb-8 text-center">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl p-8 border border-nature-100 shadow-lg">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-6">Send us a message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {status && <div className="p-3 bg-green-100 text-green-700 rounded-lg">{status}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows={5} required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-all flex justify-center items-center gap-2">
              Send Message <Send size={18} />
            </button>
          </form>
        </div>

        {/* Location & Info */}
        <div className="bg-nature-50 p-8 rounded-2xl flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-primary mb-6">Visit Our Branch</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-primary shadow-sm">
                <MapPin />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Kaduna Branch</h4>
                <p className="text-gray-600">S. 15 Charanchi Road Tudun Wada Kaduna</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-primary shadow-sm">
                <Phone />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Phone, SMS & WhatsApp</h4>
                <p className="text-gray-600 space-y-1">
                  <strong>Call / SMS:</strong><br/>
                  <a href="tel:08069771954" className="hover:text-primary transition-colors">0806 977 1954</a> (<a href="sms:08069771954" className="hover:text-primary transition-colors">SMS</a>)<br />
                  <a href="tel:08039197650" className="hover:text-primary transition-colors">0803 919 7650</a> (<a href="sms:08039197650" className="hover:text-primary transition-colors">SMS</a>)<br />
                  <strong className="mt-2 inline-block">WhatsApp:</strong><br/>
                  <a href="https://wa.me/2348069771954" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors mr-3">0806 977 1954</a><br/>
                  <a href="https://wa.me/2348039197650" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">0803 919 7650</a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-primary shadow-sm">
                <Mail />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Email</h4>
                <p className="text-gray-600 flex flex-col gap-1">
                  <a href="mailto:abdullahibichishuaib.abs@gmail.com" className="hover:text-primary transition-colors">abdullahibichishuaib.abs@gmail.com</a>
                  <a href="mailto:mubarakmashi@gmail.com" className="hover:text-primary transition-colors">mubarakmashi@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
