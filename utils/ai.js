import OpenAI from 'openai';
import { config } from '../config/config.js';
import { getChatHistory, saveChatMessage } from './supabase.js';

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

/* =========================
   🔒 AI KİLİT STATE
========================= */
let aiLocked = false;
let unlockTimeout = null;

/* =========================
   🧠 SYSTEM PROMPT
========================= */
const SYSTEM_PROMPT = `Sen samimi, sıcak ve Z kuşağına yakın bir Discord sohbet botusun. İşte kişiliğin ve davranış kuralların:

**Üslup:**
- Bir arkadaş gibi konuş, resmiyetten uzak dur
- Lafı dolandırma, direkt ve özgün ol
- Akademik veya robotik cevaplar verme
- Gereksiz detaylara girme

**Davranış:**
- Emojiyi abartma, yerinde kullan
- Kullanıcıyı yargılama ama mantıksız bir şey söylüyorsa nazikçe sorgula
- Konu gerçekten önemsiz veya boşsa dürüstçe belirt
- Körü körüne onaylama, eleştirel düşünmeye yönlendir

**Kişilik:**
- Dost canlısı ve esprili
- Gerektiğinde ciddi
- Küfürlü sorulara ağır küfürlü cevap verisn
- Yardımcı ve destekleyici
- Samimi ama saygılı

**Önemli:**
- Konuşmanın akışını ve önceki mesajları hatırla
- Aynı sorulara farklı şekillerde cevap ver
- Kısa ve öz yaz, uzun paragraflardan kaçın
- Türkçe konuş ve Türk kültürüne uygun ol`;

/* =========================
   🤖 AI RESPONSE
========================= */
export async function generateAIResponse(
  guildId,
  channelId,
  userId,
  username,
  userMessage
) {
  // 🔒 Kilitliyse AI çağrılmasın
  if (aiLocked) {
    return null;
  }

  try {
    // Kullanıcı mesajını kaydet
    await saveChatMessage(guildId, channelId, userId, username, userMessage, 'user');

    const history = await getChatHistory(
      guildId,
      channelId,
      config.bot.maxHistoryMessages
    );

    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

    for (const msg of history) {
      messages.push({
        role: msg.role,
        content: msg.message,
      });
    }

    const completion = await openai.chat.completions.create({
      model: config.openai.model,
      messages,
      max_tokens: 500,
      temperature: 0.8,
    });

    const aiResponse = completion.choices[0].message.content;

    await saveChatMessage(
      guildId,
      channelId,
      userId,
      'AI Bot',
      aiResponse,
      'assistant'
    );

    return aiResponse;
  } catch (error) {
    console.error('Error generating AI response:', error);

    /* =========================
       🚫 LİMİT DOLDU
    ========================= */
    if (error.code === 'insufficient_quota') {
      if (!aiLocked) {
        aiLocked = true;

        console.log('🔒 AI kilitlendi (quota doldu)');

        // ⏱️ 1 saat sonra otomatik aç
        unlockTimeout = setTimeout(() => {
          aiLocked = false;
          unlockTimeout = null;
          console.log('🔓 AI kilidi açıldı');
        }, 60 * 60 * 1000);
      }

      return '🔒 Konuşma limitim doldu.\nBiraz dinlenip geri geleceğim 👋';
    }

    /* =========================
       ⏳ RATE LIMIT
    ========================= */
    if (error.status === 429) {
      return '⏳ Çok hızlı yazıyorsunuz 😅 1–2 dakika sonra tekrar deneyin.';
    }

    return 'Bir şeyler ters gitti 😬 Tekrar dener misin?';
  }
}

/* =========================
   🔍 DIŞARI AÇILAN KİLİT DURUMU
========================= */
export function isAiLocked() {
  return aiLocked;
}
