import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    tabBarConfig: [],
    systemInfo: null,
    statusBarHeight: 0,
    navBarHeight: 44,
  }),
  actions: {
    setSystemInfo(info) {
      this.systemInfo = info
      this.statusBarHeight = info.statusBarHeight || 0
    },
    setTabBarConfig(config) {
      this.tabBarConfig = config
    },
  },
})
