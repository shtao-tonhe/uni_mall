import { defineStore } from 'pinia'
import { getUserInfo, updateUserInfo as apiUpdateUserInfo } from '../../api/base/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: uni.getStorageSync('token') || '',
    userInfo: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setToken(token) {
      this.token = token
      uni.setStorageSync('token', token)
    },
    logout() {
      this.token = ''
      this.userInfo = null
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
    },
    async fetchUserInfo() {
      try {
        const res = await getUserInfo()
        this.userInfo = res
        uni.setStorageSync('userInfo', res)
      } catch (e) {
        console.error('获取用户信息失败', e)
      }
    },
    async updateUserInfo(data) {
      const res = await apiUpdateUserInfo(data)
      this.userInfo = { ...this.userInfo, ...res }
      uni.setStorageSync('userInfo', this.userInfo)
    },
  },
})
