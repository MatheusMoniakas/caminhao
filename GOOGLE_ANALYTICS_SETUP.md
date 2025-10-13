# 📊 Google Analytics - Configuração e Uso
## Sistema de Gestão de Rotas de Caminhões

---

## 🚀 **CONFIGURAÇÃO INICIAL**

### **1. Criar Conta no Google Analytics**

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Clique em "Começar a medir"
3. Crie uma conta para sua empresa
4. Configure uma propriedade para o sistema
5. Escolha "Web" como plataforma
6. Configure o fluxo de dados:
   - **Nome do fluxo**: "Sistema de Gestão de Rotas"
   - **URL do site**: Sua URL de produção
   - **Nome do fluxo**: "Web"

### **2. Obter o Measurement ID**

1. No Google Analytics, vá para **Administração** > **Fluxos de dados**
2. Clique no fluxo criado
3. Copie o **ID de medição** (formato: `G-XXXXXXXXXX`)

### **3. Configurar Variáveis de Ambiente**

1. Copie o arquivo `frontend/env.example` para `frontend/.env`
2. Substitua o valor de `VITE_GA_MEASUREMENT_ID`:

```env
# Google Analytics Configuration
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### **4. Deploy e Teste**

1. Faça o build da aplicação: `npm run build`
2. Deploy em produção
3. Acesse o Google Analytics para verificar se os dados estão chegando

---

## 📈 **EVENTOS TRACKADOS AUTOMATICAMENTE**

### **Navegação e Páginas**
- ✅ **Page Views**: Todas as mudanças de rota
- ✅ **Tempo de Carregamento**: Performance de cada página
- ✅ **Erros JavaScript**: Captura automática de erros

### **Autenticação**
- ✅ **Login**: Sucesso e falhas
- ✅ **Logout**: Ações de saída
- ✅ **Registro**: Novos usuários
- ✅ **Erros de Autenticação**: Tipos de erro

### **Performance de API**
- ✅ **Chamadas de API**: Sucesso e falhas
- ✅ **Tempo de Resposta**: Duração das requisições
- ✅ **Status Codes**: Códigos de resposta HTTP

### **Gestão de Funcionários**
- ✅ **Criação**: Novos funcionários
- ✅ **Edição**: Atualizações de dados
- ✅ **Desativação**: Remoção de funcionários

### **Gestão de Rotas**
- ✅ **Criação**: Novas rotas
- ✅ **Edição**: Modificações em rotas
- ✅ **Duplicação**: Cópia de rotas existentes

### **Execução de Rotas**
- ✅ **Início**: Quando uma rota é iniciada
- ✅ **Conclusão**: Rotas finalizadas
- ✅ **Cancelamento**: Rotas canceladas

### **Gestão de Problemas**
- ✅ **Reporte**: Problemas reportados
- ✅ **Resolução**: Problemas resolvidos

### **Notificações WhatsApp**
- ✅ **Envio**: Notificações enviadas
- ✅ **Falhas**: Erros no envio

### **Interface e UX**
- ✅ **Mudança de Tema**: Alternância entre claro/escuro
- ✅ **Busca**: Termos pesquisados
- ✅ **Filtros**: Filtros aplicados

---

## 🛠️ **USO MANUAL DO ANALYTICS**

### **Importar o Serviço**

```typescript
import { analytics } from '@/services/analytics';
```

### **Eventos Básicos**

```typescript
// Evento customizado
analytics.trackEvent({
  action: 'click',
  category: 'user_interaction',
  label: 'button_save',
  value: 1,
  custom_parameters: {
    page: 'employee_form',
    user_role: 'admin'
  }
});
```

### **Eventos Específicos do Sistema**

```typescript
// Tracking de criação de rota
analytics.trackRouteCreated('standard');

// Tracking de início de execução
analytics.trackRouteStarted('route-123');

// Tracking de problema reportado
analytics.trackProblemReported('mechanical_issue');

// Tracking de mudança de tema
analytics.trackThemeChanged('dark');
```

### **Usando Hooks**

```typescript
import { useUserInteractionTracking } from '@/hooks/useAnalytics';

function MyComponent() {
  const { trackButtonClick, trackFormSubmission } = useUserInteractionTracking();

  const handleSave = () => {
    trackButtonClick('save_employee', 'employee_form');
    // ... lógica de salvamento
  };

  const handleSubmit = (success: boolean) => {
    trackFormSubmission('employee_form', success);
  };

  return (
    // ... JSX
  );
}
```

---

## 📊 **CONFIGURAÇÕES NO GOOGLE ANALYTICS**

### **1. Eventos Personalizados**

No Google Analytics, configure os seguintes eventos:

#### **Categorias Principais:**
- `authentication` - Eventos de login/logout
- `employee_management` - Gestão de funcionários
- `route_management` - Gestão de rotas
- `route_execution` - Execução de rotas
- `problem_management` - Gestão de problemas
- `whatsapp_notifications` - Notificações WhatsApp
- `user_interaction` - Interações do usuário
- `api_performance` - Performance de API
- `application_errors` - Erros da aplicação
- `application_performance` - Performance geral

### **2. Métricas Importantes**

#### **Conversão:**
- Taxa de login bem-sucedido
- Taxa de criação de rotas
- Taxa de conclusão de rotas

#### **Engajamento:**
- Tempo médio na aplicação
- Páginas mais visitadas
- Ações mais realizadas

#### **Performance:**
- Tempo de carregamento das páginas
- Tempo de resposta das APIs
- Taxa de erro das APIs

### **3. Relatórios Recomendados**

#### **Dashboard Principal:**
- Usuários ativos por dia
- Rotas criadas vs concluídas
- Problemas reportados vs resolvidos
- Performance média das APIs

#### **Relatório de Usuários:**
- Função dos usuários (admin/employee)
- Páginas mais acessadas por função
- Tempo de sessão por função

#### **Relatório de Performance:**
- Tempo de carregamento por página
- Erros mais comuns
- APIs mais lentas

---

## 🔧 **CONFIGURAÇÕES AVANÇADAS**

### **1. Filtros de Desenvolvimento**

Para evitar dados de desenvolvimento no Analytics de produção:

```typescript
// No analytics.ts
ReactGA.initialize(this.measurementId, {
  testMode: import.meta.env.DEV, // Modo de teste em desenvolvimento
  gtagOptions: {
    send_page_view: false,
  },
});
```

### **2. Configuração de Domínios**

Para múltiplos ambientes:

```typescript
// Configuração por ambiente
const config = {
  development: {
    measurementId: 'G-DEV-XXXXXXXXXX',
    testMode: true,
  },
  production: {
    measurementId: 'G-PROD-XXXXXXXXXX',
    testMode: false,
  }
};
```

### **3. Configuração de Cookies**

Para conformidade com LGPD:

```typescript
gtag('config', 'G-XXXXXXXXXX', {
  cookie_flags: 'SameSite=None;Secure',
  anonymize_ip: true,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
});
```

---

## 📱 **CONFIGURAÇÃO PARA MOBILE**

### **1. PWA (Progressive Web App)**

Se o sistema for usado como PWA:

```typescript
// Detectar se é PWA
const isPWA = window.matchMedia('(display-mode: standalone)').matches;

analytics.trackEvent({
  action: 'app_launch',
  category: 'pwa',
  label: isPWA ? 'standalone' : 'browser',
});
```

### **2. Offline Tracking**

Para tracking quando offline:

```typescript
// Armazenar eventos offline
const offlineEvents = JSON.parse(localStorage.getItem('offline_events') || '[]');

// Enviar quando voltar online
window.addEventListener('online', () => {
  offlineEvents.forEach(event => analytics.trackEvent(event));
  localStorage.removeItem('offline_events');
});
```

---

## 🚨 **TROUBLESHOOTING**

### **Problemas Comuns**

#### **1. Dados não aparecem no Analytics**
- ✅ Verificar se o Measurement ID está correto
- ✅ Aguardar até 24h para dados aparecerem
- ✅ Verificar se não está em modo de teste
- ✅ Verificar console do navegador por erros

#### **2. Eventos duplicados**
- ✅ Verificar se não há múltiplas inicializações
- ✅ Verificar se o AnalyticsProvider está apenas uma vez na árvore

#### **3. Performance impactada**
- ✅ Verificar se o analytics está sendo carregado de forma assíncrona
- ✅ Considerar usar Google Tag Manager para carregamento otimizado

### **Debug Mode**

Para debug em desenvolvimento:

```typescript
// Adicionar no console do navegador
window.gtag = function(...args) {
  console.log('GA Event:', args);
};
```

---

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

### **Configuração Inicial**
- [ ] Conta Google Analytics criada
- [ ] Measurement ID obtido
- [ ] Variável de ambiente configurada
- [ ] Script gtag adicionado ao HTML
- [ ] AnalyticsProvider integrado ao React

### **Testes**
- [ ] Page views sendo trackadas
- [ ] Eventos de login funcionando
- [ ] Performance de API sendo medida
- [ ] Erros sendo capturados
- [ ] Dados aparecendo no Google Analytics

### **Produção**
- [ ] Measurement ID de produção configurado
- [ ] Modo de teste desabilitado
- [ ] Filtros de desenvolvimento aplicados
- [ ] Monitoramento ativo

---

## 📚 **RECURSOS ADICIONAIS**

### **Documentação Oficial**
- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- [React GA4](https://github.com/PriceRunner/react-ga4)
- [GTag](https://developers.google.com/analytics/devguides/collection/gtagjs)

### **Ferramentas Úteis**
- [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
- [GA4 Query Explorer](https://ga-dev-tools.google/ga4/query-explorer/)
- [Real-time Reports](https://analytics.google.com/analytics/web/#/p[ID]/realtime)

---

*Esta documentação garante que o Google Analytics seja implementado corretamente no Sistema de Gestão de Rotas de Caminhões, fornecendo insights valiosos sobre o uso e performance da aplicação.*
