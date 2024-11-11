import { MainItem } from '../object/MainItem'
import { LeftItem } from '../object/LeftItem'

export default {
	data() {
		return {
			leftKeyword: '',
			leftTypeId: null,
			leftOffsetX: 0,
			leftOffsetY: 0,
			leftRect: {},
			leftItem: {},
			leftMove: 'none',
			leftItems: [],
			leftTimeout: null,
			leftAnimationId: null,
			leftAnimationQueue: []
		}
	},
	watch: {
		leftItemList: {
			immediate: true,
			handler() {
				//与外部解耦
				this.leftItems = this.leftItemList.map((item) => new LeftItem(item))
			}
		}
	},
	methods: {
		/**
		 * 计算left元素在main容器中的大小
		 *
		 * @param {LeftItem} leftItem
		 */
		calcLeftItemSize(leftItem) {
			let { width, height, xScale, yScale } = this.currentMainSizer
			let target = this.$refs[`mt-left-clone-${leftItem.id}`][0] //target
			leftItem._width = target.offsetWidth || target.width || 0
			leftItem._height = target.offsetHeight || target.height || 0
			leftItem._mainWidth = Math.round((width * leftItem._width) / this.currentMainSize.width, 2) * xScale
			leftItem._mainHeight = Math.round((height * leftItem._height) / this.currentMainSize.height, 2) * yScale
		},
		/**
		 * 过滤left元素
		 *
		 * @param {LeftItem} leftItem
		 * @returns
		 */
		filterLeftKeyword(leftItem) {
			return (!this.leftKeyword || (leftItem.name || '').includes(this.leftKeyword)) && (!this.leftTypeId || leftItem.typeId === this.leftTypeId)
		},
		/**
		 * left元素事件 - 鼠标按下时拖放开始
		 *
		 * @param {MouseEvent} event
		 * @param {LeftItem} leftItem
		 * @param {String} moveType
		 * @returns
		 */
		onMouseDownLeftItem(event, leftItem, moveType) {
			this.clearSelection(true)
			if (this.clearLeftTimeout()) return false
			if (moveType == this.MOVE_NATIVE)
				this.leftTimeout = window.setTimeout(() => this._onMouseDownLeftItem(event, leftItem, moveType), 1000 / 60)
			else this._onMouseDownLeftItem(event, leftItem, moveType)
		},
		/**
		 * left元素事件 - 鼠标按下时拖放开始
		 *
		 * @private
		 *
		 * @param {MouseEvent} event
		 * @param {LeftItem} leftItem
		 * @param {String} moveType
		 * @returns
		 */
		_onMouseDownLeftItem(event, leftItem, moveType) {
			if (moveType == this.MOVE_NATIVE && !this.leftTimeout) return
			this.updateMainRect()
			this.calcLeftItemSize(leftItem)
			this.leftOffsetX = event.offsetX
			this.leftOffsetY = event.offsetY
			this._onMouseMoveLeftItem_none(event, leftItem)
			this.leftMove = moveType
			this.leftItem = leftItem
			this.leftAnimationId = window.requestAnimationFrame(this._onMouseMoveLeftItem)
		},
		/**
		 * left元素事件 - 鼠标移动时将坐标放入移动轨迹队列，然后在动画函数中执行移动轨迹队列
		 *
		 * @private
		 */
		_onMouseMoveLeftItem() {
			for (let i = 0; i < 60; i++) {
				let first = this.leftAnimationQueue.shift()
				if (first) (this.leftItem._x = first[0]), (this.leftItem._y = first[1])
				else break
			}
			this.leftAnimationId = window.requestAnimationFrame(this._onMouseMoveLeftItem)
		},
		/**
		 * left元素事件 - 处理移动类型 none
		 *
		 * @private
		 *
		 * @param {MouseEvent} event
		 * @param {LeftItem} leftItem
		 */
		_onMouseMoveLeftItem_none(event, leftItem) {
			leftItem._x = event.clientX - this.leftOffsetX
			leftItem._y = event.clientY - this.leftOffsetY
		},
		/**
		 * left元素事件 - 处理移动类型 native
		 *
		 * @private
		 *
		 * @param {MouseEvent} event
		 * @param {LeftItem} leftItem
		 */
		_onMouseMoveLeftItem_native(event, leftItem) {
			leftItem._dragging = true
			let x = event.clientX - this.leftOffsetX
			let y = event.clientY - this.leftOffsetY
			let { left, right, top, bottom } = this.mainRect
			if (x > left && x < right && y > top && y < bottom) {
				//在容器范围内
				let mainItem = new MainItem(leftItem)
				mainItem._inMain = true
				this.onMouseDownMainItem(
					{ clientX: event.clientX, clientY: event.clientY, offsetX: this.leftOffsetX, offsetY: this.leftOffsetY },
					mainItem,
					this.MOVE_EMULATE
				)
				this.onMouseUpLeftItem(event, leftItem)
				this.mainItems.push(mainItem)
			} else {
				//不在容器范围内
				this.leftAnimationQueue.push([x, y])
			}
		},
		/**
		 * left元素事件 - 鼠标松开时拖放结束
		 *
		 * @param {MouseEvent} event
		 * @param {LeftItem} leftItem
		 */
		onMouseUpLeftItem(event, leftItem) {
			if (this.leftAnimationQueue.length > 0) this._onMouseUpLeftItem(event, leftItem)
			else {
				this.clearLeftTimeout()
				window.cancelAnimationFrame(this.leftAnimationId)
				leftItem._dragging = false
				this.leftItem = {}
				this.leftAnimationId = null
			}
		},
		/**
		 * left元素事件 - 鼠标松开时拖放结束，执行剩余移动轨迹队列
		 *
		 * @private
		 *
		 * @param {MouseEvent} event
		 * @param {LeftItem} leftItem
		 */
		_onMouseUpLeftItem(event, leftItem) {
			for (let i = 0; i < 60; i++) {
				let first = this.leftAnimationQueue.shift()
				if (first) (leftItem._x = first[0]), (leftItem._y = first[1])
				else break
			}
			this.onMouseUpLeftItem(event, leftItem)
		},
		/**
		 * 清除定时器
		 *
		 * @returns {Boolean}
		 */
		clearLeftTimeout() {
			if (!this.leftTimeout) return false
			window.clearTimeout(this.leftTimeout)
			this.leftTimeout = null
			return true
		}
	}
}
