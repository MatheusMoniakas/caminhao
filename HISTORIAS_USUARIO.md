# 📖 HISTÓRIAS DE USUÁRIO
## Sistema de Gestão de Rotas de Caminhões

---

## 👥 PERFIS DE USUÁRIO

### 🎯 **Persona 1: Administrador (João Silva)**
- **Cargo**: Gerente de Operações
- **Experiência**: 5 anos em logística
- **Necessidades**: Controlar operações, gerenciar equipe, acompanhar performance
- **Frustrações**: Falta de visibilidade das operações, comunicação ineficiente

### 🎯 **Persona 2: Motorista (Carlos Santos)**
- **Cargo**: Motorista de Caminhão
- **Experiência**: 8 anos dirigindo
- **Necessidades**: Saber suas rotas, reportar problemas, comunicar status
- **Frustrações**: Informações desatualizadas, dificuldade para reportar problemas

### 🎯 **Persona 3: Ajudante (Maria Oliveira)**
- **Cargo**: Ajudante de Caminhão
- **Experiência**: 3 anos na função
- **Necessidades**: Acompanhar rotas, auxiliar motorista, reportar situações
- **Frustrações**: Falta de informações sobre as rotas, comunicação limitada

---

## 📋 ÉPICOS E HISTÓRIAS DE USUÁRIO

## 🏢 **ÉPICO 1: GESTÃO DE FUNCIONÁRIOS**

### **US001 - Cadastrar Funcionário**
**Como** um **Administrador**  
**Eu quero** cadastrar novos funcionários no sistema  
**Para que** eu possa gerenciar minha equipe e atribuir rotas

**Critérios de Aceitação:**
- [ ] Devo poder inserir nome, email, senha e telefone
- [ ] O sistema deve validar se o email é único
- [ ] A senha deve ter mínimo 6 caracteres
- [ ] Devo poder escolher o cargo (admin/employee)
- [ ] O sistema deve enviar confirmação de cadastro
- [ ] O funcionário deve receber notificação por WhatsApp (se tiver telefone)

**Definição de Pronto:**
- [ ] Formulário de cadastro implementado
- [ ] Validações de dados funcionando
- [ ] Integração com banco de dados
- [ ] Testes unitários criados
- [ ] Documentação atualizada

---

### **US002 - Listar Funcionários**
**Como** um **Administrador**  
**Eu quero** visualizar todos os funcionários cadastrados  
**Para que** eu possa gerenciar minha equipe

**Critérios de Aceitação:**
- [ ] Devo ver lista com nome, email, cargo e status
- [ ] Devo poder filtrar por status (ativo/inativo)
- [ ] Devo poder buscar por nome ou email
- [ ] Devo poder ordenar por diferentes campos
- [ ] A lista deve ser paginada para muitos funcionários

**Definição de Pronto:**
- [ ] Interface de listagem implementada
- [ ] Filtros e busca funcionando
- [ ] Paginação implementada
- [ ] Testes de integração criados

---

### **US003 - Editar Funcionário**
**Como** um **Administrador**  
**Eu quero** editar dados de funcionários existentes  
**Para que** eu possa manter as informações atualizadas

**Critérios de Aceitação:**
- [ ] Devo poder editar nome, email e telefone
- [ ] Devo poder ativar/desativar funcionário
- [ ] O sistema deve validar email único (exceto o próprio)
- [ ] Devo receber confirmação das alterações
- [ ] As alterações devem ser salvas no banco

**Definição de Pronto:**
- [ ] Formulário de edição implementado
- [ ] Validações funcionando
- [ ] Atualização no banco de dados
- [ ] Testes de atualização criados

---

### **US004 - Desativar Funcionário**
**Como** um **Administrador**  
**Eu quero** desativar funcionários que não trabalham mais  
**Para que** eu possa manter o controle de acesso

**Critérios de Aceitação:**
- [ ] Devo poder desativar funcionário sem deletar dados
- [ ] Funcionário desativado não deve conseguir fazer login
- [ ] Devo receber confirmação da desativação
- [ ] O status deve ser atualizado na interface

**Definição de Pronto:**
- [ ] Funcionalidade de desativação implementada
- [ ] Bloqueio de login para usuários inativos
- [ ] Interface atualizada
- [ ] Testes de segurança criados

---

## 🗺️ **ÉPICO 2: GESTÃO DE ROTAS**

### **US005 - Criar Rota**
**Como** um **Administrador**  
**Eu quero** criar novas rotas de entrega  
**Para que** eu possa organizar as operações logísticas

**Critérios de Aceitação:**
- [ ] Devo poder inserir nome, descrição e pontos da rota
- [ ] Devo poder adicionar pontos intermediários (waypoints)
- [ ] Devo poder atribuir motorista e ajudante
- [ ] Devo poder definir data e turno
- [ ] O sistema deve enviar notificação WhatsApp automaticamente
- [ ] Devo receber confirmação de criação

**Definição de Pronto:**
- [ ] Formulário de criação implementado
- [ ] Validações de dados funcionando
- [ ] Integração WhatsApp funcionando
- [ ] Criação automática de execução de rota
- [ ] Testes end-to-end criados

---

### **US006 - Listar Rotas**
**Como** um **Administrador**  
**Eu quero** visualizar todas as rotas criadas  
**Para que** eu possa acompanhar as operações

**Critérios de Aceitação:**
- [ ] Devo ver lista com nome, motorista, status e data
- [ ] Devo poder filtrar por status (ativa/inativa)
- [ ] Devo poder filtrar por motorista
- [ ] Devo poder buscar por nome da rota
- [ ] Devo ver status de execução de cada rota

**Definição de Pronto:**
- [ ] Interface de listagem implementada
- [ ] Filtros e busca funcionando
- [ ] Status de execução integrado
- [ ] Testes de performance criados

---

### **US007 - Duplicar Rota**
**Como** um **Administrador**  
**Eu quero** duplicar rotas existentes  
**Para que** eu possa reutilizar rotas similares rapidamente

**Critérios de Aceitação:**
- [ ] Devo poder duplicar qualquer rota existente
- [ ] O nome deve ser alterado para "Cópia de [Nome Original]"
- [ ] Pontos de partida, destino e waypoints devem ser copiados
- [ ] Motorista e ajudante devem ser removidos (para reatribuir)
- [ ] Data deve ser limpa (para redefinir)

**Definição de Pronto:**
- [ ] Funcionalidade de duplicação implementada
- [ ] Modal de confirmação criado
- [ ] Lógica de cópia funcionando
- [ ] Testes de duplicação criados

---

### **US008 - Editar Rota**
**Como** um **Administrador**  
**Eu quero** editar rotas existentes  
**Para que** eu possa ajustar as operações conforme necessário

**Critérios de Aceitação:**
- [ ] Devo poder editar todos os campos da rota
- [ ] Devo poder reatribuir motorista e ajudante
- [ ] Devo poder alterar data e turno
- [ ] O sistema deve validar se a rota não está em execução
- [ ] Devo receber confirmação das alterações

**Definição de Pronto:**
- [ ] Formulário de edição implementado
- [ ] Validações de estado da rota
- [ ] Atualização no banco de dados
- [ ] Testes de edição criados

---

## 🚛 **ÉPICO 3: EXECUÇÃO DE ROTAS**

### **US009 - Visualizar Minhas Rotas**
**Como** um **Funcionário (Motorista/Ajudante)**  
**Eu quero** ver as rotas atribuídas a mim  
**Para que** eu possa me preparar para as entregas

**Critérios de Aceitação:**
- [ ] Devo ver apenas rotas onde sou motorista ou ajudante
- [ ] Devo ver nome, pontos, data e turno da rota
- [ ] Devo ver status atual da execução
- [ ] Devo poder filtrar por status (pendente, em andamento, concluída)
- [ ] A lista deve ser ordenada por data

**Definição de Pronto:**
- [ ] Interface de visualização implementada
- [ ] Filtros por status funcionando
- [ ] Ordenação por data implementada
- [ ] Testes de autorização criados

---

### **US010 - Iniciar Execução de Rota**
**Como** um **Funcionário (Motorista)**  
**Eu quero** iniciar a execução de uma rota  
**Para que** eu possa começar a entrega

**Critérios de Aceitação:**
- [ ] Devo poder iniciar apenas rotas com status "pending"
- [ ] O sistema deve registrar o horário de início
- [ ] O status deve mudar para "in_progress"
- [ ] Devo receber confirmação do início
- [ ] O administrador deve ser notificado

**Definição de Pronto:**
- [ ] Botão de iniciar implementado
- [ ] Registro de horário funcionando
- [ ] Atualização de status implementada
- [ ] Testes de execução criados

---

### **US011 - Atualizar Status da Rota**
**Como** um **Funcionário (Motorista/Ajudante)**  
**Eu quero** atualizar o status da execução da rota  
**Para que** eu possa comunicar o progresso

**Critérios de Aceitação:**
- [ ] Devo poder atualizar status para "in_progress", "completed" ou "cancelled"
- [ ] Devo poder adicionar observações sobre a execução
- [ ] Devo poder marcar se houve problemas e se foram resolvidos
- [ ] O sistema deve registrar horário de finalização (se aplicável)
- [ ] Devo receber confirmação da atualização

**Definição de Pronto:**
- [ ] Interface de atualização implementada
- [ ] Campos de observações funcionando
- [ ] Registro de horários automático
- [ ] Testes de atualização criados

---

### **US012 - Finalizar Rota**
**Como** um **Funcionário (Motorista)**  
**Eu quero** finalizar a execução de uma rota  
**Para que** eu possa completar a entrega

**Critérios de Aceitação:**
- [ ] Devo poder finalizar apenas rotas "in_progress"
- [ ] O sistema deve registrar horário de fim
- [ ] O status deve mudar para "completed"
- [ ] Devo poder adicionar observações finais
- [ ] O administrador deve ser notificado da conclusão

**Definição de Pronto:**
- [ ] Botão de finalizar implementado
- [ ] Registro de horário de fim funcionando
- [ ] Notificação para administrador
- [ ] Testes de finalização criados

---

## 📊 **ÉPICO 4: DASHBOARD E RELATÓRIOS**

### **US013 - Visualizar Dashboard**
**Como** um **Administrador**  
**Eu quero** ver um dashboard com métricas gerais  
**Para que** eu possa acompanhar o desempenho das operações

**Critérios de Aceitação:**
- [ ] Devo ver total de funcionários ativos
- [ ] Devo ver total de rotas criadas
- [ ] Devo ver rotas em execução
- [ ] Devo ver rotas concluídas no período
- [ ] Devo ver taxa de conclusão
- [ ] Os dados devem ser atualizados em tempo real

**Definição de Pronto:**
- [ ] Dashboard implementado
- [ ] Métricas calculadas corretamente
- [ ] Atualização em tempo real
- [ ] Testes de métricas criados

---

### **US014 - Visualizar Relatórios de Performance**
**Como** um **Administrador**  
**Eu quero** ver relatórios de performance dos funcionários  
**Para que** eu possa avaliar o desempenho da equipe

**Critérios de Aceitação:**
- [ ] Devo ver rotas concluídas por funcionário
- [ ] Devo ver tempo médio de execução
- [ ] Devo ver taxa de problemas reportados
- [ ] Devo poder filtrar por período
- [ ] Devo poder exportar os dados

**Definição de Pronto:**
- [ ] Relatórios implementados
- [ ] Filtros por período funcionando
- [ ] Cálculos de métricas corretos
- [ ] Testes de relatórios criados

---

## 🚨 **ÉPICO 5: GESTÃO DE PROBLEMAS**

### **US015 - Reportar Problema**
**Como** um **Funcionário (Motorista/Ajudante)**  
**Eu quero** reportar problemas durante a execução da rota  
**Para que** eu possa comunicar dificuldades encontradas

**Critérios de Aceitação:**
- [ ] Devo poder reportar problema em qualquer rota atribuída
- [ ] Devo poder descrever o problema em detalhes
- [ ] Devo poder marcar se o problema foi resolvido
- [ ] O administrador deve ser notificado
- [ ] Devo receber confirmação do reporte

**Definição de Pronto:**
- [ ] Interface de reporte implementada
- [ ] Notificação para administrador
- [ ] Campos de descrição funcionando
- [ ] Testes de reporte criados

---

### **US016 - Visualizar Problemas Reportados**
**Como** um **Administrador**  
**Eu quero** ver todos os problemas reportados pelos funcionários  
**Para que** eu possa acompanhar e resolver as questões

**Critérios de Aceitação:**
- [ ] Devo ver lista com rota, funcionário, descrição e status
- [ ] Devo poder filtrar por status (resolvido/não resolvido)
- [ ] Devo poder filtrar por funcionário
- [ ] Devo poder filtrar por período
- [ ] Devo ver data e hora do reporte

**Definição de Pronto:**
- [ ] Interface de visualização implementada
- [ ] Filtros funcionando
- [ ] Lista ordenada por data
- [ ] Testes de visualização criados

---

### **US017 - Resolver Problema**
**Como** um **Administrador**  
**Eu quero** marcar problemas como resolvidos  
**Para que** eu possa acompanhar o status das questões

**Critérios de Aceitação:**
- [ ] Devo poder marcar problema como resolvido
- [ ] Devo poder adicionar observações sobre a resolução
- [ ] O funcionário deve ser notificado da resolução
- [ ] O status deve ser atualizado na interface
- [ ] Devo receber confirmação da resolução

**Definição de Pronto:**
- [ ] Funcionalidade de resolução implementada
- [ ] Notificação para funcionário
- [ ] Atualização de status funcionando
- [ ] Testes de resolução criados

---

## 🔐 **ÉPICO 6: AUTENTICAÇÃO E SEGURANÇA**

### **US018 - Fazer Login**
**Como** um **Usuário (Admin/Funcionário)**  
**Eu quero** fazer login no sistema  
**Para que** eu possa acessar as funcionalidades

**Critérios de Aceitação:**
- [ ] Devo poder inserir email e senha
- [ ] O sistema deve validar as credenciais
- [ ] Devo ser redirecionado para a página correta baseado no meu role
- [ ] Devo receber token de acesso válido
- [ ] Em caso de erro, devo receber mensagem clara

**Definição de Pronto:**
- [ ] Formulário de login implementado
- [ ] Validação de credenciais funcionando
- [ ] Redirecionamento por role implementado
- [ ] Gerenciamento de tokens funcionando
- [ ] Testes de autenticação criados

---

### **US019 - Fazer Logout**
**Como** um **Usuário (Admin/Funcionário)**  
**Eu quero** fazer logout do sistema  
**Para que** eu possa sair com segurança

**Critérios de Aceitação:**
- [ ] Devo poder fazer logout de qualquer página
- [ ] O sistema deve invalidar meu token
- [ ] Devo ser redirecionado para a página de login
- [ ] Minha sessão deve ser encerrada
- [ ] Devo receber confirmação do logout

**Definição de Pronto:**
- [ ] Botão de logout implementado
- [ ] Invalidação de token funcionando
- [ ] Redirecionamento para login
- [ ] Limpeza de sessão implementada
- [ ] Testes de logout criados

---

### **US020 - Renovar Token**
**Como** um **Usuário (Admin/Funcionário)**  
**Eu quero** que meu token seja renovado automaticamente  
**Para que** eu não perca minha sessão durante o uso

**Critérios de Aceitação:**
- [ ] O sistema deve renovar token automaticamente antes de expirar
- [ ] Não devo ser deslogado durante o uso normal
- [ ] Em caso de falha na renovação, devo ser redirecionado para login
- [ ] O processo deve ser transparente para mim
- [ ] Devo receber novo token válido

**Definição de Pronto:**
- [ ] Renovação automática implementada
- [ ] Interceptors HTTP funcionando
- [ ] Tratamento de falhas implementado
- [ ] Testes de renovação criados

---

## 📱 **ÉPICO 7: NOTIFICAÇÕES WHATSAPP**

### **US021 - Receber Notificação de Nova Rota**
**Como** um **Funcionário (Motorista/Ajudante)**  
**Eu quero** receber notificação no WhatsApp quando uma rota for criada  
**Para que** eu possa me preparar para a entrega

**Critérios de Aceitação:**
- [ ] Devo receber mensagem no WhatsApp quando rota for atribuída a mim
- [ ] A mensagem deve conter nome da rota, data, turno e equipe
- [ ] A mensagem deve ser formatada de forma clara
- [ ] Devo receber notificação imediatamente após criação da rota
- [ ] O sistema deve funcionar mesmo se eu não tiver WhatsApp configurado

**Definição de Pronto:**
- [ ] Integração WhatsApp implementada
- [ ] Formatação de mensagem funcionando
- [ ] Envio automático após criação de rota
- [ ] Tratamento de falhas implementado
- [ ] Testes de notificação criados

---

### **US022 - Configurar WhatsApp**
**Como** um **Administrador**  
**Eu quero** configurar o sistema de notificações WhatsApp  
**Para que** os funcionários recebam notificações

**Critérios de Aceitação:**
- [ ] Devo poder configurar URL da API WhatsApp
- [ ] Devo poder configurar token de autenticação
- [ ] Devo poder testar a conexão WhatsApp
- [ ] O sistema deve funcionar com diferentes provedores (Baileys, Z-API, etc.)
- [ ] Devo receber feedback sobre o status da configuração

**Definição de Pronto:**
- [ ] Interface de configuração implementada
- [ ] Suporte a múltiplos provedores
- [ ] Teste de conexão funcionando
- [ ] Validação de configuração implementada
- [ ] Testes de integração criados

---

## 🎨 **ÉPICO 8: INTERFACE E EXPERIÊNCIA**

### **US023 - Tema Escuro/Claro**
**Como** um **Usuário (Admin/Funcionário)**  
**Eu quero** poder alternar entre tema escuro e claro  
**Para que** eu possa usar o sistema com conforto visual

**Critérios de Aceitação:**
- [ ] Devo poder alternar entre temas na interface
- [ ] A preferência deve ser salva e mantida
- [ ] Todos os componentes devem se adaptar ao tema
- [ ] A transição deve ser suave
- [ ] O tema deve ser aplicado em todas as páginas

**Definição de Pronto:**
- [ ] Toggle de tema implementado
- [ ] Persistência de preferência funcionando
- [ ] Todos os componentes adaptados
- [ ] Transições suaves implementadas
- [ ] Testes de tema criados

---

### **US024 - Interface Responsiva**
**Como** um **Usuário (Admin/Funcionário)**  
**Eu quero** usar o sistema em diferentes dispositivos  
**Para que** eu possa acessar de qualquer lugar

**Critérios de Aceitação:**
- [ ] O sistema deve funcionar em desktop, tablet e mobile
- [ ] A interface deve se adaptar ao tamanho da tela
- [ ] Todos os botões e campos devem ser acessíveis
- [ ] A navegação deve ser intuitiva em mobile
- [ ] O desempenho deve ser mantido em todos os dispositivos

**Definição de Pronto:**
- [ ] Design responsivo implementado
- [ ] Testes em diferentes dispositivos
- [ ] Navegação mobile otimizada
- [ ] Performance validada
- [ ] Testes de responsividade criados

---

## 📈 **CRITÉRIOS DE ACEITAÇÃO GERAIS**

### **Performance**
- [ ] Páginas devem carregar em menos de 3 segundos
- [ ] Operações de banco devem ser otimizadas
- [ ] Interface deve ser responsiva em tempo real

### **Segurança**
- [ ] Todas as rotas devem ser protegidas por autenticação
- [ ] Dados sensíveis devem ser criptografados
- [ ] Validação de entrada deve ser implementada
- [ ] Logs de segurança devem ser mantidos

### **Usabilidade**
- [ ] Interface deve ser intuitiva e fácil de usar
- [ ] Mensagens de erro devem ser claras
- [ ] Feedback visual deve ser fornecido para todas as ações
- [ ] Navegação deve ser consistente

### **Confiabilidade**
- [ ] Sistema deve funcionar 99% do tempo
- [ ] Dados não devem ser perdidos
- [ ] Backup automático deve ser implementado
- [ ] Recuperação de falhas deve ser possível

---

## 🎯 **DEFINIÇÃO DE PRONTO (DOD)**

Para cada história de usuário ser considerada "Pronta", deve atender:

### **Desenvolvimento**
- [ ] Código implementado e revisado
- [ ] Testes unitários criados e passando
- [ ] Testes de integração criados e passando
- [ ] Código documentado

### **Qualidade**
- [ ] Testes manuais realizados
- [ ] Validação de critérios de aceitação
- [ ] Performance validada
- [ ] Segurança verificada

### **Deploy**
- [ ] Funcionalidade testada em ambiente de staging
- [ ] Deploy em produção realizado
- [ ] Monitoramento configurado
- [ ] Rollback testado (se necessário)

### **Documentação**
- [ ] Documentação técnica atualizada
- [ ] Manual do usuário atualizado
- [ ] Histórico de mudanças atualizado
- [ ] Treinamento realizado (se necessário)

---

*Esta documentação de histórias de usuário serve como base para o desenvolvimento, teste e validação das funcionalidades do Sistema de Gestão de Rotas de Caminhões, garantindo que todas as necessidades dos usuários sejam atendidas de forma eficiente e eficaz.*

