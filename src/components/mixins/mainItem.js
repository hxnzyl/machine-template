export default {
	data() {
		return {
			mainSizeId: null,
			mainOffsetX: 0,
			mainOffsetY: 0,
			mainMinX: 0,
			mainMinY: 0,
			mainMaxX: 0,
			mainMaxY: 0,
			mainRect: {},
			mainItem: {},
			originalMainItem: null,
			currentItem: {},
			mainMove: 'none',
			mainTimeout: null,
			mainItems: [
				{
					_dragging: false,
					_resizing: false,
					_inMain: true,
					_mainId: 1660619022794,
					_originalWidth: 199,
					_originalHeight: 451,
					_width: 199,
					_height: 451,
					_zindex: 500,
					_x: 582,
					_y: 146,
					_outX: 0,
					_outY: 0,
					_lock: false,
					materialId: 2,
					materialName: '皮卡丘卡面290*658',
					materialImage: 'https://qiniush.heysee.cn/1646906201611.png',
					typeId: 1,
					typeName: '商品位',
					width: 290,
					height: 658,
					zindex: 500,
					x: 849,
					y: 214
				}
			],
			mainSizePopover: false,
			mainAnimationId: null,
			mainAnimationQueue: []
		}
	},
	watch: {
		mainSizeList: {
			immediate: true,
			handler() {
				this.updateMainSize()
			}
		}
	},
	methods: {
		updateMainSize() {
			let size = this.mainSizeList.find((size) => size.isDefault) || this.mainSizeList[0]
			if (size) this.mainSizeId = size.id
			else console.warn('updateMainSize: size not found.')
		},
		updateMainRect() {
			let mainEl = this.$refs.mainContainer.$el
			let { x, y, left, right, top, bottom } = mainEl.getBoundingClientRect()
			this.mainRect = { x, y, left, right, top, bottom, scrollTop: mainEl.scrollTop, scrollLeft: mainEl.scrollLeft }
		},
		/**
		 * 计算模板元素坐标
		 * @param {Object} mainItem
		 */
		calcMainItemCoord(mainItem) {
			let { width, height, xScale, yScale } = this.currentMainSizer
			mainItem.x = Math.round((this.currentMainSize.width * (mainItem._x / xScale)) / width, 2)
			mainItem.y = Math.round((this.currentMainSize.height * (mainItem._y / yScale)) / height, 2)
		},
		onMouseDownMainItem(event, mainItem, moveType) {
			this.clearSelection(true)
			if (this.clearMainTimeout()) return false
			this.currentItem = mainItem
			if (moveType == this.MOVE_NATIVE)
				this.mainTimeout = window.setTimeout(() => this._onMouseDownMainItem(event, mainItem, moveType), 1000 / 60)
			else this._onMouseDownMainItem(event, mainItem, moveType)
		},
		_onMouseDownMainItem(event, mainItem, moveType) {
			if (moveType == this.MOVE_NATIVE && !this.mainTimeout) return
			this.updateMainRect()
			let gtWidth = mainItem.width > this.currentMainSize.width
			let gtHeight = mainItem.height > this.currentMainSize.height
			this.mainOffsetX = event.offsetX + this.mainRect.left - this.mainRect.scrollLeft
			this.mainOffsetY = event.offsetY + this.mainRect.top - this.mainRect.scrollTop
			//素材高宽大于容器高宽时，素材的最小坐标可为负数
			this.mainMinX = gtWidth ? -mainItem._width : 0
			this.mainMinY = gtHeight ? -mainItem._height : 0
			this.mainMaxX = this.currentMainSizer._width + (gtWidth ? mainItem._width : -mainItem._width)
			this.mainMaxY = this.currentMainSizer._height + (gtHeight ? mainItem._height : -mainItem._height)
			this._onMouseMoveMainItem_none(event, mainItem)
			this.mainMove = moveType
			this.mainItem = mainItem
			this.originalMainItem = { ...mainItem }
			this.mainAnimationId = window.requestAnimationFrame(this._onMouseMoveMainItem)
		},
		_onMouseMoveMainItem() {
			for (let i = 0; i < 60; i++) {
				let first = this.mainAnimationQueue.shift()
				if (first) Object.assign(this.mainItem, first)
				else break
			}
			this.mainAnimationId = window.requestAnimationFrame(this._onMouseMoveMainItem)
		},
		_onMouseMoveMainItem_none(event, mainItem) {
			mainItem._x = Math.max(0, Math.min(event.clientX - this.mainOffsetX, this.mainMaxX))
			mainItem._y = Math.max(0, Math.min(event.clientY - this.mainOffsetY, this.mainMaxY))
		},
		_onMouseMoveMainItem_native(event, mainItem) {
			mainItem._dragging = true
			let x = event.clientX - this.mainOffsetX
			let y = event.clientY - this.mainOffsetY
			if (x < this.mainMinX || x > this.mainMaxX || y < this.mainMinY || y > this.mainMaxY) {
				if (this.canMoveDelete) {
					mainItem._outMain = true
					let { left, top, scrollLeft, scrollTop } = this.mainRect
					this.mainAnimationQueue.push({ _outX: x + left - scrollLeft, _outY: y + top - scrollTop })
					let { width, height } = this.currentMainSizer
					let x2 = width / 12 //移出容器宽度的1/12
					let y2 = height / 12 //移出容器高度的1/12
					if (x < -x2 || x > this.mainMaxX + x2 || y < -y2 || y > this.mainMaxY + y2) return (mainItem._inMain = false)
				}
			} else (mainItem._inMain = true), (mainItem._outMain = false)
			this.mainAnimationQueue.push({
				_x: Math.max(this.mainMinX, Math.min(x, this.mainMaxX)),
				_y: Math.max(this.mainMinY, Math.min(y, this.mainMaxY))
			})
		},
		_onMouseMoveMainItem_emulate(event, mainItem) {
			this._onMouseMoveMainItem_native(event, mainItem)
		},
		onMouseUpMainItem(event, mainItem) {
			if (this.mainAnimationQueue.length > 0) this._onMouseUpMainItem(event, mainItem)
			else {
				this.clearMainTimeout()
				window.cancelAnimationFrame(this.mainAnimationId)
				this.calcMainItemCoord(mainItem)
				this.updateToolbarStatus(mainItem)
				if (!mainItem._inMain) this.deleteMainItem(mainItem), this.addToolbarUndo(this.UNDO_DELETE, mainItem, this.originalMainItem)
				else if (mainItem._dragging) this.addToolbarUndo(this.UNDO_CHANGE, mainItem, this.originalMainItem)
				mainItem._dragging = false
				this.mainItem = {}
				this.originalMainItem = null
				// this.currentItem = {}
			}
		},
		_onMouseUpMainItem(event, mainItem) {
			for (let i = 0; i < 60; i++) {
				let first = this.mainAnimationQueue.shift()
				if (first) (mainItem._x = first[0]), (mainItem._y = first[1])
				else break
			}
			this.onMouseUpMainItem(event, mainItem)
		},
		onClickDeleteMainItem(event, mainItem) {
			this.deleteMainItem(mainItem)
			this.addToolbarUndo(this.UNDO_DELETE, mainItem)
		},
		onClickCopyMainItem(event, mainItem) {
			let { _width, _height } = this.currentMainSizer
			let copyItem = { ...mainItem, _mainId: Date.now(), zindex: mainItem.zindex + 1 }
			copyItem._x = Math.max(0, Math.min(mainItem._x + 20, _width - mainItem._width))
			copyItem._y = Math.max(0, Math.min(mainItem._y + 20, _height - mainItem._height))
			this.calcMainItemCoord(copyItem)
			this.mainItems.push(copyItem)
			this.addToolbarUndo(this.UNDO_ADDNEW, copyItem)
		},
		onClickChangeMainSize(event, mainSize) {
			if (this.mainSizeId == mainSize.id) return
			this.mainSizeId = mainSize.id
			this.mainSizePopover = false
			this.mainItems = []
		},
		clearMainTimeout() {
			if (!this.mainTimeout) return false
			window.clearTimeout(this.mainTimeout)
			this.mainTimeout = null
			return true
		},
		deleteMainItem(mainItem, mainIndex) {
			if (mainIndex == null) mainIndex = this.mainItems.findIndex((e) => e._mainId == mainItem._mainId)
			this.mainItems.splice(mainIndex, 1)
		}
	}
}
