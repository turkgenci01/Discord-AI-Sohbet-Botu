import { getGuildSettings } from '../utils/supabase.js';
import { generateAIResponse } from '../utils/ai.js';

export const name = 'messageCreate';

const redirectMessages = [
  'Burası baya kalabalık 😅\nGel bizim tarafa geçelim, daha rahat konuşuruz.',
  'Yaa burası çok gürültülü 🙈\nAI sohbet kanalına gel, orada daha iyi sohbet ederiz.',
  'Burda herkes var, gel özel yerime geçelim 😊\nOrada daha samimi konuşuruz.',
  'Oof burası çok karışık 🤯\nAI sohbet kanalında buluşalım mı?',
];

function getRandomRedirect() {
  return redirectMessages[Math.floor(Math.random() * redirectMessages.length)];
}

export async function execute(message) {
  if (message.author.bot) return;
  if (!message.guild) return;

  const guildId = message.guild.id;
  const channelId = message.channel.id;
  const settings = await getGuildSettings(guildId);

  // Debug: log settings and incoming channel IDs
  console.log(`Message in guild ${guildId}, channel ${channelId}. Settings:`, settings);

  if (!settings || !settings.ai_channel_id) {
    // Sadece direct mentions'a yanıt ver, @everyone/@here yoksay
    if (message.mentions.has(message.client.user) && !message.mentions.everyone) {
      await message.reply('Henüz bir AI sohbet kanalı ayarlanmamış. Bir yönetici `/setup` komutuyla kanal ayarlayabilir. 🛠️');
    }
    return;
  }

  // Debug: compare types and values safely
  const storedChannelIdString = settings.ai_channel_id ? settings.ai_channel_id.toString() : null;
  console.log('Comparing channelId:', channelId, 'to stored ai_channel_id:', settings.ai_channel_id, '->', storedChannelIdString);

  const isAIChannel = channelId === storedChannelIdString;
  // Sadece direct mentions'a yanıt ver, @everyone/@here yoksay
  const isMentioned = message.mentions.has(message.client.user) && !message.mentions.everyone;

  if (!isAIChannel && isMentioned) {
    const aiChannel = message.guild.channels.cache.get(settings.ai_channel_id.toString());
    const redirect = getRandomRedirect();
    await message.reply(aiChannel ? `${redirect}\n\n👉 ${aiChannel}` : redirect);
    return;
  }

  if (isAIChannel) {
    try {
      await message.channel.sendTyping();

      const response = await generateAIResponse(
        guildId,
        channelId,
        message.author.id,
        message.author.username,
        message.content
      );

      if (response.length > 2000) {
        const chunks = response.match(/.{1,2000}/g);
        for (const chunk of chunks) {
          await message.reply(chunk);
        }
      } else {
        await message.reply(response);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      await message.reply('Yaa bir hata oldu 😬 Tekrar dener misin?');
    }
  }
}
