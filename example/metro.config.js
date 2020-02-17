/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path')
const blacklist = require('metro-config/src/defaults/blacklist')

const packagePath = path.resolve(__dirname, '../')

const extraNodeModules = {
  'react': path.resolve(__dirname, 'node_modules/react'),
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
  'react-native-fast-modal': packagePath,
  'react-native-safe-area-context': path.resolve(packagePath, 'node_modules', 'react-native-safe-area-context')
}

module.exports = {
  resolver: {
    extraNodeModules,
    blacklistRE: blacklist([
      /^src[/\\].*/,
      /^example[/\\]src[/\\].*/
    ])
  },
  watchFolders: [packagePath],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    })
  }
}
