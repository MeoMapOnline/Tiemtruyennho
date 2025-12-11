import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Wallet, DollarSign, BookOpen, LogOut, Shield, Key, Copy, Check, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<'deposit' | 'withdraw'>('deposit');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getUserInfo().then(data => {
      if (data && data.encrypted_yw_id) {
        api.get('/api/user/me').then(u => setUser(u));
      }
    });
  }, []);

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      localStorage.removeItem('yw_user_id');
      localStorage.removeItem('yw_is_login');
      window.location.href = '/';
    }
  };

  const handleCopyId = () => {
    if (user?.encrypted_yw_id) {
      navigator.clipboard.writeText(user.encrypted_yw_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      alert('Đã copy Mã Khôi Phục!');
    }
  };

  if (!user) return <div className="p-10 text-center">Vui lòng đăng nhập để xem hồ sơ.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} type={paymentType} />
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        {/* KHUNG MÃ KHÔI PHỤC */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
          <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2"><Key size={20} /> Mã Khôi Phục Tài Khoản</h3>
          <p className="text-sm text-yellow-700 mb-3">Lưu mã này để đăng nhập lại khi đổi máy:</p>
          <div className="flex gap-2">
            <code className="flex-1 bg-white border border-yellow-300 p-3 rounded-lg font-mono text-sm break-all text-gray-600">{user.encrypted_yw_id}</code>
            <button onClick={handleCopyId} className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 rounded-lg font-bold flex items-center gap-2">{copied ? <Check size={18} /> : <Copy size={18} />} Copy</button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
             {user.photo_url ? <img src={user.photo_url} alt="Avatar" /> : <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">{user.display_name?.[0] || 'U'}</div>}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.display_name || 'Người dùng'}</h1>
            <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded uppercase">{user.role}</span>
          </div>
        </div>

        {user.role === 'admin' && (
          <div className="mb-6">
            <Link to="/admin" className="block w-full bg-red-50 border border-red-200 hover:bg-red-100 p-4 rounded-xl text-center font-bold text-red-700 transition-colors flex items-center justify-center gap-2">
              <Shield size={20} /> Truy cập Trang Quản Trị
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2"><span className="text-indigo-100 text-sm font-medium">Số dư đọc truyện</span><Wallet size={20} className="text-indigo-200" /></div>
            <div className="text-3xl font-bold mb-6">{user.balance?.toLocaleString()} <span className="text-lg font-normal opacity-80">Xu</span></div>
            <button onClick={() => { setPaymentType('deposit'); setShowPayment(true); }} className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"><ArrowDownLeft size={18} /> Nạp Xu</button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 mt-6">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 p-3 rounded-xl transition-colors font-medium"><LogOut size={20} /> Đăng xuất</button>
        </div>
      </div>
    </div>
  );
};
export default Profile;
