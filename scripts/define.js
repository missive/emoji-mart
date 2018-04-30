var pack = require('../package.json')

module.exports = {
  'process.env.NODE_ENV': 'production',
  EMOJI_DATASOURCE_VERSION: pack.devDependencies['emoji-datasource'],
}
