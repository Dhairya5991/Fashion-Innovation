module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['react-native-reanimated/plugin'], // Required for Reanimated 2
    ['module:react-native-dotenv', {
      "env": {
        "local": {
          "path": "../.env" // Adjust path if .env is not in the root
        }
      }
    }]
  ]
};
