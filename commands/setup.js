import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { updateGuildSettings } from '../utils/supabase.js';

export const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('AI sohbet kanalını ayarla')
  .addChannelOption(option =>
    option
      .setName('kanal')
      .setDescription('AI sohbet için kullanılacak kanal')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const channel = interaction.options.getChannel('kanal');
  const guildId = interaction.guild.id;

  // Acknowledge immediately to avoid interaction timeout / double-ack issues
  await interaction.deferReply({ flags: 64 });

  const settings = await updateGuildSettings(guildId, {
    ai_channel_id: channel.id
  });

  if (settings) {
    await interaction.editReply({
      content: `✅ Tamam! Artık ${channel} kanalında seninle sohbet edebilirim. Hadi gel konuşalım! 🎉`
    });
  } else {
    await interaction.editReply({
      content: '❌ Bir şeyler ters gitti, tekrar dener misin?'
    });
  }
}
