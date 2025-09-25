# Integração WhatsApp - Sistema de Gestão de Rotas

## 📱 Visão Geral

Esta funcionalidade envia automaticamente mensagens no WhatsApp para motoristas e ajudantes sempre que uma nova rota é criada no sistema. A mensagem inclui:

- Nome da rota
- Data da rota
- Turno da rota
- Nomes do motorista e ajudante (se houver)

## 🚀 Como Funciona

1. **Criação da Rota**: Quando uma rota é criada via API
2. **Busca de Dados**: Sistema busca dados do motorista e ajudante
3. **Verificação de Telefone**: Verifica se os funcionários têm telefone cadastrado
4. **Envio da Mensagem**: Envia mensagem formatada via WhatsApp API
5. **Log de Resultados**: Registra sucesso ou falha no envio

## ⚙️ Configuração

### 1. Adicionar Campo de Telefone

Execute o script SQL para adicionar o campo `phone` na tabela `users`:

```sql
-- Execute no Supabase SQL Editor
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
COMMENT ON COLUMN users.phone IS 'Número de telefone do usuário para notificações WhatsApp';
CREATE INDEX idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
```

### 2. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# URL da API do WhatsApp
WHATSAPP_API_URL=https://api.whatsapp.com/v1

# Token de autenticação
WHATSAPP_API_TOKEN=seu_token_aqui
```

### 3. Provedores de API WhatsApp

#### WhatsApp Business API (Facebook)
```env
WHATSAPP_API_URL=https://graph.facebook.com/v18.0/SEU_PHONE_NUMBER_ID/messages
WHATSAPP_API_TOKEN=seu_access_token_do_facebook
```

#### Twilio WhatsApp
```env
WHATSAPP_API_URL=https://api.twilio.com/2010-04-01/Accounts/SEU_ACCOUNT_SID/Messages.json
WHATSAPP_API_TOKEN=seu_auth_token_do_twilio
```

#### API Personalizada
```env
WHATSAPP_API_URL=https://sua-api.com/whatsapp
WHATSAPP_API_TOKEN=seu_token_personalizado
```

## 📝 Formato da Mensagem

A mensagem enviada segue este formato:

```
🚛 *Nova Rota Criada*

📋 *Rota:* Nome da Rota
📅 *Data:* 15/12/2023
⏰ *Turno:* Manhã
👥 *Equipe:* João Silva (Motorista) e Maria Santos (Ajudante)

✅ Rota criada com sucesso! Verifique os detalhes no sistema.
```

## 🔧 Uso

### Cadastrar Telefone de Funcionário

Ao criar ou editar um funcionário, inclua o campo `phone`:

```json
{
  "name": "João Silva",
  "email": "joao@empresa.com",
  "password": "senha123",
  "phone": "11999999999"
}
```

### Criar Rota

Ao criar uma rota, o sistema automaticamente enviará as notificações:

```json
{
  "name": "Rota Centro - Zona Sul",
  "driverId": "uuid-do-motorista",
  "helperId": "uuid-do-ajudante",
  "scheduledDate": "2023-12-15",
  "shift": "morning"
}
```

## 🛡️ Tratamento de Erros

- **API não configurada**: Sistema continua funcionando, apenas registra aviso
- **Telefone não cadastrado**: Registra aviso e não envia mensagem
- **Falha no envio**: Registra erro mas não afeta criação da rota
- **Funcionário não encontrado**: Registra aviso e continua

## 📊 Logs

O sistema registra todas as operações:

```
WhatsApp notification sent to driver: João Silva (11999999999)
WhatsApp notification sent to helper: Maria Santos (11888888888)
```

Em caso de erro:
```
Failed to send WhatsApp notification to driver: João Silva (11999999999)
Driver João Silva does not have a phone number registered
```

## 🔍 Monitoramento

Para verificar se as mensagens estão sendo enviadas:

1. Verifique os logs do servidor
2. Confirme se as variáveis de ambiente estão configuradas
3. Teste a API do WhatsApp diretamente
4. Verifique se os funcionários têm telefone cadastrado

## 🚨 Importante

- A funcionalidade é **não-bloqueante**: falhas no WhatsApp não impedem a criação da rota
- Telefones devem estar no formato brasileiro (com DDD)
- O sistema adiciona automaticamente o código do país (+55) se necessário
- Mensagens são enviadas de forma assíncrona para não impactar a performance

## 🔧 Desenvolvimento

### Estrutura dos Arquivos

- `WhatsAppService.ts`: Serviço principal para envio de mensagens
- `RouteService.ts`: Integração com criação de rotas
- `UserService.ts`: Gerenciamento de dados de usuários
- `add-phone-field.sql`: Script para adicionar campo telefone

### Testando Localmente

1. Configure as variáveis de ambiente
2. Execute o script SQL no banco
3. Crie um funcionário com telefone
4. Crie uma rota e verifique os logs
