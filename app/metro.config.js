const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Add 'glb' to the list of asset extensions
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'mp4', 'mov', 'avi', 'm4a', 'mp3', 'wav', 'ogg', 'pdf', 'svg', 'glb', 'gltf', 'bin'],
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'mjs'],
  },
  transformer: {
    get  TransformOptions() {
      const defaultTransformOptions = require("metro-react-native-babel-transformer").TransformOptions;
      return {
        ...defaultTransformOptions,
        // Add any custom transform options here if needed
      };
    },
    // Ensure that GLSL shaders are correctly handled if you use them
    // babelTransformerPath: require.resolve('react-native-web/jest/babel-transformer'), // Example for web, not needed for native
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
