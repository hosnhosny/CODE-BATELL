
import React, { useState } from 'react';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  type: 'badge' | 'title' | 'theme';
}

const STORE_ITEMS: StoreItem[] = [
  { id: '1', name: 'وسام المبتدئ الطموح', description: 'يظهر في ملفك الشخصي كبداية قوية.', cost: 300, icon: '🌱', type: 'badge' },
  { id: '2', name: 'لقب: وحش الـ C++', description: 'لقب يظهر بجانب اسمك في المحادثات.', cost: 1000, icon: '👹', type: 'title' },
  { id: '3', name: 'ثيم المحرر الذهبي', description: 'لون خاص للمحرر يجعل كودك يتألق.', cost: 2500, icon: '✨', type: 'theme' },
  { id: '4', name: 'وسام مدمر الأخطاء', description: 'يمنح للمبرمجين الذين لا يتركون خطأ يهرب.', cost: 800, icon: '🐛', type: 'badge' },
  { id: '5', name: 'لقب: مهندس المستقبل', description: 'لقب مرموق يعكس طموحك العالي.', cost: 1500, icon: '🚀', type: 'title' },
];

const Store: React.FC = () => {
  const [userXP, setUserXP] = useState(Number(localStorage.getItem('cb_xp') || '0'));
  const [ownedItems, setOwnedItems] = useState<string[]>(JSON.parse(localStorage.getItem('cb_owned') || '[]'));
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handlePurchase = (item: StoreItem) => {
    if (ownedItems.includes(item.id)) return;
    
    if (userXP >= item.cost) {
      const newXP = userXP - item.cost;
      const newOwned = [...ownedItems, item.id];
      
      setUserXP(newXP);
      setOwnedItems(newOwned);
      
      localStorage.setItem('cb_xp', newXP.toString());
      localStorage.setItem('cb_owned', JSON.stringify(newOwned));
      
      setMessage({ text: `مبروك! لقد حصلت على ${item.name}`, type: 'success' });
      window.dispatchEvent(new Event('xpUpdate'));
    } else {
      setMessage({ text: 'نقاطك غير كافية، استمر في حل التحديات!', type: 'error' });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-4">
            <i className="fas fa-shopping-cart text-[#8f5bff]"></i> متجر الجوائز
          </h1>
          <p className="text-gray-400">استبدل نقاط خبرتك بأشياء رائعة لملفك الشخصي.</p>
        </div>
        <div className="bg-[#1a1b3b] border border-[#8f5bff]/30 px-6 py-4 rounded-2xl text-center shadow-[0_0_20px_rgba(143,91,255,0.1)]">
          <span className="text-xs text-gray-500 uppercase font-bold block mb-1">رصيدك الحالي</span>
          <span className="text-2xl font-black text-[#8f5bff]">{userXP.toLocaleString()} XP</span>
        </div>
      </div>

      {message && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl border animate-bounce ${message.type === 'success' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}>
          <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} ml-2`}></i>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {STORE_ITEMS.map((item) => (
          <div key={item.id} className={`bg-[#12132b] border ${ownedItems.includes(item.id) ? 'border-green-500/30' : 'border-white/5'} p-6 rounded-3xl group hover:border-[#8f5bff]/50 transition-all relative overflow-hidden`}>
            {ownedItems.includes(item.id) && (
              <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">مملوك</div>
            )}
            
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.name}</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">{item.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold">التكلفة</span>
                <span className="text-lg font-black text-white">{item.cost} XP</span>
              </div>
              <button 
                onClick={() => handlePurchase(item)}
                disabled={ownedItems.includes(item.id)}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${ownedItems.includes(item.id) ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#8f5bff] text-white hover:shadow-[0_0_15px_rgba(143,91,255,0.4)]'}`}
              >
                {ownedItems.includes(item.id) ? 'تم الشراء' : 'شراء'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
