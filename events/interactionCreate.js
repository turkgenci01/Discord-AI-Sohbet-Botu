export const name = 'interactionCreate';

export async function execute(interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`Komut bulunamadı: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Komut çalıştırılırken hata:', error);
    const reply = {
      content: 'Bu komutu çalıştırırken bir hata oluştu 😔',
      flags: 64
    };

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    } catch (err) {
      console.error('Hata mesajı gönderilemedi:', err);
      // Fallback: try editReply if the interaction was deferred
      try {
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply({ content: 'Bu komutu çalıştırırken bir hata oluştu 😔' });
        }
      } catch (err2) {
        console.error('Fallback hata gönderilemedi:', err2);
      }
    }
  }
}
