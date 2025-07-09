import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootStackParamList, ResumoFinanceiro, Transacao } from '../../types';
import { CORES, ESPACAMENTOS, TAMANHOS_FONTE } from '../../constants';
import { formatarMoeda, obterSaudacao, formatarDataCurta } from '../../utils';
import { transacaoService, authService } from '../../services/supabase';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [resumo, setResumo] = useState<ResumoFinanceiro>({
    saldoAtual: 0,
    receitasDoMes: 0,
    despesasDoMes: 0,
    contasAVencer: 0,
  });
  const [transacoesRecentes, setTransacoesRecentes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');

  useEffect(() => {
    carregarDados();
    obterDadosUsuario();
  }, []);

  const obterDadosUsuario = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user?.user_metadata?.nome) {
        setNomeUsuario(user.user_metadata.nome);
      }
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
    }
  };

  const carregarDados = async () => {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;

      // Carregar resumo financeiro
      const resumoData = await transacaoService.obterResumoFinanceiro(user.id);
      setResumo(resumoData);

      // Carregar transações recentes
      const transacoes = await transacaoService.buscarTransacoes(user.id, 5);
      setTransacoesRecentes(transacoes);
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const navegarParaNovaTransacao = (tipo?: 'receita' | 'despesa') => {
    navigation.navigate('AddTransaction', { tipo });
  };

  const navegarParaNotificacoes = () => {
    navigation.navigate('Notifications');
  };

  const navegarParaTransacoes = () => {
    navigation.navigate('MainTabs', { screen: 'Transactions' });
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={carregarDados} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.saudacao}>{obterSaudacao()}</Text>
          <Text style={styles.nomeUsuario}>{nomeUsuario || 'Usuário'}</Text>
        </View>
        <TouchableOpacity onPress={navegarParaNotificacoes} style={styles.notificationButton}>
          <Icon name="notifications" size={24} color={CORES.texto} />
          {resumo.contasAVencer > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{resumo.contasAVencer}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Cards de Resumo */}
      <View style={styles.resumoContainer}>
        <View style={styles.saldoCard}>
          <Text style={styles.saldoLabel}>Saldo Atual</Text>
          <Text style={[
            styles.saldoValor,
            { color: resumo.saldoAtual >= 0 ? CORES.sucesso : CORES.erro }
          ]}>
            {formatarMoeda(resumo.saldoAtual)}
          </Text>
        </View>

        <View style={styles.resumoCardsRow}>
          <View style={[styles.resumoCard, styles.receitaCard]}>
            <Icon name="trending-up" size={24} color={CORES.receita} />
            <Text style={styles.resumoCardLabel}>Receitas</Text>
            <Text style={styles.resumoCardValor}>
              {formatarMoeda(resumo.receitasDoMes)}
            </Text>
          </View>

          <View style={[styles.resumoCard, styles.despesaCard]}>
            <Icon name="trending-down" size={24} color={CORES.despesa} />
            <Text style={styles.resumoCardLabel}>Despesas</Text>
            <Text style={styles.resumoCardValor}>
              {formatarMoeda(resumo.despesasDoMes)}
            </Text>
          </View>
        </View>
      </View>

      {/* Ações Rápidas */}
      <View style={styles.acoesContainer}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.acoesRow}>
          <TouchableOpacity 
            style={[styles.acaoButton, { backgroundColor: CORES.receita }]}
            onPress={() => navegarParaNovaTransacao('receita')}
          >
            <Icon name="add" size={24} color={CORES.textoClaro} />
            <Text style={styles.acaoButtonText}>Receita</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.acaoButton, { backgroundColor: CORES.despesa }]}
            onPress={() => navegarParaNovaTransacao('despesa')}
          >
            <Icon name="remove" size={24} color={CORES.textoClaro} />
            <Text style={styles.acaoButtonText}>Despesa</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transações Recentes */}
      <View style={styles.transacoesContainer}>
        <View style={styles.transacoesHeader}>
          <Text style={styles.sectionTitle}>Transações Recentes</Text>
          <TouchableOpacity onPress={navegarParaTransacoes}>
            <Text style={styles.verTodas}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {transacoesRecentes.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="receipt" size={48} color={CORES.neutral} />
            <Text style={styles.emptyStateText}>Nenhuma transação encontrada</Text>
            <TouchableOpacity 
              style={styles.addFirstTransaction}
              onPress={() => navegarParaNovaTransacao()}
            >
              <Text style={styles.addFirstTransactionText}>
                Adicionar primeira transação
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          transacoesRecentes.map((transacao) => (
            <View key={transacao.id} style={styles.transacaoItem}>
              <View style={styles.transacaoInfo}>
                <View style={[
                  styles.transacaoIcon,
                  { backgroundColor: transacao.tipo === 'receita' ? CORES.receita : CORES.despesa }
                ]}>
                  <Icon 
                    name={transacao.tipo === 'receita' ? 'arrow-upward' : 'arrow-downward'}
                    size={16} 
                    color={CORES.textoClaro} 
                  />
                </View>
                <View style={styles.transacaoDetails}>
                  <Text style={styles.transacaoDescricao}>{transacao.descricao}</Text>
                  <Text style={styles.transacaoData}>
                    {formatarDataCurta(new Date(transacao.data))}
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.transacaoValor,
                { color: transacao.tipo === 'receita' ? CORES.receita : CORES.despesa }
              ]}>
                {transacao.tipo === 'receita' ? '+' : '-'}{formatarMoeda(transacao.valor)}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ESPACAMENTOS.grande,
    backgroundColor: CORES.branco,
  },
  saudacao: {
    fontSize: TAMANHOS_FONTE.medio,
    color: CORES.textoSecundario,
  },
  nomeUsuario: {
    fontSize: TAMANHOS_FONTE.subtitulo,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  notificationButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: CORES.erro,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: CORES.textoClaro,
    fontSize: TAMANHOS_FONTE.pequeno,
    fontWeight: 'bold',
  },
  resumoContainer: {
    padding: ESPACAMENTOS.grande,
  },
  saldoCard: {
    backgroundColor: CORES.branco,
    borderRadius: 12,
    padding: ESPACAMENTOS.grande,
    marginBottom: ESPACAMENTOS.medio,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saldoLabel: {
    fontSize: TAMANHOS_FONTE.medio,
    color: CORES.textoSecundario,
    marginBottom: ESPACAMENTOS.pequeno,
  },
  saldoValor: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  resumoCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resumoCard: {
    flex: 1,
    backgroundColor: CORES.branco,
    borderRadius: 12,
    padding: ESPACAMENTOS.medio,
    marginHorizontal: ESPACAMENTOS.pequeno / 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  receitaCard: {
    marginLeft: 0,
  },
  despesaCard: {
    marginRight: 0,
  },
  resumoCardLabel: {
    fontSize: TAMANHOS_FONTE.pequeno,
    color: CORES.textoSecundario,
    marginTop: ESPACAMENTOS.pequeno,
    marginBottom: ESPACAMENTOS.pequeno / 2,
  },
  resumoCardValor: {
    fontSize: TAMANHOS_FONTE.medio,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  acoesContainer: {
    padding: ESPACAMENTOS.grande,
  },
  sectionTitle: {
    fontSize: TAMANHOS_FONTE.subtitulo,
    fontWeight: 'bold',
    color: CORES.texto,
    marginBottom: ESPACAMENTOS.medio,
  },
  acoesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acaoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: ESPACAMENTOS.medio,
    borderRadius: 8,
    marginHorizontal: ESPACAMENTOS.pequeno / 2,
  },
  acaoButtonText: {
    color: CORES.textoClaro,
    fontSize: TAMANHOS_FONTE.medio,
    fontWeight: 'bold',
    marginLeft: ESPACAMENTOS.pequeno,
  },
  transacoesContainer: {
    padding: ESPACAMENTOS.grande,
  },
  transacoesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESPACAMENTOS.medio,
  },
  verTodas: {
    color: CORES.primaria,
    fontSize: TAMANHOS_FONTE.medio,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: ESPACAMENTOS.extraGrande,
    backgroundColor: CORES.branco,
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: TAMANHOS_FONTE.medio,
    color: CORES.textoSecundario,
    marginTop: ESPACAMENTOS.medio,
    textAlign: 'center',
  },
  addFirstTransaction: {
    marginTop: ESPACAMENTOS.medio,
  },
  addFirstTransactionText: {
    color: CORES.primaria,
    fontSize: TAMANHOS_FONTE.medio,
    fontWeight: '500',
  },
  transacaoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CORES.branco,
    padding: ESPACAMENTOS.medio,
    borderRadius: 8,
    marginBottom: ESPACAMENTOS.pequeno,
  },
  transacaoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transacaoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ESPACAMENTOS.medio,
  },
  transacaoDetails: {
    flex: 1,
  },
  transacaoDescricao: {
    fontSize: TAMANHOS_FONTE.medio,
    fontWeight: '500',
    color: CORES.texto,
  },
  transacaoData: {
    fontSize: TAMANHOS_FONTE.pequeno,
    color: CORES.textoSecundario,
  },
  transacaoValor: {
    fontSize: TAMANHOS_FONTE.medio,
    fontWeight: 'bold',
  },
});

export default HomeScreen;