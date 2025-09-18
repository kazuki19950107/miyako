<template>
  <v-container fluid>
    <!-- ページヘッダー -->
    <!-- <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 font-weight-bold">ダッシュボード</h1>
        <p class="text-grey-darken-1">本日の活動状況と重要指標</p>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-refresh" @click="refreshData">
          更新
        </v-btn>
      </v-col>
    </v-row> -->

    <!-- KPIカード -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-grey-darken-1 mb-1">本日の新規（退店）</p>
                <p class="text-h4 font-weight-bold">{{ kpiData.todayExit }}</p>
                <div class="d-flex align-center mt-1">
                  <v-icon 
                    :color="kpiData.exitTrend > 0 ? 'success' : 'error'" 
                    size="small"
                  >
                    {{ kpiData.exitTrend > 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                  </v-icon>
                  <span class="text-caption ml-1">
                    {{ Math.abs(kpiData.exitTrend) }}% 前日比
                  </span>
                </div>
              </div>
              <v-avatar color="blue-lighten-4" size="48">
                <v-icon color="blue" size="24">mdi-store-remove</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-grey-darken-1 mb-1">本日の新規（出店）</p>
                <p class="text-h4 font-weight-bold">{{ kpiData.todayOpen }}</p>
                <div class="d-flex align-center mt-1">
                  <v-icon 
                    :color="kpiData.openTrend > 0 ? 'success' : 'error'" 
                    size="small"
                  >
                    {{ kpiData.openTrend > 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                  </v-icon>
                  <span class="text-caption ml-1">
                    {{ Math.abs(kpiData.openTrend) }}% 前日比
                  </span>
                </div>
              </div>
              <v-avatar color="green-lighten-4" size="48">
                <v-icon color="green" size="24">mdi-store-plus</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-grey-darken-1 mb-1">アクティブ物件</p>
                <p class="text-h4 font-weight-bold">{{ kpiData.activeProperties }}</p>
                <p class="text-caption mt-1">公開中: {{ kpiData.publicProperties }}</p>
              </div>
              <v-avatar color="orange-lighten-4" size="48">
                <v-icon color="orange" size="24">mdi-home-city</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-grey-darken-1 mb-1">マッチング成功率</p>
                <p class="text-h4 font-weight-bold">{{ kpiData.matchingRate }}%</p>
                <p class="text-caption mt-1">今月: {{ kpiData.monthlyMatches }}件</p>
              </div>
              <v-avatar color="purple-lighten-4" size="48">
                <v-icon color="purple" size="24">mdi-handshake</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- タスクと活動履歴 -->
    <v-row class="mt-4">
      <!-- 本日のタスク -->
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>本日のタスク</span>
            <v-chip color="error" size="small" v-if="overdueTasks > 0">
              期限超過: {{ overdueTasks }}
            </v-chip>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-list lines="two">
              <template v-for="(task, index) in todayTasks" :key="task.id">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-checkbox-btn
                      v-model="task.completed"
                      @change="updateTaskStatus(task.id)"
                    ></v-checkbox-btn>
                  </template>
                  <v-list-item-title>{{ task.title }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip 
                      size="x-small" 
                      :color="task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'"
                      class="mr-2"
                    >
                      {{ task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低' }}
                    </v-chip>
                    {{ task.customer }} | 期限: {{ task.dueTime }}
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    <v-btn icon="mdi-chevron-right" variant="text" size="small"></v-btn>
                  </template>
                </v-list-item>
                <v-divider v-if="index < todayTasks.length - 1"></v-divider>
              </template>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" to="/admin/sales/tasks">
              すべてのタスクを見る
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- 最近の活動 -->
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>最近の活動</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-timeline density="compact" side="end">
              <v-timeline-item
                v-for="activity in recentActivities"
                :key="activity.id"
                :dot-color="activity.color"
                size="small"
              >
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="font-weight-medium">{{ activity.title }}</div>
                    <div class="text-caption text-grey-darken-1">
                      {{ activity.user }} - {{ activity.detail }}
                    </div>
                  </div>
                  <div class="text-caption">{{ activity.time }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" to="/admin/analytics">
              活動を確認
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 営業パイプライン概要 -->
    <v-row class="mt-4">
      <!-- 退店パイプライン（タブ式カンバン） -->
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon color="blue" class="mr-2">mdi-store-remove</v-icon>
              退店案件パイプライン
            </div>
            <v-btn
              color="primary"
              size="small"
              prepend-icon="mdi-plus"
              @click="addNewExitDeal"
            >
              新規案件
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>

          <!-- サマリーカード -->
          <v-card-text class="pb-2">
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-card variant="outlined" density="compact">
                  <v-card-text class="text-center">
                    <div class="text-caption text-grey-darken-1">全案件数</div>
                    <div class="text-h5 font-weight-bold">{{ getTotalDeals() }}</div>
                    <v-chip size="x-small" color="success" variant="tonal">
                      +{{ getNewDealsToday() }} 今日
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card variant="outlined" density="compact">
                  <v-card-text class="text-center">
                    <div class="text-caption text-grey-darken-1">予想売上</div>
                    <div class="text-h5 font-weight-bold">¥{{ formatCurrency(getTotalValue()) }}</div>
                    <div class="text-caption">平均: ¥{{ formatPrice(getAverageValue()) }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card variant="outlined" density="compact">
                  <v-card-text class="text-center">
                    <div class="text-caption text-grey-darken-1">今週の成約</div>
                    <div class="text-h5 font-weight-bold">{{ getWeeklyClosedDeals() }}</div>
                    <div class="text-caption text-green">成約率: {{ getConversionRate() }}%</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card variant="outlined" density="compact">
                  <v-card-text class="text-center">
                    <div class="text-caption text-grey-darken-1">要対応</div>
                    <div class="text-h5 font-weight-bold text-orange">{{ getUrgentDeals() }}</div>
                    <div class="text-caption">停滞: {{ getStalledDeals() }}件</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- タブ切り替え -->
          <v-tabs
            v-model="selectedPhaseTab"
            color="primary"
            align-tabs="center"
            class="mb-2"
          >
            <v-tab value="initial">
              初期対応
              <v-chip size="x-small" class="ml-2" variant="tonal">
                {{ getPhaseDealsCount('initial') }}
              </v-chip>
            </v-tab>
            <v-tab value="negotiation">
              商談
              <v-chip size="x-small" class="ml-2" variant="tonal">
                {{ getPhaseDealsCount('negotiation') }}
              </v-chip>
            </v-tab>
            <v-tab value="listing">
              募集
              <v-chip size="x-small" class="ml-2" variant="tonal">
                {{ getPhaseDealsCount('listing') }}
              </v-chip>
            </v-tab>
            <v-tab value="closing">
              完了
              <v-chip size="x-small" class="ml-2" variant="tonal">
                {{ getPhaseDealsCount('closing') }}
              </v-chip>
            </v-tab>
          </v-tabs>

          <v-card-text class="pa-0">
            <!-- カンバンボード -->
            <div class="kanban-board">
              <div class="kanban-wrapper">
                <div
                  v-for="stage in getCurrentPhaseStages()"
                  :key="stage.id"
                  class="kanban-column"
                  @dragover.prevent
                  @drop="handleDrop($event, stage.id)"
                >
                  <!-- ステージヘッダー -->
                  <div class="kanban-header">
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <h3 class="text-subtitle-1 font-weight-bold">{{ stage.name }}</h3>
                        <v-chip size="x-small" :color="stage.color" variant="tonal">
                          {{ stage.deals.length }}件
                        </v-chip>
                      </div>
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <v-btn icon="mdi-dots-vertical" size="x-small" variant="text" v-bind="props"></v-btn>
                        </template>
                        <v-list density="compact">
                          <v-list-item @click="sortStageBy(stage.id, 'date')">
                            <v-list-item-title>日付順</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="sortStageBy(stage.id, 'amount')">
                            <v-list-item-title>金額順</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </div>

                  <!-- 案件カード -->
                  <div class="kanban-cards">
                    <div
                      v-for="deal in stage.deals"
                      :key="deal.id"
                      class="kanban-card"
                      :data-deal-id="deal.id"
                      :draggable="true"
                      @dragstart="handleDragStart($event, deal, stage.id)"
                      @click="openDealDetails(deal)"
                    >
                      <div class="card-header">
                        <span class="font-weight-medium">{{ deal.customerName }}</span>
                        <v-chip
                          size="x-small"
                          :color="getPriorityColor(deal.priority)"
                          variant="tonal"
                        >
                          {{ deal.priority }}
                        </v-chip>
                      </div>
                      <div class="card-body">
                        <p class="text-caption text-grey-darken-1 mb-1">
                          <v-icon size="x-small">mdi-map-marker</v-icon>
                          {{ deal.location }}
                        </p>
                        <p class="text-caption text-grey-darken-1 mb-1">
                          <v-icon size="x-small">mdi-home-variant</v-icon>
                          {{ deal.propertyType }} | {{ deal.area }}坪
                        </p>
                        <p class="text-body-2 font-weight-bold">
                          ¥{{ formatPrice(deal.amount) }}
                        </p>
                      </div>
                      <div class="card-footer">
                        <div class="d-flex align-center justify-space-between">
                          <div class="text-caption text-grey-darken-1">
                            <v-icon size="x-small">mdi-account</v-icon>
                            {{ deal.assignee }}
                          </div>
                          <div class="text-caption text-grey-darken-1">
                            {{ formatDate(deal.updatedAt) }}
                          </div>
                        </div>
                        <v-progress-linear
                          v-if="deal.progress"
                          :model-value="deal.progress"
                          height="2"
                          :color="stage.color"
                          class="mt-1"
                        ></v-progress-linear>
                      </div>
                    </div>

                    <!-- 案件がない場合のプレースホルダー -->
                    <div v-if="stage.deals.length === 0" class="empty-stage">
                      <v-icon size="large" color="grey-lighten-1">mdi-inbox</v-icon>
                      <p class="text-caption text-grey-lighten-1 mt-2">案件なし</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" to="/admin/sales/pipeline?type=exit">
              退店パイプライン詳細
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- 出店パイプライン -->
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon color="green" class="mr-2">mdi-store-plus</v-icon>
            出店案件パイプライン
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col 
                v-for="stage in openPipelineStages" 
                :key="stage.name"
                cols="12" 
                sm="6" 
                md="2"
              >
                <div class="text-center">
                  <p class="text-caption text-grey-darken-1">{{ stage.name }}</p>
                  <p class="text-h5 font-weight-bold">{{ stage.count }}</p>
                  <p class="text-caption">¥{{ formatCurrency(stage.value) }}</p>
                  <v-progress-linear
                    :model-value="stage.percentage"
                    :color="stage.color"
                    height="4"
                    class="mt-2"
                  ></v-progress-linear>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" to="/admin/sales/pipeline?type=open">
              出店パイプライン詳細
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// ページメタ設定
definePageMeta({
  layout: 'admin'
  // middleware: ['auth', 'admin'] // TODO: middleware実装後に有効化
})

// KPIデータ
const kpiData = ref({
  todayExit: 5,
  exitTrend: 12,
  todayOpen: 8,
  openTrend: -5,
  activeProperties: 127,
  publicProperties: 89,
  matchingRate: 68,
  monthlyMatches: 23
})

// タスクデータ
const overdueTasks = ref(2)
const todayTasks = ref([
  {
    id: 1,
    title: '田中様への物件提案フォロー',
    customer: '田中商店',
    priority: 'high',
    dueTime: '10:00',
    completed: false
  },
  {
    id: 2,
    title: '査定結果の承認確認',
    customer: '山田カフェ',
    priority: 'medium',
    dueTime: '14:00',
    completed: false
  },
  {
    id: 3,
    title: '内見スケジュール調整',
    customer: '佐藤ラーメン',
    priority: 'low',
    dueTime: '17:00',
    completed: false
  }
])

// 最近の活動
const recentActivities = ref([
  {
    id: 1,
    title: '新規物件登録',
    user: '営業 山田',
    detail: '渋谷区 居酒屋 45坪',
    time: '10分前',
    color: 'success'
  },
  {
    id: 2,
    title: '査定承認',
    user: '管理者 鈴木',
    detail: '新宿区カフェ ¥850,000',
    time: '30分前',
    color: 'primary'
  },
  {
    id: 3,
    title: '商談ステータス更新',
    user: '営業 田中',
    detail: '内見 → 交渉中',
    time: '1時間前',
    color: 'warning'
  },
  {
    id: 4,
    title: '成約',
    user: '営業 佐藤',
    detail: '品川区 ラーメン店',
    time: '2時間前',
    color: 'success'
  }
])

// 退店パイプラインカンバンデータ
const exitPipelineKanban = ref([
  {
    id: 'echo',
    name: '反響対応',
    color: 'grey',
    deals: [
      {
        id: 'deal-1',
        customerName: '田中商店',
        location: '渋谷区',
        propertyType: '居酒屋',
        area: 45,
        amount: 850000,
        priority: '高',
        assignee: '山田太郎',
        updatedAt: new Date('2024-01-15'),
        progress: 20
      },
      {
        id: 'deal-2',
        customerName: '山田カフェ',
        location: '新宿区',
        propertyType: 'カフェ',
        area: 30,
        amount: 680000,
        priority: '中',
        assignee: '鈴木花子',
        updatedAt: new Date('2024-01-14'),
        progress: 40
      }
    ]
  },
  {
    id: 'pricing',
    name: '値付け',
    color: 'blue-lighten-2',
    deals: [
      {
        id: 'deal-3',
        customerName: '佐藤ラーメン',
        location: '品川区',
        propertyType: 'ラーメン店',
        area: 35,
        amount: 750000,
        priority: '高',
        assignee: '田中次郎',
        updatedAt: new Date('2024-01-13'),
        progress: 60
      }
    ]
  },
  {
    id: 'sharing',
    name: '物件共有',
    color: 'blue',
    deals: []
  },
  {
    id: 'negotiation',
    name: '物件折衝',
    color: 'indigo',
    deals: [
      {
        id: 'deal-4',
        customerName: '鈴木精肉店',
        location: '目黒区',
        propertyType: '精肉店',
        area: 25,
        amount: 550000,
        priority: '中',
        assignee: '佐藤三郎',
        updatedAt: new Date('2024-01-12'),
        progress: 80
      }
    ]
  },
  {
    id: 'viewing',
    name: '内覧',
    color: 'purple',
    deals: []
  },
  {
    id: 'ml-application',
    name: 'サブリース用マスターリース申込',
    color: 'deep-purple',
    deals: []
  },
  {
    id: 'approval',
    name: '募集承諾',
    color: 'orange',
    deals: []
  },
  {
    id: 'ml-contract',
    name: 'サブリース用マスターリース契約',
    color: 'deep-orange',
    deals: []
  },
  {
    id: 'listing',
    name: '募集',
    color: 'red-lighten-1',
    deals: []
  },
  {
    id: 'tenant-application',
    name: '客付け申し込み',
    color: 'pink',
    deals: []
  },
  {
    id: 'contract',
    name: '契約',
    color: 'green-lighten-1',
    deals: []
  },
  {
    id: 'handover',
    name: '引渡し',
    color: 'green',
    deals: []
  },
  {
    id: 'post-processing',
    name: '後処理',
    color: 'teal',
    deals: []
  },
  {
    id: 'completed',
    name: '完了',
    color: 'success',
    deals: []
  }
])

// 出店パイプラインステージ
const openPipelineStages = ref([
  { name: 'リード', count: 43, value: 12500000, percentage: 100, color: 'grey' },
  { name: '提案', count: 32, value: 9800000, percentage: 74, color: 'blue' },
  { name: '内見', count: 18, value: 6200000, percentage: 42, color: 'indigo' },
  { name: '交渉', count: 12, value: 4100000, percentage: 28, color: 'orange' },
  { name: '契約準備', count: 5, value: 1800000, percentage: 12, color: 'deep-orange' },
  { name: '成約', count: 3, value: 1100000, percentage: 7, color: 'success' }
])

// タブ管理
const selectedPhaseTab = ref('initial')

// フェーズ定義
const phaseMapping = {
  initial: ['echo', 'pricing', 'sharing', 'negotiation'],
  negotiation: ['viewing', 'ml-application', 'approval', 'ml-contract'],
  listing: ['listing', 'tenant-application', 'contract'],
  closing: ['handover', 'post-processing', 'completed']
}

// ドラッグ中の案件を保持
const draggedDeal = ref(null)
const draggedFromStage = ref(null)

// メソッド
const refreshData = () => {
  // データ更新処理
  console.log('データを更新しました')
}

const updateTaskStatus = (taskId) => {
  // タスクステータス更新処理
  console.log('タスク更新:', taskId)
}

const formatCurrency = (value) => {
  return (value / 1000000).toFixed(1) + 'M'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('ja-JP').format(price)
}

const formatDate = (date) => {
  const d = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - d)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今日'
  if (diffDays === 1) return '昨日'
  if (diffDays < 7) return `${diffDays}日前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`
  return `${d.getMonth() + 1}/${d.getDate()}`
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case '高':
      return 'error'
    case '中':
      return 'warning'
    case '低':
      return 'info'
    default:
      return 'default'
  }
}

// ドラッグ&ドロップ処理
const handleDragStart = (event, deal, stageId) => {
  draggedDeal.value = deal
  draggedFromStage.value = stageId
  event.dataTransfer.effectAllowed = 'move'
  event.target.style.opacity = '0.5'
}

const handleDrop = (event, toStageId) => {
  event.preventDefault()

  if (draggedDeal.value && draggedFromStage.value !== toStageId) {
    // 元のステージから案件を削除
    const fromStage = exitPipelineKanban.value.find(s => s.id === draggedFromStage.value)
    const fromIndex = fromStage.deals.findIndex(d => d.id === draggedDeal.value.id)
    if (fromIndex > -1) {
      fromStage.deals.splice(fromIndex, 1)
    }

    // 新しいステージに案件を追加
    const toStage = exitPipelineKanban.value.find(s => s.id === toStageId)
    toStage.deals.push({
      ...draggedDeal.value,
      updatedAt: new Date()
    })

    // タブをまたぐ移動の場合、タブを自動切り替え
    const toStagePhase = getStagePhase(toStageId)
    if (toStagePhase && toStagePhase !== selectedPhaseTab.value) {
      selectedPhaseTab.value = toStagePhase
      // 移動先ステージをハイライト（オプション）
      setTimeout(() => {
        const movedCard = document.querySelector(`[data-deal-id="${draggedDeal.value.id}"]`)
        if (movedCard) {
          movedCard.classList.add('highlight-animation')
          setTimeout(() => movedCard.classList.remove('highlight-animation'), 1000)
        }
      }, 100)
    }

    // リセット
    draggedDeal.value = null
    draggedFromStage.value = null
  }

  // ドラッグ元の要素の透明度を戻す
  const draggedElement = document.querySelector('[style*="opacity: 0.5"]')
  if (draggedElement) {
    draggedElement.style.opacity = '1'
  }
}

// ステージがどのフェーズに属するか判定
const getStagePhase = (stageId) => {
  for (const [phase, stages] of Object.entries(phaseMapping)) {
    if (stages.includes(stageId)) {
      return phase
    }
  }
  return null
}

// 案件詳細を開く
const openDealDetails = (deal) => {
  console.log('案件詳細:', deal)
  // TODO: 案件詳細モーダルまたはページ遷移の実装
}

// 新規案件追加
const addNewExitDeal = () => {
  console.log('新規退店案件追加')
  // TODO: 新規案件追加モーダルまたはページ遷移の実装
}

// ステージ内の案件をソート
const sortStageBy = (stageId, sortBy) => {
  const stage = exitPipelineKanban.value.find(s => s.id === stageId)
  if (stage) {
    if (sortBy === 'date') {
      stage.deals.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    } else if (sortBy === 'amount') {
      stage.deals.sort((a, b) => b.amount - a.amount)
    }
  }
}

// 現在のフェーズのステージを取得
const getCurrentPhaseStages = () => {
  const stageIds = phaseMapping[selectedPhaseTab.value] || []
  return exitPipelineKanban.value.filter(stage => stageIds.includes(stage.id))
}

// サマリー計算メソッド
const getTotalDeals = () => {
  return exitPipelineKanban.value.reduce((total, stage) => total + stage.deals.length, 0)
}

const getNewDealsToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return exitPipelineKanban.value.reduce((total, stage) => {
    return total + stage.deals.filter(deal => {
      const dealDate = new Date(deal.updatedAt)
      dealDate.setHours(0, 0, 0, 0)
      return dealDate.getTime() === today.getTime()
    }).length
  }, 0)
}

const getTotalValue = () => {
  const total = exitPipelineKanban.value.reduce((sum, stage) => {
    return sum + stage.deals.reduce((stageSum, deal) => stageSum + deal.amount, 0)
  }, 0)
  return total / 1000000 // Mで返す
}

const getAverageValue = () => {
  const totalValue = exitPipelineKanban.value.reduce((sum, stage) => {
    return sum + stage.deals.reduce((stageSum, deal) => stageSum + deal.amount, 0)
  }, 0)
  const totalDeals = getTotalDeals()
  return totalDeals > 0 ? Math.round(totalValue / totalDeals) : 0
}

const getWeeklyClosedDeals = () => {
  const completed = exitPipelineKanban.value.find(s => s.id === 'completed')
  return completed ? completed.deals.length : 0
}

const getConversionRate = () => {
  const total = getTotalDeals()
  const closed = getWeeklyClosedDeals()
  return total > 0 ? Math.round((closed / total) * 100) : 0
}

const getUrgentDeals = () => {
  return exitPipelineKanban.value.reduce((total, stage) => {
    return total + stage.deals.filter(deal => deal.priority === '高').length
  }, 0)
}

const getStalledDeals = () => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  return exitPipelineKanban.value.reduce((total, stage) => {
    if (stage.id === 'completed') return total
    return total + stage.deals.filter(deal => {
      return new Date(deal.updatedAt) < oneWeekAgo
    }).length
  }, 0)
}

const getPhaseDealsCount = (phase) => {
  const stageIds = phaseMapping[phase] || []
  return exitPipelineKanban.value
    .filter(stage => stageIds.includes(stage.id))
    .reduce((total, stage) => total + stage.deals.length, 0)
}

// マウント時の処理
onMounted(() => {
  // 初期データ取得
  // TODO: Supabaseからデータ取得
})
</script>

<style scoped>
.kanban-board {
  width: 100%;
  overflow-x: auto;
  padding: 1rem;
  background: #f5f5f5;
}

.kanban-wrapper {
  display: flex;
  gap: 1rem;
  min-width: fit-content;
  padding-bottom: 1rem;
}

.kanban-column {
  flex: 0 0 280px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 600px;
}

.kanban-header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
  border-radius: 8px 8px 0 0;
}

.kanban-cards {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  min-height: 100px;
}

.kanban-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  cursor: move;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.kanban-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.kanban-card[draggable="true"]:active {
  cursor: grabbing;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.card-body {
  margin-bottom: 0.5rem;
}

.card-footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 0.5rem;
}

.empty-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #9e9e9e;
  min-height: 150px;
}

/* レスポンシブ対応 */
@media (max-width: 1280px) {
  .kanban-column {
    flex: 0 0 260px;
  }
}

@media (max-width: 960px) {
  .kanban-column {
    flex: 0 0 240px;
  }
}

@media (max-width: 600px) {
  .kanban-wrapper {
    flex-direction: column;
  }

  .kanban-column {
    flex: 1 1 auto;
    max-height: 400px;
  }
}

/* スクロールバーのスタイリング */
.kanban-board::-webkit-scrollbar {
  height: 8px;
}

.kanban-board::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.kanban-board::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.kanban-board::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.kanban-cards::-webkit-scrollbar {
  width: 6px;
}

.kanban-cards::-webkit-scrollbar-track {
  background: transparent;
}

.kanban-cards::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.kanban-cards::-webkit-scrollbar-thumb:hover {
  background: #bbb;
}

/* ハイライトアニメーション */
.highlight-animation {
  animation: highlight 1s ease-in-out;
}

@keyframes highlight {
  0% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.7);
  }
  50% {
    box-shadow: 0 0 10px 5px rgba(33, 150, 243, 0.3);
  }
  100% {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  }
}

/* タブインジケーター */
.v-tab--active {
  font-weight: bold;
}
</style>