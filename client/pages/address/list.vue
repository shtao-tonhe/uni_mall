<template>
	<view class="address-list">
		<nav-bar
			title="收货地址"
			:showBack="true"
			:statusBarHeight="statusBarHeight"
		></nav-bar>

		<scroll-view class="address-list__scroll" :style="{ top: navOffset + 'px' }" scroll-y>
			<empty-state
				v-if="list.length === 0 && !loading"
				type="address"
				title="暂无收货地址"
				description="添加地址以便下单"
				:showAction="false"
			></empty-state>

			<view
				v-for="item in list"
				:key="item.id"
				class="address-list__item"
				@click="selectItem(item)"
			>
				<view class="address-list__item-top">
					<text class="address-list__name">{{ item.name }}</text>
					<text class="address-list__phone">{{ item.phone }}</text>
					<text v-if="item.isDefault" class="address-list__default">默认</text>
				</view>
				<text class="address-list__detail">{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}</text>
				<view class="address-list__actions">
					<text class="address-list__edit" @click.stop="editItem(item.id)">编辑</text>
					<text class="address-list__delete" @click.stop="deleteItem(item.id)">删除</text>
				</view>
			</view>
		</scroll-view>

		<view class="address-list__add-btn" @click="addAddress">
			<text>+ 新增地址</text>
		</view>
	</view>
</template>

<script>
	import shareMixin from '../../common/utils/share'
	import { getAddressList, deleteAddress } from '../../common/api/base/user'

	export default {
		mixins: [shareMixin],
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 44,
				list: [],
				loading: false,
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
		},
		onShow() {
			this.fetchList()
		},
		methods: {
			async fetchList() {
				this.loading = true
				try {
					const res = await getAddressList()
					this.list = res.list || []
				} catch (e) {
					console.error('获取地址列表失败', e)
				} finally {
					this.loading = false
				}
			},
			selectItem(item) {
				uni.navigateTo({ url: `/pages/address/edit?id=${item.id}` })
			},
			addAddress() {
				uni.navigateTo({ url: '/pages/address/edit' })
			},
			editItem(id) {
				uni.navigateTo({ url: `/pages/address/edit?id=${id}` })
			},
			deleteItem(id) {
				uni.showModal({
					title: '提示',
					content: '确定要删除该地址吗？',
					success: async (res) => {
						if (res.confirm) {
							try {
								await deleteAddress(id)
								this.fetchList()
							} catch (e) {
								console.error('删除地址失败', e)
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.address-list {
		background: #f8f8f8;
		min-height: 100vh;

		&__scroll {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 120rpx;
			padding: 16rpx 24rpx;
		}

		&__item {
			background: #fff;
			border-radius: 12rpx;
			padding: 24rpx;
			margin-bottom: 16rpx;

			&-top {
				display: flex;
				align-items: center;
				margin-bottom: 12rpx;
			}
		}

		&__name {
			font-size: 28rpx;
			color: #333;
			font-weight: 500;
			margin-right: 16rpx;
		}

		&__phone {
			font-size: 26rpx;
			color: #666;
		}

		&__default {
			font-size: 20rpx;
			color: #ff4757;
			border: 2rpx solid #ff4757;
			border-radius: 4rpx;
			padding: 2rpx 8rpx;
			margin-left: 16rpx;
		}

		&__detail {
			font-size: 24rpx;
			color: #999;
			display: block;
			margin-bottom: 16rpx;
		}

		&__actions {
			display: flex;
			justify-content: flex-end;
			gap: 24rpx;
			padding-top: 16rpx;
			border-top: 2rpx solid #f8f8f8;
		}

		&__edit {
			font-size: 24rpx;
			color: #666;
		}

		&__delete {
			font-size: 24rpx;
			color: #ff4757;
		}

		&__add-btn {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background: #ff4757;
			color: #fff;
			text-align: center;
			padding: 24rpx 0;
			padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
			font-size: 28rpx;
		}
	}
</style>
