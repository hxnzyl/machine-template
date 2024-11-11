import { MainSizer } from '../object/MainSizer.js'

export default {
	props: {
		//#region Data Props
		leftItemList: Array,
		leftTypeList: Array,
		mainSizeList: Array,
		//#endregion Data Props
		//#region Function Props
		//元素是否可从main容器内拖出
		canMoveDelete: Boolean,
		//左侧素材是否显示名称
		leftShowName: Boolean,
		//左侧素材分成几列
		leftItemCol: { type: Number, default: 3 },
		//#endregion Function Props
		//#region Style Props
		width: { type: [String, Number], default: '100%' },
		height: { type: [String, Number], default: '100%' },
		leftWidth: { type: [String, Number], default: '300px' },
		rightWidth: { type: [String, Number], default: '300px' }
		//#endregion Style Props
	},
	data() {
		return {
			isHorizontal: window.screen.width > window.screen.height,
			isMounted: false,
			//移动类型
			MOVE_NONE: 'none', //实际未移动
			MOVE_EMULATE: 'emulate', //仿真事件
			MOVE_NATIVE: 'native' //原生事件
		}
	},
	created() {
		document.addEventListener('mousemove', this.onMouseMove, false)
		document.addEventListener('mouseup', this.onMouseUp, false)
		document.addEventListener('mousedown', this.onMouseDown, false)
	},
	beforeDestroy() {
		document.removeEventListener('mousemove', this.onMouseMove, false)
		document.removeEventListener('mouseup', this.onMouseUp, false)
		document.removeEventListener('mousedown', this.onMouseDown, false)
	},
	mounted() {
		this.isMounted = true
	},
	computed: {
		currentLeftWidth() {
			return this.unit2num(this.leftWidth) - 20
		},
		currentLeftItemW() {
			let scrollWidth = this.$refs.mainContainer?.$el.scrollTop > 0 ? 10 : 0
			return (this.currentLeftWidth - scrollWidth - 10 * (this.leftItemCol - 1)) / this.leftItemCol
		},
		currentLeftGroup() {
			return this.leftItems.reduce(
				(group, item) => (this.filterLeftKeyword(item) && (group[item.typeId] = group[item.typeId] || []).push(item), group),
				{}
			)
		},
		currentMainSize() {
			return this.mainSizeId ? this.mainSizeList.find((size) => size.id == this.mainSizeId) : { width: 0, height: 0 }
		},
		currentMainSizer() {
			//$refs在mounted之后才能取到
			if (!this.isMounted) return new MainSizer()
			let { main, mainHeader, mainFooter } = this.$refs
			let _width = main.$el.offsetWidth - 1 //-1: border-right
			let _height = main.$el.offsetHeight - mainHeader.$el.offsetHeight - mainFooter.$el.offsetHeight
			let { width, height } = this.currentMainSize
			return width > height
				? new MainSizer(_width, Math.round(_width * (height / width), 2), this.isHorizontal ? 1 : 2, 1) //模板是横屏，客户端为竖屏 则 模板宽拉长2倍
				: new MainSizer(Math.round(_height * (width / height), 2), _height, 1, this.isHorizontal ? 2 : 1) //模板是竖屏，客户端为横屏 则 模板高拉长2倍
		}
	},
	methods: {
		/**
		 * 全局鼠标移动中事件
		 *
		 * @param {MouseEvent} event
		 */
		onMouseMove(event) {
			if (this.leftItem._leftId) this[`_onMouseMoveLeftItem_${this.leftMove}`](event, this.leftItem)
			if (this.mainItem._mainId && !this.mainItem._lock) this[`_onMouseMoveMainItem_${this.mainMove}`](event, this.mainItem)
			if (this.resizeItem._mainId && !this.resizeItem._lock) this[`_onMouseMoveResizeItem_${this.resizeType}`](event, this.resizeItem)
			if (this.rotateItem._mainId && !this.rotateItem._lock) this[`_onMouseMoveRotateItem_${this.rotateType}`](event, this.rotateItem)
		},
		/**
		 * 全局鼠标放下事件
		 *
		 * @param {MouseEvent} event
		 */
		onMouseUp(event) {
			if (this.leftItem._leftId) this.onMouseUpLeftItem(event, this.leftItem)
			if (this.mainItem._mainId) this.onMouseUpMainItem(event, this.mainItem)
			if (this.resizeItem._mainId) this.onMouseUpResizeItem(event, this.resizeItem)
			if (this.rotateItem._mainId) this.onMouseUpRotateItem(event, this.rotateItem)
			document.body.classList.remove('mt-unselectable')
		},
		/**
		 * 全局鼠标点下事件。NOTE：子节点mousedown不要使用stop修饰防止事件冒泡，这里要对冒泡行为进行验证
		 * 冒泡顺序：自下往上
		 */
		onMouseDown(event) {
			//不是操作的mainItem
			if (!this.currentItem._mainId) return
			let parent = event.target
			//是否操作的mainItem
			let inMainItem = false
			do {
				if (!parent) break
				if (!parent.classList || !parent.classList.contains('mt-main-target')) continue
				inMainItem = true
				break
			} while ((parent = parent.parentNode))
			//发生在mainItem内不管
			if (inMainItem) return
			//发生在mainItem外时清除currentItem
			this.currentItem = {}
			//重置工具栏状态
			this.resetToolbarStatus()
		},
		/**
		 * 字符串转单位值
		 *
		 * @param {String|Number} str
		 * @param {String} unit
		 * @returns {String}
		 */
		str2unit(str, unit = 'px') {
			return str.toString().includes('%') ? str : str.toString().replace(unit, '') + unit
		},
		/**
		 * 单位值转数值
		 *
		 * @param {String|Number} str
		 * @param {String} unit
		 * @returns {Number}
		 */
		unit2num(str, unit = 'px') {
			if (str.toString().includes('%')) return console.warn("unit2num: percentage can't convert to number."), 0
			return parseInt(str.toString().replace(unit, ''), 10) || 0
		},
		/**
		 * 清空选择
		 */
		clearSelection(unselectable) {
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
			unselectable && document.body.classList.add('mt-unselectable')
		},
		/**
		 * 右上角成功通知
		 *
		 * @param {String} message
		 */
		notifySuccess(message) {
			this.$notify.success({ title: '提示', message, duration: 1500, position: 'top-right' })
		}
	}
}
