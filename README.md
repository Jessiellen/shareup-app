# ShareUp

<div align="center">
  <img src="public/img/logo.svg" alt="ShareUp Logo" width="200"/>
  
  <p align="center">
    <strong>Plataforma de Troca de Habilidades</strong>
    <br />
    Conecte-se, aprenda e ensine em uma comunidade colaborativa
  </p>

  <p align="center">
    <a href="https://github.com/seu-usuario/shareup/issues">🐛 Reportar Bug</a>
    ·
    <a href="https://github.com/seu-usuario/shareup/issues">✨ Solicitar Feature</a>
  </p>
</div>

## 📋 Sobre o Projeto

O **ShareUp** é uma plataforma inovadora que conecta pessoas interessadas em trocar conhecimentos e habilidades. Seja você um especialista em uma área específica ou alguém interessado em aprender algo novo, o ShareUp facilita essas conexões de forma orgânica e eficiente.

### ✨ Principais Funcionalidades

- 🤝 **Sistema de Troca**: Conecte-se com outros profissionais para trocar conhecimentos
- 👥 **Perfis Profissionais**: Crie e gerencie seu perfil com habilidades e especialidades
- 📅 **Agendamento**: Sistema completo de agendamento de sessões de troca
- 💬 **Chat Integrado**: Comunicação direta entre usuários
- 📝 **Posts e Comunidade**: Compartilhe conhecimento através de posts
- ⭐ **Sistema de Avaliações**: Avalie e seja avaliado pelos parceiros de troca
- 🎯 **Histórias de Sucesso**: Inspire-se com casos reais de transformação

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React com renderização híbrida
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e customizáveis
- **Lucide React** - Ícones modernos e leves
- **React Hook Form** - Gerenciamento de formulários
- **React Query** - Gerenciamento de estado servidor

### Backend & Database
- **Prisma** - ORM moderno para Node.js e TypeScript
- **SQLite** - Banco de dados relacional (desenvolvimento)
- **NextAuth.js** - Autenticação completa
- **Zod** - Validação de schemas TypeScript

### Ferramentas de Desenvolvimento
- **Jest** - Framework de testes
- **ESLint** - Linting de código
- **Prettier** - Formatação de código

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou pnpm
- Git

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/shareup.git
   cd shareup
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   
   Edite o arquivo `.env.local` com suas configurações:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # NextAuth
   NEXTAUTH_SECRET="seu-secret-aqui"
   NEXTAUTH_URL="http://localhost:3000"
   
   # OAuth Providers (opcional)
   GOOGLE_CLIENT_ID="seu-google-client-id"
   GOOGLE_CLIENT_SECRET="seu-google-client-secret"
   ```

4. **Configure o banco de dados**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

6. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 📁 Estrutura do Projeto

```
shareup/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard do usuário
│   ├── home/             # Página inicial
│   ├── login/            # Autenticação
│   ├── posts/            # Sistema de posts
│   ├── professionals/    # Listagem de profissionais
│   └── profile/          # Perfil do usuário
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de UI (Radix)
│   └── ...               # Componentes específicos
├── contexts/             # Contexts do React
├── hooks/                # Custom hooks
├── lib/                  # Utilitários e configurações
├── prisma/               # Schema e migrações do banco
├── public/               # Arquivos estáticos
└── types/                # Definições de tipos TypeScript
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Linting do código

# Testes
npm run test         # Executa testes
npm run test:watch   # Testes em modo watch
npm run test:coverage # Cobertura de testes

# Banco de dados
npm run db:generate  # Gera cliente Prisma
npm run db:migrate   # Executa migrações
npm run db:push      # Push schema para o banco
npm run db:seed      # Popula banco com dados de exemplo
npm run db:studio    # Interface visual do banco
npm run db:reset     # Reset completo do banco
```

## 🧪 Testes

O projeto utiliza Jest para testes unitários e de integração:

```bash
# Executar todos os testes
npm run test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo watch
npm run test:watch
```

## 🎨 Guia de Contribuição

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request**

### Padrões de Commit

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação, sem mudanças de código
- `refactor:` refatoração de código
- `test:` adição ou correção de testes
- `chore:` tarefas de manutenção

## 📊 Funcionalidades Principais

### Sistema de Troca de Habilidades
- Busca por profissionais com habilidades específicas
- Sistema de matching baseado em interesses mútuos
- Agendamento flexível de sessões de troca

### Gestão de Perfil
- Perfil completo com foto, bio e especialidades
- Portfólio de habilidades e experiências
- Sistema de reputação e avaliações

### Comunicação
- Chat em tempo real entre usuários
- Notificações de mensagens e agendamentos
- Histórico de conversas e interações

### Posts e Comunidade
- Sistema de posts para compartilhar conhecimento
- Comentários e interações na comunidade
- Categorização por áreas de conhecimento

## 🔐 Autenticação e Segurança

- Autenticação via email/senha e OAuth (Google)
- Sessões seguras com NextAuth.js
- Middleware de proteção de rotas
- Validação de dados com Zod

## 📱 Responsividade

O ShareUp é totalmente responsivo e funciona perfeitamente em:
- 📱 Dispositivos móveis
- 📱 Tablets
- 💻 Desktops
- 🖥️ Telas grandes

## 🌟 Histórias de Sucesso

O ShareUp já facilitou centenas de trocas de conhecimento:
- Maria mudou de contabilidade para design gráfico
- Carlos aprendeu francês e conseguiu trabalho na França  
- Ana triplicou o número de alunos em sua escola de ballet

## 🤝 Contribuidores

<a href="https://github.com/seu-usuario/shareup/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=seu-usuario/shareup" />
</a>

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <p>Feito com ❤️ para conectar pessoas através do conhecimento</p>
  <p>
    <a href="#shareup">⬆️ Voltar ao topo</a>
  </p>
</div>
