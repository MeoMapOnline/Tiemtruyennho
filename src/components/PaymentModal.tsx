import React, { useState, useEffect } from 'react';
import { X, CreditCard, Wallet, Lock, Copy, Check } from 'lucide-react';
import { api } from '../api/client';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw' | 'unlock';
  amount?: number; // For unlock
  onSuccess?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, type, amount, onSuccess }) => {
  const [inputAmount, setInputAmount] = useState(amount || 10000);
  const [walletNumber, setWalletNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getUserInfo().then(data => {
        if (data && data.encrypted_yw_id) {
           setUser(data);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (type === 'deposit') {
        const res = await api.post('/api/payment/deposit', { amount: inputAmount });
        if (res && res.success) {
          alert('Đã gửi yêu cầu nạp tiền! Vui lòng chờ Admin duyệt (thường trong 5-10 phút).');
          onClose();
        }
      } else if (type === 'withdraw') {
        const res = await api.post('/api/payment/withdraw', { amount: inputAmount, wallet_number: walletNumber });
        if (res && res.success) {
          alert('Yêu cầu rút tiền đã được gửi!');
          onClose();
        } else {
          alert(res.error || 'Lỗi');
        }
      } else if (type === 'unlock') {
        // Unlock logic handled in parent usually, but can be here
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const transferContent = `NAP ${user?.encrypted_yw_id?.substring(0, 8) || 'USER'}`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          {type === 'deposit' && <><CreditCard className="text-green-600" /> Nạp Xu (MOMO)</>}
          {type === 'withdraw' && <><Wallet className="text-orange-600" /> Rút Tiền</>}
          {type === 'unlock' && <><Lock className="text-indigo-600" /> Mở Khóa Chương</>}
        </h2>

        {type === 'deposit' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-2">Quét mã QR để nạp tiền</p>
              <div className="flex justify-center mb-2">
                 {/* Thay link ảnh QR của bạn vào đây nếu cần */}
                 <img src="/momo-qr.jpeg" alt="MOMO QR" className="w-48 h-48 object-contain border rounded" />
              </div>
              <p className="text-xs text-gray-400">Hoặc chuyển khoản thủ công</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chuyển khoản (Bắt buộc)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={transferContent} 
                  readOnly 
                  className="flex-1 border rounded-lg px-3 py-2 bg-gray-100 font-mono font-bold text-indigo-600"
                />
                <button 
                  onClick={() => handleCopy(transferContent)}
                  className="p-2 text-gray-500 hover:text-indigo-600 border rounded-lg"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền muốn nạp</label>
              <input 
                type="number" 
                value={inputAmount}
                onChange={(e) => setInputAmount(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                step="10000"
                min="10000"
              />
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Xác Nhận Đã Chuyển'}
            </button>
          </div>
        )}

        {type === 'withdraw' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">Số dư khả dụng: {user?.earnings?.toLocaleString()} xu</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số ví MOMO / Ngân hàng</label>
              <input 
                type="text" 
                value={walletNumber}
                onChange={(e) => setWalletNumber(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="0987..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền rút</label>
              <input 
                type="number" 
                value={inputAmount}
                onChange={(e) => setInputAmount(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                max={user?.earnings}
              />
            </div>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Gửi Yêu Cầu Rút'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
