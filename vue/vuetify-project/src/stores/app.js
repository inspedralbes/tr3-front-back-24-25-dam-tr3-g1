// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    username: null,
    army: null,
  }),

  actions: {
    setUsername(username) {
      this.username = username
    },
    setArmy(army) {
      this.army = army
    },
    getUsername() {
      return this.username
    },
    getArmy() {
      return this.army
    }
  }
})
