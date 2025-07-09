import { Categoria } from '../types';

// Cores do tema
export const CORES = {
  // Cores principais
  primaria: '#2E7D32',
  secundaria: '#4CAF50',
  
  // Cores de fundo
  fundo: '#F5F5F5',
  fundoEscuro: '#2C2C2C',
  branco: '#FFFFFF',
  
  // Cores de texto
  texto: '#333333',
  textoSecundario: '#666666',
  textoClaro: '#FFFFFF',
  
  // Cores de status
  sucesso: '#4CAF50',
  erro: '#F44336',
  aviso: '#FF9800',
  info: '#2196F3',
  
  // Cores específicas
  receita: '#4CAF50',
  despesa: '#F44336',
  neutral: '#9E9E9E',
  
  // Cores dos gráficos
  graficoVerde: '#4CAF50',
  graficoAzul: '#2196F3',
  graficoLaranja: '#FF9800',
  graficoRoxo: '#9C27B0',
  graficoVermelho: '#F44336',
  graficoAmarelo: '#FFEB3B',
  graficoRosa: '#E91E63',
  graficoCiano: '#00BCD4',
};

// Tamanhos de fonte
export const TAMANHOS_FONTE = {
  pequeno: 12,
  medio: 16,
  grande: 20,
  titulo: 24,
  subtitulo: 18,
};

// Espaçamentos
export const ESPACAMENTOS = {
  pequeno: 8,
  medio: 16,
  grande: 24,
  extraGrande: 32,
};

// Categorias padrão para receitas
export const CATEGORIAS_RECEITA: Omit<Categoria, 'id'>[] = [
  {
    nome: 'Salário',
    icone: 'work',
    cor: CORES.graficoVerde,
    tipo: 'receita',
  },
  {
    nome: 'Freelance',
    icone: 'computer',
    cor: CORES.graficoAzul,
    tipo: 'receita',
  },
  {
    nome: 'Investimentos',
    icone: 'trending-up',
    cor: CORES.graficoLaranja,
    tipo: 'receita',
  },
  {
    nome: 'Vendas',
    icone: 'shopping-cart',
    cor: CORES.graficoRoxo,
    tipo: 'receita',
  },
  {
    nome: 'Outros',
    icone: 'more-horiz',
    cor: CORES.neutral,
    tipo: 'receita',
  },
];

// Categorias padrão para despesas
export const CATEGORIAS_DESPESA: Omit<Categoria, 'id'>[] = [
  {
    nome: 'Alimentação',
    icone: 'restaurant',
    cor: CORES.graficoVermelho,
    tipo: 'despesa',
  },
  {
    nome: 'Transporte',
    icone: 'directions-car',
    cor: CORES.graficoAzul,
    tipo: 'despesa',
  },
  {
    nome: 'Moradia',
    icone: 'home',
    cor: CORES.graficoLaranja,
    tipo: 'despesa',
  },
  {
    nome: 'Saúde',
    icone: 'local-hospital',
    cor: CORES.graficoRosa,
    tipo: 'despesa',
  },
  {
    nome: 'Educação',
    icone: 'school',
    cor: CORES.graficoRoxo,
    tipo: 'despesa',
  },
  {
    nome: 'Lazer',
    icone: 'movie',
    cor: CORES.graficoCiano,
    tipo: 'despesa',
  },
  {
    nome: 'Compras',
    icone: 'shopping-bag',
    cor: CORES.graficoAmarelo,
    tipo: 'despesa',
  },
  {
    nome: 'Contas',
    icone: 'receipt',
    cor: CORES.neutral,
    tipo: 'despesa',
  },
  {
    nome: 'Outros',
    icone: 'more-horiz',
    cor: CORES.textoSecundario,
    tipo: 'despesa',
  },
];

// Configurações de formatação
export const FORMATACAO = {
  moeda: {
    locale: 'pt-BR',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  data: {
    locale: 'pt-BR',
    dateStyle: 'short' as const,
  },
};

// Configurações de notificação
export const NOTIFICACOES = {
  diasAntesVencimento: 3,
  horarioPadrao: '09:00',
};

// Mensagens do app
export const MENSAGENS = {
  erro: {
    conexao: 'Erro de conexão. Verifique sua internet.',
    generico: 'Ocorreu um erro inesperado.',
    login: 'Email ou senha inválidos.',
    campoObrigatorio: 'Este campo é obrigatório.',
    emailInvalido: 'Digite um email válido.',
    senhaMinima: 'A senha deve ter pelo menos 6 caracteres.',
    senhasNaoConferem: 'As senhas não conferem.',
  },
  sucesso: {
    transacaoSalva: 'Transação salva com sucesso!',
    transacaoExcluida: 'Transação excluída com sucesso!',
    loginRealizado: 'Login realizado com sucesso!',
    cadastroRealizado: 'Cadastro realizado com sucesso!',
  },
  confirmacao: {
    excluirTransacao: 'Tem certeza que deseja excluir esta transação?',
    sair: 'Tem certeza que deseja sair?',
  },
};

// Configurações do Supabase (estas devem ser movidas para variáveis de ambiente)
export const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL',
  anonKey: 'YOUR_SUPABASE_ANON_KEY',
};

// Configurações de paginação
export const PAGINACAO = {
  itensPorPagina: 20,
  limiteInicial: 10,
};

// URLs de APIs externas (se necessário)
export const APIS = {
  // Adicionar URLs de APIs externas se necessário
};