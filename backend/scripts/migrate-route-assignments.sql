-- Script para migrar atribuições de rotas e garantir compatibilidade
-- Execute este script no Supabase SQL Editor

-- 1. Migrar dados de assigned_employee_id para driver_id (se necessário)
UPDATE routes 
SET driver_id = assigned_employee_id 
WHERE assigned_employee_id IS NOT NULL 
  AND driver_id IS NULL;

-- 2. Verificar se existem rotas sem motorista atribuído
SELECT 
  id, 
  name, 
  driver_id, 
  helper_id, 
  assigned_employee_id,
  is_active
FROM routes 
WHERE driver_id IS NULL 
  AND assigned_employee_id IS NULL;

-- 3. Criar execuções de rota para rotas existentes que não têm execuções
INSERT INTO route_executions (route_id, employee_id, status, created_at, updated_at)
SELECT 
  r.id as route_id,
  r.driver_id as employee_id,
  'pending' as status,
  NOW() as created_at,
  NOW() as updated_at
FROM routes r
WHERE r.driver_id IS NOT NULL
  AND r.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM route_executions re 
    WHERE re.route_id = r.id
  );

-- 4. Verificar a estrutura final
SELECT 
  'routes' as table_name,
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'routes' 
ORDER BY ordinal_position

UNION ALL

SELECT 
  'route_executions' as table_name,
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'route_executions' 
ORDER BY ordinal_position;

-- 5. Verificar dados migrados
SELECT 
  r.id,
  r.name,
  r.driver_id,
  r.helper_id,
  re.status as execution_status,
  re.created_at as execution_created
FROM routes r
LEFT JOIN route_executions re ON r.id = re.route_id
WHERE r.is_active = true
ORDER BY r.created_at DESC;
