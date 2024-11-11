/**
 * 元素对齐方式状态管理
 *
 * text: 文本
 * component: 图标组件
 * disabled: 是否禁用
 * checker: 是否可操作
 * getter: 需修改的值
 */
const toolbarAlignConfig = {
	left: {
		text: '左对齐',
		component: 'mt-icon-align-left',
		disabled: true,
		checker(_, { _lock, _x }) {
			return _lock || _x == 0
		},
		getter() {
			return {
				_x: 0
			}
		}
	},
	right: {
		text: '右对齐',
		component: 'mt-icon-align-right',
		disabled: true,
		checker({ width }, { _lock, _x, _width }) {
			return _lock || _x == width - _width
		},
		getter({ width }, { _width }) {
			return {
				_x: width - _width
			}
		}
	},
	top: {
		text: '顶对齐',
		component: 'mt-icon-align-top',
		disabled: true,
		checker(_, { _lock, _y }) {
			return _lock || _y == 0
		},
		getter() {
			return {
				_y: 0
			}
		}
	},
	bottom: {
		text: '底对齐',
		component: 'mt-icon-align-bottom',
		disabled: true,
		checker({ height }, { _lock, _y, _height }) {
			return _lock || _y == height - _height
		},
		getter({ height }, { _height }) {
			return {
				_y: height - _height
			}
		}
	},
	xCenter: {
		text: '水平居中',
		component: 'mt-icon-align-x-center',
		disabled: true,
		checker({ width }, { _lock, _x, _width }) {
			return _lock || _x == (width - _width) / 2
		},
		getter({ width }, { _width }) {
			return {
				_x: (width - _width) / 2
			}
		}
	},
	yCenter: {
		text: '垂直居中',
		component: 'mt-icon-align-y-center',
		disabled: true,
		checker({ height }, { _lock, _y, _height }) {
			return _lock || _y == (height - _height) / 2
		},
		getter({ height }, { _height }) {
			return {
				_y: (height - _height) / 2
			}
		}
	}
}

export default {
	data() {
		return {
			toolbarUndoList: [], //撤销记录
			UNDO_CHANGE: 'change', //撤销修改。NOTE: 此类操作需先addToolbarUndo后修改，因为需要记录改变前数据
			UNDO_DELETE: 'delete', //撤销删除
			UNDO_ADDNEW: 'addNew', //撤销新增
			toolbarRedoList: [], //重做记录。重做记录只在撤销操作时新增
			REDO_CHANGE: 'change', //重做修改
			REDO_DELETE: 'delete', //重做删除
			REDO_ADDNEW: 'addNew', //重做新增
			toolbarAlignData: Object.keys(toolbarAlignConfig).reduce(
				(data, key) => ((data[key] = { ...toolbarAlignConfig[key] }), delete data[key].getter, delete data[key].checker, data),
				{}
			)
		}
	},
	computed: {
		/**
		 * 工具栏 - 元素对齐 - 是否不可操作
		 *
		 * @returns {Boolean}
		 */
		toolbarCantAlign() {
			let { _mainId, _lock } = this.currentItem
			return _mainId ? _lock : true
		},
		/**
		 * 工具栏 - 锁定 - 是否不可操作
		 *
		 * @returns {Boolean}
		 */
		toolbarCantLock() {
			let { _mainId, _lock } = this.currentItem
			return _mainId ? _lock : true
		},
		/**
		 * 工具栏 - 解锁 - 是否不可操作
		 *
		 * @returns {Boolean}
		 */
		toolbarCantUnlock() {
			let { _mainId, _lock } = this.currentItem
			return _mainId ? !_lock : true
		},
		/**
		 * 工具栏 - 置顶 - 是否不可操作
		 *
		 * @returns {Boolean}
		 */
		toolbarCantPlaceTop() {
			let { zindex, _zindex, _mainId, _lock } = this.currentItem
			return !_mainId || _lock || zindex == _zindex + 1
		},
		/**
		 * 工具栏 - 置底 - 是否不可操作
		 *
		 * @returns {Boolean}
		 */
		toolbarCantPlaceBottom() {
			let { zindex, _zindex, _mainId, _lock } = this.currentItem
			return !_mainId || _lock || zindex == _zindex - 1
		}
	},
	methods: {
		/**
		 * 工具栏 - 重置状态
		 */
		resetToolbarStatus() {
			//还原元素对齐方式的是否可操作。
			//NOTE: 这里本可使用computed，但因为对齐方式的变化会改变xy。而xy是在拖放过重中不断变化的，使用computed会导致大量的无用计算而浪费性能，从而抛弃
			Object.keys(toolbarAlignConfig).forEach((type) => (toolbarAlignConfig[type].disabled = true))
		},
		/**
		 * 工具栏 - 更新状态
		 */
		updateToolbarStatus(mainItem) {
			this.updateToolbarAlignStatus(mainItem)
		},
		/**
		 * 工具栏 - 更新元素对齐可操作状态
		 *
		 * @param {MainItem} mainItem
		 */
		updateToolbarAlignStatus(mainItem) {
			Object.keys(toolbarAlignConfig).forEach(
				(alignType) => (toolbarAlignConfig[alignType].disabled = toolbarAlignConfig[alignType].checker(this.currentMainSizer, mainItem))
			)
		},
		/**
		 * 添加撤销项
		 *
		 * @param {String} undoType
		 * @param {MainItem} mainItem
		 * @param {MainItem} originalMainItem
		 */
		addToolbarUndo(undoType, mainItem, originalMainItem) {
			this.toolbarUndoList.unshift([undoType, mainItem, originalMainItem || { ...mainItem }])
		},
		/**
		 * 添加重做项
		 *
		 * @param {String} undoType
		 * @param {Mainitem} mainItem
		 * @param {MainItem} originalMainItem
		 */
		addToolbarRedo(undoType, mainItem, originalMainItem) {
			this.toolbarRedoList.unshift([undoType, mainItem, originalMainItem || { ...mainItem }])
		},
		/**
		 * 工具栏事件 - 撤销
		 *
		 * @returns
		 */
		onClickToolbarUndo() {
			let undoItem = this.toolbarUndoList.shift()
			if (!undoItem) return
			//addToolbarRedo: 添加重做项，达到 撤销 <-> 重做 的循环操作
			switch (undoItem[0]) {
				//change
				case this.UNDO_CHANGE:
					this.addToolbarRedo(this.REDO_CHANGE, undoItem[1])
					Object.assign(undoItem[1], undoItem[2])
					break
				//delete
				case this.UNDO_DELETE:
					this.addToolbarRedo(this.REDO_ADDNEW, undoItem[1])
					this.mainItems.push(undoItem[2])
					break
				//addNew
				case this.UNDO_ADDNEW:
					this.addToolbarRedo(this.REDO_DELETE, undoItem[1])
					this.deleteMainItem(undoItem[1])
					break
			}
			this.updateToolbarStatus(undoItem[1])
		},
		/**
		 * 工具栏事件 - 重做
		 *
		 * @returns
		 */
		onClickToolbarRedo() {
			let redoItem = this.toolbarRedoList.shift()
			if (!redoItem) return
			//addToolbarUndo: 添加撤销项，达到 重做 <-> 撤销 的循环操作
			switch (redoItem[0]) {
				//change
				case this.UNDO_CHANGE:
					this.addToolbarUndo(this.UNDO_CHANGE, redoItem[1])
					Object.assign(redoItem[1], redoItem[2])
					break
				//delete
				case this.UNDO_DELETE:
					this.addToolbarUndo(this.UNDO_DELETE, redoItem[1])
					this.mainItems.push(redoItem[2])
					break
				//addNew
				case this.UNDO_ADDNEW:
					this.addToolbarUndo(this.UNDO_ADDNEW, redoItem[1])
					this.deleteMainItem(redoItem[1])
					break
			}
			this.updateToolbarStatus(redoItem[1])
		},
		/**
		 * 工具栏事件 - 加锁
		 *
		 * @returns
		 */
		onClickToolbarLock() {
			this.addToolbarUndo(this.UNDO_CHANGE, this.currentItem)
			this.currentItem._lock = true
			this.notifySuccess(`已锁定"${this.currentItem.materialName}"`)
		},
		/**
		 * 工具栏事件 - 解锁
		 *
		 * @returns
		 */
		onClickToolbarUnlock() {
			this.addToolbarUndo(this.UNDO_CHANGE, this.currentItem)
			this.currentItem._lock = false
			this.notifySuccess(`已解锁"${this.currentItem.materialName}"`)
		},
		/**
		 * 工具栏事件 - 置顶
		 *
		 * @returns
		 */
		onClickToolbarPlaceTop() {
			this.addToolbarUndo(this.UNDO_CHANGE, this.currentItem)
			this.currentItem.zindex = this.currentItem._zindex + 1
		},
		/**
		 * 工具栏事件 - 置底
		 *
		 * @returns
		 */
		onClickToolbarPlaceBottom() {
			this.addToolbarUndo(this.UNDO_CHANGE, this.currentItem)
			this.currentItem.zindex = this.currentItem._zindex - 1
		},
		/**
		 * 工具栏事件 - 元素对齐
		 *
		 * @param {String} alignType
		 * @returns
		 */
		onClickToolbarAlign(alignType) {
			this.addToolbarUndo(this.UNDO_CHANGE, this.currentItem)
			Object.assign(this.currentItem, toolbarAlignConfig[alignType].getter(this.currentMainSizer, this.currentItem))
			this.updateToolbarAlignStatus(this.currentItem)
		}
	}
}
