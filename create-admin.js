const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🚚 Criando usuário administrador...');
    
    // Criar empresa padrão
    const company = await prisma.company.create({
      data: {
        name: 'Transportadora Admin',
        cnpj: '00.000.000/0001-00',
        email: 'admin@transportadora.com',
        password: await bcrypt.hash('admin123', 10),
        address: 'Endereço da Empresa',
        phone: '(11) 99999-9999'
      }
    });
    
    console.log('✅ Empresa criada:', company.name);
    
    // Criar usuário administrador
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@transportadora.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
        companyId: company.id
      }
    });
    
    console.log('✅ Usuário administrador criado!');
    console.log('\n📋 CREDENCIAIS DE ACESSO:');
    console.log('================================');
    console.log('🔑 Email: admin@transportadora.com');
    console.log('🔑 Senha: admin123');
    console.log('================================');
    console.log('\n⚠️  IMPORTANTE: Altere essas credenciais após o primeiro acesso!');
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️  Usuário administrador já existe!');
      console.log('\n📋 CREDENCIAIS DE ACESSO:');
      console.log('================================');
      console.log('🔑 Email: admin@transportadora.com');
      console.log('🔑 Senha: admin123');
      console.log('================================');
    } else {
      console.error('❌ Erro ao criar usuário:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();

