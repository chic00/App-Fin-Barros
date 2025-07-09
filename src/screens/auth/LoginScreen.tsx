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

import { RootStackParamList, LoginForm } from '../../types';
import { CORES, ESPACAMENTOS, TAMANHOS_FONTE, MENSAGENS } from '../../constants';
import { validarEmail } from '../../utils';
import { authService } from '../../services/supabase';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState<Partial<LoginForm>>({});

  const validarFormulario = (): boolean => {
    const novosErros: Partial<LoginForm> = {};

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

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleLogin = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      await authService.login(formData.email, formData.senha);
      navigation.replace('MainTabs');
    } catch (error: any) {
      Alert.alert('Erro', error.message || MENSAGENS.erro.login);
    } finally {
      setLoading(false);
    }
  };

  const navegarParaCadastro = () => {
    navigation.navigate('Register');
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
          <Icon name="account-balance-wallet" size={80} color={CORES.primaria} />
          <Text style={styles.titulo}>Finanças App</Text>
          <Text style={styles.subtitulo}>Controle suas finanças pessoais</Text>
        </View>

        <View style={styles.form}>
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

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={CORES.textoClaro} />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          <TouchableOpacity onPress={navegarParaCadastro}>
            <Text style={styles.signupText}>Cadastre-se</Text>
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
  loginButton: {
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
  loginButtonText: {
    color: CORES.textoClaro,
    fontSize: TAMANHOS_FONTE.medio,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: ESPACAMENTOS.medio,
  },
  forgotPasswordText: {
    color: CORES.primaria,
    fontSize: TAMANHOS_FONTE.medio,
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
  signupText: {
    color: CORES.primaria,
    fontSize: TAMANHOS_FONTE.medio,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default LoginScreen;