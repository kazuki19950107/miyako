<template>
  <v-form ref="detailForm" v-model="formValid">

    <!-- B. ライフライン契約・支払い（統合版） -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-flash</v-icon>
        ライフライン契約・支払い
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 電気 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-flash</v-icon>
              電気
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <v-radio-group
              :model-value="customerInput?.utilities?.electricity?.contractType"
              @update:model-value="updateElectricity('contractType', $event)"
              label="契約状況"
              row
              density="compact"
            >
              <v-radio label="家主検針" value="家主検針"></v-radio>
              <v-radio label="直接契約" value="直接契約"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.electricity_company"
              @update:model-value="updateDetailCheck('electricity_company', $event)"
              label="契約会社"
              outlined
              dense
              placeholder="例: 関西電力、新電力"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.electricity_customer_number"
              @update:model-value="updateDetailCheck('electricity_customer_number', $event)"
              label="お客様番号"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12"><v-divider /></v-col>

          <!-- ガス -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-fire</v-icon>
              ガス
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <v-radio-group
              :model-value="customerInput?.utilities?.gas?.contractType"
              @update:model-value="updateGas('contractType', $event)"
              label="契約状況"
              row
              density="compact"
            >
              <v-radio label="家主検針" value="家主検針"></v-radio>
              <v-radio label="直接契約" value="直接契約"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.gas_company"
              @update:model-value="updateDetailCheck('gas_company', $event)"
              label="契約会社"
              outlined
              dense
              placeholder="例: 大阪ガス、プロパン"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.gas_customer_number"
              @update:model-value="updateDetailCheck('gas_customer_number', $event)"
              label="お客様番号"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12"><v-divider /></v-col>

          <!-- 水道 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-water</v-icon>
              水道
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <v-radio-group
              :model-value="customerInput?.utilities?.water?.contractType"
              @update:model-value="updateWater('contractType', $event)"
              label="契約状況"
              row
              density="compact"
            >
              <v-radio label="家主検針" value="家主検針"></v-radio>
              <v-radio label="直接契約" value="直接契約"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.water_company"
              @update:model-value="updateDetailCheck('water_company', $event)"
              label="契約会社"
              outlined
              dense
              placeholder="例: 水道局"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.water_customer_number"
              @update:model-value="updateDetailCheck('water_customer_number', $event)"
              label="お客様番号"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12"><v-divider /></v-col>

          <!-- ゴミ出し・その他費用 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-delete-outline</v-icon>
              ゴミ出し方法
            </div>
            <v-text-field
              :model-value="customerInput?.utilities?.garbage?.rules"
              @update:model-value="updateGarbage('rules', $event)"
              label="規則"
              outlined
              dense
              class="mb-2"
            ></v-text-field>
            <v-text-field
              :model-value="customerInput?.utilities?.garbage?.cost"
              @update:model-value="updateGarbage('cost', $event)"
              label="費用"
              outlined
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-cash-multiple</v-icon>
              家主支払い項目
            </div>
            <v-radio-group
              :model-value="detailCheck.landlord_payment"
              @update:model-value="updateDetailCheck('landlord_payment', $event)"
              row
              density="compact"
            >
              <v-radio label="なし" value="なし"></v-radio>
              <v-radio label="あり" value="あり"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="detailCheck.landlord_payment === 'あり'"
              :model-value="detailCheck.landlord_payment_detail"
              @update:model-value="updateDetailCheck('landlord_payment_detail', $event)"
              label="支払い項目詳細"
              outlined
              dense
              placeholder="例: 共益費、管理費"
              class="mt-2"
            />
          </v-col>

          <!-- その他費用 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-currency-jpy</v-icon>
              その他費用（商店街費・町内会費など）
            </div>
            <v-radio-group
              :model-value="customerInput?.utilities?.otherCosts?.status"
              @update:model-value="updateOtherCosts('status', $event)"
              row
              density="compact"
            >
              <v-radio label="なし" value="なし"></v-radio>
              <v-radio label="あり" value="あり"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput?.utilities?.otherCosts?.status === 'あり'"
              :model-value="customerInput?.utilities?.otherCosts?.detail"
              @update:model-value="updateOtherCosts('detail', $event)"
              label="詳細"
              outlined
              dense
              class="mt-2"
              placeholder="費用の種類と金額を記入してください"
            ></v-text-field>
          </v-col>

          <v-col cols="12"><v-divider class="my-2" /></v-col>

          <!-- 請求書写真 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-receipt-text</v-icon>
              請求書写真
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <v-file-input
              :model-value="detailCheck.electricity_bill_photos"
              @update:model-value="updateDetailCheck('electricity_bill_photos', $event)"
              label="電気請求書"
              outlined
              dense
              multiple
              accept="image/*"
              prepend-icon="mdi-camera"
              show-size
              counter
              chips
              small-chips
            >
              <template v-slot:selection="{ fileNames }">
                <v-chip
                  v-for="fileName in fileNames"
                  :key="fileName"
                  size="small"
                  color="primary"
                  class="me-2"
                >
                  {{ fileName }}
                </v-chip>
              </template>
            </v-file-input>
            <div v-if="detailCheck.electricity_bill_photos?.length" class="d-flex flex-wrap gap-2 mt-2">
              <v-img
                v-for="(photo, index) in getPhotoUrls(detailCheck.electricity_bill_photos)"
                :key="index"
                :src="photo"
                width="80"
                height="80"
                cover
                class="rounded border"
              />
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <v-file-input
              :model-value="detailCheck.gas_bill_photos"
              @update:model-value="updateDetailCheck('gas_bill_photos', $event)"
              label="ガス請求書"
              outlined
              dense
              multiple
              accept="image/*"
              prepend-icon="mdi-camera"
              show-size
              counter
              chips
              small-chips
            >
              <template v-slot:selection="{ fileNames }">
                <v-chip
                  v-for="fileName in fileNames"
                  :key="fileName"
                  size="small"
                  color="primary"
                  class="me-2"
                >
                  {{ fileName }}
                </v-chip>
              </template>
            </v-file-input>
            <div v-if="detailCheck.gas_bill_photos?.length" class="d-flex flex-wrap gap-2 mt-2">
              <v-img
                v-for="(photo, index) in getPhotoUrls(detailCheck.gas_bill_photos)"
                :key="index"
                :src="photo"
                width="80"
                height="80"
                cover
                class="rounded border"
              />
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <v-file-input
              :model-value="detailCheck.water_bill_photos"
              @update:model-value="updateDetailCheck('water_bill_photos', $event)"
              label="水道請求書"
              outlined
              dense
              multiple
              accept="image/*"
              prepend-icon="mdi-camera"
              show-size
              counter
              chips
              small-chips
            >
              <template v-slot:selection="{ fileNames }">
                <v-chip
                  v-for="fileName in fileNames"
                  :key="fileName"
                  size="small"
                  color="primary"
                  class="me-2"
                >
                  {{ fileName }}
                </v-chip>
              </template>
            </v-file-input>
            <div v-if="detailCheck.water_bill_photos?.length" class="d-flex flex-wrap gap-2 mt-2">
              <v-img
                v-for="(photo, index) in getPhotoUrls(detailCheck.water_bill_photos)"
                :key="index"
                :src="photo"
                width="80"
                height="80"
                cover
                class="rounded border"
              />
            </div>
          </v-col>

          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.section_b_memo"
              @update:model-value="updateDetailCheck('section_b_memo', $event)"
              label="ライフライン契約・支払い メモ"
              outlined
              dense
              rows="2"
              placeholder="特記事項があれば記載"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 申告・条件情報・費用・その他 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-alert-decagram-outline</v-icon>
        申告・条件情報・費用・その他
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 事前申告 -->
          <v-col cols="12">
            <v-textarea
              :model-value="customerInput?.disclosure?.priorNotice"
              @update:model-value="updateDisclosure('priorNotice', $event)"
              label="事前申告"
              outlined
              dense
              rows="3"
              prepend-inner-icon="mdi-clipboard-alert-outline"
              placeholder="例）家賃滞納・近隣トラブル・家主変更など"
            ></v-textarea>
          </v-col>

          <!-- 新条件 -->
          <v-col cols="12">
            <v-textarea
              :model-value="customerInput?.disclosure?.newConditions"
              @update:model-value="updateDisclosure('newConditions', $event)"
              label="新条件"
              outlined
              dense
              rows="3"
              prepend-inner-icon="mdi-file-document-edit-outline"
              placeholder="例）既に貸主から後継テナントの新条件を聞いている場合"
            ></v-textarea>
          </v-col>

          <!-- ゴミ回収費用 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.garbage_disposal_cost"
              @update:model-value="updateDetailCheck('garbage_disposal_cost', $event)"
              label="ゴミ回収費用（月額）"
              outlined
              dense
              type="number"
              suffix="円"
            />
          </v-col>

          <!-- その他月額費用 -->
          <v-col cols="12" md="6">
            <v-radio-group
              :model-value="detailCheck.other_monthly_costs"
              @update:model-value="updateDetailCheck('other_monthly_costs', $event)"
              label="その他月額費用"
              row
            >
              <v-radio label="あり" value="あり"></v-radio>
              <v-radio label="なし" value="なし"></v-radio>
            </v-radio-group>
          </v-col>

          <v-col cols="12" md="6" v-if="detailCheck.other_monthly_costs === 'あり'">
            <v-text-field
              :model-value="detailCheck.other_monthly_costs_detail"
              @update:model-value="updateDetailCheck('other_monthly_costs_detail', $event)"
              label="その他費用詳細"
              outlined
              dense
              placeholder="例: 防虫サービス、清掃費"
            />
          </v-col>

          <v-col cols="12" md="6" v-if="detailCheck.other_monthly_costs === 'あり'">
            <v-text-field
              :model-value="detailCheck.other_monthly_costs_amount"
              @update:model-value="updateDetailCheck('other_monthly_costs_amount', $event)"
              label="費用（月額）"
              outlined
              dense
              type="number"
              suffix="円"
            />
          </v-col>

          <!-- 申告事項 -->
          <v-col cols="12">
            <v-text-field
              :model-value="detailCheck.declarations"
              @update:model-value="updateDetailCheck('declarations', $event)"
              label="申告事項"
              outlined
              dense
              placeholder="例: 保健所許可、消防署届出"
            />
          </v-col>

          <!-- 新テナント条件 -->
          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.new_tenant_conditions"
              @update:model-value="updateDetailCheck('new_tenant_conditions', $event)"
              label="新テナント条件"
              outlined
              dense
              rows="3"
              placeholder="新しいテナントに対する条件や要求事項"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.section_c_memo"
              @update:model-value="updateDetailCheck('section_c_memo', $event)"
              label="メモ"
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
const props = defineProps<{
  propertyFeatures: {
    strengths: string[]
    limitations: string[]
  }
  customerInput?: {
    utilities: {
      electricity: {
        contractType: string
        customerNumber: string
      }
      gas: {
        contractType: string
        customerNumber: string
      }
      water: {
        contractType: string
        customerNumber: string
      }
      garbage: {
        rules: string
        cost: string
      }
      otherCosts: {
        status: string
        detail: string
      }
    }
    disclosure: {
      priorNotice: string
      newConditions: string
    }
  }
  detailCheck: {
    // A. 交渉・制限・図面
    landlord_negotiation: string
    landlord_negotiation_detail: string
    usage_restriction: string
    usage_restriction_detail: string
    floor_plan: string
    floor_plan_type: string
    section_a_memo: string
    // 写真: 賃貸借契約書・平面図
    lease_contract_photos: File[]
    floor_plan_photos: File[]

    // B. ライフライン契約・支払い
    electricity_company: string
    electricity_customer_number: string
    gas_company: string
    gas_customer_number: string
    water_company: string
    water_customer_number: string
    landlord_payment: string
    landlord_payment_detail: string
    section_b_memo: string
    // 写真: 請求書
    electricity_bill_photos: File[]
    gas_bill_photos: File[]
    water_bill_photos: File[]

    // C. その他申告・費用
    garbage_disposal_cost: string
    other_monthly_costs: string
    other_monthly_costs_detail: string
    other_monthly_costs_amount: string
    declarations: string
    new_tenant_conditions: string
    section_c_memo: string

    // D. 設備・内装・譲渡
    non_transferable_equipment: string
    non_transferable_equipment_detail: string
    broken_equipment: string
    broken_equipment_detail: string
    lease_debt: string
    lease_debt_amount: string
    landlord_equipment: string
    landlord_equipment_detail: string
    section_d_memo: string

    // E. メーター・容量・機器位置
    exhaust_equipment: string
    exhaust_route: string
    drainage_equipment: string
    electric_meter_location: string
    electric_capacity: string
    power_capacity: string
    gas_meter_location: string
    gas_capacity: string
    water_meter_location: string
    water_pipe_capacity: string
    outdoor_unit_location: string
    mdf_location: string
    section_e_memo: string
    // 写真: 設備リスト
    kitchen_equipment_photos: File[]
    duct_photos: File[]
    grease_trap_photos: File[]
    electric_meter_photos: File[]
    gas_meter_photos: File[]
    water_meter_photos: File[]

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
}>()

// Emits
const emit = defineEmits<{
  'update:propertyFeatures': [value: typeof props.propertyFeatures]
  'update:detailCheck': [value: typeof props.detailCheck]
  'update:customerInput': [value: typeof props.customerInput]
}>()

// Internal state
const formValid = ref(false)
const detailForm = ref(null)

// 写真のプレビューURL生成
const getPhotoUrls = (files: File[] | null): string[] => {
  if (!files || !Array.isArray(files)) return []
  return files.map(file => {
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }
    return ''
  }).filter(url => url !== '')
}

// Methods
const updatePropertyFeatures = (key: string, value: any) => {
  emit('update:propertyFeatures', { ...props.propertyFeatures, [key]: value })
}

const updateDetailCheck = (key: string, value: any) => {
  emit('update:detailCheck', { ...props.detailCheck, [key]: value })
}

// CustomerInput update methods
const updateElectricity = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      electricity: { ...props.customerInput.utilities.electricity, [key]: value }
    }
  })
}

const updateGas = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      gas: { ...props.customerInput.utilities.gas, [key]: value }
    }
  })
}

const updateWater = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      water: { ...props.customerInput.utilities.water, [key]: value }
    }
  })
}

const updateGarbage = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      garbage: { ...props.customerInput.utilities.garbage, [key]: value }
    }
  })
}

const updateOtherCosts = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      otherCosts: { ...props.customerInput.utilities.otherCosts, [key]: value }
    }
  })
}

const updateDisclosure = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    disclosure: { ...props.customerInput.disclosure, [key]: value }
  })
}

// Expose form validity for parent
defineExpose({
  formValid,
  detailForm
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
