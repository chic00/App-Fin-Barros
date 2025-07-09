#!/bin/bash

# Script de configuração automática do Finanças App
echo "🚀 Configurando o Finanças App..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
    echo "❌ Node.js versão $REQUIRED_VERSION ou superior é necessária. Versão atual: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js versão $NODE_VERSION detectada"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Configurar ícones para Android
echo "🎨 Configurando ícones..."
npx react-native-asset 2>/dev/null || echo "⚠️ Configuração de ícones será feita durante o build"

# Verificar se Android SDK está configurado
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️ ANDROID_HOME não está configurado. Configure o Android SDK para desenvolvimento Android."
else
    echo "✅ Android SDK encontrado em: $ANDROID_HOME"
fi

# Criar arquivo de ambiente de exemplo
echo "📝 Criando arquivo de configuração de exemplo..."
cat > .env.example << 'EOF'
# Configurações do Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima-aqui

# Configurações de notificação
NOTIFICATION_ICON=ic_notification
NOTIFICATION_CHANNEL_ID=financas_app_notifications
NOTIFICATION_CHANNEL_NAME=Finanças App
EOF

echo "✅ Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o Supabase:"
echo "   - Crie uma conta em https://supabase.com"
echo "   - Crie um novo projeto"
echo "   - Copie a URL e chave anônima para src/services/supabase.ts"
echo ""
echo "2. Execute o SQL do README.md no editor do Supabase para criar as tabelas"
echo ""
echo "3. Para rodar o app:"
echo "   - Android: npm run android"
echo "   - iOS: npm run ios"
echo ""
echo "💡 Consulte o README.md para instruções detalhadas!"