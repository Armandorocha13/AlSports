# 📧 Configuração do Sistema de Email

## Visão Geral

O sistema de notificações por email foi implementado para notificar automaticamente os clientes sempre que o status de seus pedidos for atualizado no painel administrativo.

## 🚀 Funcionalidades

### ✅ Notificações Automáticas
- **Atualização de Status**: Cliente recebe email a cada mudança de status
- **Templates Personalizados**: Emails com design profissional da AlSports
- **Informações Completas**: Detalhes do pedido, status atual e próximos passos

### 📧 Tipos de Notificação
1. **Aguardando Pagamento** - Lembra sobre o pagamento pendente
2. **Pagamento Confirmado** - Confirma recebimento do pagamento
3. **Preparando Pedido** - Informa que o pedido está sendo preparado
4. **Enviado** - Notifica sobre o envio com código de rastreamento
5. **Em Trânsito** - Acompanha a entrega
6. **Entregue** - Confirma a entrega
7. **Cancelado** - Informa sobre cancelamento
8. **Devolvido** - Notifica sobre devolução

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Adicione ao seu arquivo `.env.local`:

```env
# Configuração do Site
NEXT_PUBLIC_SITE_URL=https://seudominio.com

# Escolha UM dos serviços abaixo:

# Opção 1: SendGrid
SENDGRID_API_KEY=sua_chave_sendgrid
SENDGRID_FROM_EMAIL=noreply@seudominio.com

# Opção 2: AWS SES
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=us-east-1
AWS_FROM_EMAIL=noreply@seudominio.com

# Opção 3: Resend
RESEND_API_KEY=sua_chave_resend
RESEND_FROM_EMAIL=noreply@seudominio.com

# Opção 4: SMTP (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
SMTP_FROM_EMAIL=noreply@seudominio.com
```

### 2. Implementação do Serviço

Atualmente o sistema está configurado para **simulação**. Para ativar o envio real:

1. **Escolha um provedor** (SendGrid, AWS SES, Resend, ou SMTP)
2. **Configure as variáveis** de ambiente
3. **Descomente o código** correspondente em `lib/email-service.ts`
4. **Instale as dependências** necessárias

### 3. Dependências Necessárias

```bash
# Para SendGrid
npm install @sendgrid/mail

# Para AWS SES
npm install aws-sdk

# Para Resend
npm install resend

# Para SMTP
npm install nodemailer
```

## 📋 Como Usar

### No Painel Administrativo

1. **Acesse** `/admin/pedidos`
2. **Selecione** um pedido
3. **Altere** o status usando o dropdown
4. **Sistema envia** automaticamente o email para o cliente

### Indicadores Visuais

- **Ícone de Email**: Aparece quando email está sendo enviado
- **Logs no Console**: Mostra status do envio
- **Confirmação**: Alertas de sucesso/erro

## 🎨 Templates de Email

### Design Responsivo
- ✅ **Mobile-first**: Otimizado para celulares
- ✅ **Tema AlSports**: Cores e logo da marca
- ✅ **Informações Claras**: Status, valores, endereço
- ✅ **Call-to-Action**: Botão para acompanhar pedido

### Conteúdo Personalizado
- **Nome do Cliente**: Saudação personalizada
- **Número do Pedido**: Identificação única
- **Status Atual**: Badge colorido com status
- **Mensagem Contextual**: Texto específico para cada status
- **Link de Acompanhamento**: Direciona para área do cliente

## 🔧 Personalização

### Modificar Templates

Edite o arquivo `lib/email-service.ts`:

```typescript
private generateStatusUpdateEmail(
  customerName: string,
  orderNumber: string,
  status: string,
  orderDetails: any
): string {
  // Personalize o HTML aqui
}
```

### Adicionar Novos Status

1. **Adicione** o status no dropdown
2. **Configure** a cor em `getStatusColor()`
3. **Defina** o texto em `getStatusText()`
4. **Crie** a mensagem em `getStatusMessage()`

### Configurar Remetente

```typescript
// Em lib/email-service.ts
const subject = `Atualização do Pedido #${orderNumber} - AlSports`
// Personalize o assunto aqui
```

## 🚨 Troubleshooting

### Email Não Enviado
1. **Verifique** as variáveis de ambiente
2. **Confirme** as credenciais do provedor
3. **Teste** a conexão com o serviço
4. **Verifique** os logs no console

### Template Quebrado
1. **Valide** o HTML gerado
2. **Teste** em diferentes clientes de email
3. **Verifique** as imagens e links

### Performance
1. **Configure** rate limiting se necessário
2. **Use** filas para grandes volumes
3. **Monitore** o uso da API

## 📊 Monitoramento

### Logs Disponíveis
- ✅ **Envio Iniciado**: Quando começa o processo
- ✅ **Envio Concluído**: Quando email é enviado
- ✅ **Erros**: Falhas no processo
- ✅ **Dados**: Email, assunto, status

### Métricas Importantes
- **Taxa de Entrega**: % de emails entregues
- **Taxa de Abertura**: % de emails abertos
- **Tempo de Resposta**: Velocidade do sistema

## 🔒 Segurança

### Boas Práticas
- ✅ **Nunca** exponha chaves de API no frontend
- ✅ **Use** variáveis de ambiente
- ✅ **Valide** emails antes do envio
- ✅ **Configure** SPF/DKIM no domínio
- ✅ **Monitore** tentativas de spam

### Validação de Email
```typescript
// Validação básica implementada
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

## 🚀 Próximos Passos

### Melhorias Futuras
- [ ] **Templates Avançados**: Mais opções de design
- [ ] **Agendamento**: Envio em horários específicos
- [ ] **A/B Testing**: Testar diferentes versões
- [ ] **Analytics**: Métricas detalhadas
- [ ] **Multi-idioma**: Suporte a outros idiomas

### Integrações
- [ ] **WhatsApp**: Notificações via WhatsApp
- [ ] **SMS**: Notificações por SMS
- [ ] **Push**: Notificações push no app
- [ ] **Webhook**: Integração com outros sistemas

---

**💡 Dica**: Para desenvolvimento, o sistema funciona em modo simulação. Para produção, configure um provedor real de email.
