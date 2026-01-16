<template>
  <v-container fluid>
    <!-- ページヘッダー -->
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 font-weight-bold">物件管理</h1>
        <p class="text-grey-darken-1">BizFlo連携 - 物件一覧・新規登録</p>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openNewPropertyDialog">
          新規物件登録
        </v-btn>
      </v-col>
    </v-row>

    <!-- フィルター -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          label="検索"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          placeholder="屋号、住所、依頼者名..."
          clearable
          @update:model-value="handleSearch"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="filterLifecycle"
          label="ステージ"
          :items="lifecycleOptions"
          variant="outlined"
          density="compact"
          @update:model-value="fetchData"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="filterStatus"
          label="ステータス"
          :items="statusOptions"
          variant="outlined"
          density="compact"
          @update:model-value="fetchData"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-btn
          variant="outlined"
          block
          @click="fetchData"
          :loading="loading"
        >
          <v-icon left>mdi-refresh</v-icon>
          更新
        </v-btn>
      </v-col>
    </v-row>

    <!-- 物件一覧 -->
    <v-card elevation="2">
      <v-card-title class="d-flex align-center justify-space-between">
        <span>物件一覧</span>
        <v-chip color="primary" variant="tonal">
          {{ filteredProperties.length }}件
        </v-chip>
      </v-card-title>
      <v-divider></v-divider>

      <!-- ローディング -->
      <v-progress-linear v-if="loading" indeterminate color="primary" />

      <!-- エラー表示 -->
      <v-alert v-if="error" type="error" class="ma-4">
        {{ error }}
      </v-alert>

      <!-- テーブル -->
      <v-data-table
        v-if="!loading && !error"
        :headers="tableHeaders"
        :items="filteredProperties"
        :items-per-page="10"
        class="elevation-0"
        hover
        @click:row="handleRowClick"
      >
        <!-- ステージ列 -->
        <template v-slot:item.lifecycle_stage="{ item }">
          <v-chip
            :color="getLifecycleColor(item.lifecycle_stage)"
            size="small"
            variant="tonal"
          >
            {{ getLifecycleLabel(item.lifecycle_stage) }}
          </v-chip>
        </template>

        <!-- ステータス列 -->
        <template v-slot:item.master_status="{ item }">
          <v-chip
            :color="getStatusColor(item.master_status)"
            size="small"
            variant="outlined"
          >
            {{ item.master_status }}
          </v-chip>
        </template>

        <!-- 住所列 -->
        <template v-slot:item.address="{ item }">
          <div class="text-truncate" style="max-width: 200px;">
            {{ [item.prefecture, item.city, item.address].filter(Boolean).join(' ') }}
          </div>
        </template>

        <!-- 日付列 -->
        <template v-slot:item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <!-- アクション列 -->
        <template v-slot:item.actions="{ item }">
          <v-btn
            color="primary"
            size="small"
            variant="tonal"
            @click.stop="goToExitForm(item.id)"
          >
            <v-icon left size="small">mdi-pencil</v-icon>
            編集
          </v-btn>
        </template>
      </v-data-table>

      <!-- 空の状態 -->
      <v-card-text v-if="!loading && !error && filteredProperties.length === 0" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1">mdi-home-search</v-icon>
        <p class="text-h6 text-grey-darken-1 mt-4">物件が見つかりません</p>
        <p class="text-body-2 text-grey">新規物件を登録してください</p>
        <v-btn color="primary" class="mt-4" @click="openNewPropertyDialog">
          <v-icon left>mdi-plus</v-icon>
          新規物件登録
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- 新規物件登録ダイアログ -->
    <v-dialog v-model="newPropertyDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h5">
          <v-icon left color="primary">mdi-home-plus</v-icon>
          新規物件登録
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-form ref="newPropertyForm" v-model="formValid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newProperty.shop_name"
                  label="屋号 *"
                  variant="outlined"
                  :rules="[v => !!v || '屋号は必須です']"
                  placeholder="例: イタリアン酒場"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="newProperty.prefecture"
                  label="都道府県 *"
                  variant="outlined"
                  :rules="[v => !!v || '都道府県は必須です']"
                  placeholder="例: 大阪府"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="newProperty.city"
                  label="市区町村 *"
                  variant="outlined"
                  :rules="[v => !!v || '市区町村は必須です']"
                  placeholder="例: 大阪市北区"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="newProperty.address"
                  label="番地"
                  variant="outlined"
                  placeholder="例: 曽根崎2-1-12"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newProperty.requester_name"
                  label="依頼者名"
                  variant="outlined"
                  placeholder="例: 田中太郎"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newProperty.requester_phone"
                  label="電話番号"
                  variant="outlined"
                  placeholder="例: 090-1234-5678"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newProperty.echo_source"
                  label="反響元"
                  :items="echoSourceOptions"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newProperty.master_status"
                  label="ステータス"
                  :items="initialStatusOptions"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="newPropertyDialog = false">
            キャンセル
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :loading="creating"
            :disabled="!formValid"
            @click="createProperty"
          >
            登録して編集へ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMiyakoProperties, type MiyakoPropertyListItem } from '~/composables/useMiyakoProperties'

// ページメタ設定
definePageMeta({
  layout: 'admin'
})

const router = useRouter()
const {
  properties,
  loading,
  error,
  fetchProperties
} = useMiyakoProperties()

// State
const searchQuery = ref('')
const filterLifecycle = ref('all')
const filterStatus = ref('all')
const newPropertyDialog = ref(false)
const formValid = ref(false)
const creating = ref(false)
const newPropertyForm = ref(null)

const newProperty = ref({
  shop_name: '',
  prefecture: '',
  city: '',
  address: '',
  requester_name: '',
  requester_phone: '',
  echo_source: '反響（DM）',
  master_status: '保留中'
})

// Options
const lifecycleOptions = [
  { title: 'すべて', value: 'all' },
  { title: '見込み', value: 'prospect' },
  { title: '物件化済み', value: 'property' },
  { title: 'アーカイブ', value: 'archived' }
]

const statusOptions = [
  { title: 'すべて', value: 'all' },
  { title: '保留中', value: '保留中' },
  { title: '訪問結果待ち', value: '訪問結果待ち' },
  { title: '値付けOK', value: '値付けOK' },
  { title: '値付けNG', value: '値付けNG' },
  { title: '募集中', value: '募集中' },
  { title: '商談中', value: '商談中' },
  { title: '成約', value: '成約' }
]

const echoSourceOptions = [
  '反響（DM）',
  '反響（電話）',
  '反響（HP）',
  '紹介',
  'その他'
]

const initialStatusOptions = [
  '保留中',
  '訪問結果待ち'
]

// Table headers
const tableHeaders = [
  { title: '屋号', key: 'shop_name', sortable: true },
  { title: '住所', key: 'address', sortable: false },
  { title: 'ステージ', key: 'lifecycle_stage', sortable: true },
  { title: 'ステータス', key: 'master_status', sortable: true },
  { title: '依頼者', key: 'requester_name', sortable: true },
  { title: '反響元', key: 'echo_source', sortable: true },
  { title: '登録日', key: 'created_at', sortable: true },
  { title: '', key: 'actions', sortable: false, align: 'end' }
]

// Computed
const filteredProperties = computed(() => {
  let result = properties.value

  // 検索フィルター
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      (p.shop_name?.toLowerCase().includes(query)) ||
      (p.prefecture?.toLowerCase().includes(query)) ||
      (p.city?.toLowerCase().includes(query)) ||
      (p.address?.toLowerCase().includes(query)) ||
      (p.requester_name?.toLowerCase().includes(query))
    )
  }

  // ライフサイクルフィルター
  if (filterLifecycle.value !== 'all') {
    result = result.filter(p => p.lifecycle_stage === filterLifecycle.value)
  }

  // ステータスフィルター
  if (filterStatus.value !== 'all') {
    result = result.filter(p => p.master_status === filterStatus.value)
  }

  return result
})

// Methods
const fetchData = async () => {
  await fetchProperties({ lifecycleStage: 'all' })
}

const handleSearch = () => {
  // 検索はcomputedで処理されるので、特に処理不要
}

const handleRowClick = (event: Event, { item }: { item: MiyakoPropertyListItem }) => {
  goToExitForm(item.id)
}

const goToExitForm = (id: string) => {
  router.push(`/admin/exit-form?id=${id}`)
}

const openNewPropertyDialog = () => {
  // フォームリセット
  newProperty.value = {
    shop_name: '',
    prefecture: '',
    city: '',
    address: '',
    requester_name: '',
    requester_phone: '',
    echo_source: '反響（DM）',
    master_status: '保留中'
  }
  newPropertyDialog.value = true
}

const createProperty = async () => {
  if (!formValid.value) return

  creating.value = true
  try {
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()

    const { data, error: insertError } = await supabase
      .from('MIYAKO_PROPERTIES')
      .insert({
        shop_name: newProperty.value.shop_name,
        prefecture: newProperty.value.prefecture,
        city: newProperty.value.city,
        address: newProperty.value.address,
        requester_name: newProperty.value.requester_name,
        requester_phone: newProperty.value.requester_phone,
        echo_source: newProperty.value.echo_source,
        master_status: newProperty.value.master_status,
        lifecycle_stage: 'prospect',
        echo_datetime: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) throw insertError

    newPropertyDialog.value = false

    // 新規作成した物件の編集画面へ遷移
    if (data?.id) {
      router.push(`/admin/exit-form?id=${data.id}`)
    }
  } catch (e: any) {
    console.error('createProperty error:', e)
    alert('物件の登録に失敗しました: ' + e.message)
  } finally {
    creating.value = false
  }
}

const getLifecycleColor = (stage: string) => {
  switch (stage) {
    case 'prospect': return 'blue'
    case 'property': return 'green'
    case 'archived': return 'grey'
    default: return 'default'
  }
}

const getLifecycleLabel = (stage: string) => {
  switch (stage) {
    case 'prospect': return '見込み'
    case 'property': return '物件化済み'
    case 'archived': return 'アーカイブ'
    default: return stage
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case '保留中': return 'grey'
    case '訪問結果待ち': return 'orange'
    case '値付けOK': return 'blue'
    case '値付けNG': return 'red'
    case '募集中': return 'green'
    case '商談中': return 'purple'
    case '成約': return 'success'
    default: return 'default'
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.v-data-table :deep(tbody tr) {
  cursor: pointer;
}

.v-data-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
}
</style>
