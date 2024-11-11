export default {
	data() {
		return {
			resizeOffsetX: 0,
			resizeOffsetY: 0,
			resizeRightMinX: 0,
			resizeRightMinY: 0,
			resizeRightMaxX: 0,
			resizeRightMaxY: 0,
			resizeLeftMaxX: 0,
			resizeLeftMaxY: 0,
			resizeItems: [],
			resizeItem: {},
			originalResizeItem: null,
			resizeTimeout: null,
			resizeAnimationId: null,
			resizeAnimationQueue: [],
			//resize类型
			resizeType: 'none',
			RESIZE_NONE: 'none',
			RESIZE_LEFT: 'left',
			RESIZE_RIGHT: 'right',
			RESIZE_TOP: 'top',
			RESIZE_BOTTOM: 'bottom',
			RESIZE_TOP_LEFT: 'top-left',
			RESIZE_TOP_RIGHT: 'top-right',
			RESIZE_BOTTOM_LEFT: 'bottom-left',
			RESIZE_BOTTOM_RIGHT: 'bottom-right'
		}
	},
	methods: {
		onMouseDownResizeItem(event, resizeItem, resizeType) {
			this.clearSelection(true)
			if (this.clearResizeTimeout()) return false
			this.currentItem = resizeItem
			this.resizeTimeout = window.setTimeout(() => this._onMouseDownResizeItem(event, resizeItem, resizeType), 1000 / 60)
		},
		_onMouseDownResizeItem(event, resizeItem, resizeType) {
			if (!this.resizeTimeout) return
			this.updateMainRect()
			this.resizeOffsetX = event.offsetX + this.mainRect.left - this.mainRect.scrollLeft
			this.resizeOffsetY = event.offsetY + this.mainRect.top - this.mainRect.scrollTop
			this.resizeRightMinX = resizeItem._x + resizeItem._originalWidth
			this.resizeRightMinY = resizeItem._y + resizeItem._originalHeight
			this.resizeRightMaxX = this.currentMainSizer._width
			this.resizeRightMaxY = this.currentMainSizer._height
			this.resizeLeftMaxX = resizeItem._x + resizeItem._width - resizeItem._originalWidth
			this.resizeLeftMaxY = resizeItem._y + resizeItem._height - resizeItem._originalHeight
			this.resizeType = resizeType
			this.resizeItem = resizeItem
			this.originalResizeItem = { ...resizeItem }
			document.body.classList.add(`mt-cursor-${this.resizeType}`)
			this.resizeAnimationId = window.requestAnimationFrame(this._onMouseMoveResizeItem)
		},
		_onMouseMoveResizeItem() {
			for (let i = 0; i < 60; i++) {
				let first = this.resizeAnimationQueue.shift()
				if (first) Object.assign(this.resizeItem, first)
				else break
			}
			this.resizeAnimationId = window.requestAnimationFrame(this._onMouseMoveResizeItem)
		},
		//RESIZE_LEFT
		_onMouseMoveResizeItem_left(event, resizeItem) {
			resizeItem._resizing = true
			let x = event.clientX - this.resizeOffsetX
			let _x = Math.max(0, Math.min(x, this.resizeLeftMaxX))
			let _width = resizeItem._originalWidth + this.resizeLeftMaxX - _x
			this.resizeAnimationQueue.push({ _x, _width })
		},
		//RESIZE_RIGHT
		_onMouseMoveResizeItem_right(event, resizeItem) {
			resizeItem._resizing = true
			let x = Math.max(this.resizeRightMinX, Math.min(event.clientX - this.resizeOffsetX, this.resizeRightMaxX))
			let _width = resizeItem._originalWidth + x - this.resizeRightMinX
			this.resizeAnimationQueue.push({ _width })
		},
		//RESIZE_TOP
		_onMouseMoveResizeItem_top(event, resizeItem) {
			resizeItem._resizing = true
			let y = event.clientY - this.resizeOffsetY
			let _y = Math.max(0, Math.min(y, this.resizeLeftMaxY))
			let _height = resizeItem._originalHeight + this.resizeLeftMaxY - _y
			this.resizeAnimationQueue.push({ _y, _height })
		},
		//RESIZE_BOTTOM
		_onMouseMoveResizeItem_bottom(event, resizeItem) {
			resizeItem._resizing = true
			let y = Math.max(this.resizeRightMinY, Math.min(event.clientY - this.resizeOffsetY, this.resizeRightMaxY))
			let _height = resizeItem._originalHeight + y - this.resizeRightMinY
			this.resizeAnimationQueue.push({ _height })
		},
		//RESIZE_TOP_LEFT
		'_onMouseMoveResizeItem_top-left'(event, resizeItem) {
			resizeItem._resizing = true
			let x = event.clientX - this.resizeOffsetX
			let y = event.clientY - this.resizeOffsetY
			let _x = Math.max(0, Math.min(x, this.resizeLeftMaxX))
			let _y = Math.max(0, Math.min(y, this.resizeLeftMaxY))
			let _width = resizeItem._originalWidth + this.resizeLeftMaxX - _x
			let _height = resizeItem._originalHeight + this.resizeLeftMaxY - _y
			this.resizeAnimationQueue.push({ _x, _y, _width, _height })
		},
		//RESIZE_TOP_RIGHT
		'_onMouseMoveResizeItem_top-right'(event, resizeItem) {
			resizeItem._resizing = true
			let x = Math.max(this.resizeRightMinX, Math.min(event.clientX - this.resizeOffsetX, this.resizeRightMaxX))
			let y = event.clientY - this.resizeOffsetY
			let _y = Math.max(0, Math.min(y, this.resizeLeftMaxY))
			let _width = resizeItem._originalWidth + x - this.resizeRightMinX
			let _height = resizeItem._originalHeight + this.resizeLeftMaxY - _y
			this.resizeAnimationQueue.push({ _y, _width, _height })
		},
		//RESIZE_BOTTOM_LEFT
		'_onMouseMoveResizeItem_bottom-left'(event, resizeItem) {
			resizeItem._resizing = true
			let x = event.clientX - this.resizeOffsetX
			let y = Math.max(this.resizeRightMinY, Math.min(event.clientY - this.resizeOffsetY, this.resizeRightMaxY))
			let _x = Math.max(0, Math.min(x, this.resizeLeftMaxX))
			let _width = resizeItem._originalWidth + this.resizeLeftMaxX - _x
			let _height = resizeItem._originalHeight + y - this.resizeRightMinY
			this.resizeAnimationQueue.push({ _x, _width, _height })
		},
		//RESIZE_BOTTOM_RIGHT
		'_onMouseMoveResizeItem_bottom-right'(event, resizeItem) {
			resizeItem._resizing = true
			let y = Math.max(this.resizeRightMinY, Math.min(event.clientY - this.resizeOffsetY, this.resizeRightMaxY))
			let x = Math.max(this.resizeRightMinX, Math.min(event.clientX - this.resizeOffsetX, this.resizeRightMaxX))
			let _width = resizeItem._originalWidth + x - this.resizeRightMinX
			let _height = resizeItem._originalHeight + y - this.resizeRightMinY
			this.resizeAnimationQueue.push({ _width, _height })
		},
		onMouseUpResizeItem(event, resizeItem) {
			if (this.resizeAnimationQueue.length > 0) this._onMouseUpResizeItem(event, resizeItem)
			else {
				this.clearResizeTimeout()
				window.cancelAnimationFrame(this.mainAnimationId)
				this.calcMainItemCoord(resizeItem)
				this.updateToolbarStatus(resizeItem)
				if (resizeItem._resizing) this.addToolbarUndo(this.UNDO_CHANGE, resizeItem, this.originalResizeItem)
				document.body.classList.remove(`mt-cursor-${this.resizeType}`)
				resizeItem._resizing = false
				this.resizeType = this.RESIZE_NONE
				this.resizeItem = {}
				this.originalResizeItem = null
			}
		},
		_onMouseUpResizeItem(event, resizeItem) {
			for (let i = 0; i < 60; i++) {
				let first = this.resizeAnimationQueue.shift()
				if (first) Object.assign(resizeItem, first)
				else break
			}
			this.onMouseUpResizeItem(event, resizeItem)
		},
		clearResizeTimeout() {
			if (!this.resizeTimeout) return false
			window.clearTimeout(this.resizeTimeout)
			this.resizeTimeout = null
			return true
		}
	}
}
