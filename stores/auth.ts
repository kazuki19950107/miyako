import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userRole: '',
    agencyId: '',
    userId: '',
    userName: '',
    initialized: false,
  }),
  actions: {
    setUser(user: { id: string; name: string; role: string; company_id?: string }) {
      this.userId = user.id
      this.userName = user.name
      this.userRole = user.role
      this.agencyId = user.company_id || ''
    },
    // サーバーAPIでログイン（アカウント名 + パスワード）
    async login(accountName: string, password: string): Promise<{ success: boolean; error?: string }> {
      try {
        const res = await $fetch<{ success: boolean; error?: string; user?: any }>('/api/admin/login', {
          method: 'POST',
          body: { accountName, password },
        })

        if (res.success && res.user) {
          this.setUser(res.user)
          return { success: true }
        }
        return { success: false, error: res.error || 'ログインに失敗しました' }
      } catch (e: any) {
        return { success: false, error: 'ログイン処理に失敗しました' }
      }
    },
    // サーバーcookieからセッション復元
    async checkAuth(): Promise<boolean> {
      if (this.initialized) return !!this.userRole
      this.initialized = true

      try {
        const res = await $fetch<{ success: boolean; user?: any }>('/api/admin/check-auth')
        if (res.success && res.user) {
          this.setUser(res.user)
          return true
        }
        return false
      } catch {
        return false
      }
    },
    // ログアウト
    async logout() {
      try {
        await $fetch('/api/admin/logout', { method: 'POST' })
      } catch {
        // cookieが消えなくてもstateはクリア
      }
      this.userRole = ''
      this.agencyId = ''
      this.userId = ''
      this.userName = ''
      this.initialized = false
    },
  },
})
