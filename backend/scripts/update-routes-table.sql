-- Script para atualizar a tabela routes com os novos campos
-- Execute este script no Supabase SQL Editor

-- Adicionar novas colunas para motorista e ajudante
ALTER TABLE routes 
ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS helper_id UUID REFERENCES users(id);

-- Tornar start_point e end_point opcionais (nullable)
ALTER TABLE routes 
ALTER COLUMN start_point DROP NOT NULL,
ALTER COLUMN end_point DROP NOT NULL;

-- Remover a coluna antiga assigned_employee_id se existir
-- (Comentado para segurança - descomente se necessário)
-- ALTER TABLE routes DROP COLUMN IF EXISTS assigned_employee_id;

-- Criar índices para as novas colunas
CREATE INDEX IF NOT EXISTS idx_routes_driver_id ON routes(driver_id);
CREATE INDEX IF NOT EXISTS idx_routes_helper_id ON routes(helper_id);

-- Atualizar dados existentes (se houver)
-- Migrar dados de assigned_employee_id para driver_id se necessário
-- UPDATE routes SET driver_id = assigned_employee_id WHERE assigned_employee_id IS NOT NULL AND driver_id IS NULL;

-- Verificar a estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'routes' 
ORDER BY ordinal_position;
