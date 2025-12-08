<template>
  <v-form ref="basicForm" v-model="formValid">
    <!-- 連絡先 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-phone-outline</v-icon>
        連絡先
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="contact.storeName"
              @update:model-value="updateContact('storeName', $event)"
              label="屋号名"
              outlined
              dense
              prepend-inner-icon="mdi-store"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="contact.ownerName"
              @update:model-value="updateContact('ownerName', $event)"
              label="氏名"
              :rules="[rules.required]"
              outlined
              dense
              prepend-inner-icon="mdi-account"
              required
            >
              <template v-slot:label>
                氏名 <span class="red--text">*</span>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              :model-value="contact.address"
              @update:model-value="updateContact('address', $event)"
              label="住所"
              :rules="[rules.required]"
              outlined
              dense
              prepend-inner-icon="mdi-map-marker"
              required
            >
              <template v-slot:label>
                住所 <span class="red--text">*</span>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="contact.phoneNumber"
              @update:model-value="updateContact('phoneNumber', $event)"
              label="連絡先"
              :rules="[rules.required, rules.phone]"
              outlined
              dense
              prepend-inner-icon="mdi-cellphone"
              placeholder="例: 090-1234-5678"
              required
            >
              <template v-slot:label>
                連絡先 <span class="red--text">*</span>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 現状の把握 -->
    <v-card outlined class="section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-chart-line</v-icon>
        現状の把握
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 左列 -->
          <v-col cols="12" md="6">
            <!-- 閉める理由 -->
            <div class="mb-6">
              <v-select
                :model-value="status.selectedClosingReasons"
                @update:model-value="updateStatus('selectedClosingReasons', $event)"
                label="閉める理由"
                :items="closingReasons"
                :rules="[rules.required]"
                multiple
                chips
                small-chips
                deletable-chips
                outlined
                dense
                prepend-inner-icon="mdi-store-remove"
                required
              >
                <template v-slot:label>
                  閉める理由 <span class="red--text">*</span>
                </template>
              </v-select>
              <v-text-field
                v-if="status.selectedClosingReasons.includes('その他')"
                :model-value="status.reasonOtherText"
                @update:model-value="updateStatus('reasonOtherText', $event)"
                label="その他の詳細"
                outlined
                dense
                class="mt-3"
                placeholder="詳細を入力してください"
              ></v-text-field>
            </div>

            <!-- 家主・管理会社への告知 -->
            <div class="mb-6">
              <v-select
                :model-value="status.landlordNotification"
                @update:model-value="updateStatus('landlordNotification', $event)"
                label="家主や管理会社に閉店の話をしているか"
                :items="['している', 'していない']"
                :rules="[rules.required]"
                outlined
                dense
                prepend-inner-icon="mdi-account-tie"
                required
              >
                <template v-slot:label>
                  家主や管理会社に閉店の話をしているか <span class="red--text">*</span>
                </template>
              </v-select>

              <!-- 誰に話しているか（チェックボックス） -->
              <div v-if="status.landlordNotification === 'している'" class="mt-4">
                <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
                  誰に話しているか
                </div>
                <v-row>
                  <v-col cols="6">
                    <v-checkbox
                      :model-value="status.notifiedLandlord"
                      @update:model-value="updateStatus('notifiedLandlord', $event)"
                      label="家主"
                      hide-details
                      color="primary"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-checkbox
                      :model-value="status.notifiedManagement"
                      @update:model-value="updateStatus('notifiedManagement', $event)"
                      label="管理会社"
                      hide-details
                      color="primary"
                    />
                  </v-col>
                </v-row>

                <!-- 家主の連絡先 -->
                <div v-if="status.notifiedLandlord" class="mt-4 pa-3" style="background: #f8faff; border-radius: 8px;">
                  <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
                    <v-icon small class="mr-1">mdi-account</v-icon>
                    家主の連絡先
                  </div>
                  <v-row dense>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        :model-value="status.landlordName"
                        @update:model-value="updateStatus('landlordName', $event)"
                        label="会社名/氏名"
                        outlined
                        dense
                        placeholder="例: 田中 一郎"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        :model-value="status.landlordContact"
                        @update:model-value="updateStatus('landlordContact', $event)"
                        label="担当者"
                        outlined
                        dense
                        placeholder="例: 本人"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        :model-value="status.landlordPhone"
                        @update:model-value="updateStatus('landlordPhone', $event)"
                        label="連絡先"
                        outlined
                        dense
                        placeholder="例: 090-1234-5678"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>

                <!-- 管理会社の連絡先 -->
                <div v-if="status.notifiedManagement" class="mt-4 pa-3" style="background: #f8faff; border-radius: 8px;">
                  <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
                    <v-icon small class="mr-1">mdi-office-building</v-icon>
                    管理会社の連絡先
                  </div>
                  <v-row dense>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        :model-value="status.managementCompany"
                        @update:model-value="updateStatus('managementCompany', $event)"
                        label="会社名"
                        outlined
                        dense
                        placeholder="例: ○○不動産管理"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        :model-value="status.managementContact"
                        @update:model-value="updateStatus('managementContact', $event)"
                        label="担当者"
                        outlined
                        dense
                        placeholder="例: 佐藤 花子"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        :model-value="status.managementPhone"
                        @update:model-value="updateStatus('managementPhone', $event)"
                        label="連絡先"
                        outlined
                        dense
                        placeholder="例: 06-1234-5678"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>

                <!-- 次居抜きの許可 -->
                <v-select
                  :model-value="status.nextTenantPermission"
                  @update:model-value="updateStatus('nextTenantPermission', $event)"
                  label="次居抜きで探していいかの許可を取っているか"
                  :items="['している', 'していない']"
                  outlined
                  dense
                  prepend-inner-icon="mdi-check-circle"
                  class="mt-4"
                ></v-select>
              </div>
            </div>

            <!-- 解約通知の有無 -->
            <div class="mb-6">
              <v-select
                :model-value="status.terminationNotice"
                @update:model-value="updateStatus('terminationNotice', $event)"
                label="解約通知の有無"
                :items="['有り', '無し']"
                outlined
                dense
                prepend-inner-icon="mdi-file-document-outline"
              ></v-select>
            </div>

            <!-- 従業員への告知 -->
            <div class="mb-6">
              <v-select
                :model-value="status.employeeNotification"
                @update:model-value="updateStatus('employeeNotification', $event)"
                label="従業員に閉店の話をしているか"
                :items="['している', 'していない']"
                :rules="[rules.required]"
                outlined
                dense
                prepend-inner-icon="mdi-account-group"
                required
              >
                <template v-slot:label>
                  従業員に閉店の話をしているか <span class="red--text">*</span>
                </template>
              </v-select>
            </div>

          </v-col>

          <!-- 右列 -->
          <v-col cols="12" md="6">
            <!-- 営業をいつまでするのか -->
            <div class="mb-6">
              <v-select
                :model-value="status.businessContinuation"
                @update:model-value="updateStatus('businessContinuation', $event)"
                label="営業をいつまでするのか"
                :items="['すでに決めている', '決まるまでやる', 'すでに閉店している']"
                :rules="[rules.required]"
                outlined
                dense
                prepend-inner-icon="mdi-calendar-clock"
                required
              >
                <template v-slot:label>
                  営業をいつまでするのか <span class="red--text">*</span>
                </template>
              </v-select>
              <v-text-field
                v-if="status.businessContinuation === 'すでに決めている'"
                :model-value="status.closingDate"
                @update:model-value="updateStatus('closingDate', $event)"
                label="閉店予定日"
                outlined
                dense
                type="date"
                class="mt-3"
              ></v-text-field>
            </div>

            <!-- いつまでに・いくらで売りたいのか -->
            <div class="mb-6">
              <v-select
                :model-value="status.desiredSalePeriod"
                @update:model-value="updateStatus('desiredSalePeriod', $event)"
                label="いつまでに売りたいか"
                :items="salePeriods"
                :rules="[rules.required]"
                outlined
                dense
                prepend-inner-icon="mdi-clock-outline"
                required
              >
                <template v-slot:label>
                  いつまでに売りたいか <span class="red--text">*</span>
                </template>
              </v-select>
              <v-text-field
                v-if="status.desiredSalePeriod === '日付を指定する'"
                :model-value="status.desiredSaleDate"
                @update:model-value="updateStatus('desiredSaleDate', $event)"
                label="希望売却日"
                outlined
                dense
                type="date"
                class="mt-3"
              ></v-text-field>
            </div>

            <!-- 他の会社への相談 -->
            <div class="mb-6">
              <v-select
                :model-value="status.otherConsultation"
                @update:model-value="updateStatus('otherConsultation', $event)"
                label="他の会社に相談しているか"
                :items="['している', 'していない']"
                :rules="[rules.required]"
                outlined
                dense
                prepend-inner-icon="mdi-office-building"
                required
              >
                <template v-slot:label>
                  他の会社に相談しているか <span class="red--text">*</span>
                </template>
              </v-select>
              <div v-if="status.otherConsultation === 'している'" class="mt-3">
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      :model-value="status.consultationCompany"
                      @update:model-value="updateStatus('consultationCompany', $event)"
                      label="相談先の会社名"
                      outlined
                      dense
                      placeholder="会社名を入力"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      :model-value="status.consultationStartDate"
                      @update:model-value="updateStatus('consultationStartDate', $event)"
                      label="いつから依頼しているか"
                      outlined
                      dense
                      type="date"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
            </div>

          </v-col>
        </v-row>

        <!-- 希望金額 -->
        <div class="mb-6">
          <div class="text-subtitle-1 mb-4 font-weight-bold">
            <v-icon small class="mr-1">mdi-currency-jpy</v-icon>
            希望金額
          </div>

          <v-row class="align-center">
            <v-col cols="12" md="8">
              <!-- ① 概算スライダー（通常操作） -->
              <v-slider
                :model-value="status.desiredPrice"
                @update:model-value="updateStatus('desiredPrice', $event)"
                :max="10000000"
                :min="0"
                :step="100000"
                thumb-label
                :disabled="showDetailPrice"
                label="概算"
                hint="最大1,000万円。より細かい金額や1,000万円超は［詳細入力］をタップ"
                persistent-hint
                color="primary"
                track-color="primary"
              />
            </v-col>

            <v-col cols="12" md="4" class="d-flex ga-2">
              <!-- ② 詳細入力トグル -->
              <v-chip
                color="primary"
                variant="elevated"
                @click="showDetailPrice = !showDetailPrice"
                class="font-weight-bold"
                clickable
              >
                <v-icon start size="18" class="force-white-icon">{{ showDetailPrice ? 'mdi-arrow-left' : 'mdi-pencil-outline' }}</v-icon>
                {{ showDetailPrice ? 'スライダーに戻す' : '詳細入力' }}
              </v-chip>
            </v-col>

            <!-- ③ 詳細入力（必要時のみ表示） -->
            <v-col v-if="showDetailPrice" cols="12" md="6">
              <v-text-field
                :model-value="status.desiredPrice"
                @update:model-value="updateStatus('desiredPrice', Number($event))"
                type="number"
                inputmode="numeric"
                :min="0"
                :step="10000"
                label="詳細金額（円）"
                suffix="円"
                hint="1円〜上限なしで入力可能"
                persistent-hint
                outlined
                dense
                color="primary"
                prepend-inner-icon="mdi-calculator"
              />
            </v-col>

            <!-- ④ ワンタップのプリセット（任意） -->
            <v-col v-if="showDetailPrice" cols="12">
              <div class="text-subtitle-2 mb-2">ワンタップ選択</div>
              <v-chip-group
                v-model="selectedPresetChip"
                @update:model-value="updatePriceFromChip"
                column
              >
                <v-chip
                  v-for="preset in quickPresets"
                  :key="preset.value"
                  :value="preset.value"
                  class="ma-1 preset-chip"
                  :class="{ 'preset-chip-selected': selectedPresetChip === preset.value }"
                >
                  {{ preset.text }}
                </v-chip>
              </v-chip-group>
            </v-col>

            <!-- ⑤ 現在値の見える化 -->
            <v-col cols="12">
              <div class="d-flex align-center">
                <v-icon small class="mr-2" color="primary">mdi-cash</v-icon>
                <span class="text-body-1 font-weight-medium" style="color: #1e50a2;">
                  現在の金額：{{ priceJP }}
                </span>
              </div>
            </v-col>

            <!-- ⑥ 希望額の理由 -->
            <v-col cols="12">
              <v-textarea
                :model-value="status.desiredPriceReason"
                @update:model-value="updateStatus('desiredPriceReason', $event)"
                label="希望額の理由"
                outlined
                dense
                rows="2"
                placeholder="例: 初期投資の回収、借入金の返済、次の事業資金など"
                prepend-inner-icon="mdi-text-box-outline"
              ></v-textarea>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
const props = defineProps<{
  contact: {
    storeName: string
    ownerName: string
    address: string
    phoneNumber: string
  }
  status: {
    selectedClosingReasons: string[]
    reasonOtherText: string
    landlordNotification: string
    nextTenantPermission: string
    notifiedLandlord: boolean
    landlordName: string
    landlordContact: string
    landlordPhone: string
    notifiedManagement: boolean
    managementCompany: string
    managementContact: string
    managementPhone: string
    terminationNotice: string
    employeeNotification: string
    businessContinuation: string
    closingDate: string
    desiredSalePeriod: string
    desiredSaleDate: string
    otherConsultation: string
    consultationCompany: string
    consultationStartDate: string
    desiredPrice: number
    desiredPriceReason: string
  }
}>()

// Emits
const emit = defineEmits<{
  'update:contact': [value: typeof props.contact]
  'update:status': [value: typeof props.status]
}>()

// Internal state
const formValid = ref(false)
const showDetailPrice = ref(false)
const selectedPresetChip = ref<number | null>(null)
const basicForm = ref(null)

// Validation rules
const rules = {
  required: (v: any) => !!v || 'この項目は必須です',
  email: (v: string) => /.+@.+\..+/.test(v) || 'メールアドレスの形式が正しくありません',
  phone: (v: string) => !v || /^[0-9-]+$/.test(v) || '電話番号の形式が正しくありません'
}

// Options
const closingReasons = ['売上不振', '体調不良', '後継者不在', '他事業に注力', '家族の事情', '賃料が高い', '人材不足', 'その他']
const salePeriods = ['1ヶ月以内', '3ヶ月以内', '6ヶ月以内', '1年以内', '急いでいない', '日付を指定する']

const quickPresets = [
  { text: '300万', value: 3000000 },
  { text: '500万', value: 5000000 },
  { text: '800万', value: 8000000 },
  { text: '1,000万', value: 10000000 },
  { text: '1,500万', value: 15000000 },
  { text: '2,000万', value: 20000000 },
  { text: '3,000万', value: 30000000 },
  { text: '5,000万', value: 50000000 }
]

// Computed
const priceJP = computed(() =>
  `${new Intl.NumberFormat('ja-JP').format(Number(props.status.desiredPrice || 0))} 円`
)

// Methods
const updateContact = (key: string, value: any) => {
  emit('update:contact', { ...props.contact, [key]: value })
}

const updateStatus = (key: string, value: any) => {
  emit('update:status', { ...props.status, [key]: value })
}

const updatePriceFromChip = (value: number | null) => {
  if (value !== null) {
    updateStatus('desiredPrice', value)
  }
}

// Expose form validity for parent
defineExpose({
  formValid,
  basicForm
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
