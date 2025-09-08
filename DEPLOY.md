# 🚀 Guia de Deploy no Vercel

Este guia explica como fazer o deploy da aplicação **Gestão de Rotas de Caminhões** no Vercel.

## 📋 Pré-requisitos

1. **Conta no Vercel**: [vercel.com](https://vercel.com)
2. **Conta no GitHub**: [github.com](https://github.com)
3. **Banco de dados PostgreSQL**: Recomendamos usar [Neon](https://neon.tech) ou [Supabase](https://supabase.com)

## 🗄️ Configuração do Banco de Dados

### Opção 1: Neon (Recomendado)
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a string de conexão PostgreSQL

### Opção 2: Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Vá em Settings > Database
5. Copie a string de conexão

## 🔧 Configuração no Vercel

### 1. Conectar Repositório
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Conecte sua conta do GitHub
4. Selecione o repositório `caminhao`
5. Clique em "Import"

### 2. Configurar Variáveis de Ambiente
No painel do Vercel, vá em Settings > Environment Variables e adicione:

```
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
JWT_SECRET=sua-chave-secreta-super-forte-aqui-123456789
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://seu-projeto.vercel.app
```

**Importante**: Substitua `seu-projeto.vercel.app` pela URL real do seu projeto.

### 3. Configurar Build Settings
O Vercel deve detectar automaticamente as configurações, mas verifique se:

- **Framework Preset**: Other
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install`

### 4. Deploy
1. Clique em "Deploy"
2. Aguarde o processo de build
3. Acesse a URL fornecida

## 🗄️ Configuração do Banco de Dados no Deploy

### 1. Executar Migrações
Após o deploy, você precisa executar as migrações do Prisma:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Executar migrações
vercel env pull .env.local
npx prisma migrate deploy
```

### 2. Verificar Conexão
Teste se o banco está funcionando:
```bash
npx prisma studio
```

## 🔍 Verificação do Deploy

### 1. Testar API
Acesse: `https://seu-projeto.vercel.app/api/health`

Deve retornar:
```json
{
  "status": "OK",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

### 2. Testar Frontend
Acesse: `https://seu-projeto.vercel.app`

Deve carregar a interface de login.

### 3. Testar Registro
1. Clique em "Criar Conta"
2. Preencha os dados da empresa
3. Verifique se o registro funciona

## 🚨 Solução de Problemas

### Erro 500 na API
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o banco de dados está acessível
- Verifique os logs no painel do Vercel

### Erro 404 no Frontend
- Verifique se o build foi executado corretamente
- Confirme se o `vercel.json` está configurado

### Problemas de CORS
- Verifique se `FRONTEND_URL` está correto
- Confirme se a URL do frontend está na lista de origens permitidas

### Banco de Dados não Conecta
- Verifique se a string de conexão está correta
- Confirme se o banco permite conexões externas
- Teste a conexão localmente primeiro

## 📱 URLs Importantes

Após o deploy, você terá:
- **Frontend**: `https://seu-projeto.vercel.app`
- **API Health**: `https://seu-projeto.vercel.app/api/health`
- **API Auth**: `https://seu-projeto.vercel.app/api/auth`

## 🔄 Deploy Automático

O Vercel fará deploy automático sempre que você fizer push para a branch `main` no GitHub.

Para fazer mudanças:
1. Faça as alterações no código
2. Commit e push para o GitHub
3. O Vercel fará o deploy automaticamente

## 📊 Monitoramento

No painel do Vercel você pode:
- Ver logs de erro
- Monitorar performance
- Configurar domínios customizados
- Gerenciar variáveis de ambiente

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs no painel do Vercel
2. Teste localmente primeiro
3. Consulte a documentação do Vercel
4. Abra uma issue no GitHub

---

**Pronto!** Sua aplicação estará online e funcionando! 🎉
