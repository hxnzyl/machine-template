export default {
	data() {
		return {
			rightKeyword: '',
			rightTypeId: null
		}
	},
	methods: {
		filterRightKeyword(item) {
			return (
				(!this.rightKeyword || (item.name || '').includes(this.rightKeyword)) && (!this.rightTypeId || item.typeId === this.rightTypeId)
			)
		}
	}
}
