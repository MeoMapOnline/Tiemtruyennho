import React, { useState } from 'react';
import { X, Mail, Lock, User, Chrome, Key } from 'lucide-react';
import { api } from '../api/client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false); // Chế độ khôi phục
  const [recoveryCode, setRecoveryCode] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Xử lý đăng nhập bằng Mã Khôi Phục
    if (isRecovery) {
      if (!recoveryCode.trim()) {
        alert('Vui lòng nhập mã khôi phục!');
        setLoading(false);
        return;
      }
      // Lưu mã vào localStorage để đăng nhập lại
      localStorage.setItem('yw_user_id', recoveryCode.trim());
      localStorage.setItem('yw_is_login', '1');
      
      // Sync lại user để đảm bảo tồn tại
      api.post('/api/sync-user', {
        display_name: 'Khôi phục User',
        photo_url: ''
      }).then(() => {
        setLoading(false);
        alert('Khôi phục tài khoản thành công!');
        window.location.reload();
      });
      return;
    }

    // Giả lập đăng nhập thường (Tạo ID mới)
    setTimeout(() => {
      const mockUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('yw_user_id', mockUserId);
      localStorage.setItem('yw_is_login', '1');
      
      api.post('/api/sync-user', {
        display_name: formData.displayName || formData.email.split('@')[0],
        photo_url: `https://ui-avatars.com/api/?name=${formData.displayName || 'User'}&background=random`
      }).then(() => {
        setLoading(false);
        window.location.reload();
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isRecovery ? 'Khôi phục tài khoản' : (isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập')}
          </h2>
          <p className="text-gray-500 mb-6">
            {isRecovery ? 'Nhập mã khôi phục (ID) của bạn để vào lại tài khoản cũ.' : (isRegister ? 'Tạo tài khoản mới' : 'Chào mừng bạn quay trở lại!')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRecovery ? (
              // Form nhập Mã Khôi Phục
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Mã Khôi Phục (User ID)</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono"
                    placeholder="Ví dụ: google_g123..."
                    value={recoveryCode}
                    onChange={e => setRecoveryCode(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              // Form đăng nhập thường
              <>
                {isRegister && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Tên hiển thị</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input type="text" required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl outline-none" placeholder="Nhập tên" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} />
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="email" required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl outline-none" placeholder="name@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="password" required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl outline-none" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-95 disabled:opacity-70"
            >
              {loading ? 'Đang xử lý...' : (isRecovery ? 'Khôi Phục Tài Khoản' : (isRegister ? 'Đăng Ký' : 'Đăng Nhập'))}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            {!isRecovery ? (
              <>
                <button onClick={() => setIsRecovery(true)} className="text-indigo-600 hover:text-indigo-800 font-medium underline">
                  Tôi có Mã Khôi Phục (Đăng nhập lại tài khoản cũ)
                </button>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-gray-500">{isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}</span>
                  <button onClick={() => setIsRegister(!isRegister)} className="ml-2 font-bold text-indigo-600 hover:text-indigo-500">
                    {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
                  </button>
                </div>
              </>
            ) : (
              <button onClick={() => setIsRecovery(false)} className="text-gray-500 hover:text-gray-700 font-medium">
                Quay lại đăng nhập thường
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
