<template>
	<el-container class="mt machine-layout" ref="mt" :style="`width:${str2unit(width)};height:${str2unit(height)}`">
		<el-aside class="mt-left" ref="left" :width="leftWidth">
			<div class="mt-left-header">
				<el-input v-model="leftKeyword" placeholder="素材名称" size="small" clearable>
					<el-select v-model="leftTypeId" slot="prepend" placeholder="素材类型" style="min-width: 100px" clearable>
						<el-option v-for="(typeInfo, key) in leftTypeList" :key="key" :label="typeInfo.typeName" :value="typeInfo.typeId"></el-option>
					</el-select>
					<el-button slot="append" icon="el-icon-search"></el-button>
				</el-input>
			</div>
			<div class="mt-left-container mt-scrollbar">
				<el-collapse :value="Object.keys(currentLeftGroup)">
					<el-collapse-item v-for="(items, typeId) in currentLeftGroup" :key="typeId" :name="typeId" :title="items[0].typeName">
						<div class="mt-left-list" :style="`width: ${currentLeftWidth}px`">
							<div
								v-for="(item, index) in items"
								:key="index"
								class="mt-left-item"
								:title="item.name"
								:style="`width: ${currentLeftItemW}px; height: ${currentLeftItemW + 30}px; margin-left: ${!index || index % leftItemCol === 0 ? 0 : 10}px`"
							>
								<img
									:src="item.image"
									:alt="item.name"
									@mousedown.left="onMouseDownLeftItem($event, item, MOVE_NATIVE)"
									:style="`max-width: ${currentLeftItemW}px; max-height: ${currentLeftItemW}px`"
									unselectable="on"
									draggable="false"
								/>
								<div class="mt-left-clone" :class="{ 'mt-dragging': item._dragging }" :style="`transform:translate3d(${item._x}px,${item._y}px,1px)`">
									<img
										:src="item.image"
										:ref="`mt-left-clone-${item.id}`"
										:style="`width:${item._mainWidth}px;height:${item._mainHeight}px;`"
										unselectable="on"
										draggable="false"
									/>
									<el-tag class="mt-left-clone-coord">X:{{ item._x }},Y:{{ item._y }}</el-tag>
								</div>
								<div v-if="leftShowName" class="mt-left-name mt-line-1">{{ item.name }}</div>
							</div>
						</div>
					</el-collapse-item>
				</el-collapse>
			</div>
		</el-aside>
		<el-container class="mt-main" ref="main" :style="`width:calc(100% - ${str2unit(leftWidth)} - ${str2unit(rightWidth)});height:100%`">
			<el-header class="mt-main-header" ref="mainHeader">
				<el-popover v-model="mainSizePopover" placement="bottom" trigger="click" popper-class="mt-no-padding">
					<div class="mt-main-sizer mt-scrollbar">
						<div
							v-for="(size, key) in mainSizeList"
							:key="key"
							@click="onClickChangeMainSize($event, size)"
							class="mt-main-sizer-card mt-transparent"
							:class="{ active: size.id == mainSizeId }"
							:style="`height:${200 / (size.width / size.height)}px;background-size:cover;${size.image ? `;background-image:url(${size.image})` : ''}`"
						>
							{{ size.width }} x {{ size.height }}
						</div>
					</div>
					<el-tooltip slot="reference" content="选择面板大小" placement="bottom">
						<div class="mt-toolbar mt-toolbar-size mt-main-target">
							<mt-icon-magic />
						</div>
					</el-tooltip>
				</el-popover>
				<div class="mt-divider"></div>
				<el-tooltip content="撤销(Ctrl+Z)" placement="bottom">
					<div class="mt-toolbar mt-toolbar-undo mt-main-target" :class="{ 'mt-disabled': toolbarUndoList.length == 0 }" @click="onClickToolbarUndo">
						<mt-icon-undo />
					</div>
				</el-tooltip>
				<el-tooltip content="恢复(Ctrl+Y)" placement="bottom">
					<div class="mt-toolbar mt-toolbar-redo mt-main-target" :class="{ 'mt-disabled': toolbarRedoList.length == 0 }" @click="onClickToolbarRedo">
						<mt-icon-redo />
					</div>
				</el-tooltip>
				<div class="mt-divider"></div>
				<el-tooltip content="元素对齐" placement="bottom">
					<el-dropdown trigger="click" @command="onClickToolbarAlign" :disabled="toolbarCantAlign">
						<div class="mt-toolbar mt-toolbar-align mt-main-target" :class="{ 'mt-disabled': toolbarCantAlign }">
							<component :is="toolbarAlignData.left.component"></component>
							<i class="el-icon-arrow-down el-icon--right"></i>
						</div>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item
								v-for="(alignInfo, alignType) in toolbarAlignData"
								:key="alignType"
								:command="alignType"
								:disabled="alignInfo.disabled"
								class="is-align-middle el-row--flex mt-main-target"
							>
								<component :is="alignInfo.component"></component>
								<span style="margin-left: 10px">{{ alignInfo.text }}</span>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-tooltip>
				<div class="mt-divider"></div>
				<el-tooltip content="锁定" placement="bottom">
					<i
						class="el-icon-lock mt-toolbar mt-toolbar-lock mt-main-target"
						:class="{ 'mt-disabled': toolbarCantLock }"
						@click="toolbarCantLock || onClickToolbarLock()"
					></i>
				</el-tooltip>
				<el-tooltip content="解锁" placement="bottom">
					<i
						class="el-icon-unlock mt-toolbar mt-toolbar-unlock mt-main-target"
						:class="{ 'mt-disabled': toolbarCantUnlock }"
						@click="toolbarCantUnlock || onClickToolbarUnlock()"
					></i>
				</el-tooltip>
				<div class="mt-divider"></div>
				<el-tooltip content="置顶" placement="bottom">
					<div
						class="mt-toolbar mt-toolbar-top mt-main-target"
						:class="{ 'mt-disabled': toolbarCantPlaceTop }"
						@click="toolbarCantPlaceTop || onClickToolbarPlaceTop()"
					>
						<mt-icon-place-top />
					</div>
				</el-tooltip>
				<el-tooltip content="置底" placement="bottom">
					<div
						class="mt-toolbar mt-toolbar-unlock mt-main-target"
						:class="{ 'mt-disabled': toolbarCantPlaceBottom }"
						@click="toolbarCantPlaceBottom || onClickToolbarPlaceBottom()"
					>
						<mt-icon-place-bottom />
					</div>
				</el-tooltip>
			</el-header>
			<el-main
				class="mt-main-container mt-scrollbar mt-transparent"
				ref="mainContainer"
				:style="`width:${currentMainSizer.width}px;height:${currentMainSizer.height}px`"
				:class="{ 'mt-horizontal': currentMainSizer.horizontal, 'mt-vertical': currentMainSizer.vertical }"
			>
				<div class="mt-main-list" :style="`width:${currentMainSizer._width}px;height:${currentMainSizer._height}px`">
					<div
						v-for="item in mainItems"
						:key="item._mainId"
						v-show="item._inMain"
						class="mt-main-item mt-main-target"
						:ref="'mt-main-item-' + item._mainId"
						:class="{ 'mt-dragging': item._dragging, 'mt-resizing': item._resizing, 'mt-lock': item._lock }"
						:style="`transform:translate3d(${item._x}px,${item._y}px,1px);width:${item._width}px;height:${item._height + 40}px;z-index:${item.zindex}`"
					>
						<div class="mt-main-item-dropped" :style="`width:${item._width}px;height:${item._height}px;`">
							<div
								:style="`width:${item._width}px;height:${item._height}px;`"
								@mousedown.left="onMouseDownMainItem($event, item, MOVE_NATIVE)"
								unselectable="on"
								draggable="false"
							>
								<img :src="item.materialImage" unselectable="on" draggable="false" style="width: 100%; height: 100%" />
							</div>
							<div class="mt-main-item-action mt-copy" :style="`z-index:${item.zindex + 1}`">
								<el-tooltip content="复制此素材" placement="top">
									<el-button type="primary" size="mini" icon="el-icon-copy-document" @click.stop="onClickCopyMainItem($event, item)" circle></el-button>
								</el-tooltip>
							</div>
							<div class="mt-main-item-action mt-delete" :style="`z-index:${item.zindex + 1}`">
								<el-tooltip content="删除此素材" placement="top">
									<el-button type="danger" size="mini" icon="el-icon-delete" @click.stop="onClickDeleteMainItem($event, item)" circle></el-button>
								</el-tooltip>
							</div>
							<div class="mt-gridlines mt-gridlines-left" :style="`z-index:${item.zindex + 1}`"></div>
							<div class="mt-gridlines mt-gridlines-right" :style="`z-index:${item.zindex + 1}`"></div>
							<div class="mt-gridlines mt-gridlines-top" :style="`z-index:${item.zindex + 1}`"></div>
							<div class="mt-gridlines mt-gridlines-bottom" :style="`z-index:${item.zindex + 1}`"></div>
							<div
								class="mt-resizable mt-resizable-left"
								:style="`z-index:${item.zindex + 1}`"
								@mousedown.left="onMouseDownResizeItem($event, item, RESIZE_LEFT)"
							></div>
							<div
								class="mt-resizable mt-resizable-right"
								:style="`z-index:${item.zindex + 1}`"
								@mousedown.left="onMouseDownResizeItem($event, item, RESIZE_RIGHT)"
							></div>
							<div
								class="mt-resizable mt-resizable-top"
								:style="`z-index:${item.zindex + 1}`"
								@mousedown.left="onMouseDownResizeItem($event, item, RESIZE_TOP)"
							></div>
							<div
								class="mt-resizable mt-resizable-bottom"
								:style="`z-index:${item.zindex + 1}`"
								@mousedown.left="onMouseDownResizeItem($event, item, RESIZE_BOTTOM)"
							></div>
							<div
								class="mt-resizable mt-resizable-top-left"
								:style="`z-index:${item.zindex + 1}`"
								@mousedown.left="onMouseDownResizeItem($event, item, RESIZE_TOP_LEFT)"
							></div>
							<div
								class="mt-resizable mt-resizable-top-right"
								:style="`z-index:${item.zindex + 1}`"
								@mousedown.left="onMouseDownResizeItem($event, item, RESIZE_TOP_RIGHT)"
							></div>
							<div
								class="mt-resizable mt-resizable-bottom-left"
								:style="`z-index:${item.zindex + 1}`"
								@mousedown.left="onMouseDownResizeItem($event, item, RESIZE_BOTTOM_LEFT)"
							></div>
							<div
								class="mt-resizable mt-resizable-bottom-right"
								:style="`z-index:${item.zindex + 1}`"
								@mousedown.left="onMouseDownResizeItem($event, item, RESIZE_BOTTOM_RIGHT)"
							></div>
							<div
								class="mt-rotatable mt-rotatable-round"
								:style="`z-index:${item.zindex + 1}`"
								@mousedown.left="onMouseDownRotateItem($event, item, ROTATE_ROUND)"
							></div>
							<div class="mt-main-item-lock" :style="`width:${item._width}px;height:${item._height}px;z-index:${item.zindex + 1}`">
								<div class="el-row--flex is-justify-center is-align-middle" :style="`width:${item._width}px;height:${item._height}px;`">
									<i class="el-icon-lock"></i>
								</div>
							</div>
						</div>
						<el-tag class="mt-main-item-footer">X:{{ item._x }},Y:{{ item._y }}</el-tag>
					</div>
				</div>
			</el-main>
			<el-footer class="mt-main-footer" ref="mainFooter"></el-footer>
		</el-container>
		<el-aside class="mt-right" ref="right" :width="rightWidth">
			<div class="mt-right-header">
				<el-input placeholder="素材名称" v-model="rightKeyword" size="small" clearable>
					<el-select v-model="rightTypeId" slot="prepend" placeholder="素材类型" style="min-width: 100px" clearable>
						<el-option v-for="(typeInfo, key) in leftTypeList" :key="key" :label="typeInfo.typeName" :value="typeInfo.typeId"></el-option>
					</el-select>
					<el-button slot="append" icon="el-icon-search"></el-button>
				</el-input>
			</div>
			<div class="mt-right-container mt-scrollbar">
				<el-collapse :value="currentItem._mainId">
					<el-collapse-item v-for="(item, key) in mainItems" :key="key" :name="item._mainId" :title="item.materialName">
						{{ item.materialName }}
					</el-collapse-item>
				</el-collapse>
			</div>
		</el-aside>
		<div
			v-show="mainItem._mainId && mainItem._outMain"
			class="mt-main-item mt-outside mt-dragging"
			:style="`transform:translate3d(${mainItem._outX}px,${mainItem._outY}px,1px);width:${mainItem._width}px;height:${
				mainItem._height + 40
			}px;z-index:${mainItem.zindex}`"
		>
			<div class="mt-main-item-dropped" :style="`width:${mainItem._width}px;height:${mainItem._height}px;`" unselectable="on" draggable="false">
				<img :src="mainItem.materialImage" unselectable="on" draggable="false" style="width: 100%; height: 100%" />
			</div>
			<el-tag class="mt-main-item-footer">X:{{ mainItem._outX }},Y:{{ mainItem._outY }}</el-tag>
		</div>
	</el-container>
</template>

<script>
import mixins from './mixins.js'
import icons from './icons.js'

export default { name: 'machine-template', components: icons, mixins }
</script>

<style lang="scss">
@import './scss/template.scss';
</style>
