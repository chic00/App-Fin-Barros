import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CORES, ESPACAMENTOS, TAMANHOS_FONTE } from '../../constants';

const ReportsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatórios</Text>
      <Text style={styles.subtitle}>Gráficos e relatórios em desenvolvimento</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CORES.fundo,
    padding: ESPACAMENTOS.grande,
  },
  title: {
    fontSize: TAMANHOS_FONTE.titulo,
    fontWeight: 'bold',
    color: CORES.texto,
    marginBottom: ESPACAMENTOS.pequeno,
  },
  subtitle: {
    fontSize: TAMANHOS_FONTE.medio,
    color: CORES.textoSecundario,
    textAlign: 'center',
  },
});

export default ReportsScreen;