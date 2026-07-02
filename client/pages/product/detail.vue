<template>
	<view class="detail">
		<nav-bar
			title="商品详情"
			:showBack="true"
			:statusBarHeight="statusBarHeight"
		></nav-bar>

		<scroll-view class="detail__scroll" :style="{ top: navOffset + 'px' }" scroll-y>
			<swiper class="detail__swiper" :autoplay="false" :circular="true">
				<swiper-item v-for="(img, index) in detail.images" :key="index">
					<image class="detail__swiper-img" :src="img" mode="aspectFill" />
				</swiper-item>
			</swiper>

			<view class="detail__info">
				<text class="detail__price">¥{{ detail.price }}</text>
				<text v-if="detail.originalPrice" class="detail__original">¥{{ detail.originalPrice }}</text>
				<text class="detail__name">{{ detail.name }}</text>
				<text class="detail__desc">{{ detail.description }}</text>
			</view>

			<view class="detail__specs" v-if="detail.specs && detail.specs.length > 0">
				<text class="detail__section-title">规格选择</text>
				<view class="detail__spec-list">
					<text
						v-for="(spec, idx) in detail.specs"
						:key="idx"
						class="detail__spec-item"
						:class="{ 'detail__spec-item--active': selectedSpec === idx }"
						@click="selectedSpec = idx"
					>{{ spec.name }}</text>
				</view>
			</view>

			<view class="detail__detail">
				<text class="detail__section-title">商品详情</text>
				<rich-text v-if="detail.content" :nodes="detail.content"></rich-text>
			</view>
		</scroll-view>

		<view class="detail__footer">
			<view class="detail__footer-btn detail__footer-btn--cart" @click="addToCart">
				加入购物车
			</view>
			<view class="detail__footer-btn detail__footer-btn--buy" @click="buyNow">
				立即购买
			</view>
		</view>
	</view>
</template>

<script>
	import shareMixin from '../../common/utils/share'
	import { getProductDetail } from '../../common/api/base/product'
	import { useCartStore } from '../../common/store/base/cart'

	export default {
		mixins: [shareMixin],
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 44,
				detail: {},
				selectedSpec: 0,
				id: null,
			}
		},
		computed: {
			navOffset() {
				return this.statusBarHeight + this.navBarHeight
			}
		},
		onLoad(query) {
			this.id = query.id
			const info = uni.getSystemInfoSync()
			this.statusBarHeight = info.statusBarHeight || 0
			this.fetchDetail()
		},
		methods: {
			async fetchDetail() {
				try {
					const res = await getProductDetail(this.id)
					this.detail = res || {}
				} catch (e) {
					console.error('获取商品详情失败', e)
				}
			},
			async addToCart() {
				const store = useCartStore()
				await store.addToCart(this.id, null, 1)
			},
			buyNow() {
				uni.navigateTo({
					url: `/pages/order/create?productId=${this.id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.detail {
		background: #f8f8f8;
		min-height: 100vh;

		&__scroll {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 100rpx;
		}

		&__swiper {
			height: 600rpx;

			&-img {
				width: 100%;
				height: 100%;
			}
		}

		&__info {
			background: #fff;
			padding: 24rpx;
		}

		&__price {
			font-size: 40rpx;
			color: #ff4757;
			font-weight: 700;
		}

		&__original {
			font-size: 24rpx;
			color: #ccc;
			text-decoration: line-through;
			margin-left: 16rpx;
		}

		&__name {
			font-size: 30rpx;
			color: #333;
			font-weight: 500;
			margin-top: 12rpx;
			display: block;
		}

		&__desc {
			font-size: 26rpx;
			color: #999;
			margin-top: 8rpx;
			display: block;
		}

		&__specs {
			background: #fff;
			margin-top: 16rpx;
			padding: 24rpx;
		}

		&__section-title {
			font-size: 28rpx;
			font-weight: 500;
			color: #333;
			display: block;
			margin-bottom: 16rpx;
		}

		&__spec-list {
			display: flex;
			flex-wrap: wrap;
			gap: 16rpx;
		}

		&__spec-item {
			padding: 12rpx 28rpx;
			border: 2rpx solid #ddd;
			border-radius: 8rpx;
			font-size: 24rpx;
			color: #666;

			&--active {
				border-color: #ff4757;
				color: #ff4757;
				background: #fff5f5;
			}
		}

		&__detail {
			background: #fff;
			margin-top: 16rpx;
			padding: 24rpx;
		}

		&__footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			background: #fff;
			padding: 16rpx 24rpx;
			padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
			gap: 20rpx;

			&-btn {
				flex: 1;
				text-align: center;
				padding: 20rpx 0;
				border-radius: 40rpx;
				font-size: 28rpx;

				&--cart {
					border: 2rpx solid #ff4757;
					color: #ff4757;
				}

				&--buy {
					background: #ff4757;
					color: #fff;
				}
			}
		}
	}
</style>
