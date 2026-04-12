import { navigateTo } from '#app'
import { useAuthStore } from '@/stores/auth'
import { useClientAuth } from '~/composables/useClientAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  // ─── 管理者ルート（/admin/*） ───
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    const authStore = useAuthStore()
    // cookieからセッション復元（初回のみサーバーに問い合わせ）
    const isAdmin = await authStore.checkAuth()
    if (!isAdmin) {
      return navigateTo('/admin/login')
    }
  }

  // ─── 出店希望者ルート（/mypage） ───
  if (to.path === '/mypage') {
    // Supabaseセッションは localStorage に保存されるため、サーバーサイドではスキップ
    if (import.meta.server) return
    const { isLoggedIn, initialize } = useClientAuth()
    await initialize()
    if (!isLoggedIn.value) {
      return navigateTo('/login')
    }
  }
})
