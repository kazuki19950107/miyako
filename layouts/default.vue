<template>
  <v-app>
    <!-- ヘッダー -->
    <v-app-bar elevation="0" color="white" class="border-b-thin">
      <v-container class="d-flex align-center">
        <!-- ロゴ -->
        <v-app-bar-nav-icon @click="$router.push('/')" class="logo-icon">
          <v-icon color="primary" size="28">mdi-store-outline</v-icon>
        </v-app-bar-nav-icon>

        <v-toolbar-title tag="div" class="logo-title" @click="$router.push('/')">
          <span class="main-title">みやこ</span>
          <span class="sub-title">居抜き物件マッチング</span>
        </v-toolbar-title>

        <v-spacer />

        <!-- デスクトップメニュー -->
        <div class="d-none d-md-flex align-center navbar-menu">
          <!-- 退店希望者メニュー -->
          <v-menu
            v-model="exitMenuOpen"
            transition="scale-transition"
            :close-on-content-click="false"
            offset-y
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                color="primary"
                variant="text"
                class="nav-btn"
              >
                <v-icon start>mdi-store-minus</v-icon>
                退店希望者
                <v-icon end>mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-card elevation="8" class="menu-card">
              <v-list>
                <v-list-item @click="goTo('/assessment')" class="menu-item">
                  <v-list-item-title>
                    <v-icon start color="primary">mdi-calculator</v-icon>
                    物件査定
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="goTo('/register')" class="menu-item">
                  <v-list-item-title>
                    <v-icon start color="primary">mdi-account-plus</v-icon>
                    新規登録
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>

          <!-- 出店希望者メニュー -->
          <v-menu
            v-model="enterMenuOpen"
            transition="scale-transition"
            :close-on-content-click="false"
            offset-y
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                color="primary"
                variant="text"
                class="nav-btn"
              >
                <v-icon start>mdi-store-plus</v-icon>
                出店希望者
                <v-icon end>mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-card elevation="8" class="menu-card">
              <v-list>
                <v-list-item @click="goTo('/register')" class="menu-item">
                  <v-list-item-title>
                    <v-icon start color="primary">mdi-account-plus</v-icon>
                    会員登録
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="goTo('/properties')" class="menu-item">
                  <v-list-item-title>
                    <v-icon start color="primary">mdi-magnify</v-icon>
                    物件検索
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>

          <!-- マイページ -->
          <v-btn
            @click="goTo('/mypage')"
            color="primary"
            variant="text"
            class="nav-btn"
          >
            <v-icon start>mdi-account-circle</v-icon>
            マイページ
          </v-btn>

          <!-- 管理者メニュー -->
          <v-menu
            v-if="isAdmin"
            v-model="adminMenuOpen"
            transition="scale-transition"
            :close-on-content-click="false"
            offset-y
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                color="secondary"
                variant="text"
                class="nav-btn"
              >
                <v-icon start>mdi-cog</v-icon>
                管理
                <v-icon end>mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-card elevation="8" class="menu-card">
              <v-list>
                <v-list-item @click="goTo('/admin/master')" class="menu-item">
                  <v-list-item-title>
                    <v-icon start color="secondary">mdi-database</v-icon>
                    マスタ管理
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="goTo('/admin/users')" class="menu-item">
                  <v-list-item-title>
                    <v-icon start color="secondary">mdi-account-group</v-icon>
                    ユーザー管理
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>

          <!-- ログアウト -->
          <v-btn
            @click="handleLogout"
            color="error"
            variant="outlined"
            class="logout-btn"
          >
            <v-icon start>mdi-logout</v-icon>
            ログアウト
          </v-btn>
        </div>

        <!-- モバイルメニュー -->
        <v-app-bar-nav-icon
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="d-md-none"
        >
          <v-icon>mdi-menu</v-icon>
        </v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>

    <!-- モバイルナビゲーション -->
    <v-navigation-drawer
      v-model="mobileMenuOpen"
      temporary
      location="right"
      class="mobile-nav"
    >
      <v-list>
        <v-list-item class="mobile-nav-header">
          <v-list-item-title class="font-weight-bold">みやこ</v-list-item-title>
          <v-list-item-subtitle>居抜き物件マッチング</v-list-item-subtitle>
        </v-list-item>
        
        <v-divider />

        <v-list-group>
          <template #activator="{ props }">
            <v-list-item v-bind="props" class="mobile-nav-item">
              <v-list-item-title>
                <v-icon start color="primary">mdi-store-minus</v-icon>
                退店希望者
              </v-list-item-title>
            </v-list-item>
          </template>
          
          <v-list-item @click="goTo('/assessment')" class="mobile-nav-subitem">
            <v-list-item-title>物件査定</v-list-item-title>
          </v-list-item>
          <v-list-item @click="goTo('/register')" class="mobile-nav-subitem">
            <v-list-item-title>新規登録</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group>
          <template #activator="{ props }">
            <v-list-item v-bind="props" class="mobile-nav-item">
              <v-list-item-title>
                <v-icon start color="primary">mdi-store-plus</v-icon>
                出店希望者
              </v-list-item-title>
            </v-list-item>
          </template>
          
          <v-list-item @click="goTo('/register')" class="mobile-nav-subitem">
            <v-list-item-title>会員登録</v-list-item-title>
          </v-list-item>
          <v-list-item @click="goTo('/properties')" class="mobile-nav-subitem">
            <v-list-item-title>物件検索</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item @click="goTo('/mypage')" class="mobile-nav-item">
          <v-list-item-title>
            <v-icon start color="primary">mdi-account-circle</v-icon>
            マイページ
          </v-list-item-title>
        </v-list-item>

        <v-list-group v-if="isAdmin">
          <template #activator="{ props }">
            <v-list-item v-bind="props" class="mobile-nav-item">
              <v-list-item-title>
                <v-icon start color="secondary">mdi-cog</v-icon>
                管理
              </v-list-item-title>
            </v-list-item>
          </template>
          
          <v-list-item @click="goTo('/admin/master')" class="mobile-nav-subitem">
            <v-list-item-title>マスタ管理</v-list-item-title>
          </v-list-item>
          <v-list-item @click="goTo('/admin/users')" class="mobile-nav-subitem">
            <v-list-item-title>ユーザー管理</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-divider />

        <v-list-item @click="handleLogout" class="mobile-nav-item logout-item">
          <v-list-item-title>
            <v-icon start color="error">mdi-logout</v-icon>
            ログアウト
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- メインコンテンツ -->
    <v-main class="main-content">
      <NuxtPage />
    </v-main>

    <!-- スナックバー -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="3000"
      color="primary"
      location="bottom right"
      class="custom-snackbar"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSnackbar } from '@/composables/useSnackbar'

const router = useRouter()
const authStore = useAuthStore()
const { getters, showSnackBar } = useSnackbar()
const snackbar = getters.snackbar()

const isAdmin = computed(() => authStore.userRole === 'admin')

// メニューの状態管理
const exitMenuOpen = ref(false)
const enterMenuOpen = ref(false)
const adminMenuOpen = ref(false)
const mobileMenuOpen = ref(false)

const isDesktop = ref(true)

onMounted(() => {
  isDesktop.value = window.innerWidth >= 768
  window.addEventListener('resize', () => {
    isDesktop.value = window.innerWidth >= 768
  })
})

// ナビゲーション処理
const goTo = (path) => {
  router.push(path)
  // モバイルメニューを閉じる
  mobileMenuOpen.value = false
  // デスクトップメニューを閉じる
  exitMenuOpen.value = false
  enterMenuOpen.value = false
  adminMenuOpen.value = false
}

// ログアウト処理
const handleLogout = () => {
  try {
    authStore.logout()
    localStorage.clear()
    sessionStorage.clear()
    showSnackBar('ログアウトしました')
    router.push('/admin/login')
  } catch (error) {
    console.error('ログアウトエラー:', error)
    showSnackBar('ログアウトに失敗しました')
  }
}
</script>

<style scoped>
/* ヘッダー */
.border-b-thin {
  border-bottom: 1px solid #e0e0e0;
}

/* ロゴ */
.logo-icon {
  margin-right: 8px;
}

.logo-title {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  line-height: 1.2;
}

.main-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2e7d32;
  margin-bottom: -2px;
}

.sub-title {
  font-size: 0.75rem;
  color: #757575;
  font-weight: 500;
}

/* ナビゲーション */
.navbar-menu {
  gap: 1rem;
}

.nav-btn {
  padding: 8px 16px;
  font-weight: 500;
  text-transform: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background-color: #f5f5f5;
  transform: translateY(-1px);
}

.logout-btn {
  margin-left: 16px;
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
}

/* メニューカード */
.menu-card {
  margin-top: 8px;
  border-radius: 12px;
  overflow: hidden;
}

.menu-item {
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: #f8f9fa;
  transform: translateX(4px);
}

.menu-item .v-list-item-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

/* モバイルナビゲーション */
.mobile-nav {
  min-width: 280px;
}

.mobile-nav-header {
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  color: white;
  padding: 20px 16px;
  margin-bottom: 8px;
}

.mobile-nav-item {
  padding: 12px 16px;
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-nav-item:hover {
  background-color: #f5f5f5;
}

.mobile-nav-subitem {
  padding: 8px 16px;
  margin: 2px 24px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.mobile-nav-subitem:hover {
  background-color: #e8f5e8;
}

.logout-item {
  margin-top: 8px;
  color: #d32f2f;
}

.logout-item:hover {
  background-color: #ffebee;
}

/* メインコンテンツ */
.main-content {
  background-color: #fafafa;
  min-height: 100vh;
}

/* スナックバー */
.custom-snackbar {
  border-radius: 12px;
}

/* レスポンシブ調整 */
@media (max-width: 768px) {
  .main-title {
    font-size: 1.2rem;
  }
  
  .sub-title {
    font-size: 0.65rem;
  }
}

/* テーマカラー */
:deep(.v-theme--light) {
  --v-theme-primary: #2e7d32;
  --v-theme-secondary: #ff9800;
  --v-theme-accent: #4caf50;
  --v-theme-error: #f44336;
  --v-theme-surface: #ffffff;
  --v-theme-background: #fafafa;
}

/* アニメーション */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* カスタムスクロールバー */
.mobile-nav::-webkit-scrollbar {
  width: 4px;
}

.mobile-nav::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.mobile-nav::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.mobile-nav::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
