/**
 * Script de teste para a funcionalidade de WhatsApp
 * Execute com: node scripts/test-whatsapp.js
 */

const { WhatsAppService } = require('../dist/services/WhatsAppService');

async function testWhatsApp() {
  console.log('🧪 Testando funcionalidade de WhatsApp...\n');

  const whatsappService = new WhatsAppService();

  // Dados de teste
  const testData = {
    routeName: 'Rota Centro - Zona Sul',
    scheduledDate: '2023-12-15',
    shift: 'morning',
    driverName: 'João Silva',
    helperName: 'Maria Santos'
  };

  // Teste 1: Validação de número de telefone
  console.log('📱 Teste 1: Validação de números de telefone');
  const validPhones = ['11999999999', '11888888888', '+5511999999999'];
  const invalidPhones = ['123', 'abc', ''];

  validPhones.forEach(phone => {
    const isValid = whatsappService.isValidPhoneNumber(phone);
    console.log(`  ${phone}: ${isValid ? '✅ Válido' : '❌ Inválido'}`);
  });

  invalidPhones.forEach(phone => {
    const isValid = whatsappService.isValidPhoneNumber(phone);
    console.log(`  "${phone}": ${isValid ? '✅ Válido' : '❌ Inválido'}`);
  });

  // Teste 2: Formatação de números
  console.log('\n📱 Teste 2: Formatação de números de telefone');
  const phonesToFormat = ['11999999999', '11888888888', '5511999999999'];
  
  phonesToFormat.forEach(phone => {
    const formatted = whatsappService.formatPhoneNumber(phone);
    console.log(`  ${phone} → ${formatted}`);
  });

  // Teste 3: Criação de mensagem
  console.log('\n📝 Teste 3: Criação de mensagem de notificação');
  const message = whatsappService.createRouteMessage(testData);
  console.log('Mensagem criada:');
  console.log('─'.repeat(50));
  console.log(message);
  console.log('─'.repeat(50));

  // Teste 4: Envio de mensagem (simulado)
  console.log('\n📤 Teste 4: Simulação de envio de mensagem');
  console.log('⚠️  Nota: Este é apenas um teste simulado');
  console.log('   Para testar o envio real, configure as variáveis de ambiente:');
  console.log('   - WHATSAPP_API_URL');
  console.log('   - WHATSAPP_API_TOKEN');
  
  const testPhone = '11999999999';
  console.log(`\n   Tentando enviar para: ${testPhone}`);
  
  try {
    const result = await whatsappService.sendMessage(testPhone, message);
    console.log(`   Resultado: ${result ? '✅ Sucesso' : '❌ Falha'}`);
  } catch (error) {
    console.log(`   Erro: ${error.message}`);
  }

  console.log('\n✅ Testes concluídos!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Execute o script SQL para adicionar o campo phone na tabela users');
  console.log('2. Configure as variáveis de ambiente do WhatsApp');
  console.log('3. Cadastre funcionários com números de telefone');
  console.log('4. Crie uma rota e verifique se as mensagens são enviadas');
}

// Executar testes
testWhatsApp().catch(console.error);
