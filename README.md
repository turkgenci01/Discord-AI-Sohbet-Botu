# 🤖 Discord AI Sohbet Botu

Samimi, Z kuşağı tarzında bir Discord AI sohbet botu. Çoklu sunucu desteği, konuşma hafızası ve kişiselleştirilmiş yanıtlarla donatılmış.

## ✨ Özellikler

- 🌐 **Çoklu Sunucu Desteği**: Her sunucu için bağımsız ayarlar ve konuşmalar
- 💾 **Konuşma Hafızası**: Supabase ile önceki konuşmaları hatırlar
- 🎭 **Kişiselleştirilmiş Üslup**: Samimi, arkadaşça ve Z kuşağına yakın
- 🔄 **Durum Döngüsü**: Dinamik bot durumları
- 🎯 **Akıllı Yönlendirme**: AI kanalı dışındaki yerlerde kullanıcıyı yönlendirir
- ⚙️ **Kolay Kurulum**: Slash komutlarla basit ayarlama

## 📋 Gereksinimler

- Node.js (LTS sürümü)
- Discord Bot Token
- OpenAI API Key
- Supabase Hesabı

## 🚀 Kurulum

### 1. Projeyi Klonlayın

\`\`\`bash
git clone <repo-url>
cd discord-ai-bot
npm install
\`\`\`

### 2. Discord Bot Oluşturun

1. [Discord Developer Portal](https://discord.com/developers/applications)'a gidin
2. "New Application" butonuna tıklayın
3. Bot sekmesine gidin ve "Add Bot" deyin
4. Bot token'ınızı kopyalayın
5. "MESSAGE CONTENT INTENT" seçeneğini aktifleştirin
6. OAuth2 > URL Generator'da şu yetkileri seçin:
   - `bot`
   - `applications.commands`
7. Bot Permissions'da:
   - Send Messages
   - Read Message History
   - Use Slash Commands

### 3. Supabase Kurulumu

Supabase veritabanı zaten yapılandırılmış durumda. Tablolar otomatik oluşturuldu:
- `guild_settings`: Sunucu ayarları
- `chat_history`: Konuşma geçmişi

### 4. Environment Variables

`.env.example` dosyasını kopyalayıp `.env` olarak yeniden adlandırın:

\`\`\`bash
cp .env.example .env
\`\`\`

Şu bilgileri doldurun:

\`\`\`env
DISCORD_TOKEN=discord_bot_tokeniniz
DISCORD_CLIENT_ID=discord_client_id
OPENAI_API_KEY=openai_api_keyiniz
OPENAI_MODEL=gpt-4-turbo-preview
SUPABASE_URL=supabase_url
SUPABASE_SERVICE_ROLE_KEY=supabase_service_key
\`\`\`

### 5. Botu Başlatın

\`\`\`bash
npm start
\`\`\`

## 📖 Kullanım

### Slash Komutlar

- \`/setup\` - AI sohbet kanalını ayarla (Sadece yöneticiler)
- \`/help\` - Bot hakkında bilgi al

### AI ile Sohbet

1. Yönetici olarak \`/setup\` komutunu kullanarak AI sohbet kanalını belirleyin
2. Belirlenen kanalda direkt mesaj yazarak bot ile konuşun
3. Bot önceki mesajları hatırlayarak bağlama uygun cevaplar verir

### Diğer Kanallarda

Bot başka kanallarda etiketlenirse, kullanıcıyı AI sohbet kanalına yönlendirir.

## 🎯 Botun Kişiliği

- Samimi ve arkadaşça
- Lafı dolandırmaz, direkt konuşur
- Akademik değil, doğal
- Gerektiğinde esprili
- Mantıksız şeyleri nazikçe sorgular
- Kısa ve öz cevaplar verir

## 📁 Proje Yapısı

\`\`\`
discord-ai-bot/
├── commands/          # Slash komutlar
│   ├── help.js
│   └── setup.js
├── events/           # Discord event handlers
│   ├── ready.js
│   ├── messageCreate.js
│   └── interactionCreate.js
├── utils/            # Yardımcı fonksiyonlar
│   ├── ai.js         # OpenAI entegrasyonu
│   └── supabase.js   # Veritabanı işlemleri
├── config/           # Konfigürasyon
│   └── config.js
├── index.js          # Ana dosya
├── package.json
└── .env.example
\`\`\`

## 🔧 Özelleştirme

### Durum Mesajlarını Değiştirme

\`events/ready.js\` dosyasındaki \`statuses\` dizisini düzenleyin.

### AI Kişiliğini Değiştirme

\`utils/ai.js\` dosyasındaki \`SYSTEM_PROMPT\` değişkenini düzenleyin.

### Konuşma Hafızası Ayarları

\`config/config.js\` dosyasında:
- \`maxHistoryMessages\`: Hafızada tutulacak maksimum mesaj sayısı
- \`conversationTimeout\`: Konuşma zaman aşımı (ms)

## 🛡️ Güvenlik

- Bot token'ınızı asla paylaşmayın
- \`.env\` dosyasını git'e eklemeyin
- Service role key'i sadece backend'de kullanın

## 📝 Lisans

Bu proje özel kullanım içindir.

## 🤝 Destek

Sorunlar için issue açabilirsiniz.
