-- Script para corrigir execuções duplicadas de rotas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar execuções duplicadas por rota e funcionário
SELECT 
  route_id,
  employee_id,
  COUNT(*) as execution_count,
  STRING_AGG(id::text, ', ') as execution_ids,
  STRING_AGG(status, ', ') as statuses
FROM route_executions 
GROUP BY route_id, employee_id
HAVING COUNT(*) > 1
ORDER BY execution_count DESC;

-- 2. Manter apenas a execução mais recente para cada combinação de rota/funcionário
-- e remover as duplicadas
WITH duplicate_executions AS (
  SELECT 
    id,
    route_id,
    employee_id,
    ROW_NUMBER() OVER (
      PARTITION BY route_id, employee_id 
      ORDER BY created_at DESC, id DESC
    ) as rn
  FROM route_executions
)
DELETE FROM route_executions 
WHERE id IN (
  SELECT id 
  FROM duplicate_executions 
  WHERE rn > 1
);

-- 3. Verificar se ainda existem duplicatas
SELECT 
  route_id,
  employee_id,
  COUNT(*) as execution_count
FROM route_executions 
GROUP BY route_id, employee_id
HAVING COUNT(*) > 1;

-- 4. Verificar o estado atual das execuções
SELECT 
  r.id as route_id,
  r.name as route_name,
  r.driver_id,
  r.helper_id,
  re.id as execution_id,
  re.employee_id,
  re.status,
  re.created_at,
  re.start_time,
  re.end_time
FROM routes r
LEFT JOIN route_executions re ON r.id = re.route_id
WHERE r.is_active = true
ORDER BY r.created_at DESC, re.created_at DESC;
