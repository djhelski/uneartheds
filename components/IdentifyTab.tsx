
import React, { useState, useRef } from 'react';
import { identifyRock, fileToGenerativePart, getGeologicalInsights } from '../services/geminiService';
import { RockAnalysis, GroundingSource } from '../types';

const IdentifyTab: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<RockAnalysis | null>(null);
  const [searchInsights, setSearchInsights] = useState<{ text: string; sources: GroundingSource[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysis(null);
      setSearchInsights(null);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      const part = await fileToGenerativePart(selectedImage);
      const result = await identifyRock(part);
      setAnalysis(result);

      const insights = await getGeologicalInsights(result.name);
      setSearchInsights(insights);
    } catch (error) {
      console.error("Analiz uğursuz oldu", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-1000">
      <div className="text-center space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Geoloji Kəşfiyyat Modulu
        </div>
        <h2 className="text-5xl md:text-6xl font-bold font-display tracking-tight text-gradient">
          Nümunəni yükləyin
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">
          Mineralları, kristallaşmış süxurları və ya qiymətli daşları dərhal eyniləşdirin. 
          Süni intellektimiz ən mürəkkəb geoloji strukturları analiz edir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <div 
            className={`glass-card rounded-[2.5rem] p-5 border-2 border-dashed transition-all duration-700 group relative overflow-hidden flex flex-col items-center justify-center ${
              previewUrl ? 'border-emerald-500/20' : 'border-white/5 hover:border-emerald-500/40'
            }`}
          >
            {!previewUrl ? (
              <div 
                className="flex flex-col items-center justify-center py-24 cursor-pointer w-full" 
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-24 h-24 rounded-3xl bg-emerald-500/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.05)]">
                  <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-slate-100">Faylı seçin</p>
                <p className="text-sm text-slate-500 mt-2 font-light">və ya bura sürükləyin</p>
              </div>
            ) : (
              <div className="relative group w-full">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900/50 border border-white/5 shadow-2xl">
                  <img src={previewUrl} alt="Nümunə" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                </div>
                <button 
                  onClick={() => { setPreviewUrl(null); setSelectedImage(null); setAnalysis(null); }}
                  className="absolute -top-3 -right-3 bg-red-500/90 hover:bg-red-500 p-3 rounded-2xl shadow-xl transition-all duration-300 hover:scale-110 z-10 backdrop-blur-md"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          {previewUrl && !analysis && (
            <button 
              disabled={isAnalyzing}
              onClick={startAnalysis}
              className="w-full accent-gradient py-6 rounded-[2rem] font-bold text-lg shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-4 text-white overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analiz Edilir...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Skan Et</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="lg:col-span-7">
          {analysis ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-1000">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {[
                   { label: 'Elmi Ad', val: analysis.name, color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
                   { label: 'Sinf', val: analysis.category, color: 'text-blue-400', bg: 'bg-blue-500/5' },
                   { label: 'Sərtlik', val: analysis.hardness, color: 'text-amber-400', bg: 'bg-amber-500/5' }
                 ].map((stat, idx) => (
                   <div key={idx} className={`glass-card p-6 rounded-[1.5rem] border-white/5 hover:border-white/10 transition-all ${stat.bg}`}>
                     <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2 block">{stat.label}</span>
                     <p className={`text-xl font-bold truncate ${stat.color}`}>{stat.val}</p>
                   </div>
                 ))}
              </div>

              <div className="glass-card p-10 rounded-[2.5rem] space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
                
                <div className="space-y-4">
                   <h3 className="text-3xl font-bold font-display flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                       <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                       </svg>
                     </div>
                     Geoloji Hesabat
                   </h3>
                   <p className="text-slate-300 leading-relaxed text-lg font-light">{analysis.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
                  <div className="space-y-3">
                    <span className="text-xs uppercase text-slate-500 font-bold tracking-[0.2em]">Struktur</span>
                    <p className="font-mono text-emerald-400 text-lg bg-emerald-500/5 inline-flex px-4 py-2 rounded-xl border border-emerald-500/10 shadow-inner">
                      {analysis.chemicalFormula}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs uppercase text-slate-500 font-bold tracking-[0.2em]">Tapılma dərəcəsi</span>
                    <p className="text-slate-100 font-medium text-lg">{analysis.rarity}</p>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[1.5rem] relative group">
                  <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h4 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-3">Bilirsinizmi?</h4>
                  <p className="text-slate-400 italic text-lg leading-relaxed">"{analysis.funFact}"</p>
                </div>
              </div>

              {searchInsights && (
                <div className="glass-card p-10 rounded-[2.5rem] space-y-6 border-white/5">
                  <h3 className="text-2xl font-bold font-display flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    Qlobal İnsaytlar
                  </h3>
                  <div className="prose prose-invert max-w-none text-slate-400 text-lg leading-relaxed font-light">
                    <p className="whitespace-pre-wrap">{searchInsights.text}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
                    {searchInsights.sources.map((source, i) => (
                      <a 
                        key={i} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-white/5 hover:bg-emerald-500/10 px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-300 flex items-center gap-2 border border-white/5 hover:border-emerald-500/20 text-slate-400 hover:text-emerald-400"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 glass-card rounded-[2.5rem] border-dashed border-2 border-white/5">
              <div className="w-32 h-32 mb-8 animate-float opacity-20">
                <svg className="w-full h-full text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-500 uppercase tracking-[0.2em]">Analiz Gözlənilir</h3>
              <p className="text-slate-600 mt-4 max-w-sm text-lg font-light">Eyniləşdirmək istədiyiniz nümunənin şəklini soldakı sahəyə yükləyin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdentifyTab;
