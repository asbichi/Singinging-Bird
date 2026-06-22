import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store the token and navigate to admin
        localStorage.setItem('admin_token', data.token);
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <div className="min-h-screen bg-nature-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden mt-16">
        <div className="bg-primary p-8 text-center">
          <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-primary" size={30} />
          </div>
          <h2 className="text-white font-heading text-2xl font-bold">Admin Portal</h2>
          <p className="text-nature-100 text-sm">Singing Birds Association - Kaduna</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-300">{error}</div>}
          <div className="relative">
            <Mail className="absolute left-3 top-4 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-3 border-b-2 border-gray-100 focus:border-primary outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-4 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3 border-b-2 border-gray-100 focus:border-primary outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]">
            Sign In <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
