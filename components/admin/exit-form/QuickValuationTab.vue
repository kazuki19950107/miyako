<template>
  <v-form ref="mainForm" v-model="formValid">
    <!-- 場所関連の金額情報 -->
    <v-card outlined class="section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-map-marker-outline</v-icon>
        立地情報
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 家賃 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
              家賃
            </div>
            <v-slider
              :model-value="locationInfo.rent"
              @update:model-value="updateLocationInfo('rent', $event)"
              :max="100"
              :min="0"
              :step="0.1"
              class="mt-4"
              color="primary"
            />
            <div class="text-center text-h6">{{ locationInfo.rent }}万円</div>
          </v-col>

          <!-- 坪数 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
              坪数
            </div>
            <v-slider
              :model-value="locationInfo.area"
              @update:model-value="updateLocationInfo('area', $event)"
              :max="200"
              :min="0"
              :step="0.1"
              class="mt-4"
              color="primary"
            />
            <div class="text-center text-h6">{{ locationInfo.area }}坪</div>
          </v-col>

          <!-- 立地評価 -->
          <v-col cols="12">
            <v-card class="pa-4" elevation="2" style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);">
              <div class="text-subtitle-2 mb-2" style="color: #1565c0;">
                <v-icon small class="mr-1" color="#1565c0">mdi-map-marker-star</v-icon>
                立地評価
              </div>
              <div class="text-h5 font-weight-bold text-center mb-2" style="color: #0d47a1;">
                {{ calculateLocationEvaluation.toLocaleString() }}円
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="text-caption grey--text text--darken-1">
                <div class="d-flex justify-space-between mb-1">
                  <span>坪単価:</span>
                  <span class="font-weight-medium">{{ calculateRentPerTsubo }}円/坪</span>
                </div>
                <div class="d-flex justify-space-between mb-1">
                  <span>立地等級:</span>
                  <span class="font-weight-medium">{{ calculateLocationCoefficient.grade }}</span>
                </div>
                <div class="d-flex justify-space-between mb-1">
                  <span>立地係数:</span>
                  <span class="font-weight-medium">{{ calculateLocationCoefficient.coefficient }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span>面積係数:</span>
                  <span class="font-weight-medium">{{ calculateAreaCoefficient.toFixed(1) }}</span>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 設備の状態 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-wrench</v-icon>
        設備情報
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 設備費用 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
              設備費用
            </div>

            <v-row class="align-center">
              <v-col cols="12" md="8">
                <v-slider
                  :model-value="equipment.equipmentCost"
                  @update:model-value="updateEquipment('equipmentCost', $event)"
                  :max="1000"
                  :min="0"
                  :step="10"
                  thumb-label
                  :disabled="showDetailEquipmentCost"
                  label="概算"
                  hint="最大1,000万円。より細かい金額や1,000万円超は［詳細入力］をタップ"
                  persistent-hint
                  color="primary"
                  track-color="primary"
                />
              </v-col>

              <v-col cols="12" md="4" class="d-flex ga-2">
                <v-chip
                  color="primary"
                  variant="elevated"
                  @click="showDetailEquipmentCost = !showDetailEquipmentCost"
                  class="font-weight-bold"
                  clickable
                >
                  <v-icon start size="18" class="force-white-icon">{{ showDetailEquipmentCost ? 'mdi-arrow-left' : 'mdi-pencil-outline' }}</v-icon>
                  {{ showDetailEquipmentCost ? 'スライダーに戻す' : '詳細入力' }}
                </v-chip>
              </v-col>

              <v-col v-if="showDetailEquipmentCost" cols="12" md="6">
                <v-text-field
                  :model-value="equipment.equipmentCost"
                  @update:model-value="updateEquipment('equipmentCost', Number($event))"
                  type="number"
                  inputmode="numeric"
                  :min="0"
                  :step="10"
                  label="詳細金額（万円）"
                  outlined
                  dense
                  suffix="万円"
                  prepend-inner-icon="mdi-currency-jpy"
                />
              </v-col>

              <v-col v-if="!showDetailEquipmentCost" cols="12">
                <div class="text-center text-h6">{{ equipment.equipmentCost }}万円</div>
              </v-col>
            </v-row>
          </v-col>

          <!-- 内装費用 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
              内装費用
            </div>

            <v-row class="align-center">
              <v-col cols="12" md="8">
                <v-slider
                  :model-value="equipment.interiorCost"
                  @update:model-value="updateEquipment('interiorCost', $event)"
                  :max="1000"
                  :min="0"
                  :step="10"
                  thumb-label
                  :disabled="showDetailInteriorCost"
                  label="概算"
                  hint="最大1,000万円。より細かい金額や1,000万円超は［詳細入力］をタップ"
                  persistent-hint
                  color="primary"
                  track-color="primary"
                />
              </v-col>

              <v-col cols="12" md="4" class="d-flex ga-2">
                <v-chip
                  color="primary"
                  variant="elevated"
                  @click="showDetailInteriorCost = !showDetailInteriorCost"
                  class="font-weight-bold"
                  clickable
                >
                  <v-icon start size="18" class="force-white-icon">{{ showDetailInteriorCost ? 'mdi-arrow-left' : 'mdi-pencil-outline' }}</v-icon>
                  {{ showDetailInteriorCost ? 'スライダーに戻す' : '詳細入力' }}
                </v-chip>
              </v-col>

              <v-col v-if="showDetailInteriorCost" cols="12" md="6">
                <v-text-field
                  :model-value="equipment.interiorCost"
                  @update:model-value="updateEquipment('interiorCost', Number($event))"
                  type="number"
                  inputmode="numeric"
                  :min="0"
                  :step="10"
                  label="詳細金額（万円）"
                  outlined
                  dense
                  suffix="万円"
                  prepend-inner-icon="mdi-currency-jpy"
                />
              </v-col>

              <v-col v-if="!showDetailInteriorCost" cols="12">
                <div class="text-center text-h6">{{ equipment.interiorCost }}万円</div>
              </v-col>
            </v-row>
          </v-col>

          <!-- 営業年数 -->
          <v-col cols="12" md="6">
            <v-select
              :model-value="equipment.businessYears"
              @update:model-value="updateEquipment('businessYears', $event)"
              label="営業年数"
              :items="businessYearsOptions"
              outlined
              dense
              prepend-inner-icon="mdi-store-clock"
              hint="店舗の営業年数を選択してください"
              persistent-hint
            />
          </v-col>

          <!-- 入居時の引き渡し状態 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2" style="color: #154a8a;">
              <v-icon small class="mr-1" color="#1e50a2">mdi-home-export-outline</v-icon>
              入居時の引き渡し状態について教えてください。
            </div>
            <v-radio-group
              :model-value="equipment.handoverCondition"
              @update:model-value="updateEquipment('handoverCondition', $event)"
              row
              hide-details
              class="mt-2"
            >
              <v-radio
                label="スケルトン"
                value="スケルトン"
                color="primary"
              />
              <v-radio
                label="居抜き（無償）"
                value="居抜き（無償）"
                color="primary"
              />
              <v-radio
                label="居抜き（有償）"
                value="居抜き（有償）"
                color="primary"
              />
            </v-radio-group>
          </v-col>

          <!-- 居抜き（有償）の金額 -->
          <v-col cols="12" v-if="equipment.handoverCondition === '居抜き（有償）'">
            <div class="text-subtitle-2 mb-2">
              <v-icon small color="primary" class="mr-1">mdi-currency-jpy</v-icon>
              居抜き金額
            </div>

            <v-row class="align-center">
              <v-col cols="12" md="8">
                <v-slider
                  :model-value="equipment.handoverAmount"
                  @update:model-value="updateEquipment('handoverAmount', $event)"
                  :max="1000"
                  :min="0"
                  :step="10"
                  thumb-label
                  :disabled="showDetailHandoverAmount"
                  label="概算"
                  hint="最大1,000万円。より細かい金額や1,000万円超は［詳細入力］をタップ"
                  persistent-hint
                  color="primary"
                  track-color="primary"
                />
              </v-col>

              <v-col cols="12" md="4" class="d-flex ga-2">
                <v-chip
                  color="primary"
                  variant="elevated"
                  @click="showDetailHandoverAmount = !showDetailHandoverAmount"
                  class="font-weight-bold"
                  clickable
                >
                  <v-icon start size="18" class="force-white-icon">{{ showDetailHandoverAmount ? 'mdi-arrow-left' : 'mdi-pencil-outline' }}</v-icon>
                  {{ showDetailHandoverAmount ? 'スライダーに戻す' : '詳細入力' }}
                </v-chip>
              </v-col>

              <v-col v-if="showDetailHandoverAmount" cols="12" md="6">
                <v-text-field
                  :model-value="equipment.handoverAmount"
                  @update:model-value="updateEquipment('handoverAmount', Number($event))"
                  type="number"
                  inputmode="numeric"
                  :min="0"
                  :step="10"
                  label="詳細金額（万円）"
                  outlined
                  dense
                  suffix="万円"
                  prepend-inner-icon="mdi-currency-jpy"
                />
              </v-col>

              <v-col v-if="!showDetailHandoverAmount" cols="12">
                <div class="text-center text-h6">{{ equipment.handoverAmount }}万円</div>
              </v-col>
            </v-row>
          </v-col>

          <!-- 設備評価 -->
          <v-col cols="12">
            <v-card class="pa-4" elevation="2" style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);">
              <div class="text-subtitle-2 mb-2" style="color: #2e7d32;">
                <v-icon small class="mr-1" color="#2e7d32">mdi-tools</v-icon>
                設備評価
              </div>
              <div class="text-h5 font-weight-bold text-center mb-2" style="color: #1b5e20;">
                {{ calculateEquipmentEvaluation.toLocaleString() }}万円
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="text-caption grey--text text--darken-1">
                <div class="d-flex justify-space-between mb-1">
                  <span>設備残存価値:</span>
                  <span class="font-weight-medium">{{ calculateEquipmentResidual.toLocaleString() }}万円</span>
                </div>
                <div class="d-flex justify-space-between mb-1">
                  <span>内装残存価値:</span>
                  <span class="font-weight-medium">{{ calculateInteriorResidual.toLocaleString() }}万円</span>
                </div>
                <div class="d-flex justify-space-between mb-1">
                  <span>設備係数:</span>
                  <span class="font-weight-medium">{{ equipment.equipmentCoefficient !== undefined ? equipment.equipmentCoefficient : 0.8 }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span>内装係数:</span>
                  <span class="font-weight-medium">{{ (1 - (equipment.equipmentCoefficient !== undefined ? equipment.equipmentCoefficient : 0.8)).toFixed(1) }}</span>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- 詳細設定 -->
          <v-col cols="12">
            <v-card outlined>
              <v-card-text>
                <div
                  class="d-flex align-center justify-space-between"
                  style="cursor: pointer;"
                  @click="showCoefficientSettings = !showCoefficientSettings"
                >
                  <span class="text-subtitle-2">
                    <v-icon small class="mr-2">mdi-tune</v-icon>
                    詳細設定（係数調整）
                  </span>
                  <v-icon>{{ showCoefficientSettings ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </div>

                <v-expand-transition>
                  <div v-show="showCoefficientSettings" class="mt-4">
                    <v-row>
                      <v-col cols="12">
                        <div class="text-caption mb-2">スライダーで設備と内装の重みを調整できます</div>
                      </v-col>

                      <v-col cols="12">
                        <div class="d-flex justify-space-between mb-2">
                          <span class="text-subtitle-2">設備重み {{ equipment.equipmentCoefficient !== undefined ? equipment.equipmentCoefficient : 0.8 }}</span>
                          <span class="text-subtitle-2">内装重み {{ (1 - (equipment.equipmentCoefficient !== undefined ? equipment.equipmentCoefficient : 0.8)).toFixed(1) }}</span>
                        </div>
                        <v-slider
                          :model-value="equipment.equipmentCoefficient"
                          @update:model-value="updateCoefficientAndEmit"
                          :min="0"
                          :max="1"
                          :step="0.1"
                          thumb-label
                          color="primary"
                          track-color="secondary"
                        >
                          <template v-slot:prepend>
                            <v-icon color="primary">mdi-tools</v-icon>
                          </template>
                          <template v-slot:append>
                            <v-icon color="secondary">mdi-palette</v-icon>
                          </template>
                        </v-slider>
                        <div class="text-center text-caption grey--text">
                          設備 {{ ((equipment.equipmentCoefficient !== undefined ? equipment.equipmentCoefficient : 0.8) * 10).toFixed(0) }} : 内装 {{ ((1 - (equipment.equipmentCoefficient !== undefined ? equipment.equipmentCoefficient : 0.8)) * 10).toFixed(0) }}
                        </div>
                      </v-col>

                      <v-col cols="12">
                        <v-btn
                          block
                          outlined
                          color="primary"
                          small
                          @click="resetCoefficientsLocal"
                        >
                          <v-icon left small>mdi-refresh</v-icon>
                          デフォルトに戻す（8:2）
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </v-expand-transition>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 簡易査定 -->
    <v-card outlined class="section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-calculator-variant</v-icon>
        簡易査定
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 簡易査定結果 -->
          <v-col cols="12">
            <v-card class="pa-4" elevation="2" style="background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);">
              <div class="text-subtitle-2 mb-2" style="color: #f57c00;">
                <v-icon small class="mr-1" color="#f57c00">mdi-cash-multiple</v-icon>
                簡易査定額
              </div>
              <div class="text-h5 font-weight-bold text-center mb-2" style="color: #e65100;">
                {{ calculateSimpleValuation.toLocaleString() }}円
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="text-caption grey--text text--darken-1">
                <div class="d-flex justify-space-between mb-1">
                  <span>立地評価:</span>
                  <span class="font-weight-medium">{{ calculateLocationEvaluation.toLocaleString() }}円</span>
                </div>
                <div class="d-flex justify-space-between mb-1">
                  <span>設備評価:</span>
                  <span class="font-weight-medium">{{ (calculateEquipmentEvaluation * 10000).toLocaleString() }}円</span>
                </div>
                <div class="d-flex justify-space-between mb-1">
                  <span>立地重み:</span>
                  <span class="font-weight-medium">{{ valuation.locationWeight !== undefined ? valuation.locationWeight : 0.6 }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span>設備重み:</span>
                  <span class="font-weight-medium">{{ (1 - (valuation.locationWeight !== undefined ? valuation.locationWeight : 0.6)).toFixed(1) }}</span>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- 詳細設定 -->
          <v-col cols="12">
            <v-card outlined>
              <v-card-text>
                <div
                  class="d-flex align-center justify-space-between"
                  style="cursor: pointer;"
                  @click="showValuationSettings = !showValuationSettings"
                >
                  <span class="text-subtitle-2">
                    <v-icon small class="mr-2">mdi-tune</v-icon>
                    詳細設定（係数調整）
                  </span>
                  <v-icon>{{ showValuationSettings ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </div>

                <v-expand-transition>
                  <div v-show="showValuationSettings" class="mt-4">
                    <v-row>
                      <v-col cols="12">
                        <div class="text-caption mb-2">スライダーで立地と設備の重みを調整できます</div>
                      </v-col>

                      <v-col cols="12">
                        <div class="d-flex justify-space-between mb-2">
                          <span class="text-subtitle-2">立地重み {{ valuation.locationWeight !== undefined ? valuation.locationWeight : 0.6 }}</span>
                          <span class="text-subtitle-2">設備重み {{ (1 - (valuation.locationWeight !== undefined ? valuation.locationWeight : 0.6)).toFixed(1) }}</span>
                        </div>
                        <v-slider
                          :model-value="valuation.locationWeight"
                          @update:model-value="updateValuationWeightAndEmit"
                          :min="0"
                          :max="1"
                          :step="0.1"
                          thumb-label
                          color="primary"
                          track-color="secondary"
                        >
                          <template v-slot:prepend>
                            <v-icon color="primary">mdi-map-marker</v-icon>
                          </template>
                          <template v-slot:append>
                            <v-icon color="secondary">mdi-tools</v-icon>
                          </template>
                        </v-slider>
                        <div class="text-center text-caption grey--text">
                          立地 {{ ((valuation.locationWeight !== undefined ? valuation.locationWeight : 0.6) * 10).toFixed(0) }} : 設備 {{ ((1 - (valuation.locationWeight !== undefined ? valuation.locationWeight : 0.6)) * 10).toFixed(0) }}
                        </div>
                      </v-col>

                      <v-col cols="12">
                        <v-btn
                          block
                          outlined
                          color="primary"
                          small
                          @click="resetValuationWeightsLocal"
                        >
                          <v-icon left small>mdi-refresh</v-icon>
                          デフォルトに戻す（6:4）
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </v-expand-transition>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
const props = defineProps<{
  locationInfo: {
    rent: number
    area: number
  }
  equipment: {
    equipmentCost: number
    interiorCost: number
    businessYears: number
    handoverCondition: string
    handoverAmount: number
    equipmentCoefficient: number
    interiorCoefficient: number
  }
  valuation: {
    locationWeight: number
    equipmentWeight: number
  }
}>()

// Emits
const emit = defineEmits<{
  'update:locationInfo': [value: typeof props.locationInfo]
  'update:equipment': [value: typeof props.equipment]
  'update:valuation': [value: typeof props.valuation]
}>()

// Internal state
const formValid = ref(false)
const showDetailEquipmentCost = ref(false)
const showDetailInteriorCost = ref(false)
const showDetailHandoverAmount = ref(false)
const showCoefficientSettings = ref(false)
const showValuationSettings = ref(false)
const mainForm = ref(null)

// Options
const businessYearsOptions = [
  { title: '1年未満', value: 0 },
  { title: '1年', value: 1 },
  { title: '2年', value: 2 },
  { title: '3年', value: 3 },
  { title: '4年', value: 4 },
  { title: '5年', value: 5 },
  { title: '6年', value: 6 },
  { title: '7年', value: 7 },
  { title: '8年', value: 8 },
  { title: '9年', value: 9 },
  { title: '10年', value: 10 },
  { title: '11年', value: 11 },
  { title: '12年', value: 12 },
  { title: '13年', value: 13 },
  { title: '14年', value: 14 },
  { title: '15年以上', value: 15 }
]

// Computed
const calculateRentPerTsubo = computed(() => {
  const rent = Number(props.locationInfo.rent) * 10000
  const area = Number(props.locationInfo.area)
  if (rent > 0 && area > 0) {
    return Math.round(rent / area).toLocaleString()
  }
  return '0'
})

const calculateLocationCoefficient = computed(() => {
  const rent = Number(props.locationInfo.rent) * 10000
  const area = Number(props.locationInfo.area)
  if (rent <= 0 || area <= 0) return { grade: '', coefficient: 0 }

  const tsuboPrice = rent / area

  if (tsuboPrice <= 10000) return { grade: '1等地A', coefficient: 1 }
  if (tsuboPrice <= 15000) return { grade: '1等地B', coefficient: 2 }
  if (tsuboPrice <= 20000) return { grade: '2等地A', coefficient: 3 }
  if (tsuboPrice <= 30000) return { grade: '2等地B', coefficient: 4 }
  if (tsuboPrice <= 50000) return { grade: '3等地A', coefficient: 5 }
  return { grade: '3等地B', coefficient: 6 }
})

const calculateAreaCoefficient = computed(() => {
  const area = Number(props.locationInfo.area)
  const locationCoef = calculateLocationCoefficient.value.coefficient

  if (area <= 0 || locationCoef === 0) return 0

  if (area <= 20) return locationCoef * 2
  if (area <= 50) return locationCoef * 1.5
  return locationCoef * 1.2
})

const calculateLocationEvaluation = computed(() => {
  const rent = Number(props.locationInfo.rent) * 10000
  const area = Number(props.locationInfo.area)
  const areaCoef = calculateAreaCoefficient.value

  if (rent <= 0 || area <= 0 || areaCoef === 0) return 0

  const tsuboPrice = rent / area
  const evaluation = tsuboPrice * area * areaCoef

  return Math.round(evaluation)
})

const calculateEquipmentResidual = computed(() => {
  const equipmentCost = Number(props.equipment.equipmentCost) || 0
  const businessYears = Number(props.equipment.businessYears) || 0
  const depreciationYears = 7

  if (equipmentCost <= 0) return 0
  if (businessYears >= depreciationYears) return 0

  const residualValue = equipmentCost * (depreciationYears - businessYears) / depreciationYears

  return Math.round(residualValue * 10) / 10
})

const calculateInteriorResidual = computed(() => {
  const interiorCost = Number(props.equipment.interiorCost) || 0
  const businessYears = Number(props.equipment.businessYears) || 0
  const depreciationYears = 15

  if (interiorCost <= 0) return 0
  if (businessYears >= depreciationYears) return 0

  const residualValue = interiorCost * (depreciationYears - businessYears) / depreciationYears

  return Math.round(residualValue * 10) / 10
})

const calculateEquipmentEvaluation = computed(() => {
  const equipmentResidual = calculateEquipmentResidual.value
  const interiorResidual = calculateInteriorResidual.value

  const equipmentCoefficient = Number(props.equipment.equipmentCoefficient) || 0.8
  const interiorCoefficient = Number(props.equipment.interiorCoefficient) || 0.2

  const evaluation = (equipmentResidual * equipmentCoefficient) + (interiorResidual * interiorCoefficient)

  return Math.round(evaluation * 10) / 10
})

const calculateSimpleValuation = computed(() => {
  const locationEvaluation = calculateLocationEvaluation.value
  const equipmentEvaluation = (calculateEquipmentEvaluation.value || 0) * 10000

  const locationWeight = Number(props.valuation.locationWeight) || 0.6
  const equipmentWeight = Number(props.valuation.equipmentWeight) || 0.4

  const valuation = (locationEvaluation * locationWeight) + (equipmentEvaluation * equipmentWeight)

  return Math.round(valuation)
})

// Methods
const updateLocationInfo = (key: string, value: any) => {
  emit('update:locationInfo', { ...props.locationInfo, [key]: value })
}

const updateEquipment = (key: string, value: any) => {
  emit('update:equipment', { ...props.equipment, [key]: value })
}

const updateValuation = (key: string, value: any) => {
  emit('update:valuation', { ...props.valuation, [key]: value })
}

const updateCoefficientAndEmit = (value: number) => {
  const interiorCoef = Math.round((1 - value) * 10) / 10
  emit('update:equipment', {
    ...props.equipment,
    equipmentCoefficient: value,
    interiorCoefficient: interiorCoef
  })
}

const resetCoefficientsLocal = () => {
  emit('update:equipment', {
    ...props.equipment,
    equipmentCoefficient: 0.8,
    interiorCoefficient: 0.2
  })
}

const updateValuationWeightAndEmit = (value: number) => {
  const equipmentWeight = Math.round((1 - value) * 10) / 10
  emit('update:valuation', {
    ...props.valuation,
    locationWeight: value,
    equipmentWeight: equipmentWeight
  })
}

const resetValuationWeightsLocal = () => {
  emit('update:valuation', {
    ...props.valuation,
    locationWeight: 0.6,
    equipmentWeight: 0.4
  })
}

// Expose form validity for parent
defineExpose({
  formValid,
  mainForm
})
</script>

<style scoped>
/* セクション見出しを統一 */
.section-title {
  font-weight: 700 !important;
  font-size: 17px !important;
  background: linear-gradient(135deg, #f2f6ff 0%, #e8efff 100%) !important;
  color: #154a8a !important;
  border-bottom: 2px solid #e1ecff !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  border-radius: 0 !important;
}

.section-title .v-icon {
  background: rgba(30, 80, 162, 0.1);
  border-radius: 50%;
  padding: 6px;
  margin-right: 12px !important;
}

/* カードの間隔と角丸の統一 */
.v-card.section-card,
.v-card.outlined {
  border-radius: 16px !important;
  border: 1px solid #e1ecff !important;
  box-shadow: 0 4px 12px rgba(30, 80, 162, 0.08) !important;
  margin-bottom: 24px !important;
  overflow: hidden;
}

.v-card.section-card:hover {
  box-shadow: 0 6px 20px rgba(30, 80, 162, 0.12) !important;
  transition: box-shadow 0.3s ease;
}
</style>
