// Tipos de Transação
export type TipoTransacao = 'receita' | 'despesa';
export type TipoRecorrencia = 'unica' | 'mensal' | 'anual';

// Interface para Categoria
export interface Categoria {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  tipo: TipoTransacao;
}

// Interface para Transação
export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  data: Date;
  categoria_id: string;
  categoria?: Categoria;
  tipo: TipoTransacao;
  recorrencia: TipoRecorrencia;
  data_vencimento?: Date;
  observacoes?: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

// Interface para Usuário
export interface Usuario {
  id: string;
  email: string;
  nome: string;
  telefone?: string;
  created_at: Date;
  updated_at: Date;
}

// Interface para Resumo Financeiro
export interface ResumoFinanceiro {
  saldoAtual: number;
  receitasDoMes: number;
  despesasDoMes: number;
  contasAVencer: number;
}

// Interface para Notificação
export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'vencimento' | 'lembrete' | 'meta';
  data: Date;
  lida: boolean;
  transacao_id?: string;
  user_id: string;
}

// Interface para Meta Financeira
export interface MetaFinanceira {
  id: string;
  nome: string;
  valor_meta: number;
  valor_atual: number;
  data_inicio: Date;
  data_fim: Date;
  categoria_id?: string;
  user_id: string;
}

// Types para Navigation
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  AddTransaction: { tipo?: TipoTransacao };
  TransactionDetails: { transactionId: string };
  EditTransaction: { transactionId: string };
  Notifications: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Reports: undefined;
  Profile: undefined;
};

// Types para formulários
export interface TransactionForm {
  descricao: string;
  valor: string;
  categoria_id: string;
  data: Date;
  recorrencia: TipoRecorrencia;
  data_vencimento?: Date;
  observacoes?: string;
}

export interface LoginForm {
  email: string;
  senha: string;
}

export interface RegisterForm {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

// Types para gráficos
export interface DadosGrafico {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }>;
}

export interface DadosGraficoPizza {
  name: string;
  value: number;
  color: string;
  legendFontColor?: string;
  legendFontSize?: number;
}