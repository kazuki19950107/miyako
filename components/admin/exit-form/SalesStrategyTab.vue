<template>
  <v-form ref="strategyForm" v-model="formValid">
    <!-- 販売用情報 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title d-flex align-center">
        <v-icon left size="24" class="mr-2">mdi-clipboard-text-outline</v-icon>
        販売用情報
        <v-spacer></v-spacer>
        <v-btn
          color="blue-grey-lighten-2"
          small
          @click="formatWithAI"
          :loading="isFormatting"
          :disabled="isFormatting"
          class="ai-output-btn"
        >
          <v-icon left small style="color: white !important;">mdi-auto-fix</v-icon>
          AIで出力
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <v-col cols="12" md="6">
            <v-textarea
              :model-value="salesOverview.schedule"
              @update:model-value="updateSalesOverview('schedule', $event)"
              label="スケジュール"
              outlined
              dense
              rows="3"
              placeholder="例: 2024年3月末閉店予定、4月から引き渡し可能"
              prepend-inner-icon="mdi-calendar-clock"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea
              :model-value="salesOverview.propertyOverview"
              @update:model-value="updateSalesOverview('propertyOverview', $event)"
              label="立地概要"
              outlined
              dense
              rows="3"
              placeholder="例: 1階路面店、角地、視認性良好"
              prepend-inner-icon="mdi-home-outline"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea
              :model-value="salesOverview.currentTenant"
              @update:model-value="updateSalesOverview('currentTenant', $event)"
              label="現況テナント"
              outlined
              dense
              rows="3"
              placeholder="例: イタリアンレストラン営業中、客単価3,500円"
              prepend-inner-icon="mdi-store"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea
              :model-value="salesOverview.ownerManagement"
              @update:model-value="updateSalesOverview('ownerManagement', $event)"
              label="オーナー・管理会社"
              outlined
              dense
              rows="3"
              placeholder="例: 個人オーナー、管理会社は〇〇不動産"
              prepend-inner-icon="mdi-account-tie"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              :model-value="salesOverview.risks"
              @update:model-value="updateSalesOverview('risks', $event)"
              label="リスク"
              outlined
              dense
              rows="4"
              placeholder="例: 設備の老朽化あり、近隣に競合店舗開業予定"
              prepend-inner-icon="mdi-alert-outline"
              color="warning"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 販売方針の決定 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-target</v-icon>
        販売方針の決定
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <v-col cols="12">
            <v-text-field
              :model-value="strategy.sellingPrice"
              @update:model-value="updateStrategy('sellingPrice', $event)"
              label="販売希望価格"
              outlined
              dense
              type="number"
              suffix="万円"
              prepend-inner-icon="mdi-currency-jpy"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              :model-value="strategy.minimumPrice"
              @update:model-value="updateStrategy('minimumPrice', $event)"
              label="最低販売価格"
              outlined
              dense
              type="number"
              suffix="万円"
              prepend-inner-icon="mdi-currency-jpy"
            />
          </v-col>
          <v-col cols="12">
            <v-select
              :model-value="strategy.negotiability"
              @update:model-value="updateStrategy('negotiability', $event)"
              label="価格交渉"
              :items="['応相談', '多少可', '不可']"
              outlined
              dense
              prepend-inner-icon="mdi-handshake"
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
const props = defineProps<{
  salesOverview: {
    schedule: string
    propertyOverview: string
    currentTenant: string
    ownerManagement: string
    risks: string
  }
  strategy: {
    sellingPrice: number
    minimumPrice: number
    negotiability: string
  }
}>()

// Emits
const emit = defineEmits<{
  'update:salesOverview': [value: typeof props.salesOverview]
  'update:strategy': [value: typeof props.strategy]
  'format-with-ai': []
}>()

// Form validation
const formValid = ref(true)
const strategyForm = ref<any>(null)

// AI formatting state
const isFormatting = ref(false)

// Update functions
const updateSalesOverview = (key: string, value: any) => {
  emit('update:salesOverview', { ...props.salesOverview, [key]: value })
}

const updateStrategy = (key: string, value: any) => {
  emit('update:strategy', { ...props.strategy, [key]: value })
}

// AI formatting function
const formatWithAI = () => {
  isFormatting.value = true
  emit('format-with-ai')
  // 親コンポーネントでAI整形処理が完了したらisFormattingをfalseにする
  setTimeout(() => {
    isFormatting.value = false
  }, 2000)
}

// Expose form validity for parent
defineExpose({
  formValid,
  strategyForm
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

/* AIで出力ボタンのスタイル */
.ai-output-btn {
  text-transform: none !important;
  font-weight: 600 !important;
  letter-spacing: 0.3px !important;
}

.ai-output-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 80, 162, 0.25) !important;
  transition: all 0.2s ease;
}
</style>
