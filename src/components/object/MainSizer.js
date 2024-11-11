export function MainSizer(width = 0, height = 0, xScale = 0, yScale = 0) {
	this.width = width
	this.height = height
	this.xScale = xScale
	this.yScale = yScale
	this.horizontal = width >= height
	this.vertical = width < height
	this._width = width * xScale
	this._height = height * yScale
}
