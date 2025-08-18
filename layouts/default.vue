<template>
  <v-app>
    <!-- ヘッダー -->
    <v-app-bar elevation="0" density="comfortable" class="border-b-thin">
      <v-container class="d-flex align-center">
        <!-- 左側トリガー（左ドロワーのときだけ出す） -->
        <v-app-bar-nav-icon
          v-if="!isRight"
          class="d-md-none"
          @click="mobileMenuOpen = true"
          aria-label="メニュー"
        />

        <!-- ロゴ/タイトル -->
        <div class="d-flex align-center cursor-pointer" @click="go('/')">
          <!-- <v-icon size="26" class="mr-2">mdi-store-outline</v-icon> -->
          <!-- 画像ロゴに変更。縦横を合わせてテキストと揃える -->
          <v-img
            src="/miyako-logo.png"
            width="26" height="26"
            class="mr-2"
            alt="MIYAKO ロゴ"
            cover
          />
          <div class="font-weight-bold">みやこ不動産企画</div>
        </div>

        <v-spacer />

        <!-- デスクトップ：メインメニュー（ロール別・アクティブ強調） -->
        <div class="d-none d-md-flex align-center">
          <v-btn
            v-for="item in mainMenu"
            :key="item.to"
            :variant="isActive(item.to) ? 'tonal' : 'text'"
            class="mx-1"
            :class="{'active-btn': isActive(item.to)}"
            @click="go(item.to)"
          >
            <v-icon start :icon="item.icon" />
            {{ item.title }}
          </v-btn>
        </div>

        <v-spacer class="d-none d-lg-flex" />

        <!-- デスクトップ：検索 -->
        <v-text-field
          v-model="q"
          class="d-none d-lg-flex"
          style="max-width: 280px"
          density="compact"
          variant="solo"
          hide-details
          prepend-inner-icon="mdi-magnify"
          placeholder="検索（Ctrl + K）"
          @keydown.enter="onSearch"
        />

        <!-- 右側アイコン群 -->
        <!-- <v-btn icon @click="toggleTheme" :aria-label="`テーマ切替`"><v-icon>mdi-theme-light-dark</v-icon></v-btn> -->
        <v-btn icon @click="go('/notifications')" aria-label="通知"><v-icon>mdi-bell-outline</v-icon></v-btn>
        

        <!-- アバターメニュー -->
        <v-menu>
          <template #activator="{ props }">
            <v-btn icon v-bind="props" aria-label="アカウント">
              <v-avatar size="28"><v-icon>mdi-account-circle</v-icon></v-avatar>
            </v-btn>
          </template>
          <v-list density="comfortable">
            <v-list-item @click="go('/mypage')">
              <template #prepend><v-icon>mdi-account</v-icon></template>
              <v-list-item-title>マイページ</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="isStaff" @click="go('/admin')">
              <template #prepend><v-icon>mdi-shield-account</v-icon></template>
              <v-list-item-title>管理</v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item @click="logout">
              <template #prepend><v-icon>mdi-logout</v-icon></template>
              <v-list-item-title>ログアウト</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- 右側トリガー（右ドロワーのときだけ出す） -->
        <v-btn
          v-if="isRight"
          class="d-md-none mr-1"
          icon
          @click="mobileMenuOpen = true"
          aria-label="メニュー"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>

      </v-container>

      <!-- ルート遷移ローディング（薄いライン） -->
      <v-progress-linear
        v-if="routeLoading"
        absolute
        location="bottom"
        color="primary"
        height="2"
        indeterminate
      />
    </v-app-bar>

    <!-- PC：クイックアクション列 -->
    <v-sheet class="border-b-thin d-none d-md-block">
      <v-container class="py-1 d-flex align-center">
        <v-btn size="small" variant="tonal" @click="go('/admin/exit-form')">
          <v-icon start>mdi-calculator-variant</v-icon> 簡易査定
        </v-btn>
        <v-btn size="small" variant="tonal" class="ml-2" @click="go('/admin/entry-form')">
          <v-icon start>mdi-file-account</v-icon> 出店履歴書
        </v-btn>
        <v-btn size="small" variant="tonal" class="ml-2" @click="go('/matches')">
          <v-icon start>mdi-handshake-outline</v-icon> マッチ一覧
        </v-btn>
        <v-spacer />
        <div class="text-caption text-medium-emphasis">Ctrl + K で検索</div>
      </v-container>
    </v-sheet>

    <!-- モバイル：右ドロワー -->
    <v-navigation-drawer
      v-model="mobileMenuOpen"
      location="right"
      temporary
      class="d-md-none"
      width="280"
    >
      <v-list density="comfortable">
        <v-list-subheader>メニュー</v-list-subheader>
        <v-list-item
          v-for="item in mainMenu"
          :key="item.to"
          @click="go(item.to, true)"
          :class="{'bg-grey-lighten-4': isActive(item.to)}"
        >
          <template #prepend><v-icon :icon="item.icon" /></template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2" />

        <v-list-subheader>クイック</v-list-subheader>
        <v-list-item @click="go('/admin/exit-form', true)">
          <template #prepend><v-icon>mdi-calculator-variant</v-icon></template>
          <v-list-item-title>簡易査定</v-list-item-title>
        </v-list-item>
        <v-list-item @click="go('/admin/entry-form', true)">
          <template #prepend><v-icon>mdi-file-account</v-icon></template>
          <v-list-item-title>出店履歴書</v-list-item-title>
        </v-list-item>
        <v-list-item @click="go('/matches', true)">
          <template #prepend><v-icon>mdi-handshake-outline</v-icon></template>
          <v-list-item-title>マッチ一覧</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 本文 -->
    <v-main>
      <slot />
    </v-main>

    <!-- モバイル：ボトムバー（クイックアクセス） -->
    <v-bottom-navigation
      class="d-md-none"
      grow
      mode="shift"
      height="64"
      app
    >
      <v-btn @click="go('/')" :class="{'text-primary': isActive('/')}">
        <v-icon>mdi-home-outline</v-icon>
        ホーム
      </v-btn>
      <v-btn @click="go('/sell/quick')" :class="{'text-primary': isActive('/sell')}">
        <v-icon>mdi-calculator-variant</v-icon>
        査定
      </v-btn>
      <v-btn @click="go('/entry/resume')" :class="{'text-primary': isActive('/entry')}">
        <v-icon>mdi-file-account</v-icon>
        履歴書
      </v-btn>
      <v-btn @click="go('/matches')" :class="{'text-primary': isActive('/matches')}">
        <v-icon>mdi-handshake-outline</v-icon>
        マッチ
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
// import { useAuthStore } from '@/stores/auth' // 本番はこれを使ってロール判定

const router = useRouter()
const route = useRoute()
const theme = useTheme()

/** モバイルドロワー制御 */
const mobileMenuOpen = ref(false)
// ドロワーの出る側を設定（'right' | 'left'）
const drawerSide = ref<'right' | 'left'>('right')
const isRight = computed(() => drawerSide.value === 'right')


/** ルート遷移ローディング（before/afterEach で制御） */
const routeLoading = ref(false)
router.beforeEach((_to, _from, next) => {
  routeLoading.value = true
  next()
})
router.afterEach(() => {
  routeLoading.value = false
})
router.onError(() => {
  routeLoading.value = false
})

/** 検索 */
const q = ref('')
const onSearch = () => {
  if (!q.value) return
  router.push({ path: '/search', query: { q: q.value } })
}

/** Ctrl/Cmd + K で検索フォーカス */
let keyHandler: any
onMounted(() => {
  keyHandler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      const input = document.querySelector('input[placeholder*="検索"]') as HTMLInputElement
      input?.focus()
    }
  }
  window.addEventListener('keydown', keyHandler)

  // 起動時にテーマ読み込み
  const saved = localStorage.getItem('theme')
  if (saved) theme.global.name.value = saved
})
onUnmounted(() => window.removeEventListener('keydown', keyHandler))

/** テーマ切替（永続化） */
const toggleTheme = () => {
  const isDark = theme.current.value.dark
  theme.global.name.value = isDark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.global.name.value as string)
}

/** ロール判定（ダミー）。本番は authStore.role を参照 */
// const auth = useAuthStore()
// const isStaff = computed(() => ['staff', 'admin'].includes(auth.role))
const isStaff = computed(() => false) // ←必要に応じて接続

/** メニュー定義 */
type MenuItem = { title: string; to: string; icon: string }
const userMenu: MenuItem[] = [
  { title: 'マイページ', to: '/mypage', icon: 'mdi-home-outline' },
  { title: '退店査定', to: '/admin/exit-form', icon: 'mdi-store-remove-outline' },
  { title: '出店登録', to: '/admin/entry-form', icon: 'mdi-store-plus-outline' },
  { title: 'メッセージ', to: '/messages', icon: 'mdi-email-outline' }
]
const staffMenu: MenuItem[] = [
  { title: 'ダッシュボード', to: '/admin', icon: 'mdi-view-dashboard-outline' },
  { title: 'リード', to: '/admin/leads', icon: 'mdi-account-search-outline' },
  { title: '退店物件', to: '/admin/exits', icon: 'mdi-store-outline' },
  { title: '出店希望', to: '/admin/entries', icon: 'mdi-account-tie-outline' },
  { title: 'マッチ', to: '/admin/matches', icon: 'mdi-handshake-outline' },
  { title: 'カレンダー', to: '/admin/calendar', icon: 'mdi-calendar-outline' },
  { title: 'レポート', to: '/admin/reports', icon: 'mdi-chart-bar' }
]
const mainMenu = computed<MenuItem[]>(() => (isStaff.value ? staffMenu : userMenu))

/** 遷移ヘルパー */
const go = (to: string, closeDrawer = false) => {
  if (closeDrawer) mobileMenuOpen.value = false
  if (to === route.path) return
  router.push(to)
}

/** 現在ルートの簡易判定（prefix一致） */
const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(to + '/')
}

/** ログアウト（ダミー） */
const logout = () => {
  // ここで authStore.logout() 等を実装
  router.push('/login')
}
</script>

<style scoped>
.border-b-thin { border-bottom: 1px solid rgba(0,0,0,.08); }
.cursor-pointer { cursor: pointer; }

/* アクティブメニューの視認性UP */
.active-btn {
  font-weight: 600;
}

/* モバイル下部のボトムバーが重ならないよう、Vuetifyの app プロップで処理 */
</style>
