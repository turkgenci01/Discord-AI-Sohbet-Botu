-- Convert Discord ID columns from bigint to text to avoid JS numeric precision loss
-- 2026-01-06: Convert id columns to text

-- guild_settings: id, ai_channel_id
ALTER TABLE IF EXISTS public.guild_settings
  ALTER COLUMN id TYPE text USING id::text;

ALTER TABLE IF EXISTS public.guild_settings
  ALTER COLUMN ai_channel_id TYPE text USING ai_channel_id::text;

-- chat_history: guild_id, channel_id, user_id
ALTER TABLE IF EXISTS public.chat_history
  ALTER COLUMN guild_id TYPE text USING guild_id::text;

ALTER TABLE IF EXISTS public.chat_history
  ALTER COLUMN channel_id TYPE text USING channel_id::text;

ALTER TABLE IF EXISTS public.chat_history
  ALTER COLUMN user_id TYPE text USING user_id::text;

-- Recreate indexes (on text columns)
DROP INDEX IF EXISTS idx_chat_history_guild_channel;
CREATE INDEX IF NOT EXISTS idx_chat_history_guild_channel
  ON public.chat_history(guild_id, channel_id, created_at DESC);

DROP INDEX IF EXISTS idx_chat_history_created_at;
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at
  ON public.chat_history(created_at DESC);
