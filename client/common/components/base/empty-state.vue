<template>
	<view class="empty-state">
		<view class="empty-state__graphic" :style="graphicStyle">
			<text class="empty-state__emoji">{{ emoji }}</text>
		</view>
		<text class="empty-state__title">{{ title }}</text>
		<text v-if="description" class="empty-state__desc">{{ description }}</text>
		<view v-if="showAction" class="empty-state__action" @click="handleAction">
			<text class="empty-state__action-text">{{ actionText }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				default: 'default'
			},
			title: {
				type: String,
				default: '暂无数据'
			},
			description: {
				type: String,
				default: ''
			},
			showAction: {
				type: Boolean,
				default: false
			},
			actionText: {
				type: String,
				default: '去看看'
			}
		},
		computed: {
			emoji() {
				const map = {
					cart: '🛒',
					order: '📦',
					address: '📍',
					favorite: '❤️',
					search: '🔍',
					default: '📭',
				}
				return map[this.type] || map.default
			},
			graphicStyle() {
				const colors = {
					cart: '#fff0f0',
					order: '#f0f8ff',
					address: '#f5f0ff',
					favorite: '#fff0f5',
					search: '#f0fff0',
					default: '#f8f8f8',
				}
				return {
					backgroundColor: colors[this.type] || colors.default
				}
			}
		},
		methods: {
			handleAction() {
				this.$emit('action')
			}
		}
	}
</script>

<style lang="scss">
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 120rpx 60rpx;

		&__graphic {
			width: 220rpx;
			height: 220rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 32rpx;
		}

		&__emoji {
			font-size: 80rpx;
		}

		&__title {
			font-size: 28rpx;
			color: #999;
			margin-bottom: 12rpx;
		}

		&__desc {
			font-size: 24rpx;
			color: #ccc;
			margin-bottom: 32rpx;
			text-align: center;
		}

		&__action {
			padding: 16rpx 48rpx;
			border: 2rpx solid #ff4757;
			border-radius: 40rpx;
		}

		&__action-text {
			font-size: 26rpx;
			color: #ff4757;
		}
	}
</style>
