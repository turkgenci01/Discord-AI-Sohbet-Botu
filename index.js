import { Client, Collection, GatewayIntentBits, Partials, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();

async function loadCommands() {
  const commands = [];
  const commandFiles = readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }

  return commands;
}

async function loadEvents() {
  const eventFiles = readdirSync(join(__dirname, 'events')).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = await import(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}

async function registerCommands(commands) {
  try {
    console.log('🔄 Slash komutları kaydediliyor...');

    const rest = new REST({ version: '10' }).setToken(config.discord.token);

    await rest.put(
      Routes.applicationCommands(config.discord.clientId),
      { body: commands }
    );

    console.log('✅ Slash komutları başarıyla kaydedildi');
  } catch (error) {
    console.error('❌ Komut kaydı hatası:', error);
  }
}

async function main() {
  try {
    if (!config.discord.token) {
      throw new Error('DISCORD_TOKEN bulunamadı! .env dosyasını kontrol edin.');
    }

    if (!config.openai.apiKey) {
      throw new Error('OPENAI_API_KEY bulunamadı! .env dosyasını kontrol edin.');
    }

    if (!config.supabase.url || !config.supabase.serviceKey) {
      throw new Error('Supabase bilgileri bulunamadı! .env dosyasını kontrol edin.');
    }

    const commands = await loadCommands();
    await loadEvents();
    await registerCommands(commands);

    await client.login(config.discord.token);
  } catch (error) {
    console.error('❌ Bot başlatma hatası:', error);
    process.exit(1);
  }
}

main();
