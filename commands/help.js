import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Bot hakkında bilgi al');

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('🤖 AI Sohbet Botu')
    .setDescription('Merhaba! Ben senin AI sohbet arkadaşınım. Benimle rahatça konuşabilirsin.')
    .addFields(
      {
        name: '💬 Nasıl Kullanılır?',
        value: 'Belirlenmiş AI sohbet kanalında benimle direkt konuşabilirsin. Başka kanallarda etiketlersen seni oraya yönlendiririm.'
      },
      {
        name: '⚙️ Kurulum',
        value: 'Yöneticiler `/setup` komutuyla AI sohbet kanalını ayarlayabilir.'
      },
      {
        name: '🎯 Özellikler',
        value: '• Çoklu sunucu desteği\n• Konuşma hafızası\n• Samimi ve arkadaşça üslup\n• Her sunucu için ayrı ayarlar'
      }
    )
    .setFooter({ text: 'Sorularını çekinmeden sorabilirsin!' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], flags: 64 });
}
