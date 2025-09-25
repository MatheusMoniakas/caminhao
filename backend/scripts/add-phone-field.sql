-- Script para adicionar campo de telefone na tabela users
-- Execute este script no Supabase SQL Editor

-- Adicionar coluna phone na tabela users
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20);

-- Adicionar comentário na coluna
COMMENT ON COLUMN users.phone IS 'Número de telefone do usuário para notificações WhatsApp';

-- Criar índice para busca por telefone (opcional)
CREATE INDEX idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
