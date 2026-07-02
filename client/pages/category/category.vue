<template>
	<view class="category">
		<nav-bar
			title="商品分类"
			:showBack="false"
			:statusBarHeight="statusBarHeight"
		></nav-bar>

		<view class="category__main" :style="{ top: navOffset + 'px' }">
			<scroll-view class="category__left" scroll-y>
				<view
					v-for="(cat, index) in categories"
					:key="cat.id"
					class="category__left-item"
					:class="{ 'category__left-item--active': activeIndex === index }"
					@click="selectCategory(index)"
				>
					<text>{{ cat.name }}</text>
				</view>
			</scroll-view>

			<scroll-view class="category__right" scroll-y @scrolltolower="loadMore">
				<view v-if="products.length === 0 && !loading" class="category__empty">
					<text class="category__empty-text">暂无商品</text>
				</view>
				<view v-else class="category__product-grid">
					<view
						v-for="item in products"
						:key="item.id"
						class="category__product-item"
						@click="goDetail(item.id)"
					>
						<image class="category__product-img" :src="item.image" mode="aspectFill" />
						<text class="category__product-name">{{ item.name }}</text>
						<text class="category__product-price">¥{{ item.price }}</text>
					</view>
				</view>
				<view v-if="loading" class="category__loading">加载中...</view>
			</scroll-view>
		</view>

		<tab-bar
			:tabs="tabConfig"
			:current="'/pages/category/category'"
			@change="onTabChange"
		></tab-bar>
	</view>
</template>

<script>
	import shareMixin from '../../common/utils/share'
	import { getCategoryList, getCategoryProducts } from '../../common/api/base/category'

	export default {
		mixins: [shareMixin],
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 44,
				categories: [],
				activeIndex: 0,
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
			this.fetchCategories()
		},
		methods: {
			onTabChange(tab) {
				if (tab.path !== '/pages/category/category') {
					uni.reLaunch({ url: tab.path })
				}
			},
			async fetchCategories() {
				try {
					const res = await getCategoryList()
					this.categories = res || []
					if (this.categories.length > 0) {
						this.fetchProducts()
					}
				} catch (e) {
					console.error('获取分类失败', e)
				}
			},
			selectCategory(index) {
				this.activeIndex = index
				this.page = 1
				this.products = []
				this.hasMore = true
				this.fetchProducts()
			},
			async fetchProducts() {
				const cat = this.categories[this.activeIndex]
				if (!cat) return
				this.loading = true
				try {
					const res = await getCategoryProducts(cat.id, this.page)
					if (this.page === 1) {
						this.products = res.list || []
					} else {
						this.products = [...this.products, ...(res.list || [])]
					}
					this.hasMore = res.hasMore !== false
				} catch (e) {
					console.error('获取分类商品失败', e)
				} finally {
					this.loading = false
				}
			},
			loadMore() {
				if (!this.hasMore || this.loading) return
				this.page++
				this.fetchProducts()
			},
			goDetail(id) {
				uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
			}
		}
	}
</script>

<style lang="scss">
	.category {
		height: 100vh;
		background: #fff;

		&__main {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
		}

		&__left {
			width: 180rpx;
			background: #f8f8f8;
			height: 100%;

			&-item {
				padding: 28rpx 20rpx;
				text-align: center;
				font-size: 26rpx;
				color: #666;

				&--active {
					background: #fff;
					color: #ff4757;
					font-weight: 500;
					position: relative;

					&::before {
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						width: 4rpx;
						height: 32rpx;
						background: #ff4757;
						border-radius: 2rpx;
					}
				}
			}
		}

		&__right {
			flex: 1;
			padding: 20rpx;
			height: 100%;
		}

		&__product-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 16rpx;
		}

		&__product-item {
			background: #fafafa;
			border-radius: 12rpx;
			overflow: hidden;
		}

		&__product-img {
			width: 100%;
			height: 280rpx;
		}

		&__product-name {
			font-size: 24rpx;
			color: #333;
			padding: 8rpx 12rpx 4rpx;
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		&__product-price {
			font-size: 26rpx;
			color: #ff4757;
			font-weight: 600;
			padding: 0 12rpx 12rpx;
			display: block;
		}

		&__loading {
			text-align: center;
			padding: 24rpx;
			font-size: 24rpx;
			color: #ccc;
		}

		&__empty {
			display: flex;
			justify-content: center;
			padding-top: 120rpx;

			&-text {
				font-size: 28rpx;
				color: #ccc;
			}
		}
	}
</style>
