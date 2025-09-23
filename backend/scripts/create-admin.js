const bcrypt = require('bcryptjs');
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

async function createAdminUser() {
  try {
    console.log('🔐 Criando usuário administrador...');
    
    // Hash da senha
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Dados do usuário admin
    const adminData = {
      email: 'admin@caminhao.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin',
      is_active: true
    };
    
    // Verificar se o usuário já existe
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', adminData.email)
      .single();
    
    if (existingUser) {
      console.log('⚠️  Usuário administrador já existe!');
      console.log(`📧 Email: ${existingUser.email}`);
      console.log(`🆔 ID: ${existingUser.id}`);
      return;
    }
    
    // Criar usuário
    const { data, error } = await supabase
      .from('users')
      .insert(adminData)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar usuário:', error.message);
      return;
    }
    
    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📧 Email:', data.email);
    console.log('🔑 Senha:', password);
    console.log('🆔 ID:', data.id);
    console.log('👤 Nome:', data.name);
    console.log('🔐 Role:', data.role);
    console.log('');
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log('🎉 Script executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = { createAdminUser };
