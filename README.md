# My App

Aplicativo de conexão entre clientes e profissionais, similar ao GetNinjas.

## Visão Geral

Plataforma que conecta dois tipos de usuários:
- **Customers (Clientes)**: Usuários que criam pedidos de serviços
- **Partners (Parceiros)**: Profissionais que enviam propostas para os pedidos

### Objetivo Principal
Conectar pessoas através de propostas de serviço. Quando um cliente aceita uma proposta, o sistema envia o contato de WhatsApp para ambas as partes continuarem a negociação.

## Autenticação

- **Método**: Login/cadastro via número de telefone (Better Auth)
  - Formulário único para ambos os tipos de usuário (Customer e Partner)
  - Diferenciação apenas pelo `userType` enviado no header
  - Better Auth detecta automaticamente se é um usuário novo ou existente
  - Após confirmação do código, a autenticação é realizada automaticamente
- **Sem senha**: Autenticação apenas por verificação de telefone
- **Cadastro automático**: Se o usuário não existir no primeiro verify, uma conta é criada automaticamente
  - Nome padrão: número do telefone
  - Email padrão: `{numero}@my-app.com`
- **Onboarding**: Usuários com dados padrão são redirecionados para completar o cadastro

## Fluxo do Parceiro (Partner)

### 1. Cadastro Inicial
- SignIn com phoneNumber do Better Auth
- Header: `userType: partner`
- Se primeira vez → Onboarding

### 2. Onboarding
**MVP - Dados obrigatórios:**
- Nome
- Email
- Serviços capacitados
- CEP (usado para calcular distância até os pedidos)

**Observação**: Esses dados podem ser alterados posteriormente pelo parceiro

### 3. Dashboard
- **Acesso imediato**: Parceiro tem acesso ao dashboard logo após completar o onboarding
- Visualizar listagem de pedidos disponíveis relacionados aos seus serviços
- Visualizar histórico de propostas enviadas (accepted, pending, rejected)
- Enviar propostas iniciais

**Futuro - Aprovação de Parceiros**:
Sistema de backoffice onde administradores poderão visualizar dados e documentos do parceiro para aprovação manual. Após implementação, será definido se parceiros não aprovados terão acesso ao dashboard.

### 4. Proposta Inicial
Informações incluídas:
- Valor inicial
- Tempo estimado para resolução
- Comentários adicionais

## Fluxo do Cliente (Customer)

### 1. Página Inicial
- Visualizar serviços disponíveis
- Visualizar categorias
  - **MVP**: Serviços de refrigeração e elétrica

### 2. Solicitação de Serviço
1. Preencher formulário do serviço (descrição, categoria, etc.)
2. Confirmar as informações preenchidas
3. Verificar número de telefone
   - SignIn com phoneNumber do Better Auth
   - Header: `userType: customer`
4. **Se usuário novo** (nome = número de telefone):
   - Preencher nome (obrigatório)
   - Preencher email (opcional)
5. Informar CEP (usado para calcular distância aproximada entre profissional e local do serviço)
6. Confirmação final do pedido

### 3. Receber Propostas
- Visualizar propostas dos parceiros
- Receber múltiplas propostas de diferentes profissionais
- Aceitar quantas propostas quiser (para ter várias opções de contato)
- Aceitar proposta → Receber contato de WhatsApp do parceiro

### 4. Gerenciar Pedido
- **Visualizar histórico**: Ver todos os pedidos anteriores (abertos e fechados)
- **Fechar pedido**: Cliente pode fechar o pedido a qualquer momento
  - Pode fechar mesmo após aceitar propostas (para parar de receber novas ofertas)
  - Quando fechado, todas as propostas pendentes são marcadas como "rejected"
  - Apenas o cliente que criou o pedido pode fechá-lo

## Status de Pedidos e Propostas

### Status de Pedido
Os pedidos podem ter 2 status controlados apenas pelo cliente:

- **opened**: Pedido ativo, aceitando propostas
- **closed**: Pedido fechado pelo cliente, não aceita mais propostas

### Status de Proposta
As propostas podem ter 3 status:

- **pending**: Proposta enviada aguardando resposta do cliente
- **accepted**: Cliente aceitou a proposta e recebeu o contato do profissional
- **rejected**: Proposta recusada (ocorre quando o pedido é fechado/cancelado)

### Regras
- Cliente pode aceitar múltiplas propostas do mesmo pedido
- Um pedido pode ter várias propostas de diferentes profissionais
- Quando um pedido é fechado, todas as propostas pendentes ficam como "rejected"
- Somente o cliente que criou o pedido pode fechá-lo

## Notificações

Sistema de notificações via WhatsApp para ambos os tipos de usuários.

### Funcionamento
- **Canal**: Mensagens via WhatsApp (API a definir)
- **Destinatários**: Customers e Partners

### Estrutura da Notificação
Cada mensagem contém:
1. **Texto descritivo**: Informações sobre a atualização
   - Exemplo: "Um profissional X te enviou uma proposta para resolver seu problema"
2. **Link direto**: URL para a página específica
   - Formato: `https://my-app.com/proposals/{proposalId}`
   - Se usuário não estiver autenticado, exibe modal de login
   - Após login, redireciona para a página solicitada

### Segurança e Validação do Link

Ao acessar um link, o sistema valida:

**1. Usuário Não Autenticado**
- Exibe modal para verificar número de telefone
- Usuário faz login para acessar o conteúdo
- Após autenticação, redireciona para a página solicitada

**2. Pedido Fechado**
- Exibe informações do pedido e propostas normalmente
- Desabilita ação de aceitar novas propostas
- Mostra status "closed" do pedido

### Ações Disponíveis via Link
- Aceitar proposta (customers)
- Visualizar detalhes da proposta aceita (partners)
- Visualizar detalhes do pedido
- Outras ações contextuais

## Tecnologias

- Next.js
- Better Auth (autenticação por telefone)
- Drizzle ORM
- Shadcn UI

## Definições Pendentes

### MVP Atual
- [ ] Estrutura detalhada de categories vs services
- [ ] Documentos adicionais do parceiro (onboarding completo)
- [ ] Cálculo de distância baseado em CEP
- [ ] API de WhatsApp para notificações

### Funcionalidades Futuras
- [ ] Sistema de backoffice para aprovação de parceiros
- [ ] Sistema de avaliações e reviews
- [ ] Chat in-app (alternativa ao WhatsApp)
- [ ] Notificações push
- [ ] Filtros avançados de busca de pedidos
