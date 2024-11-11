/**
 * 自动引入所有图标组件
 *
 * @link https://iconpark.oceanengine.com/official
 */

const files = require.context('./icons', true, /\.vue$/)

const icons = files
	.keys()
	.reduce(
		(modules, path, component) => (
			(component = files(path).default), (modules[path.replace('./', '').replace('.vue', '')] = component), modules
		),
		{}
	)

export default icons
