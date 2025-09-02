<template>
  <v-app>
    <!-- 左サイドナビゲーション -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      color="primary"
    >
      <!-- 開閉ボタン（常に表示） -->
      <div class="d-flex align-center pa-2">
        <v-icon v-if="!rail" class="mr-2">mdi-store</v-icon>
        <span v-if="!rail" class="text-h6">居抜き物件管理</span>
        <v-spacer v-if="!rail"></v-spacer>
        <v-btn
          :icon="rail ? 'mdi-menu' : 'mdi-menu-open'"
          variant="text"
          @click="rail = !rail"
        ></v-btn>
      </div>

      <v-divider></v-divider>

      <!-- メニュー項目 -->
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          :value="item.value"
          active-color="white"
          base-color="grey-lighten-1"
        >
          <v-tooltip
            v-if="rail"
            :text="item.title"
            location="end"
            activator="parent"
          ></v-tooltip>
        </v-list-item>
      </v-list>

      <!-- 下部設定メニュー -->
      <template v-slot:append>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-cog"
            title="設定"
            to="/admin/settings"
            value="settings"
            active-color="white"
            base-color="grey-lighten-1"
          >
            <v-tooltip
              v-if="rail"
              text="設定"
              location="end"
              activator="parent"
            ></v-tooltip>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- 上部アプリバー -->
    <!-- <v-app-bar elevation="1" color="white">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-lg-none"></v-app-bar-nav-icon> -->
      
      <!-- 検索バー -->
      <!-- <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="検索 (Ctrl+K)"
        variant="solo"
        density="compact"
        hide-details
        class="mx-4"
        style="max-width: 400px"
        @keydown.ctrl.k.prevent="focusSearch"
        ref="searchField"
      ></v-text-field>

      <v-spacer></v-spacer> -->

      <!-- 新規作成ボタン -->
      <!-- <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            v-bind="props"
            class="mr-2"
          >
            新規作成
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="item in createItems"
            :key="item.title"
            :prepend-icon="item.icon"
            :title="item.title"
            @click="item.action"
          ></v-list-item>
        </v-list>
      </v-menu> -->

      <!-- 通知ベル -->
      <!-- <v-btn icon class="mr-2">
        <v-badge
          :content="notificationCount"
          :model-value="notificationCount > 0"
          color="error"
        >
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn> -->

      <!-- ユーザーメニュー -->
      <!-- <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar size="32">
              <v-icon>mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            prepend-icon="mdi-account"
            title="プロフィール"
            subtitle="admin@example.com"
          ></v-list-item>
          <v-divider></v-divider>
          <v-list-item
            prepend-icon="mdi-logout"
            title="ログアウト"
            @click="logout"
          ></v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar> -->

    <!-- メインコンテンツ -->
    <v-main>
      <v-container fluid class="pa-4">
        <!-- パンくずリスト -->
        <v-breadcrumbs
          :items="breadcrumbs"
          divider="/"
          class="pa-0 mb-4"
        ></v-breadcrumbs>
        
        <!-- ページコンテンツ -->
        <slot />
      </v-container>
    </v-main>

    <!-- 右サイド詳細パネル -->
    <v-navigation-drawer
      v-model="detailPanel"
      location="right"
      temporary
      width="400"
    >
      <v-card flat>
        <v-card-title class="d-flex align-center">
          <span>詳細情報</span>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="detailPanel = false"
          ></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <!-- 詳細コンテンツはここに動的に表示 -->
          <slot name="detail" />
        </v-card-text>
      </v-card>
    </v-navigation-drawer>

    <!-- グローバルスナックバー -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar = false"
        >
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// UI状態
const drawer = ref(true)
const rail = ref(false)
const detailPanel = ref(false)
const search = ref('')
const searchField = ref(null)

// 通知
const notificationCount = ref(3)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// メニュー項目
const menuItems = ref([
  {
    icon: 'mdi-view-dashboard',
    title: 'ダッシュボード',
    to: '/admin',
    value: 'dashboard'
  },
  {
    icon: 'mdi-home-city',
    title: '物件管理',
    to: '/admin/properties',
    value: 'properties'
  },
  {
    icon: 'mdi-account-group',
    title: '顧客管理',
    to: '/admin/customers',
    value: 'customers'
  },
  {
    icon: 'mdi-briefcase',
    title: '営業',
    to: '/admin/sales/tasks',
    value: 'sales'
  },
  {
    icon: 'mdi-handshake',
    title: 'マッチング',
    to: '/admin/matching',
    value: 'matching'
  },
  {
    icon: 'mdi-chart-line',
    title: '分析',
    to: '/admin/analytics',
    value: 'analytics'
  }
])

// 新規作成メニュー
const createItems = ref([
  {
    icon: 'mdi-store-remove',
    title: '退店物件登録',
    action: () => navigateTo('/admin/properties/new?type=exit')
  },
  {
    icon: 'mdi-store-plus',
    title: '出店希望者登録',
    action: () => navigateTo('/admin/customers/new?type=open')
  },
  {
    icon: 'mdi-calendar-check',
    title: 'タスク作成',
    action: () => navigateTo('/admin/sales/tasks/new')
  }
])

// パンくずリスト
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(p => p)
  const items = []
  // const items = [{ title: 'ホーム', disabled: false, href: '/admin' }]
  
  let currentPath = ''
  const pathLabels = {
    'admin': '管理画面',
    'properties': '物件管理',
    'customers': '顧客管理',
    'sales': '営業',
    'tasks': 'タスク',
    'pipeline': 'パイプライン',
    'matching': 'マッチング',
    'analytics': '分析',
    'settings': '設定'
  }
  
  paths.forEach((path, index) => {
    if (path === 'admin' && index === 0) return
    currentPath += `/${path}`
    items.push({
      title: pathLabels[path] || path,
      disabled: index === paths.length - 1,
      href: currentPath
    })
  })
  
  return items
})

// メソッド
const focusSearch = () => {
  searchField.value?.focus()
}

const logout = () => {
  // ログアウト処理
  console.log('ログアウト')
  navigateTo('/login')
}

const navigateTo = (path) => {
  router.push(path)
}

const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

// キーボードショートカット
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      focusSearch()
    }
  })
})

// 外部に公開（子コンポーネントから使用可能）
defineExpose({
  showSnackbar,
  detailPanel
})
</script>

<style scoped>
/* カスタムスタイル */
.v-navigation-drawer--rail {
  opacity: 1 !important;
}

/* アクティブなメニュー項目の背景色 */
.v-list-item--active {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

/* ホバー時の背景色 */
.v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>