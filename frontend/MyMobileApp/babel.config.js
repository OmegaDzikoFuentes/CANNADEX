module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-typescript',
    '@babel/preset-env',
  ],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }],
    '@babel/plugin-transform-flow-strip-types', // Add this plugin to strip Flow types
  ],
};
