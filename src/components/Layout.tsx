import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Library, History, List, LogIn, Search, Bell, Menu, X, BookOpen, User } from 'lucide-react';
import { api } from '../api/client';
import LoginModal from './LoginModal';

interface LayoutProps { children: React.ReactNode; }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    api.getUserInfo().then(data => {
      if (data && data.encrypted_yw_id) {
        setUser(data);
        api.post('/api/sync-user', { display_name: data.display_name || 'User', photo_url: data.photo_url });
      }
    });
  }, []);

  const menuItems = [
    { icon: Library, label: 'Thư Viện', path: '/library' },
    { icon: History, label: 'Lịch Sử Đọc', path: '/history' },
    { icon: List, label: 'Thể Loại', path: '/genres' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-30 h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-full lg:hidden"><Menu size={24} /></button>
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="text-indigo-600" size={32} />
              {/* --- SỬA TÊN WEB TẠI ĐÂY --- */}
              <span className="text-xl font-bold text-gray-800 hidden sm:block" style={{ fontFamily: 'cursive' }}>Tiệm Truyện Nhỏ</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/profile" className="flex items-center gap-2 ml-2 hover:bg-gray-50 p-1 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all">
                <div className="w-8 h-8 rounded-full bg-indigo-100 overflow-hidden">
                  {user.photo_url ? <img src={user.photo_url} alt="Avatar" /> : <User className="p-1 text-indigo-600" />}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">{user.display_name || 'User'}</span>
              </Link>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="hidden md:flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium">
                <LogIn size={16} /> Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <div className="flex flex-1 container mx-auto px-4 py-6 gap-6 relative">
        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white lg:bg-transparent shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="h-full flex flex-col p-4 lg:p-0">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === item.path ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-white hover:shadow-sm'}`} onClick={() => setIsSidebarOpen(false)}>
                  <item.icon size={20} /> <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <main className="flex-1 w-full min-w-0">{children}</main>
      </div>
    </div>
  );
};
export default Layout;
