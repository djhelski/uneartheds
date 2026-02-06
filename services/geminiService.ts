
import { GoogleGenAI, Type } from "@google/genai";
import { RockAnalysis } from "../types";

// Faylı modelə göndərilə biləcək formata çevirir
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string, mimeType: string } }> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

// Daşın eyniləşdirilməsi (Gemini 2.5 Flash-Lite istifadə edərək)
export const identifyRock = async (imagePart: any): Promise<RockAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Bu şəkildəki geoloji nümunəni (daş, mineral və ya kristal) dərindən analiz edin. 
  Məlumatları yalnız Azərbaycan dilində təqdim edin. 
  Professional bir geoloq kimi cavab verin.
  JSON formatında aşağıdakıları daxil edin:
  - name: tam elmi adı
  - category: geoloji sinfi (məsələn: Maqmatik, Metamorfik, Mineral və s.)
  - chemicalFormula: kimyəvi tərkibi
  - hardness: Mohs şkalası üzrə sərtliyi
  - description: fiziki və vizual xüsusiyyətlərinin təsviri
  - geologicalContext: necə və harada yarandığı haqqında məlumat
  - rarity: təbiətdə tapılma dərəcəsi
  - funFact: bu nümunə haqqında çox az bilinən maraqlı məlumat.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      thinkingConfig: { thinkingBudget: 24576 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          chemicalFormula: { type: Type.STRING },
          hardness: { type: Type.STRING },
          description: { type: Type.STRING },
          geologicalContext: { type: Type.STRING },
          rarity: { type: Type.STRING },
          funFact: { type: Type.STRING }
        },
        required: ["name", "category", "chemicalFormula", "hardness", "description", "geologicalContext", "rarity", "funFact"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

// Əlavə geoloji məlumatlar (Google Search grounding)
export const getGeologicalInsights = async (rockName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `${rockName} haqqında cari geoloji və bazar məlumatlarını Azərbaycan dilində tapın. 
  Xüsusilə: tapıldığı əsas ölkələr, sənaye və ya zərgərlik əhəmiyyəti və son elmi xəbərlər.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks.map((chunk: any) => ({
    title: chunk.web?.title || 'Geoloji Mənbə',
    uri: chunk.web?.uri || '#'
  })).filter((s: any) => s.uri !== '#');

  return {
    text: response.text,
    sources
  };
};
