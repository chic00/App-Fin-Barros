import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootStackParamList, RegisterForm } from '../../types';
import { CORES, ESPACAMENTOS, TAMANHOS_FONTE, MENSAGENS } from '../../constants';
import { validarEmail } from '../../utils';
import { authService } from '../../services/supabase';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [formData, setFormData] = useState<RegisterForm>({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [erros, setErros] = useState<Partial<RegisterForm>>({});

  const validarFormulario = (): boolean => {
    const novosErros: Partial<RegisterForm> = {};

    if (!formData.nome.trim()) {
      novosErros.nome = MENSAGENS.erro.campoObrigatorio;
    }

    if (!formData.email.trim()) {
      novosErros.email = MENSAGENS.erro.campoObrigatorio;
    } else if (!validarEmail(formData.email)) {
      novosErros.email = MENSAGENS.erro.emailInvalido;
    }

    if (!formData.senha.trim()) {
      novosErros.senha = MENSAGENS.erro.campoObrigatorio;
    } else if (formData.senha.length < 6) {
      novosErros.senha = MENSAGENS.erro.senhaMinima;
    }

    if (!formData.confirmarSenha.trim()) {
      novosErros.confirmarSenha = MENSAGENS.erro.campoObrigatorio;
    } else if (formData.senha !== formData.confirmarSenha) {
      novosErros.confirmarSenha = MENSAGENS.erro.senhasNaoConferem;
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleRegister = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      await authService.register(formData.email, formData.senha, formData.nome);
      Alert.alert(
        'Sucesso', 
        MENSAGENS.sucesso.cadastroRealizado,
        [{ text: 'OK', onPress: () => navigation.replace('MainTabs') }]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || MENSAGENS.erro.generico);
    } finally {
      setLoading(false);
    }
  };

  const voltarParaLogin = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Icon name="person-add" size={80} color={CORES.primaria} />
          <Text style={styles.titulo}>Criar Conta</Text>
          <Text style={styles.subtitulo}>Preencha os dados para se cadastrar</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome Completo</Text>
            <View style={styles.inputWrapper}>
              <Icon name="person" size={20} color={CORES.textoSecundario} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, erros.nome && styles.inputError]}
                placeholder="Digite seu nome completo"
                value={formData.nome}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, nome: text }));
                  if (erros.nome) {
                    setErros(prev => ({ ...prev, nome: undefined }));
                  }
                }}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!loading}
              />
            </View>
            {erros.nome && <Text style={styles.errorText}>{erros.nome}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Icon name="email" size={20} color={CORES.textoSecundario} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, erros.email && styles.inputError]}
                placeholder="Digite seu email"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, email: text }));
                  if (erros.email) {
                    setErros(prev => ({ ...prev, email: undefined }));
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>
            {erros.email && <Text style={styles.errorText}>{erros.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock" size={20} color={CORES.textoSecundario} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, erros.senha && styles.inputError]}
                placeholder="Digite sua senha"
                value={formData.senha}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, senha: text }));
                  if (erros.senha) {
                    setErros(prev => ({ ...prev, senha: undefined }));
                  }
                }}
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setMostrarSenha(!mostrarSenha)}
              >
                <Icon 
                  name={mostrarSenha ? 'visibility' : 'visibility-off'} 
                  size={20} 
                  color={CORES.textoSecundario} 
                />
              </TouchableOpacity>
            </View>
            {erros.senha && <Text style={styles.errorText}>{erros.senha}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock" size={20} color={CORES.textoSecundario} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, erros.confirmarSenha && styles.inputError]}
                placeholder="Confirme sua senha"
                value={formData.confirmarSenha}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, confirmarSenha: text }));
                  if (erros.confirmarSenha) {
                    setErros(prev => ({ ...prev, confirmarSenha: undefined }));
                  }
                }}
                secureTextEntry={!mostrarConfirmarSenha}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              >
                <Icon 
                  name={mostrarConfirmarSenha ? 'visibility' : 'visibility-off'} 
                  size={20} 
                  color={CORES.textoSecundario} 
                />
              </TouchableOpacity>
            </View>
            {erros.confirmarSenha && <Text style={styles.errorText}>{erros.confirmarSenha}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={CORES.textoClaro} />
            ) : (
              <Text style={styles.registerButtonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={voltarParaLogin}>
            <Text style={styles.loginText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: ESPACAMENTOS.grande,
  },
  header: {
    alignItems: 'center',
    marginBottom: ESPACAMENTOS.extraGrande,
  },
  titulo: {
    fontSize: TAMANHOS_FONTE.titulo,
    fontWeight: 'bold',
    color: CORES.texto,
    marginTop: ESPACAMENTOS.medio,
    marginBottom: ESPACAMENTOS.pequeno,
  },
  subtitulo: {
    fontSize: TAMANHOS_FONTE.medio,
    color: CORES.textoSecundario,
    textAlign: 'center',
  },
  form: {
    marginBottom: ESPACAMENTOS.extraGrande,
  },
  inputContainer: {
    marginBottom: ESPACAMENTOS.medio,
  },
  label: {
    fontSize: TAMANHOS_FONTE.medio,
    fontWeight: '500',
    color: CORES.texto,
    marginBottom: ESPACAMENTOS.pequeno,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.branco,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginLeft: ESPACAMENTOS.medio,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: ESPACAMENTOS.medio,
    fontSize: TAMANHOS_FONTE.medio,
    color: CORES.texto,
  },
  inputError: {
    borderColor: CORES.erro,
  },
  eyeIcon: {
    padding: ESPACAMENTOS.medio,
  },
  errorText: {
    fontSize: TAMANHOS_FONTE.pequeno,
    color: CORES.erro,
    marginTop: ESPACAMENTOS.pequeno / 2,
    marginLeft: ESPACAMENTOS.pequeno,
  },
  registerButton: {
    backgroundColor: CORES.primaria,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ESPACAMENTOS.medio,
  },
  buttonDisabled: {
    backgroundColor: CORES.neutral,
  },
  registerButtonText: {
    color: CORES.textoClaro,
    fontSize: TAMANHOS_FONTE.medio,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: CORES.textoSecundario,
    fontSize: TAMANHOS_FONTE.medio,
  },
  loginText: {
    color: CORES.primaria,
    fontSize: TAMANHOS_FONTE.medio,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default RegisterScreen;