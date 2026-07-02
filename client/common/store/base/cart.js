import { defineStore } from 'pinia'
import { getCartList, addToCart as apiAddToCart, updateCartItem, removeCartItem, clearCart as apiClearCart } from '../../api/base/cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    selectedIds: [],
  }),
  getters: {
    totalCount: (state) => state.items.reduce((sum, item) => sum + item.count, 0),
    totalPrice: (state) => {
      return state.items
        .filter(item => state.selectedIds.includes(item.id))
        .reduce((sum, item) => sum + item.price * item.count, 0)
    },
    selectedItems: (state) => {
      return state.items.filter(item => state.selectedIds.includes(item.id))
    },
    isEmpty: (state) => state.items.length === 0,
  },
  actions: {
    async fetchCart() {
      try {
        const res = await getCartList()
        this.items = res.items || []
      } catch (e) {
        console.error('获取购物车失败', e)
      }
    },
    async addToCart(productId, skuId, count) {
      await apiAddToCart({ productId, skuId, count })
      await this.fetchCart()
      uni.showToast({ title: '已加入购物车', icon: 'success' })
    },
    async updateCount(id, count) {
      await updateCartItem(id, { count })
      const item = this.items.find(i => i.id === id)
      if (item) item.count = count
    },
    async removeItem(id) {
      await removeCartItem(id)
      this.items = this.items.filter(i => i.id !== id)
      this.selectedIds = this.selectedIds.filter(sid => sid !== id)
    },
    async clearCart() {
      await apiClearCart()
      this.items = []
      this.selectedIds = []
    },
    toggleSelect(id) {
      const idx = this.selectedIds.indexOf(id)
      if (idx > -1) {
        this.selectedIds.splice(idx, 1)
      } else {
        this.selectedIds.push(id)
      }
    },
    toggleSelectAll(selected) {
      if (selected) {
        this.selectedIds = this.items.map(i => i.id)
      } else {
        this.selectedIds = []
      }
    },
  },
})
