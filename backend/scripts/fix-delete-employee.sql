-- Script para corrigir problemas de exclusão de funcionários
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar campo phone na tabela users (se não existir)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- 2. Adicionar comentário na coluna
COMMENT ON COLUMN users.phone IS 'Número de telefone do usuário para notificações WhatsApp';

-- 3. Criar índice para busca por telefone (opcional)
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE phone IS NOT NULL;

-- 4. Verificar constraints de foreign key
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND ccu.table_name = 'users';

-- 5. Verificar se existem dados nas tabelas relacionadas
SELECT 'routes' as table_name, COUNT(*) as count FROM routes WHERE driver_id IS NOT NULL OR helper_id IS NOT NULL OR assigned_employee_id IS NOT NULL
UNION ALL
SELECT 'route_executions' as table_name, COUNT(*) as count FROM route_executions WHERE employee_id IS NOT NULL;
