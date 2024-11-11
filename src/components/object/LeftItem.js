export function LeftItem(leftItem = {}) {
	this.id = leftItem.id //素材唯一标识id
	this.name = leftItem.name //素材名称
	this.image = leftItem.image //素材说明图
	this.typeId = leftItem.typeId //素材类型数值
	this.typeName = leftItem.typeName //素材类型中文
	this.typeLevel = leftItem.typeLevel //素材层级，越高在越上面
	this.resizable = leftItem.resizable || false //素材是否可自行调整大小
	this._leftId = this.id //唯一标识
	this._dragging = false //移动中
	this._mainWidth = 0 //在容器中宽
	this._mainHeight = 0 //在容器中高
	this._width = 0 //素材宽
	this._height = 0 //素材高
	this._x = 0 //素材x
	this._y = 0 //素材y
}
