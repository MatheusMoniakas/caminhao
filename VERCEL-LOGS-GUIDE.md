# 🔍 Guia Completo para Verificar Logs no Vercel

## 📋 **Onde encontrar logs no Vercel:**

### 1. **Logs de Deploy (Build Logs)**
**Localização**: Dashboard Vercel → Seu Projeto → Deployments → Último Deploy

**Como acessar:**
1. Acesse [vercel.com](https://vercel.com)
2. Clique no seu projeto `caminhao`
3. Vá na aba **"Deployments"**
4. Clique no último deployment (mais recente)
5. Veja a aba **"Build Logs"**

**O que procurar:**
- ❌ Erros de build
- ❌ Falha na instalação de dependências
- ❌ Erros de compilação
- ❌ Timeout de build

### 2. **Logs de Runtime (Function Logs)**
**Localização**: Dashboard Vercel → Seu Projeto → Functions

**Como acessar:**
1. No mesmo deployment, vá na aba **"Functions"**
2. Clique em **"View Function Logs"**
3. Ou vá em **"Runtime Logs"**

**O que procurar:**
- ❌ Erros de inicialização da função
- ❌ Erros de importação de módulos
- ❌ Erros de conexão com banco de dados
- ❌ Erros de variáveis de ambiente

### 3. **Logs de Edge Network**
**Localização**: Dashboard Vercel → Seu Projeto → Analytics

**Como acessar:**
1. Vá na aba **"Analytics"**
2. Clique em **"Real-time"**
3. Veja erros 404, 500, etc.

### 4. **Logs via Vercel CLI**
**Comandos úteis:**
```bash
# Ver logs em tempo real
vercel logs

# Ver logs de um deployment específico
vercel logs [deployment-url]

# Ver status do projeto
vercel ls

# Ver informações do projeto
vercel inspect
```

## 🚨 **Problemas Comuns e Soluções:**

### **Erro 404 - Rota não encontrada**
**Possíveis causas:**
1. **Arquivo não encontrado**: O Vercel não consegue encontrar o arquivo especificado
2. **Configuração incorreta**: `vercel.json` com paths errados
3. **Build falhou**: Frontend não foi buildado corretamente
4. **Função não carregou**: Backend não inicializou

### **Erro 500 - Erro interno do servidor**
**Possíveis causas:**
1. **Dependências faltando**: Módulos não instalados
2. **Variáveis de ambiente**: Não configuradas
3. **Banco de dados**: Não conecta
4. **Erro de código**: JavaScript error

## 🔧 **Checklist de Verificação:**

### **1. Verificar Build Logs:**
- [ ] Build do frontend foi bem-sucedido?
- [ ] Dependências foram instaladas?
- [ ] Não há erros de compilação?

### **2. Verificar Function Logs:**
- [ ] Função inicializou corretamente?
- [ ] Não há erros de importação?
- [ ] Variáveis de ambiente estão definidas?

### **3. Verificar Deploy:**
- [ ] Deploy foi bem-sucedido?
- [ ] URL está acessível?
- [ ] Não há timeouts?

## 📱 **URLs para Testar:**

Após o deploy, teste estas URLs:

1. **Frontend**: `https://seu-projeto.vercel.app/`
2. **API Health**: `https://seu-projeto.vercel.app/api/health`
3. **API Test**: `https://seu-projeto.vercel.app/api/test`
4. **Root API**: `https://seu-projeto.vercel.app/`

## 🆘 **Se ainda der erro 404:**

### **Passo 1: Verificar Build Logs**
- Vá em Deployments → Último Deploy → Build Logs
- Procure por erros de build
- Se houver erro, corrija e faça novo deploy

### **Passo 2: Verificar Function Logs**
- Vá em Functions → View Function Logs
- Procure por erros de runtime
- Se houver erro, verifique o código

### **Passo 3: Verificar Configuração**
- Confirme se `vercel.json` está correto
- Verifique se os arquivos existem
- Teste localmente primeiro

### **Passo 4: Verificar Variáveis de Ambiente**
- Vá em Settings → Environment Variables
- Confirme se todas estão definidas
- Verifique se os valores estão corretos

## 📞 **Suporte:**

Se não conseguir resolver:
1. Copie os logs de erro
2. Verifique a documentação do Vercel
3. Abra uma issue no GitHub
4. Entre em contato com o suporte do Vercel

---

**Status**: 🔍 Aguardando verificação dos logs
**Próximo**: Identificar problema específico nos logs
