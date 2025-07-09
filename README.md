# 💰 Finanças App - Controle de Finanças Pessoais

Um aplicativo mobile completo para controle de finanças pessoais desenvolvido em React Native com TypeScript, seguindo as melhores práticas de desenvolvimento.

## 📱 Funcionalidades

### MVP (Versão Inicial)
- ✅ **Autenticação de Usuários** - Login e cadastro com Supabase Auth
- ✅ **Gerenciamento de Receitas e Despesas** - Adicionar, editar e excluir transações
- ✅ **Categorização** - Organizar transações por categorias personalizáveis
- ✅ **Transações Recorrentes** - Suporte para receitas e despesas recorrentes
- ✅ **Notificações** - Alertas automáticos para vencimento de contas
- ✅ **Resumo Financeiro** - Visualização clara do saldo e fluxo de caixa
- ✅ **Relatórios** - Gráficos simples de receitas e despesas
- ✅ **Interface Intuitiva** - Design moderno em português brasileiro

### Funcionalidades Futuras
- 🔄 Integração com bancos
- 📊 Relatórios avançados
- 🎯 Objetivos financeiros
- 💡 Sugestões de economia
- 📈 Orçamentos por categoria

## 🛠️ Tecnologias Utilizadas

- **React Native 0.73.0** - Framework para desenvolvimento mobile
- **TypeScript** - Tipagem estática
- **Supabase** - Backend como serviço (Auth + PostgreSQL)
- **React Navigation v6** - Navegação entre telas
- **React Hook Form** - Gerenciamento de formulários
- **React Native Vector Icons** - Ícones do Material Design
- **React Native Chart Kit** - Gráficos e relatórios
- **AsyncStorage** - Armazenamento local
- **React Native Date Picker** - Seleção de datas

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Ambiente de Desenvolvimento
- **Node.js** (versão 18 ou superior)
- **React Native CLI** (`npm install -g @react-native-community/cli`)
- **Android Studio** (para desenvolvimento Android)
- **Xcode** (para desenvolvimento iOS - apenas macOS)

### Para Android
- **Java Development Kit (JDK) 11 ou superior**
- **Android SDK** e **Android SDK Platform-Tools**
- **Emulador Android** ou dispositivo físico

### Para iOS (opcional)
- **macOS**
- **Xcode 12** ou superior
- **CocoaPods** (`sudo gem install cocoapods`)

## 🚀 Configuração e Instalação

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd FinancasApp
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL e a chave anônima do projeto
4. Edite o arquivo `src/services/supabase.ts`:

```typescript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anonima-aqui';
```

### 4. Configuração do Banco de Dados

Execute os seguintes comandos SQL no editor do Supabase para criar as tabelas:

```sql
-- Tabela de categorias
CREATE TABLE categorias (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  icone text NOT NULL,
  cor text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de transações
CREATE TABLE transacoes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  descricao text NOT NULL,
  valor numeric NOT NULL,
  data date NOT NULL,
  categoria_id uuid REFERENCES categorias(id) ON DELETE SET NULL,
  tipo text NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  recorrencia text NOT NULL CHECK (recorrencia IN ('unica', 'mensal', 'anual')),
  data_vencimento date,
  observacoes text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de notificações
CREATE TABLE notificacoes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo text NOT NULL,
  mensagem text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('vencimento', 'lembrete', 'meta')),
  data timestamp with time zone NOT NULL,
  lida boolean DEFAULT false,
  transacao_id uuid REFERENCES transacoes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can manage their own categories" ON categorias
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own transactions" ON transacoes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notifications" ON notificacoes
  FOR ALL USING (auth.uid() = user_id);
```

### 5. Configuração dos Ícones (Android)

Para Android, você precisa configurar os ícones do Material Design:

```bash
# Para React Native 0.70+
npx react-native-asset
```

Ou manualmente, adicione no arquivo `android/app/build.gradle`:

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

### 6. Configuração iOS (se aplicável)

```bash
cd ios
pod install
cd ..
```

## 🏃‍♂️ Executando o Projeto

### Android
```bash
# Iniciar o Metro Bundler
npx react-native start

# Em outro terminal, executar no Android
npx react-native run-android
```

### iOS
```bash
# Iniciar o Metro Bundler
npx react-native start

# Em outro terminal, executar no iOS
npx react-native run-ios
```

## 📁 Estrutura do Projeto

```
FinancasApp/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── common/         # Componentes genéricos
│   │   ├── charts/         # Componentes de gráficos
│   │   └── forms/          # Componentes de formulários
│   ├── constants/          # Constantes do app (cores, tamanhos, etc.)
│   ├── hooks/              # Custom hooks
│   ├── navigation/         # Configuração de navegação
│   ├── screens/            # Telas do aplicativo
│   │   ├── auth/          # Telas de autenticação
│   │   ├── home/          # Tela inicial
│   │   ├── transactions/  # Telas de transações
│   │   ├── reports/       # Telas de relatórios
│   │   ├── notifications/ # Telas de notificações
│   │   └── settings/      # Telas de configurações
│   ├── services/          # Serviços (Supabase, APIs)
│   ├── types/             # Definições de tipos TypeScript
│   └── utils/             # Funções utilitárias
├── android/               # Código nativo Android
├── ios/                   # Código nativo iOS
└── README.md             # Este arquivo
```

## 🎨 Design System

O app utiliza um design system consistente com:

### Cores
- **Primária**: Verde (#2E7D32) - Representa crescimento financeiro
- **Secundária**: Verde claro (#4CAF50)
- **Receita**: Verde (#4CAF50)
- **Despesa**: Vermelho (#F44336)
- **Fundo**: Cinza claro (#F5F5F5)
- **Texto**: Cinza escuro (#333333)

### Tipografia
- **Títulos**: 24px, bold
- **Subtítulos**: 18px, medium
- **Texto padrão**: 16px, regular
- **Texto pequeno**: 12px, regular

### Espaçamentos
- **Pequeno**: 8px
- **Médio**: 16px
- **Grande**: 24px
- **Extra Grande**: 32px

## 🔧 Scripts Disponíveis

```bash
# Instalar dependências
npm install

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Iniciar Metro Bundler
npm start

# Executar testes
npm test

# Verificar linting
npm run lint

# Construir versão de produção
npm run build
```

## 🐛 Solução de Problemas

### Erro de dependências não encontradas
```bash
# Limpar cache e reinstalar
npm start -- --reset-cache
rm -rf node_modules
npm install
```

### Problemas com ícones
```bash
# Reconfigurar ícones
npx react-native-asset
```

### Problemas no Android
```bash
# Limpar build
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Problemas no iOS
```bash
cd ios
rm -rf Pods
rm Podfile.lock
pod install
cd ..
npx react-native run-ios
```

## 📱 Screenshots

*Screenshots serão adicionados conforme o desenvolvimento progride*

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvimento

### Próximos Passos
1. ✅ Estrutura base do projeto
2. ✅ Sistema de navegação
3. ✅ Telas de autenticação
4. ✅ Integração com Supabase
5. 🔄 Formulário de transações
6. 🔄 Lista de transações
7. 🔄 Gráficos e relatórios
8. 🔄 Sistema de notificações
9. 🔄 Testes unitários
10. 🔄 Deploy na Play Store/App Store

### Tecnologias Futuras
- **Redux Toolkit** - Gerenciamento de estado global
- **React Query** - Cache e sincronização de dados
- **Flipper** - Debugging avançado
- **Detox** - Testes E2E
- **Fastlane** - Automação de deploy

## 📞 Contato

Desenvolvido como parte do projeto de aplicativo de finanças pessoais.

---

**Feito com ❤️ e React Native**
