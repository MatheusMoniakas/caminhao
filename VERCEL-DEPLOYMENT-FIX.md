# Correções para Deployment no Vercel

## Problemas Identificados e Soluções

### 1. Erro 404 em `/api/auth/register`
**Problema**: O Vercel estava tentando acessar uma rota que não existia na configuração atual.

**Solução**: 
- Atualizei o arquivo `vercel.json` para usar a API simplificada em `api/index.js`
- Corrigi a estrutura de dados da rota de registro para usar `company` e `user` separados
- Atualizei as validações para corresponder à nova estrutura

### 2. Erro 404 em `/api/helth` (typo)
**Problema**: Havia um typo no endpoint de health check.

**Solução**: 
- O endpoint correto é `/api/health` (sem o 'l' extra)
- Verifique se não há chamadas para `/api/helth` no frontend

### 3. Configuração do Vercel
**Problema**: O arquivo `vercel.json` estava apontando para o backend complexo com Prisma.

**Solução**: 
- Configurei para usar a API simplificada em `api/index.js`
- Esta versão não usa Prisma e funciona melhor no ambiente serverless do Vercel

## Arquivos Modificados

### 1. `vercel.json` (raiz)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/$1"
    }
  ]
}
```

### 2. `api/index.js`
- Atualizei as rotas de autenticação para usar a estrutura correta
- Corrigi as validações para `company` e `user` separados
- Mantive a funcionalidade de mock data para funcionar sem banco de dados

## Rotas Disponíveis

### Autenticação
- `POST /api/auth/register` - Registro de empresa e usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/health` - Health check

### Outras Rotas
- `GET /api/empresa` - Lista de empresas
- `GET /api/caminhoes` - Lista de caminhões
- `POST /api/caminhoes` - Criar caminhão
- `GET /api/funcionarios` - Lista de funcionários
- `POST /api/funcionarios` - Criar funcionário
- `GET /api/rotas` - Lista de rotas
- `POST /api/rotas` - Criar rota

## Estrutura de Dados para Registro

```json
{
  "company": {
    "name": "Nome da Empresa",
    "cnpj": "12345678000199",
    "email": "empresa@email.com",
    "password": "senha123",
    "address": "Endereço da empresa",
    "phone": "11999999999"
  },
  "user": {
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "password": "senha123"
  }
}
```

## Próximos Passos

1. **Fazer o build do frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Fazer o deploy no Vercel**:
   ```bash
   vercel --prod
   ```

3. **Testar as rotas**:
   - `GET /api/health` - Deve retornar status OK
   - `POST /api/auth/register` - Deve funcionar com a nova estrutura
   - `POST /api/auth/login` - Deve funcionar com email/password

## Notas Importantes

- A API simplificada usa dados em memória (mock data)
- Para produção real, você precisará implementar um banco de dados
- As senhas são criptografadas com bcrypt
- Os tokens JWT são gerados corretamente
- CORS está configurado para aceitar requisições do frontend

## Troubleshooting

Se ainda houver problemas:

1. Verifique os logs do Vercel no dashboard
2. Confirme que o frontend está fazendo as chamadas corretas
3. Teste as rotas individualmente usando Postman ou curl
4. Verifique se as variáveis de ambiente estão configuradas no Vercel
