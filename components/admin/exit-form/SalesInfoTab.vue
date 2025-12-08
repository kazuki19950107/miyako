<template>
  <v-form ref="salesForm" v-model="formValid">

    <!-- F. 売上・営業時間 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-chart-line</v-icon>
        売上・営業時間
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 最高売上月 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.highest_sales_month"
              @update:model-value="updateDetailCheck('highest_sales_month', $event)"
              label="最高売上月"
              outlined
              dense
              type="number"
              suffix="万円"
            />
          </v-col>

          <!-- 最低売上月 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.lowest_sales_month"
              @update:model-value="updateDetailCheck('lowest_sales_month', $event)"
              label="最低売上月"
              outlined
              dense
              type="number"
              suffix="万円"
            />
          </v-col>

          <!-- ランチ営業時間 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.lunch_hours"
              @update:model-value="updateDetailCheck('lunch_hours', $event)"
              label="ランチ営業時間"
              outlined
              dense
              placeholder="例: 11:00-14:00"
            />
          </v-col>

          <!-- ディナー営業時間 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.dinner_hours"
              @update:model-value="updateDetailCheck('dinner_hours', $event)"
              label="ディナー営業時間"
              outlined
              dense
              placeholder="例: 17:00-22:00"
            />
          </v-col>

          <!-- ランチ客単価 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.lunch_avg_price"
              @update:model-value="updateDetailCheck('lunch_avg_price', $event)"
              label="ランチ客単価"
              outlined
              dense
              type="number"
              suffix="円"
            />
          </v-col>

          <!-- ディナー客単価 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.dinner_avg_price"
              @update:model-value="updateDetailCheck('dinner_avg_price', $event)"
              label="ディナー客単価"
              outlined
              dense
              type="number"
              suffix="円"
            />
          </v-col>

          <!-- 定休日 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.closed_days"
              @update:model-value="updateDetailCheck('closed_days', $event)"
              label="定休日"
              outlined
              dense
              placeholder="例: 月曜日、年中無休"
            />
          </v-col>

          <!-- 席数 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.seat_count"
              @update:model-value="updateDetailCheck('seat_count', $event)"
              label="席数"
              outlined
              dense
              type="number"
              suffix="席"
              :rules="[v => v >= 0 && v <= 500 || '席数は0-500の範囲で入力してください']"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.section_f_memo"
              @update:model-value="updateDetailCheck('section_f_memo', $event)"
              label="売上・営業時間 メモ"
              outlined
              dense
              rows="2"
              placeholder="特記事項があれば記載"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- G. エリア・客層 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-map-marker</v-icon>
        エリア・客層
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- エリアタイプ -->
          <v-col cols="12" md="6">
            <v-select
              :model-value="detailCheck.area_types"
              @update:model-value="updateDetailCheck('area_types', $event)"
              :items="['住宅街', '繁華街', 'ビジネス街', '学生街', '観光地', '駅前', '郊外']"
              label="エリアタイプ"
              multiple
              chips
              small-chips
              deletable-chips
              outlined
              dense
            />
          </v-col>

          <!-- 主要客層 -->
          <v-col cols="12" md="6">
            <v-select
              :model-value="detailCheck.customer_segments"
              @update:model-value="updateDetailCheck('customer_segments', $event)"
              :items="['若者', '中高年', '高齢者', '外国人', '学生', 'ビジネスマン', 'ファミリー', '女性客', '男性客']"
              label="主要客層"
              multiple
              chips
              small-chips
              deletable-chips
              outlined
              dense
            />
          </v-col>

          <!-- メイン客層年代 -->
          <v-col cols="12" md="4">
            <v-select
              :model-value="detailCheck.main_customer_age"
              @update:model-value="updateDetailCheck('main_customer_age', $event)"
              :items="['10代', '20代', '30代', '40代', '50代', '60代以上', '幅広い年齢層']"
              label="メイン客層（年代）"
              outlined
              dense
            />
          </v-col>

          <!-- メイン客層性別 -->
          <v-col cols="12" md="4">
            <v-select
              :model-value="detailCheck.main_customer_gender"
              @update:model-value="updateDetailCheck('main_customer_gender', $event)"
              :items="['男性中心', '女性中心', '男女半々', 'ファミリー中心']"
              label="メイン客層（性別）"
              outlined
              dense
            />
          </v-col>

          <!-- 客層タイプ -->
          <v-col cols="12" md="4">
            <v-select
              :model-value="detailCheck.customer_type"
              @update:model-value="updateDetailCheck('customer_type', $event)"
              :items="['サラリーマン', '地元住民', '観光客', '学生', 'ファミリー', '会社員', 'その他']"
              label="客層タイプ"
              outlined
              dense
            />
          </v-col>

          <!-- アクセス -->
          <v-col cols="12">
            <v-text-field
              :model-value="detailCheck.access_info"
              @update:model-value="updateDetailCheck('access_info', $event)"
              label="アクセス情報"
              outlined
              dense
              placeholder="例: 駅徒歩5分、バス停前"
            />
          </v-col>

          <!-- 周辺環境 -->
          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.surrounding_environment"
              @update:model-value="updateDetailCheck('surrounding_environment', $event)"
              label="周辺環境"
              outlined
              dense
              rows="3"
              placeholder="周辺の建物、競合店、人通りなどの特徴"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.section_g_memo"
              @update:model-value="updateDetailCheck('section_g_memo', $event)"
              label="エリア・客層 メモ"
              outlined
              dense
              rows="2"
              placeholder="特記事項があれば記載"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props
const props = withDefaults(defineProps<{
  detailCheck?: {
    // F. 売上・営業時間
    highest_sales_month: string
    lowest_sales_month: string
    lunch_hours: string
    dinner_hours: string
    lunch_avg_price: string
    dinner_avg_price: string
    closed_days: string
    seat_count: string
    section_f_memo: string

    // G. エリア・客層
    area_types: string[]
    customer_segments: string[]
    main_customer_age: string
    main_customer_gender: string
    customer_type: string
    access_info: string
    surrounding_environment: string
    section_g_memo: string
  }
}>(), {
  detailCheck: () => ({
    highest_sales_month: '',
    lowest_sales_month: '',
    lunch_hours: '',
    dinner_hours: '',
    lunch_avg_price: '',
    dinner_avg_price: '',
    closed_days: '',
    seat_count: '',
    section_f_memo: '',
    area_types: [],
    customer_segments: [],
    main_customer_age: '',
    main_customer_gender: '',
    customer_type: '',
    access_info: '',
    surrounding_environment: '',
    section_g_memo: ''
  })
})

// Emits
const emit = defineEmits<{
  'update:detailCheck': [value: typeof props.detailCheck]
}>()

// Internal state
const formValid = ref(false)
const salesForm = ref(null)

// Methods
const updateDetailCheck = (key: string, value: any) => {
  emit('update:detailCheck', { ...props.detailCheck, [key]: value })
}

// Expose form validity for parent
defineExpose({
  formValid,
  salesForm
})
</script>

<style scoped>
/* セクション見出しを統一 */
.section-title {
  font-weight: 700 !important;
  font-size: 17px !important;
  background: linear-gradient(135deg, #e3eaf5 0%, #d4e0f0 100%) !important;
  color: #154a8a !important;
  border-bottom: 2px solid #c5d5eb !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  border-radius: 0 !important;
}

.section-title .v-icon {
  background: rgba(30, 80, 162, 0.15);
  border-radius: 50%;
  padding: 6px;
  margin-right: 12px !important;
}

/* カードの間隔と角丸の統一 */
.v-card.section-card,
.v-card.outlined {
  border-radius: 16px !important;
  border: 1px solid #c5d5eb !important;
  box-shadow: 0 4px 12px rgba(30, 80, 162, 0.08) !important;
  margin-bottom: 24px !important;
  overflow: hidden;
  background-color: #ffffff !important;
}

.v-card.section-card:hover {
  box-shadow: 0 6px 20px rgba(30, 80, 162, 0.12) !important;
  transition: box-shadow 0.3s ease;
}

/* inputフィールドの背景色 */
:deep(.v-field__field) {
  background-color: #f5f8fc !important;
}

:deep(.v-field--variant-outlined .v-field__outline) {
  --v-field-border-opacity: 0.4;
}

:deep(.v-field--focused .v-field__field) {
  background-color: #ffffff !important;
}
</style>
