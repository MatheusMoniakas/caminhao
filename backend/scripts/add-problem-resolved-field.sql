-- Script para adicionar campo problem_resolved à tabela route_executions
-- Execute este script no Supabase SQL Editor

-- Adicionar nova coluna para controlar se o problema foi resolvido
ALTER TABLE route_executions 
ADD COLUMN IF NOT EXISTS problem_resolved BOOLEAN DEFAULT false;

-- Criar índice para a nova coluna
CREATE INDEX IF NOT EXISTS idx_route_executions_problem_resolved ON route_executions(problem_resolved);

-- Verificar a estrutura da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'route_executions' 
ORDER BY ordinal_position;

-- Verificar se a coluna foi adicionada corretamente
SELECT 
  id,
  route_id,
  employee_id,
  status,
  observations,
  problem_resolved,
  created_at
FROM route_executions 
WHERE observations IS NOT NULL AND observations != ''
LIMIT 5;
