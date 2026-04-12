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

        <!-- デスクトップ：メインメニュー（ログイン時のみ） -->
        <div v-if="isClientLoggedIn" class="d-none d-md-flex align-center">
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

        <!-- 管理者ログイン（仮：本番前に削除） -->
        <v-btn
          v-if="!isClientLoggedIn"
          variant="text"
          class="d-none d-md-flex mx-1 text-none"
          @click="go('/admin/login')"
        >
          <v-icon start>mdi-shield-account</v-icon>
          管理者ログイン
        </v-btn>

        <!-- ===== 未ログイン時：ログイン/新規登録ボタン ===== -->
        <template v-if="!isClientLoggedIn">
          <v-btn
            variant="text"
            class="text-none ml-2 d-none d-sm-flex"
            @click="go('/login')"
          >
            ログイン
          </v-btn>
          <v-btn
            variant="flat"
            color="primary"
            class="text-none ml-1 d-none d-sm-flex"
            rounded="lg"
            size="small"
            @click="goSignup"
          >
            <v-icon start size="16">mdi-account-plus</v-icon>
            新規登録
          </v-btn>
          <!-- モバイル：アイコンだけ -->
          <v-btn
            icon
            class="d-sm-none ml-1"
            @click="go('/login')"
            aria-label="ログイン"
          >
            <v-icon>mdi-login</v-icon>
          </v-btn>
        </template>

        <!-- ===== ログイン済み：アイコン群 + アバターメニュー ===== -->
        <template v-else>
          <v-btn icon @click="go('/mypage?tab=notices')" aria-label="通知">
            <v-badge v-if="clientUnreadCount > 0" :content="clientUnreadCount" color="error" overlap>
              <v-icon>mdi-bell-outline</v-icon>
            </v-badge>
            <v-icon v-else>mdi-bell-outline</v-icon>
          </v-btn>

          <!-- アバターメニュー -->
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon v-bind="props" aria-label="アカウント">
                <v-avatar size="28"><v-icon>mdi-account-circle</v-icon></v-avatar>
              </v-btn>
            </template>
            <v-list density="comfortable">
              <v-list-item disabled>
                <v-list-item-title class="font-weight-medium">{{ clientUserName }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ clientUserEmail }}</v-list-item-subtitle>
              </v-list-item>
              <v-divider />
              <v-list-item @click="go('/mypage')">
                <template #prepend><v-icon>mdi-account</v-icon></template>
                <v-list-item-title>マイページ</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="isStaff" @click="go('/admin')">
                <template #prepend><v-icon>mdi-shield-account</v-icon></template>
                <v-list-item-title>管理</v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item @click="handleLogout">
                <template #prepend><v-icon>mdi-logout</v-icon></template>
                <v-list-item-title>ログアウト</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

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

      <!-- ルート遷移ローディング -->
      <v-progress-linear
        v-if="routeLoading"
        absolute
        location="bottom"
        color="primary"
        height="2"
        indeterminate
      />
    </v-app-bar>

    <!-- モバイル：右ドロワー -->
    <v-navigation-drawer
      v-model="mobileMenuOpen"
      location="right"
      temporary
      class="d-md-none"
      width="280"
    >
      <v-list density="comfortable">
        <!-- ユーザー情報（ログイン済み時） -->
        <template v-if="isClientLoggedIn">
          <v-list-item class="py-3">
            <template #prepend>
              <v-avatar size="36" color="primary" class="mr-3">
                <v-icon color="white">mdi-account</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-medium">{{ clientUserName }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption">{{ clientUserEmail }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider class="mb-1" />
        </template>

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

        <!-- ログイン/ログアウト -->
        <v-divider class="my-2" />
        <template v-if="isClientLoggedIn">
          <v-list-item @click="handleLogout">
            <template #prepend><v-icon>mdi-logout</v-icon></template>
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item @click="go('/login', true)">
            <template #prepend><v-icon>mdi-login</v-icon></template>
            <v-list-item-title>ログイン / 新規登録</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- 本文 -->
    <v-main>
      <slot />
    </v-main>

    <!-- モバイル：ボトムバー（mypageのみ表示） -->
    <v-bottom-navigation
      v-if="route.path === '/mypage'"
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
      <v-btn @click="go('/mypage?tab=profile')" :class="{'text-primary': isActive('/mypage?tab=profile')}">
        <v-icon>mdi-account-cog</v-icon>
        マイ情報
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { useClientAuth } from '~/composables/useClientAuth'

const router = useRouter()
const route = useRoute()
const theme = useTheme()
const {
  isLoggedIn: isClientLoggedIn,
  userName: clientUserName,
  userEmail: clientUserEmail,
  initialize: initAuth,
  signOut,
} = useClientAuth()

// お知らせ未読数
import { useClientNotices } from '~/composables/useClientNotices'
const { unreadCount: clientUnreadCount, fetchNotices } = useClientNotices()

// 認証初期化
onMounted(async () => {
  await initAuth()
  if (isClientLoggedIn.value) {
    fetchNotices()
  }
})

/** モバイルドロワー制御 */
const mobileMenuOpen = ref(false)
const drawerSide = ref<'right' | 'left'>('right')
const isRight = computed(() => drawerSide.value === 'right')

/** ルート遷移ローディング */
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

  const saved = localStorage.getItem('theme')
  if (saved) theme.global.name.value = saved
})
onUnmounted(() => window.removeEventListener('keydown', keyHandler))

/** テーマ切替 */
const toggleTheme = () => {
  const isDark = theme.current.value.dark
  theme.global.name.value = isDark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.global.name.value as string)
}

/** ロール判定 */
const isStaff = computed(() => false)

/** メニュー定義（「出店登録」「メッセージ」削除済み） */
type MenuItem = { title: string; to: string; icon: string }
const userMenu: MenuItem[] = [
  { title: 'マイページ', to: '/mypage', icon: 'mdi-home-outline' },
  { title: '管理者ログイン', to: '/admin/login', icon: 'mdi-shield-account' },
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

/** 新規登録ページ（signupタブ付き） */
const goSignup = () => {
  router.push({ path: '/login', query: { tab: 'signup' } })
}

/** 現在ルートの簡易判定 */
const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(to + '/')
}

/** ログアウト */
const handleLogout = async () => {
  await signOut()
  mobileMenuOpen.value = false
  router.push('/login')
}
</script>

<style scoped>
.border-b-thin { border-bottom: 1px solid rgba(0,0,0,.08); }
.cursor-pointer { cursor: pointer; }
.active-btn {
  font-weight: 600;
}
</style>
