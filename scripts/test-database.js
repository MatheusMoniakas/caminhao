const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias');
  console.log('💡 Configure o arquivo backend/.env primeiro');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testDatabase() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...\n');
    
    // Testar conexão básica
    console.log('1. Testando conexão...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Erro de conexão:', connectionError.message);
      return;
    }
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Verificar se as tabelas existem
    console.log('\n2. Verificando tabelas...');
    const tables = ['users', 'routes', 'route_executions'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`❌ Tabela '${table}': ${error.message}`);
      } else {
        console.log(`✅ Tabela '${table}': OK`);
      }
    }
    
    // Verificar usuário admin
    console.log('\n3. Verificando usuário administrador...');
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('id, email, name, role, is_active')
      .eq('role', 'admin')
      .single();
    
    if (adminError) {
      console.log('❌ Usuário admin não encontrado:', adminError.message);
    } else {
      console.log('✅ Usuário admin encontrado:');
      console.log(`   📧 Email: ${adminUser.email}`);
      console.log(`   👤 Nome: ${adminUser.name}`);
      console.log(`   🔐 Role: ${adminUser.role}`);
      console.log(`   ✅ Ativo: ${adminUser.is_active ? 'Sim' : 'Não'}`);
    }
    
    // Testar inserção (opcional)
    console.log('\n4. Testando operações básicas...');
    const { data: testInsert, error: insertError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (insertError) {
      console.log('❌ Erro ao testar leitura:', insertError.message);
    } else {
      console.log('✅ Operações de leitura funcionando');
    }
    
    console.log('\n🎉 Teste do banco de dados concluído!');
    console.log('💡 Se todos os testes passaram, o banco está configurado corretamente.');
    
  } catch (error) {
    console.error('💥 Erro inesperado:', error.message);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  testDatabase()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = { testDatabase };
