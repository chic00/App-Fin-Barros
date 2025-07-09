import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Transacao, 
  Categoria, 
  Usuario, 
  ResumoFinanceiro, 
  Notificacao,
  TipoTransacao 
} from '../types';

// Configuração do Supabase (substitua pelas suas credenciais)
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

// Criação do cliente Supabase
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Serviços de Autenticação
export const authService = {
  // Login com email e senha
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // Registro de novo usuário
  async register(email: string, password: string, nome: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
        },
      },
    });
    
    if (error) throw error;
    return data;
  },

  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Obter usuário atual
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Recuperar senha
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  // Verificar se usuário está logado
  async isLoggedIn(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  },
};

// Serviços de Categorias
export const categoriaService = {
  // Buscar todas as categorias do usuário
  async buscarCategorias(userId: string): Promise<Categoria[]> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('user_id', userId)
      .order('nome');
    
    if (error) throw error;
    return data || [];
  },

  // Buscar categorias por tipo
  async buscarCategoriasPorTipo(userId: string, tipo: TipoTransacao): Promise<Categoria[]> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('user_id', userId)
      .eq('tipo', tipo)
      .order('nome');
    
    if (error) throw error;
    return data || [];
  },

  // Criar nova categoria
  async criarCategoria(categoria: Omit<Categoria, 'id'>): Promise<Categoria> {
    const { data, error } = await supabase
      .from('categorias')
      .insert(categoria)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Atualizar categoria
  async atualizarCategoria(id: string, categoria: Partial<Categoria>): Promise<Categoria> {
    const { data, error } = await supabase
      .from('categorias')
      .update(categoria)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Deletar categoria
  async deletarCategoria(id: string): Promise<void> {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Serviços de Transações
export const transacaoService = {
  // Buscar todas as transações do usuário
  async buscarTransacoes(userId: string, limit?: number, offset?: number): Promise<Transacao[]> {
    let query = supabase
      .from('transacoes')
      .select(`
        *,
        categoria:categorias(*)
      `)
      .eq('user_id', userId)
      .order('data', { ascending: false });

    if (limit) query = query.limit(limit);
    if (offset) query = query.range(offset, offset + (limit || 20) - 1);

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  },

  // Buscar transações por período
  async buscarTransacoesPorPeriodo(
    userId: string, 
    dataInicio: Date, 
    dataFim: Date
  ): Promise<Transacao[]> {
    const { data, error } = await supabase
      .from('transacoes')
      .select(`
        *,
        categoria:categorias(*)
      `)
      .eq('user_id', userId)
      .gte('data', dataInicio.toISOString())
      .lte('data', dataFim.toISOString())
      .order('data', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Buscar transação por ID
  async buscarTransacaoPorId(id: string): Promise<Transacao | null> {
    const { data, error } = await supabase
      .from('transacoes')
      .select(`
        *,
        categoria:categorias(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Criar nova transação
  async criarTransacao(transacao: Omit<Transacao, 'id' | 'created_at' | 'updated_at'>): Promise<Transacao> {
    const { data, error } = await supabase
      .from('transacoes')
      .insert(transacao)
      .select(`
        *,
        categoria:categorias(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Atualizar transação
  async atualizarTransacao(id: string, transacao: Partial<Transacao>): Promise<Transacao> {
    const { data, error } = await supabase
      .from('transacoes')
      .update(transacao)
      .eq('id', id)
      .select(`
        *,
        categoria:categorias(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Deletar transação
  async deletarTransacao(id: string): Promise<void> {
    const { error } = await supabase
      .from('transacoes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Obter resumo financeiro do mês
  async obterResumoFinanceiro(userId: string, data: Date = new Date()): Promise<ResumoFinanceiro> {
    const primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1);
    const ultimoDia = new Date(data.getFullYear(), data.getMonth() + 1, 0);

    // Buscar transações do mês
    const transacoes = await this.buscarTransacoesPorPeriodo(userId, primeiroDia, ultimoDia);

    // Calcular totais
    const receitas = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((total, t) => total + t.valor, 0);

    const despesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((total, t) => total + t.valor, 0);

    // Contar contas a vencer nos próximos 7 dias
    const hoje = new Date();
    const seteDiasDepois = new Date();
    seteDiasDepois.setDate(hoje.getDate() + 7);

    const contasAVencer = transacoes
      .filter(t => 
        t.data_vencimento && 
        new Date(t.data_vencimento) >= hoje && 
        new Date(t.data_vencimento) <= seteDiasDepois
      ).length;

    return {
      saldoAtual: receitas - despesas,
      receitasDoMes: receitas,
      despesasDoMes: despesas,
      contasAVencer,
    };
  },
};

// Serviços de Notificações
export const notificacaoService = {
  // Buscar notificações do usuário
  async buscarNotificacoes(userId: string): Promise<Notificacao[]> {
    const { data, error } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('user_id', userId)
      .order('data', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Marcar notificação como lida
  async marcarComoLida(id: string): Promise<void> {
    const { error } = await supabase
      .from('notificacoes')
      .update({ lida: true })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Criar nova notificação
  async criarNotificacao(notificacao: Omit<Notificacao, 'id'>): Promise<Notificacao> {
    const { data, error } = await supabase
      .from('notificacoes')
      .insert(notificacao)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// Listener para mudanças na autenticação
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
};