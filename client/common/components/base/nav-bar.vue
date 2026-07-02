<template>
	<view class="nav-bar" :style="navStyle">
		<view class="nav-bar__status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		<view class="nav-bar__content" :style="{ height: navBarHeight + 'px' }">
			<view class="nav-bar__left" @click="handleLeftClick">
				<slot name="left">
					<view v-if="showBack" class="nav-bar__back">
						<text class="nav-bar__back-icon">‹</text>
					</view>
				</slot>
			</view>
			<view class="nav-bar__center">
				<slot name="center">
					<text class="nav-bar__title">{{ title }}</text>
				</slot>
			</view>
			<view class="nav-bar__right">
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			showBack: {
				type: Boolean,
				default: true
			},
			backgroundColor: {
				type: String,
				default: '#ffffff'
			},
			fontColor: {
				type: String,
				default: '#333333'
			},
			statusBarHeight: {
				type: Number,
				default: 0
			},
			navBarHeight: {
				type: Number,
				default: 44
			}
		},
		computed: {
			navStyle() {
				return {
					backgroundColor: this.backgroundColor,
					color: this.fontColor
				}
			}
		},
		methods: {
			handleLeftClick() {
				if (this.showBack) {
					uni.navigateBack()
				}
				this.$emit('left-click')
			}
		}
	}
</script>

<style lang="scss">
	.nav-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;

		&__status-bar {
			width: 100%;
		}

		&__content {
			display: flex;
			align-items: center;
			padding: 0 16rpx;
		}

		&__left {
			width: 120rpx;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			flex-shrink: 0;
		}

		&__back {
			padding: 8rpx 16rpx;
		}

		&__back-icon {
			font-size: 44rpx;
			font-weight: 300;
			line-height: 1;
		}

		&__center {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
		}

		&__title {
			font-size: 32rpx;
			font-weight: 500;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			max-width: 60vw;
		}

		&__right {
			width: 120rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			flex-shrink: 0;
		}
	}
</style>
