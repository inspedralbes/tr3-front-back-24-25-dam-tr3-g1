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
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: localStorage, // Usa localStorage para persistir los datos
      },
    ],
  },
})
