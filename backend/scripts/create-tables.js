const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTables() {
  try {
    console.log('🗄️  Criando tabelas no Supabase...');
    
    // SQL para criar a tabela routes
    const createRoutesTable = `
      CREATE TABLE IF NOT EXISTS routes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        start_point VARCHAR(100) NOT NULL,
        end_point VARCHAR(100) NOT NULL,
        waypoints JSONB DEFAULT '[]'::jsonb,
        assigned_employee_id UUID REFERENCES users(id),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // SQL para criar a tabela route_executions
    const createRouteExecutionsTable = `
      CREATE TABLE IF NOT EXISTS route_executions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
        employee_id UUID NOT NULL REFERENCES users(id),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
        started_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Executar as queries
    console.log('📋 Criando tabela routes...');
    const { error: routesError } = await supabase.rpc('exec_sql', { sql: createRoutesTable });
    
    if (routesError) {
      console.error('❌ Erro ao criar tabela routes:', routesError.message);
    } else {
      console.log('✅ Tabela routes criada com sucesso!');
    }

    console.log('📋 Criando tabela route_executions...');
    const { error: executionsError } = await supabase.rpc('exec_sql', { sql: createRouteExecutionsTable });
    
    if (executionsError) {
      console.error('❌ Erro ao criar tabela route_executions:', executionsError.message);
    } else {
      console.log('✅ Tabela route_executions criada com sucesso!');
    }

    // Criar índices para melhor performance
    console.log('🔍 Criando índices...');
    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_routes_assigned_employee ON routes(assigned_employee_id);',
      'CREATE INDEX IF NOT EXISTS idx_routes_is_active ON routes(is_active);',
      'CREATE INDEX IF NOT EXISTS idx_route_executions_route_id ON route_executions(route_id);',
      'CREATE INDEX IF NOT EXISTS idx_route_executions_employee_id ON route_executions(employee_id);',
      'CREATE INDEX IF NOT EXISTS idx_route_executions_status ON route_executions(status);'
    ];

    for (const indexSql of createIndexes) {
      const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexSql });
      if (indexError) {
        console.error('❌ Erro ao criar índice:', indexError.message);
      }
    }

    console.log('✅ Índices criados com sucesso!');
    console.log('');
    console.log('🎉 Setup do banco de dados concluído!');
    console.log('📊 Tabelas criadas:');
    console.log('   - routes');
    console.log('   - route_executions');
    console.log('');
    console.log('⚠️  NOTA: Se você recebeu erros sobre exec_sql, execute os comandos SQL manualmente no Supabase SQL Editor.');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
    console.log('');
    console.log('📝 Execute os seguintes comandos SQL manualmente no Supabase SQL Editor:');
    console.log('');
    console.log('-- Criar tabela routes');
    console.log(`CREATE TABLE IF NOT EXISTS routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  start_point VARCHAR(100) NOT NULL,
  end_point VARCHAR(100) NOT NULL,
  waypoints JSONB DEFAULT '[]'::jsonb,
  assigned_employee_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`);
    console.log('');
    console.log('-- Criar tabela route_executions');
    console.log(`CREATE TABLE IF NOT EXISTS route_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`);
  }
}

createTables();
