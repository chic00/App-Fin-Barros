import { FORMATACAO } from '../constants';

// Formatação de moeda
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat(FORMATACAO.moeda.locale, {
    style: 'currency',
    currency: FORMATACAO.moeda.currency,
    minimumFractionDigits: FORMATACAO.moeda.minimumFractionDigits,
    maximumFractionDigits: FORMATACAO.moeda.maximumFractionDigits,
  }).format(valor);
};

// Formatação de data
export const formatarData = (data: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(data);
};

// Formatação de data para input
export const formatarDataInput = (data: Date): string => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

// Formatação de data curta (DD/MM)
export const formatarDataCurta = (data: Date): string => {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}`;
};

// Formatação de mês/ano
export const formatarMesAno = (data: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(data);
};

// Converter string de valor para número
export const stringParaNumero = (valor: string): number => {
  // Remove caracteres não numéricos exceto vírgula e ponto
  const valorLimpo = valor.replace(/[^\d,.-]/g, '');
  // Substitui vírgula por ponto e converte para número
  return parseFloat(valorLimpo.replace(',', '.')) || 0;
};

// Converter número para string formatada para input
export const numeroParaString = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Validar email
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar valor monetário
export const validarValor = (valor: string): boolean => {
  const numero = stringParaNumero(valor);
  return numero > 0;
};

// Obter primeiro e último dia do mês
export const obterPrimeiroDiaMes = (data: Date = new Date()): Date => {
  return new Date(data.getFullYear(), data.getMonth(), 1);
};

export const obterUltimoDiaMes = (data: Date = new Date()): Date => {
  return new Date(data.getFullYear(), data.getMonth() + 1, 0);
};

// Calcular dias entre datas
export const calcularDiasEntreDatas = (dataInicio: Date, dataFim: Date): number => {
  const diferenca = dataFim.getTime() - dataInicio.getTime();
  return Math.ceil(diferenca / (1000 * 3600 * 24));
};

// Verificar se data é hoje
export const ehHoje = (data: Date): boolean => {
  const hoje = new Date();
  return (
    data.getDate() === hoje.getDate() &&
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear()
  );
};

// Verificar se data é este mês
export const ehEsteMes = (data: Date): boolean => {
  const hoje = new Date();
  return (
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear()
  );
};

// Gerar ID único simples
export const gerarId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Capitalizar primeira letra
export const capitalizarPrimeira = (texto: string): string => {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

// Obter saudação baseada no horário
export const obterSaudacao = (): string => {
  const hora = new Date().getHours();
  
  if (hora < 12) {
    return 'Bom dia';
  } else if (hora < 18) {
    return 'Boa tarde';
  } else {
    return 'Boa noite';
  }
};

// Delay para simulação de loading
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Truncar texto
export const truncarTexto = (texto: string, limite: number): string => {
  if (texto.length <= limite) return texto;
  return texto.substring(0, limite) + '...';
};

// Ordenar array de objetos por propriedade
export const ordenarPor = <T>(
  array: T[],
  propriedade: keyof T,
  ordem: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const valorA = a[propriedade];
    const valorB = b[propriedade];
    
    if (valorA < valorB) return ordem === 'asc' ? -1 : 1;
    if (valorA > valorB) return ordem === 'asc' ? 1 : -1;
    return 0;
  });
};

// Agrupar array por propriedade
export const agruparPor = <T, K extends keyof T>(
  array: T[],
  propriedade: K
): Record<string, T[]> => {
  return array.reduce((grupos, item) => {
    const chave = String(item[propriedade]);
    if (!grupos[chave]) {
      grupos[chave] = [];
    }
    grupos[chave].push(item);
    return grupos;
  }, {} as Record<string, T[]>);
};

// Debounce para otimizar performance
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};