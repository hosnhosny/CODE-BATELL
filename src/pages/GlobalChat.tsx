import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../services/audio';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  user_name: string;
  avatar_url: string;
  message_text: string;
  created_at: string;
  country: string;
  user_id: string;
}

const GlobalChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // مرجع لتتبع حالة المكون (لمنع أخطاء التحديث بعد الخروج)
  const isMounted = useRef(false);

  // بيانات المستخدم الحالي
  const currentUsername = localStorage.getItem('cb_username') || 'محارب';
  const currentAvatar = localStorage.getItem('cb_avatar') || 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix';
  const currentCountry = localStorage.getItem('cb_country') || '🌍 العالم العربي';

  useEffect(() => {
    isMounted.current = true;

    // 1. جلب الرسائل القديمة
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(50);
        
        // إذا تم إغلاق الصفحة، لا تقم بتحديث الحالة
        if (!isMounted.current) return;

        if (error) throw error;
        if (data) setMessages(data);

      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // 2. الاشتراك في الرسائل الجديدة (Real-time)
    const channel = supabase
      .channel('global-chat')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload) => {
          if (!isMounted.current) return;

          const incoming = payload.new as Message;
          setMessages((prev) => [...prev, incoming]);
          
          if (incoming.user_name !== currentUsername) {
             // تم إزالة .catch لأن الدالة void
             audioService.playNav(); 
          }
        }
      )
      .subscribe();

    // 3. محاكاة عدد المتصلين
    setOnlineCount(Math.floor(Math.random() * 50) + 100);

    // دالة التنظيف
    return () => {
      isMounted.current = false;
      supabase.removeChannel(channel);
    };
  }, [currentUsername]);

  // التمرير التلقائي للأسفل
  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // تم إزالة .catch هنا أيضاً
    audioService.playClick();

    const tempMessage = newMessage;
    setNewMessage(''); // تفريغ الحقل فوراً

    try {
      // جلب الآيدي بشكل آمن
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            user_name: currentUsername,
            avatar_url: currentAvatar,
            message_text: tempMessage,
            country: currentCountry,
            user_id: userId
          }
        ]);

      if (error) throw error;

    } catch (error) {
      console.error("Error sending message:", error);
      alert("حدث خطأ أثناء إرسال الرسالة");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col h-[calc(100vh-80px)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <i className="fas fa-users text-[#8f5bff]"></i> مجتمع المبرمجين الحقيقي
          </h1>
          <p className="text-gray-500 text-sm mt-1">أنت الآن متصل بقاعدة بيانات حية.</p>
        </div>
        <div className="bg-[#8f5bff]/10 border border-[#8f5bff]/30 px-4 py-2 rounded-2xl flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
          <span className="text-xs font-black text-white">{onlineCount} متصل</span>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col bg-[#12132b] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg) => {
              const isMe = msg.user_name === currentUsername;
              return (
                <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-2xl p-0.5 border-2 ${isMe ? 'border-[#8f5bff]' : 'border-white/10'} bg-[#0a0b1e]`}>
                      <img src={msg.avatar_url} className="w-full h-full rounded-xl object-cover" alt="avatar" />
                    </div>
                  </div>
                  
                  <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[10px] font-black text-gray-500 uppercase">{msg.user_name}</span>
                      <span className="text-[10px] opacity-60">{msg.country}</span>
                    </div>
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed ${isMe ? 'bg-[#8f5bff] text-white rounded-tr-none' : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'}`}>
                      {msg.message_text}
                    </div>
                    <span className="text-[8px] text-gray-600 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-black/20 border-t border-white/5 flex gap-4">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالة حقيقية للجميع..."
              className="flex-1 bg-[#0a0b1e] border border-white/5 rounded-2xl py-4 px-6 text-sm outline-none focus:border-[#8f5bff]"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="w-14 h-14 bg-[#8f5bff] text-white rounded-2xl flex items-center justify-center hover:scale-105 disabled:opacity-50"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GlobalChat;