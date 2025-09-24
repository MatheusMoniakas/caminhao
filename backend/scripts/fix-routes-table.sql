-- Script para corrigir a tabela routes e resolver os problemas de validação
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar novas colunas para motorista e ajudante (se não existirem)
ALTER TABLE routes 
ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS helper_id UUID REFERENCES users(id);

-- 2. Tornar start_point e end_point opcionais (nullable)
ALTER TABLE routes 
ALTER COLUMN start_point DROP NOT NULL,
ALTER COLUMN end_point DROP NOT NULL;

-- 3. Criar índices para as novas colunas
CREATE INDEX IF NOT EXISTS idx_routes_driver_id ON routes(driver_id);
CREATE INDEX IF NOT EXISTS idx_routes_helper_id ON routes(helper_id);

-- 4. Verificar a estrutura da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'routes' 
ORDER BY ordinal_position;

-- 5. (Opcional) Remover a coluna antiga assigned_employee_id se existir
-- Descomente a linha abaixo se quiser remover a coluna antiga
-- ALTER TABLE routes DROP COLUMN IF EXISTS assigned_employee_id;
