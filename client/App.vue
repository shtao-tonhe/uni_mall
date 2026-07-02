<script>
	import { useAppStore } from './common/store/base/app'
	import { useUserStore } from './common/store/base/user'

	export default {
		onLaunch: function() {
			const info = uni.getSystemInfoSync()
			const appStore = useAppStore()
			appStore.setSystemInfo(info)

			const userStore = useUserStore()
			if (userStore.isLoggedIn) {
				userStore.fetchUserInfo()
			}
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		box-sizing: border-box;
	}
</style>
