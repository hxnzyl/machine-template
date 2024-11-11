/**
 * 自动引入所有混入模块
 */

const files = require.context('./mixins', true, /\.js$/)

const mixins = files.keys().reduce((modules, path) => modules.concat(files(path).default), [])

export default mixins
