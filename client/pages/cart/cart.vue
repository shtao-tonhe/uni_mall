<template>
	<view class="cart">
		<nav-bar
			title="购物车"
			:showBack="false"
			:statusBarHeight="statusBarHeight"
		></nav-bar>

		<view class="cart__body" :style="{ top: navOffset + 'px', bottom: bottomHeight + 'px' }">
			<empty-state
				v-if="store.isEmpty"
				type="cart"
				title="购物车是空的"
				description="快去挑选心仪的商品吧"
				:showAction="true"
				actionText="去逛逛"
				@action="goHome"
			></empty-state>

			<scroll-view v-else class="cart__list" scroll-y>
				<view
					v-for="item in store.items"
					:key="item.id"
					class="cart__item"
				>
					<view class="cart__item-check" @click="store.toggleSelect(item.id)">
						<text class="cart__check-icon" :class="{ 'cart__check-icon--active': isSelected(item) }">
							{{ isSelected(item) ? '✓' : '○' }}
						</text>
					</view>
					<image class="cart__item-img" :src="item.image" mode="aspectFill" />
					<view class="cart__item-info">
						<text class="cart__item-name">{{ item.name }}</text>
						<text class="cart__item-price">¥{{ item.price }}</text>
						<view class="cart__item-counter">
							<text class="cart__counter-btn" @click="decrease(item)">-</text>
							<text class="cart__counter-num">{{ item.count }}</text>
							<text class="cart__counter-btn" @click="increase(item)">+</text>
						</view>
					</view>
					<text class="cart__item-del" @click="removeItem(item.id)">删除</text>
				</view>
			</scroll-view>
		</view>

		<view class="cart__footer" v-if="!store.isEmpty">
			<view class="cart__footer-check" @click="toggleAll">
				<text class="cart__check-icon" :class="{ 'cart__check-icon--active': allSelected }">
					{{ allSelected ? '✓' : '○' }}
				</text>
				<text class="cart__footer-label">全选</text>
			</view>
			<view class="cart__footer-total">
				<text class="cart__footer-price">合计: ¥{{ store.totalPrice }}</text>
			</view>
			<view class="cart__footer-btn" @click="checkout">
				<text>结算 ({{ store.selectedIds.length }})</text>
			</view>
		</view>

		<tab-bar
			:tabs="tabConfig"
			:current="'/pages/cart/cart'"
			@change="onTabChange"
		></tab-bar>
	</view>
</template>

<script>
	import shareMixin from '../../common/utils/share'
	import { useCartStore } from '../../common/store/base/cart'
	import { useUserStore } from '../../common/store/base/user'
	import { checkLogin } from '../../common/utils/auth'

	export default {
		mixins: [shareMixin],
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 44,
				tabConfig: [
					{ path: '/pages/index/index', text: '首页', icon: '/static/home.png', activeIcon: '/static/home-fill.png' },
					{ path: '/pages/cart/cart', text: '购物车', icon: '/static/cart.png', activeIcon: '/static/cart-fill.png' },
					{ path: '/pages/profile/profile', text: '我的', icon: '/static/profile.png', activeIcon: '/static/profile-fill.png' },
				]
			}
		},
		computed: {
			bottomHeight() {
				return 100
			},
			navOffset() {
				return this.statusBarHeight + this.navBarHeight
			},
			allSelected() {
				return this.store.items.length > 0 &&
					this.store.selectedIds.length === this.store.items.length
			}
		},
		created() {
			this.store = useCartStore()
			this.userStore = useUserStore()
		},
		onLoad() {
			const info = uni.getSystemInfoSync()
			this.statusBarHeight = info.statusBarHeight || 0
		},
		onShow() {
			if (this.userStore.isLoggedIn) {
				this.store.fetchCart()
			}
		},
		methods: {
			isSelected(item) {
				return this.store.selectedIds.indexOf(item.id) > -1
			},
			onTabChange(tab) {
				if (tab.path !== '/pages/cart/cart') {
					uni.reLaunch({ url: tab.path })
				}
			},
			goHome() {
				uni.reLaunch({ url: '/pages/index/index' })
			},
			toggleAll() {
				this.store.toggleSelectAll(!this.allSelected)
			},
			async increase(item) {
				await this.store.updateCount(item.id, item.count + 1)
			},
			async decrease(item) {
				if (item.count <= 1) return
				await this.store.updateCount(item.id, item.count - 1)
			},
			async removeItem(id) {
				uni.showModal({
					title: '提示',
					content: '确定要删除该商品吗？',
					success: (res) => {
						if (res.confirm) {
							this.store.removeItem(id)
						}
					}
				})
			},
			checkout() {
				if (!checkLogin()) return
				if (this.store.selectedIds.length === 0) {
					uni.showToast({ title: '请选择商品', icon: 'none' })
					return
				}
				uni.navigateTo({ url: '/pages/order/create' })
			}
		}
	}
</script>

<style lang="scss">
	.cart {
		background: #f8f8f8;
		min-height: 100vh;

		&__body {
			position: fixed;
			left: 0;
			right: 0;
		}

		&__list {
			height: 100%;
			padding: 16rpx 24rpx;
		}

		&__item {
			display: flex;
			align-items: center;
			background: #fff;
			border-radius: 12rpx;
			padding: 20rpx;
			margin-bottom: 16rpx;

			&-check {
				margin-right: 16rpx;
			}

			&-img {
				width: 160rpx;
				height: 160rpx;
				border-radius: 8rpx;
				margin-right: 16rpx;
				flex-shrink: 0;
			}

			&-info {
				flex: 1;
				min-width: 0;
			}

			&-name {
				font-size: 26rpx;
				color: #333;
				display: block;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-bottom: 8rpx;
			}

			&-price {
				font-size: 28rpx;
				color: #ff4757;
				font-weight: 600;
				display: block;
				margin-bottom: 12rpx;
			}

			&-counter {
				display: flex;
				align-items: center;
			}

			&-del {
				font-size: 24rpx;
				color: #999;
				padding: 8rpx 12rpx;
				flex-shrink: 0;
			}
		}

		&__check-icon {
			font-size: 36rpx;
			color: #ddd;

			&--active {
				color: #ff4757;
			}
		}

		&__counter {
			&-btn {
				width: 44rpx;
				height: 44rpx;
				border: 2rpx solid #ddd;
				text-align: center;
				line-height: 40rpx;
				font-size: 28rpx;
				color: #666;
			}

			&-num {
				width: 64rpx;
				text-align: center;
				font-size: 26rpx;
				color: #333;
			}
		}

		&__footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			align-items: center;
			background: #fff;
			padding: 16rpx 24rpx;
			padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
			border-top: 2rpx solid #f0f0f0;

			&-check {
				display: flex;
				align-items: center;
				margin-right: 24rpx;
			}

			&-label {
				font-size: 26rpx;
				color: #333;
				margin-left: 8rpx;
			}

			&-total {
				flex: 1;
			}

			&-price {
				font-size: 28rpx;
				color: #ff4757;
				font-weight: 600;
			}

			&-btn {
				background: #ff4757;
				color: #fff;
				padding: 16rpx 48rpx;
				border-radius: 40rpx;
				font-size: 28rpx;
			}
		}
	}
</style>
