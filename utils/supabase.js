import { createClient } from '@supabase/supabase-js';
import { config } from '../config/config.js';

// Supabase client
export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceKey,
  { db: { schema: 'public' } }
);

/**
 * Guild settings getirir.
 * Yoksa oluşturur.
 */
export async function getGuildSettings(guildId) {
  const { data, error } = await supabase
    .from('guild_settings')
    .select('*')
    .eq('guild_id', guildId)
    .maybeSingle();

  console.log(`Fetched guild settings for ${guildId}:`, data);

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching guild settings:', error);
    return null;
  }

  // Yoksa oluştur
  if (!data) {
    const { data: newData, error: insertError } = await supabase
      .from('guild_settings')
      .insert({
        guild_id: guildId,
        ai_channel_id: null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating guild settings:', insertError);
      return null;
    }

    console.log(`Created new guild settings for ${guildId}:`, newData);
    return newData;
  }

  return data;
}

/**
 * Guild settings günceller (upsert)
 */
export async function updateGuildSettings(guildId, settings) {
  const payload = {
    guild_id: guildId,
    ...settings
  };

  const { data, error } = await supabase
    .from('guild_settings')
    .upsert(payload, {
      onConflict: 'guild_id'
    })
    .select()
    .maybeSingle();

  console.log(`Upsert result for guild ${guildId}:`, data, 'error:', error);

  if (error) {
    console.error('Error updating guild settings:', error);
    return null;
  }

  return data;
}

/**
 * Chat geçmişi getirir
 */
export async function getChatHistory(guildId, channelId, limit = 20) {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('guild_id', guildId)
    .eq('channel_id', channelId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }

  return data.reverse();
}

/**
 * Chat mesajı kaydeder
 */
export async function saveChatMessage(
  guildId,
  channelId,
  userId,
  username,
  message,
  role
) {
  const payload = {
    guild_id: guildId,
    channel_id: channelId,
    user_id: userId,
    username,
    message,
    role
  };

  const { error } = await supabase
    .from('chat_history')
    .insert(payload);

  if (error) {
    console.error('Error saving chat message:', error);
  }
}

/**
 * Eski chat geçmişini temizler
 */
export async function cleanOldHistory(daysOld = 7) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const { error } = await supabase
    .from('chat_history')
    .delete()
    .lt('created_at', cutoffDate.toISOString());

  if (error) {
    console.error('Error cleaning old history:', error);
  }
}
