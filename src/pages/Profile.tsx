import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, DollarSign, BookOpen, LogOut } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<'deposit' | 'withdraw'>('deposit');
  const [isRequestingAuthor, setIsRequestingAuthor] = useState(false);

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

  const handleRequestAuthor = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng ký làm tác giả?')) {
      setIsRequestingAuthor(true);
      try {
        const res = await api.post('/api/author-request', { reason: 'Tôi muốn đăng truyện' });
        if (res && res.success) {
          alert('Đã gửi yêu cầu thành công! Vui lòng chờ quản trị viên duyệt.');
        } else {
          alert('Đã gửi yêu cầu!');
        }
      } catch (e) {
        alert('Có lỗi xảy ra, vui lòng thử lại sau.');
      }
      setIsRequestingAuthor(false);
    }
  };

  if (!user) return <div className="p-10 text-center">Vui lòng đăng nhập để xem hồ sơ.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        type={paymentType} 
      />

      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
             {user.photo_url ? <img src={user.photo_url} alt="Avatar" /> : <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">{user.display_name?.[0] || 'U'}</div>}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.display_name || 'Người dùng'}</h1>
            <p className="text-gray-500 text-sm">ID: {user.encrypted_yw_id?.substring(0, 8)}...</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded uppercase">{user.role}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Balance Wallet */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-indigo-100 text-sm font-medium">Số dư đọc truyện</span>
              <Wallet size={20} className="text-indigo-200" />
            </div>
            <div className="text-3xl font-bold mb-6">{user.balance?.toLocaleString()} <span className="text-lg font-normal opacity-80">Xu</span></div>
            
            <button 
              onClick={() => { setPaymentType('deposit'); setShowPayment(true); }}
              className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowDownLeft size={18} /> Nạp Xu
            </button>
          </div>

          {/* Earnings Wallet (For Authors) */}
          {(user.role === 'author' || user.role === 'admin') && (
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-100 text-sm font-medium">Thu nhập tác giả</span>
                <DollarSign size={20} className="text-green-200" />
              </div>
              <div className="text-3xl font-bold mb-6">{user.earnings?.toLocaleString()} <span className="text-lg font-normal opacity-80">Xu</span></div>
              
              <button 
                onClick={() => { setPaymentType('withdraw'); setShowPayment(true); }}
                className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowUpRight size={18} /> Rút Tiền
              </button>
            </div>
          )}
        </div>

        {/* Author Actions */}
        {(user.role === 'author' || user.role === 'admin') ? (
          <div className="mb-6">
            <Link to="/author" className="block w-full bg-gray-50 border border-gray-200 hover:bg-gray-100 p-4 rounded-xl text-center font-bold text-gray-700 transition-colors flex items-center justify-center gap-2">
              <BookOpen size={20} /> Quản Lý Truyện Của Tôi
            </Link>
          </div>
        ) : (
          <div className="mb-6">
            <button 
              onClick={handleRequestAuthor}
              disabled={isRequestingAuthor}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white p-4 rounded-xl text-center font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <BookOpen size={20} /> 
              {isRequestingAuthor ? 'Đang gửi yêu cầu...' : 'Đăng Ký Làm Tác Giả'}
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">Trở thành tác giả để đăng truyện và kiếm thu nhập từ donate.</p>
          </div>
        )}

        <div className="border-t border-gray-100 pt-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 p-3 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
