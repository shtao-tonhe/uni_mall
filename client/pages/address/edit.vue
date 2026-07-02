<template>
	<view class="address-edit">
		<nav-bar
			:title="isEdit ? '编辑地址' : '新增地址'"
			:showBack="true"
			:statusBarHeight="statusBarHeight"
		></nav-bar>

		<view class="address-edit__form" :style="{ paddingTop: navOffset + 20 + 'px' }">
			<view class="address-edit__field">
				<text class="address-edit__label">收货人</text>
				<input class="address-edit__input" v-model="form.name" placeholder="请输入收货人姓名" />
			</view>
			<view class="address-edit__field">
				<text class="address-edit__label">手机号</text>
				<input class="address-edit__input" v-model="form.phone" placeholder="请输入手机号" type="number" maxlength="11" />
			</view>
			<view class="address-edit__field" @click="chooseRegion">
				<text class="address-edit__label">所在地区</text>
				<text class="address-edit__input" :class="{ 'address-edit__input--placeholder': !form.region }">
					{{ form.region || '请选择省/市/区' }}
				</text>
				<text class="address-edit__arrow">›</text>
			</view>
			<view class="address-edit__field">
				<text class="address-edit__label">详细地址</text>
				<input class="address-edit__input" v-model="form.detail" placeholder="请输入街道、门牌号等" />
			</view>
			<view class="address-edit__field address-edit__field--switch">
				<text class="address-edit__label">设为默认地址</text>
				<switch :checked="form.isDefault" color="#ff4757" @change="form.isDefault = !form.isDefault" />
			</view>
		</view>

		<view class="address-edit__save" @click="save">
			<text>保存</text>
		</view>
	</view>
</template>

<script>
	import { addAddress, updateAddress } from '../../common/api/base/user'

	export default {
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 44,
				isEdit: false,
				id: null,
				form: {
					name: '',
					phone: '',
					region: '',
					province: '',
					city: '',
					district: '',
					detail: '',
					isDefault: false,
				}
			}
		},
		computed: {
			navOffset() {
				return this.statusBarHeight + this.navBarHeight
			}
		},
		onLoad(query) {
			const info = uni.getSystemInfoSync()
			this.statusBarHeight = info.statusBarHeight || 0
			if (query.id) {
				this.isEdit = true
				this.id = query.id
			}
		},
		methods: {
			chooseRegion() {
				uni.chooseLocation({
					success: (res) => {
						this.form.region = res.address
					}
				})
			},
			validate() {
				if (!this.form.name) return '请输入收货人姓名'
				if (!this.form.phone || !/^1\d{10}$/.test(this.form.phone)) return '请输入正确的手机号'
				if (!this.form.region) return '请选择所在地区'
				if (!this.form.detail) return '请输入详细地址'
				return ''
			},
			async save() {
				const err = this.validate()
				if (err) {
					uni.showToast({ title: err, icon: 'none' })
					return
				}
				try {
					if (this.isEdit) {
						await updateAddress(this.id, this.form)
					} else {
						await addAddress(this.form)
					}
					uni.showToast({ title: '保存成功', icon: 'success' })
					setTimeout(() => uni.navigateBack(), 500)
				} catch (e) {
					console.error('保存地址失败', e)
				}
			}
		}
	}
</script>

<style lang="scss">
	.address-edit {
		background: #f8f8f8;
		min-height: 100vh;

		&__form {
			padding: 0 24rpx;
		}

		&__field {
			background: #fff;
			padding: 24rpx;
			border-radius: 12rpx;
			margin-bottom: 16rpx;
			display: flex;
			align-items: center;

			&--switch {
				justify-content: space-between;
			}
		}

		&__label {
			font-size: 28rpx;
			color: #333;
			width: 160rpx;
			flex-shrink: 0;
		}

		&__input {
			flex: 1;
			font-size: 28rpx;
			color: #333;

			&--placeholder {
				color: #ccc;
			}
		}

		&__arrow {
			font-size: 36rpx;
			color: #ccc;
			flex-shrink: 0;
		}

		&__save {
			margin: 40rpx 24rpx;
			background: #ff4757;
			color: #fff;
			text-align: center;
			padding: 24rpx 0;
			border-radius: 40rpx;
			font-size: 28rpx;
		}
	}
</style>
