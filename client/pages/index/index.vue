<template>
	<view class="home">
		<nav-bar
			title="uni_mall"
			:showBack="false"
			:statusBarHeight="statusBarHeight"
		></nav-bar>

		<scroll-view
			class="home__scroll"
			:style="{ top: navOffset + 'px' }"
			scroll-y
			@scrolltolower="loadMore"
		>
			<swiper class="home__swiper" :autoplay="true" :interval="3000" :circular="true">
				<swiper-item v-for="(banner, index) in banners" :key="index" @click="goBannerDetail(banner)">
					<image class="home__swiper-img" :src="banner.image" mode="aspectFill" />
				</swiper-item>
			</swiper>

			<view class="home__section">
				<text class="home__section-title">推荐商品</text>
				<view class="home__product-grid">
					<view
						v-for="item in products"
						:key="item.id"
						class="home__product-item"
						@click="goProductDetail(item.id)"
					>
						<image class="home__product-img" :src="item.image" mode="aspectFill" />
						<text class="home__product-name">{{ item.name }}</text>
						<text class="home__product-price">¥{{ item.price }}</text>
					</view>
				</view>
			</view>

			<view v-if="loading" class="home__loading">加载中...</view>
		</scroll-view>

		<tab-bar
			:tabs="tabConfig"
			:current="'/pages/index/index'"
			@change="onTabChange"
		></tab-bar>
	</view>
</template>

<script>
	import shareMixin from '../../common/utils/share'
	import { getHomeData } from '../../common/api/base/product'

	export default {
		mixins: [shareMixin],
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 44,
				banners: [],
				products: [],
				loading: false,
				page: 1,
				hasMore: true,
				tabConfig: [
					{ path: '/pages/index/index', text: '首页', icon: '/static/home.png', activeIcon: '/static/home-fill.png' },
					{ path: '/pages/cart/cart', text: '购物车', icon: '/static/cart.png', activeIcon: '/static/cart-fill.png' },
					{ path: '/pages/profile/profile', text: '我的', icon: '/static/profile.png', activeIcon: '/static/profile-fill.png' },
				]
			}
		},
		computed: {
			navOffset() {
				return this.statusBarHeight + this.navBarHeight
			}
		},
		onLoad() {
			const info = uni.getSystemInfoSync()
			this.statusBarHeight = info.statusBarHeight || 0
			this.fetchData()
		},
		methods: {
			onTabChange(tab) {
				if (tab.path !== '/pages/index/index') {
					uni.reLaunch({ url: tab.path })
				}
			},
			async fetchData() {
				this.loading = true
				try {
					const data = await getHomeData()
					this.banners = data.banners || []
					this.products = data.products || []
				} catch (e) {
					console.error('获取首页数据失败', e)
				} finally {
					this.loading = false
				}
			},
			loadMore() {
				if (!this.hasMore || this.loading) return
				this.page++
				this.fetchData()
			},
			goProductDetail(id) {
				uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
			},
			goBannerDetail(banner) {
				if (banner.link) {
					uni.navigateTo({ url: banner.link })
				}
			}
		}
	}
</script>

<style lang="scss">
	.home {
		min-height: 100vh;
		background: #f8f8f8;

		&__scroll {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
		}

		&__swiper {
			height: 360rpx;

			&-img {
				width: 100%;
				height: 100%;
			}
		}

		&__section {
			padding: 30rpx 24rpx;
			background: #fff;
			margin-top: 16rpx;

			&-title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
				margin-bottom: 24rpx;
				display: block;
			}
		}

		&__product-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20rpx;
		}

		&__product-item {
			background: #fafafa;
			border-radius: 12rpx;
			overflow: hidden;
		}

		&__product-img {
			width: 100%;
			height: 340rpx;
		}

		&__product-name {
			font-size: 24rpx;
			color: #333;
			padding: 12rpx 16rpx 4rpx;
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		&__loading {
			text-align: center;
			padding: 24rpx;
			font-size: 24rpx;
			color: #ccc;
		}

		&__product-price {
			font-size: 28rpx;
			color: #ff4757;
			font-weight: 600;
			padding: 0 16rpx 16rpx;
			display: block;
		}
	}
</style>
