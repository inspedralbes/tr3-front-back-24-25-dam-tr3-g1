// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    user: null,
  }),

  actions: {
    setUser(user) {
      this.user = user
    },
    getUser() {
      return this.user
    }
  }
})
