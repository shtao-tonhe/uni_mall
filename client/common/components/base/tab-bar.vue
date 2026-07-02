<template>
	<view class="tab-bar" v-if="tabs.length > 0">
		<view
			v-for="(tab, index) in tabs"
			:key="index"
			class="tab-bar__item"
			:class="{ 'tab-bar__item--active': current === tab.path }"
			@click="switchTab(tab)"
		>
			<image
				v-if="current === tab.path && tab.activeIcon"
				class="tab-bar__icon"
				:src="tab.activeIcon"
				mode="aspectFit"
			/>
			<image
				v-else-if="tab.icon"
				class="tab-bar__icon"
				:src="tab.icon"
				mode="aspectFit"
			/>
			<text v-else class="tab-bar__emoji">{{ tab.emoji || '📄' }}</text>
			<text class="tab-bar__label">{{ tab.text }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			tabs: {
				type: Array,
				default: () => []
			},
			current: {
				type: String,
				default: ''
			}
		},
		methods: {
			switchTab(tab) {
				if (this.current === tab.path) return
				this.$emit('change', tab)
			}
		}
	}
</script>

<style lang="scss">
	.tab-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		background: #ffffff;
		border-top: 1rpx solid #f0f0f0;
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 999;

		&__item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 8rpx 0;
			position: relative;

			&--active {
				.tab-bar__label {
					color: #ff4757;
				}
			}
		}

		&__icon {
			width: 48rpx;
			height: 48rpx;
			margin-bottom: 4rpx;
		}

		&__emoji {
			font-size: 40rpx;
			margin-bottom: 4rpx;
		}

		&__label {
			font-size: 20rpx;
			color: #999;
			line-height: 1.2;
		}
	}
</style>
