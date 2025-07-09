import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootStackParamList, MainTabParamList } from '../types';
import { CORES } from '../constants';

// Importação das telas
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import TransactionsScreen from '../screens/transactions/TransactionsScreen';
import AddTransactionScreen from '../screens/transactions/AddTransactionScreen';
import TransactionDetailsScreen from '../screens/transactions/TransactionDetailsScreen';
import EditTransactionScreen from '../screens/transactions/EditTransactionScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Configuração das tabs principais
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Transactions':
              iconName = 'list';
              break;
            case 'Reports':
              iconName = 'bar-chart';
              break;
            case 'Profile':
              iconName = 'person';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: CORES.primaria,
        tabBarInactiveTintColor: CORES.textoSecundario,
        tabBarStyle: {
          backgroundColor: CORES.branco,
          borderTopColor: CORES.fundo,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: CORES.primaria,
        },
        headerTintColor: CORES.textoClaro,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Início',
          headerTitle: 'Minhas Finanças',
        }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsScreen}
        options={{
          title: 'Transações',
          headerTitle: 'Histórico',
        }}
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{
          title: 'Relatórios',
          headerTitle: 'Relatórios',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={SettingsScreen}
        options={{
          title: 'Perfil',
          headerTitle: 'Configurações',
        }}
      />
    </Tab.Navigator>
  );
};

// Navegador principal
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: CORES.primaria,
          },
          headerTintColor: CORES.textoClaro,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: CORES.fundo,
          },
        }}
      >
        {/* Telas de Autenticação */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            title: 'Entrar',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{
            title: 'Cadastrar',
            headerShown: false,
          }}
        />

        {/* Telas Principais */}
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs}
          options={{
            headerShown: false,
          }}
        />

        {/* Telas Modais/Detalhes */}
        <Stack.Screen 
          name="AddTransaction" 
          component={AddTransactionScreen}
          options={{
            title: 'Nova Transação',
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="TransactionDetails" 
          component={TransactionDetailsScreen}
          options={{
            title: 'Detalhes da Transação',
          }}
        />
        <Stack.Screen 
          name="EditTransaction" 
          component={EditTransactionScreen}
          options={{
            title: 'Editar Transação',
          }}
        />
        <Stack.Screen 
          name="Notifications" 
          component={NotificationsScreen}
          options={{
            title: 'Notificações',
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            title: 'Configurações',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;