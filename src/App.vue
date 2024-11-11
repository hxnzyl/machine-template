<template>
	<div id="app">
		<machine-template :left-item-list="leftItemList" :left-type-list="leftTypeList" :main-size-list="mainSizeList" can-move-delete />
	</div>
</template>

<script>
import MachineTemplate from './components/index.vue'

export default {
	name: 'App',
	components: { [MachineTemplate.name]: MachineTemplate },
	data() {
		return {
			mainSizeList: [
				{
					id: 1, //面板尺寸唯一标识id
					width: 1920, //面板尺寸宽
					height: 1080, //面板尺寸高
					name: '横屏1920x1080', //面板尺寸名称
					isDefault: true, //是否为默认面板
					image: 'https://qiniush.heysee.cn/1640570942836.jpg' //面板说明图
				},
				{
					id: 2, //面板尺寸唯一标识id
					width: 1080, //面板尺寸宽
					height: 1920, //面板尺寸高
					name: '竖屏1080x1920', //面板尺寸名称
					isDefault: false, //是否为默认面板
					image: 'http://qiniu.heysee.cn/1635832383804.png' //面板说明图
				}
			],
			leftTypeList: [
				{
					typeId: 1, //素材类型数值
					typeName: '商品位', //素材类型中文
					typeLevel: 500 //素材层级，越高在越上面
				},
				{
					typeId: 2, //素材类型数值
					typeName: '背景图', //素材类型中文
					typeLevel: 1 //素材层级，越高在越上面
				},
				{
					typeId: 3, //素材类型数值
					typeName: '自定义组件', //素材类型中文
					typeLevel: 100, //素材层级，越高在越上面
					customComponentName: '' //自定义组件名称
				},
				{
					typeId: 4, //素材类型数值
					typeName: '广告位', //素材类型中文
					typeLevel: 1000 //素材层级，越高在越上面
				}
			],
			leftItemList: [
				{
					id: 1, //素材唯一标识id
					name: '商品90*200', //素材名称
					typeId: 1, //素材类型数值
					typeName: '商品位', //素材类型中文
					typeLevel: 500, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1659431803734.jpg' //素材说明图
				},
				{
					id: 2, //素材唯一标识id
					name: '皮卡丘卡面290*658', //素材名称
					typeId: 1, //素材类型数值
					typeName: '商品位', //素材类型中文
					typeLevel: 500, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1646906201611.png' //素材说明图
				},
				{
					id: 3, //素材唯一标识id
					name: '美少女战士卡面290*658', //素材名称
					typeId: 1, //素材类型数值
					typeName: '商品位', //素材类型中文
					typeLevel: 500, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1646906206400.png' //素材说明图
				},
				{
					id: 4, //素材唯一标识id
					name: '食玩背景1920x1080', //素材名称
					typeId: 2, //素材类型数值
					typeName: '背景图', //素材类型中文
					typeLevel: 1, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1646790736167.jpg' //素材说明图
				},
				{
					id: 5, //素材唯一标识id
					name: '广告位840x476', //素材名称
					typeId: 4, //素材类型数值
					typeName: '广告位', //素材类型中文
					typeLevel: 1000, //素材层级，越高在越上面
					resizable: true, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1646034427315.png' //素材说明图
				},
				{
					id: 11, //素材唯一标识id
					name: '商品90*200', //素材名称
					typeId: 1, //素材类型数值
					typeName: '商品位', //素材类型中文
					typeLevel: 500, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1659431803734.jpg' //素材说明图
				},
				{
					id: 12, //素材唯一标识id
					name: '皮卡丘卡面290*658', //素材名称
					typeId: 1, //素材类型数值
					typeName: '商品位', //素材类型中文
					typeLevel: 500, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1646906201611.png' //素材说明图
				},
				{
					id: 13, //素材唯一标识id
					name: '美少女战士卡面290*658', //素材名称
					typeId: 1, //素材类型数值
					typeName: '商品位', //素材类型中文
					typeLevel: 500, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1646906206400.png' //素材说明图
				},
				{
					id: 14, //素材唯一标识id
					name: '食玩背景1920x1080', //素材名称
					typeId: 2, //素材类型数值
					typeName: '背景图', //素材类型中文
					typeLevel: 1, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1646790736167.jpg' //素材说明图
				},
				{
					id: 15, //素材唯一标识id
					name: '广告位840x476', //素材名称
					typeId: 4, //素材类型数值
					typeName: '广告位', //素材类型中文
					typeLevel: 1000, //素材层级，越高在越上面
					resizable: true, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1646034427315.png' //素材说明图
				},
				{
					id: 24, //素材唯一标识id
					name: '食玩背景1920x1080', //素材名称
					typeId: 2, //素材类型数值
					typeName: '背景图', //素材类型中文
					typeLevel: 1, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1646790736167.jpg' //素材说明图
				},
				{
					id: 25, //素材唯一标识id
					name: '广告位840x476', //素材名称
					typeId: 4, //素材类型数值
					typeName: '广告位', //素材类型中文
					typeLevel: 1000, //素材层级，越高在越上面
					resizable: true, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1646034427315.png' //素材说明图
				},
				{
					id: 31, //素材唯一标识id
					name: '商品90*200', //素材名称
					typeId: 1, //素材类型数值
					typeName: '商品位', //素材类型中文
					typeLevel: 500, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1659431803734.jpg' //素材说明图
				},
				{
					id: 32, //素材唯一标识id
					name: '皮卡丘卡面290*658', //素材名称
					typeId: 1, //素材类型数值
					typeName: '商品位', //素材类型中文
					typeLevel: 500, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1646906201611.png' //素材说明图
				},
				{
					id: 33, //素材唯一标识id
					name: '美少女战士卡面290*658', //素材名称
					typeId: 1, //素材类型数值
					typeName: '商品位', //素材类型中文
					typeLevel: 500, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1646906206400.png' //素材说明图
				},
				{
					id: 41, //素材唯一标识id
					name: '商品90*200', //素材名称
					typeId: 1, //素材类型数值
					typeName: '商品位', //素材类型中文
					typeLevel: 500, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1659431803734.jpg' //素材说明图
				},
				{
					id: 42, //素材唯一标识id
					name: '皮卡丘卡面290*658', //素材名称
					typeId: 1, //素材类型数值
					typeName: '商品位', //素材类型中文
					typeLevel: 500, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1646906201611.png' //素材说明图
				},
				{
					id: 43, //素材唯一标识id
					name: '美少女战士卡面290*658', //素材名称
					typeId: 1, //素材类型数值
					typeName: '商品位', //素材类型中文
					typeLevel: 500, //素材层级，越高在越上面
					resizable: false, //素材是否可自行调整大小
					image: 'https://qiniush.heysee.cn/1646906206400.png' //素材说明图
				}
			]
		}
	}
}
</script>

<style>
html,
body,
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	height: 100%;
}
</style>
