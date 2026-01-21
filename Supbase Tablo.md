-- Gerekli uzantı
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 🔥 ESKİ TABLOLARI SİL
DROP TABLE IF EXISTS public.chat_history CASCADE;
DROP TABLE IF EXISTS public.guild_settings CASCADE;

-- ✅ GUILD SETTINGS (Discord snowflake = TEXT)
CREATE TABLE public.guild_settings (
  guild_id text PRIMARY KEY,
  ai_channel_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ✅ CHAT HISTORY
CREATE TABLE public.chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id text NOT NULL,
  channel_id text NOT NULL,
  user_id text NOT NULL,
  username text NOT NULL,
  message text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now()
);

-- 📌 INDEXLER
CREATE INDEX idx_chat_history_guild_channel
  ON public.chat_history (guild_id, channel_id, created_at DESC);

CREATE INDEX idx_chat_history_created_at
  ON public.chat_history (created_at DESC);

-- 🔐 RLS
ALTER TABLE public.guild_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- 🔑 POLICIES
DROP POLICY IF EXISTS "Service role can manage guild settings" ON public.guild_settings;
CREATE POLICY "Service role can manage guild settings"
  ON public.guild_settings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can manage chat history" ON public.chat_history;
CREATE POLICY "Service role can manage chat history"
  ON public.chat_history
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ⏱️ UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_guild_settings_updated_at ON public.guild_settings;
CREATE TRIGGER update_guild_settings_updated_at
  BEFORE UPDATE ON public.guild_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
