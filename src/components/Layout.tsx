
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Library, 
  History, 
  List, 
  LogIn, 
  Search, 
  Bell, 
  Menu, 
  X, 
  BookOpen,
  User
} from 'lucide-react';
import { api } from '../api/client';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    api.getUserInfo().then(data => {
      if (data && data.encrypted_yw_id) {
        setUser(data);
        // Sync user to backend
        api.post('/api/sync-user', { 
          display_name: data.display_name || 'User', 
          photo_url: data.photo_url 
        });
      }
    });
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { icon: Library, label: 'Thư Viện', path: '/library' },
    { icon: History, label: 'Lịch Sử Đọc', path: '/history' },
    { icon: List, label: 'Thể Loại', path: '/genres' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30 h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-full lg:hidden"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="text-indigo-600" size={32} />
              <span className="text-xl font-bold text-gray-800 hidden sm:block">TiệmTruyệnNhỏ</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full relative group">
              <Search size={24} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full relative group">
              <Bell size={24} className="text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {user ? (
              <Link to="/profile" className="flex items-center gap-2 ml-2 hover:bg-gray-50 p-1 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all">
                <div className="w-8 h-8 rounded-full bg-indigo-100 overflow-hidden">
                  {user.photo_url ? <img src={user.photo_url} alt="Avatar" /> : <User className="p-1 text-indigo-600" />}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">{user.display_name || 'User'}</span>
              </Link>
            ) : (
              <button className="hidden md:flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 container mx-auto px-4 py-6 gap-6 relative">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white lg:bg-transparent shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col p-4 lg:p-0">
            <div className="flex justify-between items-center lg:hidden mb-6">
              <span className="text-xl font-bold text-gray-800">Menu</span>
              <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-white hover:shadow-sm'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="my-4 border-t border-gray-200 lg:hidden"></div>
              
              {!user && (
                <button className="flex lg:hidden items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 w-full">
                  <LogIn size={20} />
                  <span className="font-medium">Đăng nhập / Đăng ký</span>
                </button>
              )}
            </nav>

            {/* Admin Link (Mock) */}
            <div className="mt-auto pt-6">
               <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
                  <h3 className="font-bold text-sm mb-1">Trở thành Tác giả?</h3>
                  <p className="text-xs opacity-90 mb-3">Đăng tải truyện của bạn ngay hôm nay.</p>
                  <Link to="/profile" className="block text-center w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-xs font-bold transition-colors">
                    Gửi yêu cầu
                  </Link>
               </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
