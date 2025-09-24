-- Script simples para adicionar campo problem_resolved
-- Execute este script no Supabase SQL Editor

ALTER TABLE route_executions 
ADD COLUMN problem_resolved BOOLEAN DEFAULT false;
