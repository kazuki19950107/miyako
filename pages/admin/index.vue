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
      <!-- 退店パイプライン -->
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon color="blue" class="mr-2">mdi-store-remove</v-icon>
            退店案件パイプライン
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col 
                v-for="stage in exitPipelineStages" 
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

// 退店パイプラインステージ
const exitPipelineStages = ref([
  { name: '問い合わせ', count: 25, value: 8500000, percentage: 100, color: 'grey' },
  { name: '査定中', count: 20, value: 6800000, percentage: 80, color: 'blue' },
  { name: '査定完了', count: 15, value: 5100000, percentage: 60, color: 'indigo' },
  { name: '商談中', count: 10, value: 3400000, percentage: 40, color: 'orange' },
  { name: '契約準備', count: 5, value: 1700000, percentage: 20, color: 'deep-orange' },
  { name: '成約', count: 2, value: 680000, percentage: 8, color: 'success' }
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

// マウント時の処理
onMounted(() => {
  // 初期データ取得
  // TODO: Supabaseからデータ取得
})
</script>

<style scoped>
/* 必要に応じてカスタムスタイル追加 */
</style>