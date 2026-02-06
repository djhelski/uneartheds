
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

const ChatTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Salam! Mən sizin rəqəmsal geoloqunuzam. Minerallar, süxur növləri, Yerin geoloji dövrləri və ya xüsusi daşların xassələri haqqında suallarınızı cavablaya bilərəm. Nədən başlayaq?', timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'Siz professional və təcrübəli bir geoloq, mineraloqsunuz. Adınız UnearthedAI Geoloji Köməkçisidir. İstifadəçilərin geologiya, minerallar, qiymətli daşlar və yer elmləri haqqında suallarını dərindən və maraqlı bir dillə cavablandırırsınız. Cavablarınız elmi cəhətdən dəqiq, lakin hər kəs tərəfindən başa düşülən olmalıdır. Bütün söhbəti yalnız Azərbaycan dilində aparın.',
        }
      });

      const response = await chat.sendMessage({ message: inputValue });
      const modelMessage: ChatMessage = { 
        role: 'model', 
        text: response.text || "Üzr istəyirəm, hal-hazırda geoloji verilənlər bazasına daxil ola bilmirəm.", 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sistemdə texniki gecikmə yarandı. Zəhmət olmasa bir qədər sonra yenidən soruşun.', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col glass-card rounded-[3rem] overflow-hidden border-white/5 shadow-2xl animate-in zoom-in duration-700 relative">
      <div className="bg-slate-900/40 backdrop-blur-xl px-10 py-6 border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
            <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold font-display text-white text-xl tracking-tight">Geologiya Mərkəzi</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">Sistem Onlayn</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-slate-950/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`group relative max-w-[80%] rounded-[2rem] px-8 py-5 transition-all duration-500 ${
              msg.role === 'user' 
                ? 'bg-emerald-600/90 text-white rounded-tr-none shadow-xl shadow-emerald-900/20 ml-12' 
                : 'glass-card text-slate-200 rounded-tl-none border-white/10 mr-12'
            }`}>
              <p className="text-[17px] leading-relaxed whitespace-pre-wrap font-light">{msg.text}</p>
              <div className={`mt-3 flex items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity ${msg.role === 'user' ? 'justify-end' : ''}`}>
                 <span className="text-[9px] uppercase font-bold tracking-widest">
                   {new Date(msg.timestamp).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}
                 </span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-card rounded-[1.5rem] px-8 py-5 rounded-tl-none border-white/10 flex gap-2.5 items-center">
              <div className="w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-white/5 bg-slate-900/40 backdrop-blur-xl">
        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }} 
          className="flex gap-4 bg-slate-950/60 p-2 rounded-[1.8rem] border border-white/5 focus-within:border-emerald-500/40 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-500"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Geoloji sualınızı bura yazın..."
            className="flex-1 bg-transparent border-none rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-0 text-white placeholder-slate-600 font-light"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading} 
            className="bg-emerald-500 hover:bg-emerald-400 text-white p-4 rounded-2xl disabled:opacity-20 transition-all duration-500 shadow-xl shadow-emerald-500/20 active:scale-90 group"
          >
            <svg className="w-7 h-7 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatTab;
