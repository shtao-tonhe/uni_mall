<template>
	<view class="profile">
		<nav-bar
			title="个人中心"
			:showBack="false"
			:statusBarHeight="statusBarHeight"
		></nav-bar>

		<view class="profile__header" :style="{ paddingTop: navOffset + 20 + 'px' }">
			<view class="profile__user" @click="handleLogin">
				<view class="profile__avatar">
					<text class="profile__avatar-emoji">{{ userInfo?.avatar ? '' : '👤' }}</text>
					<image
						v-if="userInfo?.avatar"
						class="profile__avatar-img"
						:src="userInfo.avatar"
						mode="aspectFill"
					/>
				</view>
				<view class="profile__user-info">
					<text class="profile__nickname">{{ userInfo?.nickname || '点击登录' }}</text>
					<text v-if="!isLoggedIn" class="profile__tip">登录后享受更多权益</text>
				</view>
			</view>
		</view>

		<view class="profile__orders" @click="goOrderList">
			<text class="profile__section-title">我的订单</text>
			<view class="profile__order-tabs">
				<view class="profile__order-tab" v-for="tab in orderTabs" :key="tab.key" @click.stop="goOrderTab(tab.key)">
					<text class="profile__order-icon">{{ tab.icon }}</text>
					<text class="profile__order-label">{{ tab.label }}</text>
				</view>
			</view>
		</view>

		<view class="profile__menu">
			<view class="profile__menu-item" @click="goAddress">
				<text class="profile__menu-icon">📍</text>
				<text class="profile__menu-label">收货地址</text>
				<text class="profile__menu-arrow">›</text>
			</view>
			<view class="profile__menu-item" @click="goAbout">
				<text class="profile__menu-icon">ℹ️</text>
				<text class="profile__menu-label">关于我们</text>
				<text class="profile__menu-arrow">›</text>
			</view>
		</view>

		<view v-if="isLoggedIn" class="profile__logout" @click="handleLogout">
			<text>退出登录</text>
		</view>
		<tab-bar
			:tabs="tabConfig"
			:current="'/pages/profile/profile'"
			@change="onTabChange"
		></tab-bar>
	</view>
</template>

<script>
	import shareMixin from '../../common/utils/share'
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
				],
				orderTabs: [
					{ key: 'all', label: '全部', icon: '📋' },
					{ key: 'pending_pay', label: '待付款', icon: '💳' },
					{ key: 'pending_ship', label: '待发货', icon: '📦' },
					{ key: 'shipped', label: '待收货', icon: '🚚' },
					{ key: 'completed', label: '已完成', icon: '✅' },
				]
			}
		},
		computed: {
			navOffset() {
				return this.statusBarHeight + this.navBarHeight
			},
			isLoggedIn() {
				return this.userStore.isLoggedIn
			},
			userInfo() {
				return this.userStore.userInfo
			}
		},
		created() {
			this.userStore = useUserStore()
		},
		onLoad() {
			const info = uni.getSystemInfoSync()
			this.statusBarHeight = info.statusBarHeight || 0
		},
		onShow() {
			if (this.isLoggedIn && !this.userInfo) {
				this.userStore.fetchUserInfo()
			}
		},
		methods: {
			onTabChange(tab) {
				if (tab.path !== '/pages/profile/profile') {
					uni.reLaunch({ url: tab.path })
				}
			},
			handleLogin() {
				if (!this.isLoggedIn) {
					uni.navigateTo({ url: '/pages/login/login' })
				}
			},
			handleLogout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							this.userStore.logout()
						}
					}
				})
			},
			goOrderList() {
				if (!checkLogin()) return
				uni.navigateTo({ url: '/pages/order/list' })
			},
			goOrderTab(key) {
				if (!checkLogin()) return
				uni.navigateTo({ url: `/pages/order/list?tab=${key}` })
			},
			goAddress() {
				if (!checkLogin()) return
				uni.navigateTo({ url: '/pages/address/list' })
			},
			goAbout() {
				uni.showModal({
					title: '关于我们',
					content: 'uni_mall - 优质好物，尽在掌握',
					showCancel: false
				})
			}
		}
	}
</script>

<style lang="scss">
	.profile {
		min-height: 100vh;
		background: #f8f8f8;

		&__header {
			background: linear-gradient(135deg, #ff4757, #ff6b81);
			padding: 40rpx 32rpx 60rpx;
		}

		&__user {
			display: flex;
			align-items: center;
		}

		&__avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			border: 4rpx solid rgba(255, 255, 255, 0.6);
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba(255, 255, 255, 0.2);
			overflow: hidden;
			position: relative;

			&-emoji {
				font-size: 56rpx;
			}

			&-img {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}
		}

		&__user-info {
			margin-left: 24rpx;
		}

		&__nickname {
			font-size: 34rpx;
			color: #fff;
			font-weight: 600;
			display: block;
		}

		&__tip {
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.8);
			margin-top: 8rpx;
			display: block;
		}

		&__orders {
			background: #fff;
			margin: -30rpx 24rpx 0;
			border-radius: 16rpx;
			padding: 24rpx;
			position: relative;
			z-index: 1;
		}

		&__section-title {
			font-size: 28rpx;
			font-weight: 500;
			color: #333;
			display: block;
			margin-bottom: 24rpx;
		}

		&__order-tabs {
			display: flex;
			justify-content: space-around;
		}

		&__order-tab {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		&__order-icon {
			font-size: 40rpx;
			margin-bottom: 8rpx;
		}

		&__order-label {
			font-size: 22rpx;
			color: #666;
		}

		&__menu {
			margin: 24rpx;
			background: #fff;
			border-radius: 16rpx;
			overflow: hidden;
		}

		&__menu-item {
			display: flex;
			align-items: center;
			padding: 28rpx 24rpx;
			border-bottom: 2rpx solid #f8f8f8;

			&:last-child {
				border-bottom: none;
			}
		}

		&__menu-icon {
			font-size: 32rpx;
			margin-right: 20rpx;
		}

		&__menu-label {
			flex: 1;
			font-size: 28rpx;
			color: #333;
		}

		&__menu-arrow {
			font-size: 36rpx;
			color: #ccc;
		}

		&__logout {
			margin: 24rpx;
			background: #fff;
			border-radius: 16rpx;
			padding: 28rpx;
			text-align: center;
			font-size: 28rpx;
			color: #ff4757;
		}
	}
</style>
