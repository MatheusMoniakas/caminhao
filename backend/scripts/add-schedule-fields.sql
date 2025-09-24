-- Script para adicionar campos de data e turno à tabela routes
-- Execute este script no Supabase SQL Editor

-- Adicionar novas colunas para data agendada e turno
ALTER TABLE routes 
ADD COLUMN IF NOT EXISTS scheduled_date DATE,
ADD COLUMN IF NOT EXISTS shift VARCHAR(20) CHECK (shift IN ('manha', 'tarde', 'noite', 'madrugada'));

-- Criar índices para as novas colunas
CREATE INDEX IF NOT EXISTS idx_routes_scheduled_date ON routes(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_routes_shift ON routes(shift);

-- Verificar a estrutura da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'routes' 
ORDER BY ordinal_position;

-- Verificar se as colunas foram adicionadas corretamente
SELECT 
  id,
  name,
  scheduled_date,
  shift,
  driver_id,
  helper_id,
  is_active
FROM routes 
LIMIT 5;
