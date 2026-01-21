import { ActivityType } from 'discord.js';
import { config } from '../config/config.js';
import { cleanOldHistory } from '../utils/supabase.js';

const statuses = [
  { name: 'Sohbete hazırım 💬', type: ActivityType.Playing },
  { name: 'AI Sohbet Açık 🤖', type: ActivityType.Watching },
  { name: 'Sorun varsa /help 🆘', type: ActivityType.Listening },
  { name: 'Samimi sohbetler ☕', type: ActivityType.Playing },
  { name: 'Her zaman buradayım 👋', type: ActivityType.Watching },
];

let currentStatusIndex = 0;

function rotateStatus(client) {
  const status = statuses[currentStatusIndex];
  client.user.setPresence({
    activities: [{ name: status.name, type: status.type }],
    status: 'online',
  });

  currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
}

export const name = 'clientReady';
export const once = true;

export async function execute(client) {
  console.log(`✅ Bot hazır! ${client.user.tag} olarak giriş yapıldı`);
  console.log(`📊 ${client.guilds.cache.size} sunucuda aktif`);

  rotateStatus(client);

  setInterval(() => {
    rotateStatus(client);
  }, config.bot.statusRotationInterval);

  setInterval(() => {
    cleanOldHistory(7);
  }, 86400000);

  console.log('🔄 Durum döngüsü başlatıldı');
}
