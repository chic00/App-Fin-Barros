module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: {
          project: './ios/FinancasApp.xcodeproj',
          xcodeprojDir: './ios',
          pbxprojDir: './ios',
          plist: './ios/FinancasApp/Info.plist',
        },
      },
    },
  },
  assets: ['./src/assets/fonts/'],
};