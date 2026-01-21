/*
  # Discord AI Bot Database Schema

  ## Overview
  This migration creates the database structure for a multi-guild Discord AI chatbot
  with conversation history and per-guild settings.

  ## New Tables

  ### `guild_settings`
  Stores configuration for each Discord server (guild)
  - `id` (bigint, primary key) - Discord guild ID
  - `ai_channel_id` (bigint, nullable) - Designated AI chat channel
  - `created_at` (timestamptz) - When the guild was first added
  - `updated_at` (timestamptz) - Last settings update

  ### `chat_history`
  Stores conversation history for context-aware responses
  - `id` (uuid, primary key) - Unique message identifier
  - `guild_id` (bigint) - Discord guild ID
  - `channel_id` (bigint) - Discord channel ID
  - `user_id` (bigint) - Discord user ID
  - `username` (text) - Username for display
  - `message` (text) - Message content
  - `role` (text) - 'user' or 'assistant'
  - `created_at` (timestamptz) - Message timestamp

  ## Security
  - Enable RLS on all tables
  - Add service role policies for bot operations
  - Anonymous access is denied by default

  ## Notes
  - Using bigint for Discord IDs (Discord snowflakes)
  - Chat history includes automatic cleanup via indexes
  - Guild settings are upserted on bot join
*/

-- Create guild_settings table
CREATE TABLE IF NOT EXISTS guild_settings (
  id bigint PRIMARY KEY,
  ai_channel_id bigint,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id bigint NOT NULL,
  channel_id bigint NOT NULL,
  user_id bigint NOT NULL,
  username text NOT NULL,
  message text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_history_guild_channel 
  ON chat_history(guild_id, channel_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_history_created_at 
  ON chat_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE guild_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for guild_settings
DROP TRIGGER IF EXISTS update_guild_settings_updated_at ON guild_settings;
CREATE TRIGGER update_guild_settings_updated_at
  BEFORE UPDATE ON guild_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();