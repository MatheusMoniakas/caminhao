# 🚀 Configuração Baileys WhatsApp - Guia Completo

## 📋 **Visão Geral**

O **Baileys** é uma biblioteca JavaScript gratuita e open source para WhatsApp. Este guia te ensina a configurar um servidor completo para enviar mensagens automaticamente.

## 🛠️ **Instalação Passo a Passo**

### **Passo 1: Instalar o Servidor Baileys**

```bash
# No terminal, dentro da pasta backend/scripts
cd backend/scripts
bash install-baileys.sh
```

### **Passo 2: Iniciar o Servidor**

```bash
cd baileys-server
npm start
```

### **Passo 3: Conectar seu WhatsApp**

1. **Execute o servidor** - você verá um QR Code no terminal
2. **Abra seu WhatsApp** no celular
3. **Vá em Configurações > Aparelhos conectados > Conectar um aparelho**
4. **Escaneie o QR Code** que apareceu no terminal
5. **Aguarde a conexão** - você verá "✅ Conectado com sucesso"

### **Passo 4: Configurar no Render**

Adicione estas variáveis no Render:

```env
WHATSAPP_API_URL=http://SEU_IP:3001/send-message
WHATSAPP_API_TOKEN=nao_precisa_para_baileys
```

## 🔧 **Configuração para Produção**

### **Opção 1: Hospedar no Render (Recomendado)**

1. **Crie um novo serviço** no Render
2. **Conecte ao GitHub** com o código do Baileys
3. **Configure as variáveis** de ambiente
4. **Deploy** automático

### **Opção 2: VPS/Servidor Próprio**

1. **Alugue um VPS** (DigitalOcean, AWS, etc.)
2. **Instale Node.js** no servidor
3. **Clone o código** do Baileys
4. **Configure PM2** para manter o servidor rodando
5. **Configure firewall** para liberar porta 3001

## 📱 **Como Funciona**

### **Estrutura do Servidor:**

```
baileys-server/
├── baileys-server.js    # Servidor principal
├── package.json         # Dependências
├── auth_info_default/   # Credenciais do WhatsApp (criado automaticamente)
└── node_modules/        # Dependências instaladas
```

### **Endpoints Disponíveis:**

- `GET /` - Status do servidor
- `POST /session/create` - Criar nova sessão
- `POST /send-message` - Enviar mensagem
- `GET /sessions` - Listar sessões ativas
- `DELETE /session/:id` - Deletar sessão

### **Exemplo de Envio de Mensagem:**

```bash
curl -X POST http://localhost:3001/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "default",
    "phone": "11999999999",
    "message": "Olá! Esta é uma mensagem de teste."
  }'
```

## 🔒 **Segurança**

### **Recomendações:**

1. **Use HTTPS** em produção
2. **Configure firewall** para liberar apenas porta 3001
3. **Use autenticação** se necessário
4. **Monitore logs** regularmente
5. **Faça backup** das credenciais (`auth_info_default/`)

### **Variáveis de Ambiente:**

```env
# Porta do servidor
PORT=3001

# URL do webhook (opcional)
WEBHOOK_URL=https://seu-site.com/webhook

# Configurações de segurança
NODE_ENV=production
```

## 🚨 **Solução de Problemas**

### **Problema: QR Code não aparece**
```bash
# Verifique se as dependências estão instaladas
cd baileys-server
npm install

# Execute novamente
npm start
```

### **Problema: Conexão perdida**
```bash
# O servidor reconecta automaticamente
# Se não reconectar, delete a pasta auth_info_default e reconecte
rm -rf auth_info_default
npm start
```

### **Problema: Mensagem não enviada**
```bash
# Verifique se o WhatsApp está conectado
curl http://localhost:3001/sessions

# Teste o envio manual
curl -X POST http://localhost:3001/send-message \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "default", "phone": "11999999999", "message": "Teste"}'
```

## 📊 **Monitoramento**

### **Logs Importantes:**

```bash
# Status da conexão
✅ Conectado com sucesso: default

# Mensagens enviadas
📨 Mensagem enviada para: 11999999999

# Erros
❌ Erro ao enviar mensagem: [detalhes do erro]
```

### **Comandos Úteis:**

```bash
# Ver sessões ativas
curl http://localhost:3001/sessions

# Status do servidor
curl http://localhost:3001/

# Deletar sessão
curl -X DELETE http://localhost:3001/session/default
```

## 🔄 **Integração com o Sistema**

### **Configuração no Render:**

1. **Adicione as variáveis** de ambiente
2. **Configure a URL** do servidor Baileys
3. **Teste a integração** criando uma rota
4. **Monitore os logs** para verificar o envio

### **Exemplo de Configuração:**

```env
# No Render
WHATSAPP_API_URL=http://SEU_IP:3001/send-message
WHATSAPP_API_TOKEN=nao_precisa_para_baileys
```

## 🎯 **Vantagens do Baileys**

- ✅ **100% Gratuito** - sem limites de mensagens
- ✅ **Open Source** - código aberto e auditável
- ✅ **Controle Total** - você hospeda e controla
- ✅ **Sem Dependências** - não depende de serviços externos
- ✅ **Flexível** - pode ser customizado conforme necessário
- ✅ **Estável** - reconexão automática

## 📞 **Suporte**

Se tiver problemas:

1. **Verifique os logs** do servidor
2. **Teste a conexão** manualmente
3. **Reconecte o WhatsApp** se necessário
4. **Verifique a configuração** no Render

---

**🎉 Pronto! Agora você tem um servidor WhatsApp completo e gratuito rodando com Baileys!**
