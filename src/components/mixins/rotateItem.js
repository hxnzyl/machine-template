export default {
	data() {
		return {
			rotateOffsetX: 0,
			rotateOffsetY: 0,
			rotateRightMinX: 0,
			rotateRightMinY: 0,
			rotateRightMaxX: 0,
			rotateRightMaxY: 0,
			rotateLeftMaxX: 0,
			rotateLeftMaxY: 0,
			rotateItems: [],
			rotateItem: {},
			originalRotateItem: null,
			rotateTimeout: null,
			rotateAnimationId: null,
			rotateAnimationQueue: [],
			//rotate类型
			rotateType: 'none',
			ROTATE_NONE: 'none',
			ROTATE_ROUND: 'round'
		}
	},
	methods: {
		onMouseDownRotateItem(event, rotateItem, rotateType) {
			this.clearSelection(true)
			if (this.clearRotateTimeout()) return false
			this.currentItem = rotateItem
			this.rotateTimeout = window.setTimeout(() => this._onMouseDownRotateItem(event, rotateItem, rotateType), 1000 / 60)
		},
		_onMouseDownRotateItem(event, rotateItem, rotateType) {
			if (!this.rotateTimeout) return
			this.updateMainRect()
			this.rotateOffsetX = event.offsetX + this.mainRect.left - this.mainRect.scrollLeft
			this.rotateOffsetY = event.offsetY + this.mainRect.top - this.mainRect.scrollTop
			this.rotateRightMinX = rotateItem._x + rotateItem._originalWidth
			this.rotateRightMinY = rotateItem._y + rotateItem._originalHeight
			this.rotateRightMaxX = this.currentMainSizer._width
			this.rotateRightMaxY = this.currentMainSizer._height
			this.rotateLeftMaxX = rotateItem._x + rotateItem._width - rotateItem._originalWidth
			this.rotateLeftMaxY = rotateItem._y + rotateItem._height - rotateItem._originalHeight
			this.rotateType = rotateType
			this.rotateItem = rotateItem
			this.originalRotateItem = { ...rotateItem }
			document.body.classList.add(`mt-cursor-${this.rotateType}`)
			this.rotateAnimationId = window.requestAnimationFrame(this._onMouseMoveRotateItem)
		},
		_onMouseMoveRotateItem() {
			for (let i = 0; i < 60; i++) {
				let first = this.rotateAnimationQueue.shift()
				if (first) Object.assign(this.rotateItem, first)
				else break
			}
			this.rotateAnimationId = window.requestAnimationFrame(this._onMouseMoveRotateItem)
		},
		//ROTATE_ROUND
		_onMouseMoveRotateItem_round(event, rotateItem) {
			rotateItem._rotating = true
			let x = event.clientX - this.rotateOffsetX
			let _x = Math.max(0, Math.min(x, this.rotateLeftMaxX))
			let _width = rotateItem._originalWidth + this.rotateLeftMaxX - _x
			this.rotateAnimationQueue.push({ _x, _width })
		},
		onMouseUpRotateItem(event, rotateItem) {
			if (this.rotateAnimationQueue.length > 0) this._onMouseUpRotateItem(event, rotateItem)
			else {
				this.clearRotateTimeout()
				window.cancelAnimationFrame(this.mainAnimationId)
				this.calcMainItemCoord(rotateItem)
				this.updateToolbarStatus(rotateItem)
				if (rotateItem._rotating) this.addToolbarUndo(this.UNDO_CHANGE, rotateItem, this.originalRotateItem)
				document.body.classList.remove(`mt-cursor-${this.rotateType}`)
				rotateItem._rotating = false
				this.rotateType = this.ROTATE_NONE
				this.rotateItem = {}
			}
		},
		_onMouseUpRotateItem(event, rotateItem) {
			for (let i = 0; i < 60; i++) {
				let first = this.rotateAnimationQueue.shift()
				if (first) Object.assign(rotateItem, first)
				else break
			}
			this.onMouseUpRotateItem(event, rotateItem)
		},
		clearRotateTimeout() {
			if (!this.rotateTimeout) return false
			window.clearTimeout(this.rotateTimeout)
			this.rotateTimeout = null
			return true
		}
	}
}
