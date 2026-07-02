<template>
	<view class="order-detail">
		<nav-bar
			title="订单详情"
			:showBack="true"
			:statusBarHeight="statusBarHeight"
		></nav-bar>

		<scroll-view class="order-detail__scroll" :style="{ top: navOffset + 'px' }" scroll-y>
			<view class="order-detail__status" :class="'order-detail__status--' + order.status">
				<text class="order-detail__status-icon">{{ statusIcon }}</text>
				<text class="order-detail__status-text">{{ statusText }}</text>
			</view>

			<view class="order-detail__address" v-if="order.address">
				<text class="order-detail__address-name">{{ order.address.name }} {{ order.address.phone }}</text>
				<text class="order-detail__address-detail">{{ order.address.province }}{{ order.address.city }}{{ order.address.district }}{{ order.address.detail }}</text>
			</view>

			<view class="order-detail__product">
				<image class="order-detail__product-img" :src="order.productImage" mode="aspectFill" />
				<view class="order-detail__product-info">
					<text class="order-detail__product-name">{{ order.productName }}</text>
					<text class="order-detail__product-price">¥{{ order.payAmount }}</text>
					<text class="order-detail__product-count">x{{ order.productCount }}</text>
				</view>
			</view>

			<view class="order-detail__info">
				<view class="order-detail__info-row">
					<text class="order-detail__info-label">订单编号</text>
					<text class="order-detail__info-value">{{ order.orderNo }}</text>
				</view>
				<view class="order-detail__info-row">
					<text class="order-detail__info-label">下单时间</text>
					<text class="order-detail__info-value">{{ order.createdAt }}</text>
				</view>
				<view class="order-detail__info-row">
					<text class="order-detail__info-label">支付方式</text>
					<text class="order-detail__info-value">{{ order.payMethod || '未支付' }}</text>
				</view>
				<view class="order-detail__info-row">
					<text class="order-detail__info-label">实付金额</text>
					<text class="order-detail__info-value order-detail__info-value--price">¥{{ order.payAmount }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import shareMixin from '../../common/utils/share'
	import { getOrderDetail } from '../../common/api/base/order'

	export default {
		mixins: [shareMixin],
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 44,
				order: {},
				statusMap: {
					pending_pay: '待付款',
					pending_ship: '待发货',
					shipped: '待收货',
					completed: '已完成',
					cancelled: '已取消'
				}
			}
		},
		computed: {
			navOffset() {
				return this.statusBarHeight + this.navBarHeight
			},
			statusText() {
				return this.statusMap[this.order.status] || ''
			},
			statusIcon() {
				const icons = {
					pending_pay: '💳',
					pending_ship: '📦',
					shipped: '🚚',
					completed: '✅',
					cancelled: '❌'
				}
				return icons[this.order.status] || '📋'
			}
		},
		onLoad(query) {
			const info = uni.getSystemInfoSync()
			this.statusBarHeight = info.statusBarHeight || 0
			if (query.id) {
				this.fetchDetail(query.id)
			}
		},
		methods: {
			async fetchDetail(id) {
				try {
					const res = await getOrderDetail(id)
					this.order = res || {}
				} catch (e) {
					console.error('获取订单详情失败', e)
				}
			}
		}
	}
</script>

<style lang="scss">
	.order-detail {
		background: #f8f8f8;
		min-height: 100vh;

		&__scroll {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
		}

		&__status {
			display: flex;
			align-items: center;
			padding: 40rpx 32rpx;
			background: #fff;

			&--pending_pay {
				background: linear-gradient(135deg, #ff4757, #ff6b81);
			}
			&--shipped {
				background: linear-gradient(135deg, #2ed573, #7bed9f);
			}
			&--completed {
				background: linear-gradient(135deg, #70a1ff, #a8d8ea);
			}
		}

		&__status-icon {
			font-size: 48rpx;
			margin-right: 16rpx;
		}

		&__status-text {
			font-size: 32rpx;
			color: #fff;
			font-weight: 500;
		}

		&__address {
			background: #fff;
			padding: 24rpx 32rpx;
			margin-top: 16rpx;

			&-name {
				font-size: 28rpx;
				color: #333;
				font-weight: 500;
				display: block;
				margin-bottom: 8rpx;
			}

			&-detail {
				font-size: 24rpx;
				color: #999;
				display: block;
			}
		}

		&__product {
			display: flex;
			background: #fff;
			padding: 24rpx 32rpx;
			margin-top: 16rpx;

			&-img {
				width: 160rpx;
				height: 160rpx;
				border-radius: 8rpx;
				margin-right: 16rpx;
				flex-shrink: 0;
			}

			&-info {
				flex: 1;
			}

			&-name {
				font-size: 26rpx;
				color: #333;
				display: block;
				margin-bottom: 8rpx;
			}

			&-price {
				font-size: 28rpx;
				color: #ff4757;
				font-weight: 600;
				display: block;
			}

			&-count {
				font-size: 22rpx;
				color: #999;
			}
		}

		&__info {
			background: #fff;
			padding: 24rpx 32rpx;
			margin-top: 16rpx;

			&-row {
				display: flex;
				justify-content: space-between;
				margin-bottom: 16rpx;

				&:last-child {
					margin-bottom: 0;
				}
			}

			&-label {
				font-size: 24rpx;
				color: #999;
			}

			&-value {
				font-size: 24rpx;
				color: #333;

				&--price {
					color: #ff4757;
					font-weight: 600;
					font-size: 28rpx;
				}
			}
		}
	}
</style>
