<template>
	<view class="login">
		<nav-bar
			title="登录"
			:showBack="true"
			:statusBarHeight="statusBarHeight"
		></nav-bar>

		<view class="login__body" :style="{ paddingTop: navOffset + 60 + 'px' }">
			<text class="login__title">欢迎来到 uni_mall</text>
			<text class="login__subtitle">登录后享受完整购物体验</text>

			<view class="login__form">
				<view class="login__field">
					<text class="login__field-label">手机号</text>
					<input
						class="login__field-input"
						v-model="phone"
						type="number"
						maxlength="11"
						placeholder="请输入手机号"
					/>
				</view>
				<view class="login__field">
					<text class="login__field-label">验证码</text>
					<input
						class="login__field-input"
						v-model="code"
						type="number"
						maxlength="6"
						placeholder="请输入验证码"
					/>
					<text class="login__code-btn" @click="sendCode">
						{{ codeText }}
					</text>
				</view>
			</view>

			<view class="login__btn" @click="handleLogin">
				<text>登录</text>
			</view>

			<view class="login__wechat" @click="wechatLogin">
				<text class="login__wechat-icon">💬</text>
				<text class="login__wechat-text">微信一键登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { login } from '../../common/api/base/user'
	import { useUserStore } from '../../common/store/base/user'

	export default {
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 44,
				phone: '',
				code: '',
				codeText: '获取验证码',
				codeSending: false,
				redirect: '/pages/index/index',
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
			if (query.redirect) {
				this.redirect = decodeURIComponent(query.redirect)
			}
		},
		methods: {
			sendCode() {
				if (this.codeSending) return
				if (!this.phone || !/^1\d{10}$/.test(this.phone)) {
					uni.showToast({ title: '请输入正确手机号', icon: 'none' })
					return
				}
				this.codeSending = true
				let count = 60
				this.codeText = `${count}s`
				const timer = setInterval(() => {
					count--
					if (count <= 0) {
						clearInterval(timer)
						this.codeText = '重新获取'
						this.codeSending = false
					} else {
						this.codeText = `${count}s`
					}
				}, 1000)
				uni.showToast({ title: '验证码已发送', icon: 'success' })
			},
			async handleLogin() {
				if (!this.phone || !this.code) {
					uni.showToast({ title: '请填写完整信息', icon: 'none' })
					return
				}
				try {
					const res = await login({ phone: this.code, code: this.code })
					const store = useUserStore()
					store.setToken(res.token)
					await store.fetchUserInfo()
					uni.showToast({ title: '登录成功', icon: 'success' })
					setTimeout(() => {
						uni.redirectTo({ url: this.redirect })
					}, 500)
				} catch (e) {
					console.error('登录失败', e)
				}
			},
			wechatLogin() {
				uni.showToast({ title: '微信登录开发中', icon: 'none' })
			}
		}
	}
</script>

<style lang="scss">
	.login {
		min-height: 100vh;
		background: #fff;

		&__body {
			padding: 0 40rpx;
		}

		&__title {
			font-size: 40rpx;
			font-weight: 700;
			color: #333;
			display: block;
			text-align: center;
			margin-bottom: 12rpx;
		}

		&__subtitle {
			font-size: 26rpx;
			color: #999;
			display: block;
			text-align: center;
			margin-bottom: 60rpx;
		}

		&__form {
			margin-bottom: 48rpx;
		}

		&__field {
			display: flex;
			align-items: center;
			border-bottom: 2rpx solid #f0f0f0;
			padding: 24rpx 0;
			margin-bottom: 16rpx;

			&-label {
				font-size: 28rpx;
				color: #333;
				width: 100rpx;
				flex-shrink: 0;
			}

			&-input {
				flex: 1;
				font-size: 28rpx;
				color: #333;
			}
		}

		&__code-btn {
			font-size: 24rpx;
			color: #ff4757;
			flex-shrink: 0;
			padding: 8rpx 16rpx;
			border: 2rpx solid #ff4757;
			border-radius: 8rpx;
		}

		&__btn {
			background: #ff4757;
			color: #fff;
			text-align: center;
			padding: 28rpx 0;
			border-radius: 40rpx;
			font-size: 30rpx;
			margin-bottom: 32rpx;
		}

		&__wechat {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 24rpx 0;
			border: 2rpx solid #ddd;
			border-radius: 40rpx;

			&-icon {
				font-size: 32rpx;
				margin-right: 12rpx;
			}

			&-text {
				font-size: 28rpx;
				color: #666;
			}
		}
	}
</style>
