<template>
	<view class="order-list">
		<nav-bar
			title="我的订单"
			:showBack="true"
			:statusBarHeight="statusBarHeight"
		></nav-bar>

		<view class="order-list__tabs" :style="{ marginTop: navOffset + 'px' }">
			<view
				v-for="tab in tabs"
				:key="tab.key"
				class="order-list__tab"
				:class="{ 'order-list__tab--active': currentTab === tab.key }"
				@click="switchTab(tab.key)"
			>
				<text>{{ tab.label }}</text>
			</view>
		</view>

		<scroll-view
			class="order-list__scroll"
			:style="{ top: navOffset + 80 + 'px' }"
			scroll-y
			@scrolltolower="loadMore"
		>
			<empty-state
				v-if="orders.length === 0 && !loading"
				type="order"
				title="暂无订单"
				description="快去下单吧"
				:showAction="true"
				actionText="去首页"
				@action="goHome"
			></empty-state>

			<view v-for="order in orders" :key="order.id" class="order-list__card" @click="goDetail(order.id)">
				<view class="order-list__card-header">
					<text class="order-list__order-no">订单号: {{ order.orderNo }}</text>
					<text class="order-list__order-status">{{ statusMap[order.status] }}</text>
				</view>
				<view class="order-list__card-body">
					<image class="order-list__product-img" :src="order.productImage" mode="aspectFill" />
					<view class="order-list__product-info">
						<text class="order-list__product-name">{{ order.productName }}</text>
						<text class="order-list__product-price">¥{{ order.payAmount }}</text>
						<text class="order-list__product-count">x{{ order.productCount }}</text>
					</view>
				</view>
				<view class="order-list__card-footer">
					<text class="order-list__total">共 {{ order.productCount }} 件 · 合计 ¥{{ order.payAmount }}</text>
				</view>
			</view>

			<view v-if="loading" class="order-list__loading">加载中...</view>
		</scroll-view>
	</view>
</template>

<script>
	import shareMixin from '../../common/utils/share'
	import { getOrderList } from '../../common/api/base/order'

	export default {
		mixins: [shareMixin],
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 44,
				tabs: [
					{ key: 'all', label: '全部' },
					{ key: 'pending_pay', label: '待付款' },
					{ key: 'pending_ship', label: '待发货' },
					{ key: 'shipped', label: '待收货' },
					{ key: 'completed', label: '已完成' },
				],
				currentTab: 'all',
				orders: [],
				loading: false,
				page: 1,
				hasMore: true,
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
			}
		},
		onLoad(query) {
			if (query.tab) {
				const found = this.tabs.find(t => t.key === query.tab)
				if (found) this.currentTab = found.key
			}
			const info = uni.getSystemInfoSync()
			this.statusBarHeight = info.statusBarHeight || 0
			this.fetchOrders()
		},
		methods: {
			switchTab(key) {
				this.currentTab = key
				this.page = 1
				this.orders = []
				this.hasMore = true
				this.fetchOrders()
			},
			async fetchOrders() {
				this.loading = true
				try {
					const params = { page: this.page }
					if (this.currentTab !== 'all') {
						params.status = this.currentTab
					}
					const res = await getOrderList(params)
					if (this.page === 1) {
						this.orders = res.list || []
					} else {
						this.orders = [...this.orders, ...(res.list || [])]
					}
					this.hasMore = res.hasMore !== false
				} catch (e) {
					console.error('获取订单列表失败', e)
				} finally {
					this.loading = false
				}
			},
			loadMore() {
				if (!this.hasMore || this.loading) return
				this.page++
				this.fetchOrders()
			},
			goDetail(id) {
				uni.navigateTo({ url: `/pages/order/detail?id=${id}` })
			},
			goHome() {
				uni.reLaunch({ url: '/pages/index/index' })
			}
		}
	}
</script>

<style lang="scss">
	.order-list {
		background: #f8f8f8;
		min-height: 100vh;

		&__tabs {
			position: fixed;
			left: 0;
			right: 0;
			display: flex;
			background: #fff;
			border-bottom: 2rpx solid #f0f0f0;
			z-index: 10;
		}

		&__tab {
			flex: 1;
			text-align: center;
			padding: 20rpx 0;
			font-size: 26rpx;
			color: #666;

			&--active {
				color: #ff4757;
				font-weight: 500;
				position: relative;

				&::after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 40rpx;
					height: 4rpx;
					background: #ff4757;
					border-radius: 2rpx;
				}
			}
		}

		&__scroll {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 16rpx 24rpx;
		}

		&__loading {
			text-align: center;
			padding: 24rpx;
			font-size: 24rpx;
			color: #ccc;
		}

		&__card {
			background: #fff;
			border-radius: 12rpx;
			padding: 24rpx;
			margin-bottom: 16rpx;

			&-header {
				display: flex;
				justify-content: space-between;
				margin-bottom: 16rpx;
			}
		}

		&__order-no {
			font-size: 22rpx;
			color: #999;
		}

		&__order-status {
			font-size: 24rpx;
			color: #ff4757;
		}

		&__card-body {
			display: flex;
		}

		&__product-img {
			width: 140rpx;
			height: 140rpx;
			border-radius: 8rpx;
			margin-right: 16rpx;
			flex-shrink: 0;
		}

		&__product-info {
			flex: 1;
		}

		&__product-name {
			font-size: 26rpx;
			color: #333;
			display: block;
			margin-bottom: 8rpx;
		}

		&__product-price {
			font-size: 28rpx;
			color: #ff4757;
			font-weight: 600;
			display: block;
		}

		&__product-count {
			font-size: 22rpx;
			color: #999;
		}

		&__card-footer {
			margin-top: 16rpx;
			padding-top: 16rpx;
			border-top: 2rpx solid #f8f8f8;
			text-align: right;
		}

		&__total {
			font-size: 24rpx;
			color: #666;
		}
	}
</style>
