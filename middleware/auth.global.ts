import { navigateTo } from '#app';
import { useAuthStore } from '@/stores/auth'; // Piniaストアをインポート

export default defineNuxtRouteMiddleware((to) => {
  // ストアからユーザー情報を取得
  const authStore = useAuthStore();
  
  // 🚀 テスト用に強制ログイン
  authStore.userRole = "admin"; // ここで強制的にログイン済みにする
  
  // ログインが必要なパスかどうかを判定
  const authRequired = to.path !== '/admin/login' && (to.path === '/' || to.path.startsWith('/admin'));

  // 未ログイン状態のチェック（roleが空かどうかで判断）
  const isLoggedIn = !!authStore.userRole;

  // リダイレクト処理
  if (authRequired && !isLoggedIn) {
    console.log('未ログインのためリダイレクト');
    return navigateTo('/admin/login');
  }
});
