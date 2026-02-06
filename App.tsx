
import React, { useState } from 'react';
import Header from './components/Header';
import IdentifyTab from './components/IdentifyTab';
import ChatTab from './components/ChatTab';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.IDENTIFY);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-emerald-500/30 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 container mx-auto px-4 py-10 md:py-16">
        <div className="relative">
          {activeTab === AppTab.IDENTIFY && <IdentifyTab />}
          {activeTab === AppTab.CHAT && <ChatTab />}
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 bg-slate-950/50 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                </div>
                <h3 className="text-lg font-bold font-display text-white">UnearthedAI</h3>
              </div>
              <p className="text-slate-500 text-sm">Dünya səviyyəli geoloji kəşfiyyat platforması.</p>
            </div>
            
            <div className="flex gap-8 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              <a href="#" className="hover:text-emerald-500 transition-colors">Haqqımızda</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Məxfilik</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Əlaqə</a>
            </div>

            <p className="text-slate-600 text-xs">
              © 2025 UnearthedAI. Bütün hüquqlar qorunur.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
