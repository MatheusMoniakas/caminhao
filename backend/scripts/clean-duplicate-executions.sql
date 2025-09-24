-- Script para limpar execuções duplicadas de rotas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar execuções duplicadas por rota e funcionário
SELECT 
  route_id,
  employee_id,
  COUNT(*) as execution_count,
  STRING_AGG(id::text, ', ') as execution_ids,
  STRING_AGG(status, ', ') as statuses,
  STRING_AGG(created_at::text, ', ') as created_dates
FROM route_executions 
GROUP BY route_id, employee_id
HAVING COUNT(*) > 1
ORDER BY execution_count DESC;

-- 2. Criar uma tabela temporária com as execuções mais recentes
WITH latest_executions AS (
  SELECT DISTINCT ON (route_id, employee_id)
    id,
    route_id,
    employee_id,
    status,
    created_at,
    updated_at,
    start_time,
    end_time,
    observations
  FROM route_executions
  ORDER BY route_id, employee_id, created_at DESC
)

-- 3. Deletar execuções que não são as mais recentes
DELETE FROM route_executions 
WHERE id NOT IN (
  SELECT id FROM latest_executions
);

-- 4. Verificar se ainda existem duplicatas
SELECT 
  route_id,
  employee_id,
  COUNT(*) as execution_count
FROM route_executions 
GROUP BY route_id, employee_id
HAVING COUNT(*) > 1;

-- 5. Verificar o estado final das execuções
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
