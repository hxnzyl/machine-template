export function MainItem(leftItem = {}) {
	//私有键值对
	this._dragging = false
	this._resizing = false
	this._inMain = leftItem.id ? true : false
	this._outMain = false
	this._mainId = leftItem.id ? Date.now() : null
	this._originalWidth = leftItem._mainWidth || 0 //原宽，不参与运算
	this._originalHeight = leftItem._mainHeight || 0 //原高，不参与运算
	this._zindex = leftItem.typeLevel || 0 //层级
	this._width = this._originalWidth //宽，实时变化
	this._height = this._originalHeight //高，实时变化
	this._outX = 0
	this._outY = 0
	this._x = 0
	this._y = 0
	//toolbar功能参数
	this._lock = false //锁定状态：锁定后不可对元素进行任何操作
	//实体键值对
	this.materialId = leftItem.id || null //素材id
	this.materialName = leftItem.name || null //素材名称
	this.materialImage = leftItem.image || '' //素材图片
	this.typeId = leftItem.typeId || null //素材类型id
	this.typeName = leftItem.typeName || '' //素材类型名称
	this.zindex = leftItem.typeLevel || 0
	this.width = leftItem._width || 0
	this.height = leftItem._height || 0
	this.x = 0
	this.y = 0
}
