-- Virtual Rewards System Tables for Supabase
-- Run this SQL in your Supabase SQL Editor

-- User wallet for virtual currency
CREATE TABLE IF NOT EXISTS user_wallet (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  coins INTEGER NOT NULL DEFAULT 0,
  gems INTEGER NOT NULL DEFAULT 0,
  total_coins_earned INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User's purchased/unlocked rewards
CREATE TABLE IF NOT EXISTS user_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reward_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'purchase', -- 'purchase', 'milestone', 'gift'
  UNIQUE(user_id, reward_id)
);

-- Coin transaction history
CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Positive for earning, negative for spending
  reason TEXT NOT NULL,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_created_at ON coin_transactions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_wallet
CREATE POLICY "Users can view their own wallet" ON user_wallet
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" ON user_wallet
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallet" ON user_wallet
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_rewards
CREATE POLICY "Users can view their own rewards" ON user_rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rewards" ON user_rewards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for coin_transactions
CREATE POLICY "Users can view their own transactions" ON coin_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON coin_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update wallet timestamp
CREATE OR REPLACE FUNCTION update_wallet_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wallet_updated_at
  BEFORE UPDATE ON user_wallet
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_timestamp();
