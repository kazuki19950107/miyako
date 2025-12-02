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

            <v-row class="align-center">
              <v-col cols="12" md="8">
                <v-slider
                  :model-value="locationInfo.rent"
                  @update:model-value="updateLocationInfo('rent', $event)"
                  :max="100"
                  :min="0"
                  :step="0.1"
                  thumb-label
                  :disabled="showDetailRent"
                  label="概算"
                  hint="最大100万円。より細かい金額や100万円超は［詳細入力］をタップ"
                  persistent-hint
                  color="primary"
                  track-color="primary"
                />
              </v-col>

              <v-col cols="12" md="4" class="d-flex ga-2">
                <v-chip
                  color="primary"
                  variant="elevated"
                  @click="showDetailRent = !showDetailRent"
                  class="font-weight-bold"
                  clickable
                >
                  <v-icon start size="18" class="force-white-icon">{{ showDetailRent ? 'mdi-arrow-left' : 'mdi-pencil-outline' }}</v-icon>
                  {{ showDetailRent ? 'スライダーに戻す' : '詳細入力' }}
                </v-chip>
              </v-col>

              <v-col v-if="showDetailRent" cols="12" md="6">
                <v-text-field
                  :model-value="locationInfo.rent"
                  @update:model-value="updateLocationInfo('rent', Number($event))"
                  type="number"
                  inputmode="decimal"
                  :min="0"
                  :step="0.1"
                  label="詳細金額（万円）"
                  outlined
                  dense
                  suffix="万円"
                  prepend-inner-icon="mdi-currency-jpy"
                />
              </v-col>

              <v-col v-if="!showDetailRent" cols="12">
                <div class="text-center text-h6">{{ locationInfo.rent }}万円</div>
              </v-col>
            </v-row>
          </v-col>

          <!-- 坪数 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
              坪数
            </div>

            <v-row class="align-center">
              <v-col cols="12" md="8">
                <v-slider
                  :model-value="locationInfo.area"
                  @update:model-value="updateLocationInfo('area', $event)"
                  :max="50"
                  :min="0"
                  :step="0.1"
                  thumb-label
                  :disabled="showDetailArea"
                  label="概算"
                  hint="最大50坪。より細かい数値や50坪超は［詳細入力］をタップ"
                  persistent-hint
                  color="primary"
                  track-color="primary"
                />
              </v-col>

              <v-col cols="12" md="4" class="d-flex ga-2">
                <v-chip
                  color="primary"
                  variant="elevated"
                  @click="showDetailArea = !showDetailArea"
                  class="font-weight-bold"
                  clickable
                >
                  <v-icon start size="18" class="force-white-icon">{{ showDetailArea ? 'mdi-arrow-left' : 'mdi-pencil-outline' }}</v-icon>
                  {{ showDetailArea ? 'スライダーに戻す' : '詳細入力' }}
                </v-chip>
              </v-col>

              <v-col v-if="showDetailArea" cols="12" md="6">
                <v-text-field
                  :model-value="locationInfo.area"
                  @update:model-value="updateLocationInfo('area', Number($event))"
                  type="number"
                  inputmode="decimal"
                  :min="0"
                  :step="0.1"
                  label="詳細坪数（坪）"
                  outlined
                  dense
                  suffix="坪"
                  prepend-inner-icon="mdi-ruler-square"
                />
              </v-col>

              <v-col v-if="!showDetailArea" cols="12">
                <div class="text-center text-h6">{{ locationInfo.area }}坪</div>
              </v-col>
            </v-row>
          </v-col>

          <!-- 立地評価 -->
          <v-col cols="12">
            <v-card class="pa-4" elevation="2" style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);">
              <div class="text-subtitle-2 mb-2" style="color: #1565c0;">
                <v-icon small class="mr-1" color="#1565c0">mdi-map-marker-star</v-icon>
                立地評価
              </div>
              <div class="text-h5 font-weight-bold text-center mb-2" style="color: #0d47a1;">
                {{ Math.round(calculateLocationEvaluation / 10000).toLocaleString() }}万円
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
          <!-- 内装・設備の施工費用 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
              内装・設備の施工費用
            </div>

            <v-row class="align-center">
              <v-col cols="12" md="8">
                <v-slider
                  :model-value="equipment.constructionCost"
                  @update:model-value="updateEquipment('constructionCost', $event)"
                  :max="2000"
                  :min="0"
                  :step="10"
                  thumb-label
                  :disabled="showDetailConstructionCost"
                  label="概算"
                  hint="最大2,000万円。より細かい金額や2,000万円超は［詳細入力］をタップ"
                  persistent-hint
                  color="primary"
                  track-color="primary"
                />
              </v-col>

              <v-col cols="12" md="4" class="d-flex ga-2">
                <v-chip
                  color="primary"
                  variant="elevated"
                  @click="showDetailConstructionCost = !showDetailConstructionCost"
                  class="font-weight-bold"
                  clickable
                >
                  <v-icon start size="18" class="force-white-icon">{{ showDetailConstructionCost ? 'mdi-arrow-left' : 'mdi-pencil-outline' }}</v-icon>
                  {{ showDetailConstructionCost ? 'スライダーに戻す' : '詳細入力' }}
                </v-chip>
              </v-col>

              <v-col v-if="showDetailConstructionCost" cols="12" md="6">
                <v-text-field
                  :model-value="equipment.constructionCost"
                  @update:model-value="updateEquipment('constructionCost', Number($event))"
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

              <v-col v-if="!showDetailConstructionCost" cols="12">
                <div class="text-center text-h6">{{ equipment.constructionCost }}万円</div>
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
                  <span>施工費用:</span>
                  <span class="font-weight-medium">{{ equipment.constructionCost?.toLocaleString() || 0 }}万円</span>
                </div>
                <div class="d-flex justify-space-between mb-1">
                  <span>営業年数:</span>
                  <span class="font-weight-medium">{{ equipment.businessYears }}年</span>
                </div>
                <div class="d-flex justify-space-between mb-1">
                  <span>減価償却率:</span>
                  <span class="font-weight-medium">{{ (getDepreciationRate(equipment.businessYears) * 100).toFixed(0) }}%</span>
                </div>
                <div class="d-flex justify-space-between mb-1">
                  <span>残存価値:</span>
                  <span class="font-weight-medium">{{ calculateConstructionResidual.toLocaleString() }}万円</span>
                </div>
                <div v-if="equipment.handoverCondition === '居抜き（有償）'" class="d-flex justify-space-between">
                  <span>居抜き残存価値:</span>
                  <span class="font-weight-medium">{{ calculateHandoverResidual.toLocaleString() }}万円</span>
                </div>
              </div>
            </v-card>
          </v-col>

        </v-row>
      </v-card-text>
    </v-card>

    <!-- 物件の特徴チェック -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-check-circle-outline</v-icon>
        物件の特徴
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 業態 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-store</v-icon>
              業態
            </div>
            <v-radio-group
              :model-value="propertyFeatures.businessType"
              @update:model-value="updatePropertyFeatures('businessType', $event)"
              hide-details
              class="mt-0"
            >
              <v-radio label="焼肉" value="焼肉" color="primary" />
              <v-radio label="重飲食（ラーメン、焼鳥、中華など）" value="重飲食" color="primary" />
              <v-radio label="一般的な飲食店（居酒屋レベル）" value="一般飲食" color="primary" />
              <v-radio label="ナイトクラブ" value="ナイトクラブ" color="primary" />
              <v-radio label="軽飲食（＊カフェ、テイクアウト）" value="軽飲食" color="primary" />
            </v-radio-group>
          </v-col>

          <!-- 階数 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-stairs</v-icon>
              階数・立地
            </div>
            <v-radio-group
              :model-value="propertyFeatures.floorType"
              @update:model-value="updatePropertyFeatures('floorType', $event)"
              hide-details
              class="mt-0"
            >
              <v-radio label="路面店（商業ビル内も含む）" value="路面店" color="primary" />
              <v-radio label="1階ビル奥、2階、地下、多層階" value="2階以下" color="primary" />
              <v-radio label="3階以上" value="3階以上" color="primary" />
            </v-radio-group>
          </v-col>

          <!-- 強みとなる特徴 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="success">mdi-plus-circle</v-icon>
              強みとなる特徴
            </div>
            <v-row>
              <v-col cols="12" sm="6">
                <v-checkbox
                  :model-value="propertyFeatures.strengths"
                  @update:model-value="updatePropertyFeatures('strengths', $event)"
                  label="重飲食可"
                  value="重飲食可"
                  multiple
                  hide-details
                  color="success"
                  class="mb-2"
                />
                <v-checkbox
                  :model-value="propertyFeatures.strengths"
                  @update:model-value="updatePropertyFeatures('strengths', $event)"
                  label="食べログ3.5以上"
                  value="食べログ3.5以上"
                  multiple
                  hide-details
                  color="success"
                  class="mb-2"
                />
                <v-checkbox
                  :model-value="propertyFeatures.strengths"
                  @update:model-value="updatePropertyFeatures('strengths', $event)"
                  label="グリストラップあり"
                  value="グリストラップあり"
                  multiple
                  hide-details
                  color="success"
                  class="mb-2"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-checkbox
                  :model-value="propertyFeatures.strengths"
                  @update:model-value="updatePropertyFeatures('strengths', $event)"
                  value="ダクト屋上まで設置"
                  multiple
                  hide-details
                  color="success"
                  class="mb-2"
                >
                  <template #label>
                    ダクト屋上まで設置<span style="font-size: 10px; color: #999;">（＊）</span>
                  </template>
                </v-checkbox>
                <v-checkbox
                  :model-value="propertyFeatures.strengths"
                  @update:model-value="updatePropertyFeatures('strengths', $event)"
                  label="賃料が相場より安い"
                  value="賃料が相場より安い"
                  multiple
                  hide-details
                  color="success"
                  class="mb-2"
                />
                <v-checkbox
                  :model-value="propertyFeatures.strengths"
                  @update:model-value="updatePropertyFeatures('strengths', $event)"
                  label="売上状況が良い"
                  value="売上状況が良い"
                  multiple
                  hide-details
                  color="success"
                  class="mb-2"
                />
              </v-col>
            </v-row>
          </v-col>

          <!-- 注意が必要な特徴 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="warning">mdi-alert-circle</v-icon>
              注意が必要な特徴
            </div>
            <v-row>
              <v-col cols="12" sm="6">
                <v-checkbox
                  :model-value="propertyFeatures.limitations"
                  @update:model-value="updatePropertyFeatures('limitations', $event)"
                  label="軽飲食のみ"
                  value="軽飲食のみ"
                  multiple
                  hide-details
                  color="warning"
                  class="mb-2"
                />
                <v-checkbox
                  :model-value="propertyFeatures.limitations"
                  @update:model-value="updatePropertyFeatures('limitations', $event)"
                  label="業種制限あり"
                  value="業種制限あり"
                  multiple
                  hide-details
                  color="warning"
                  class="mb-2"
                />
                <v-checkbox
                  :model-value="propertyFeatures.limitations"
                  @update:model-value="updatePropertyFeatures('limitations', $event)"
                  value="グリストラップなし"
                  multiple
                  hide-details
                  color="warning"
                  class="mb-2"
                >
                  <template #label>
                    グリストラップなし<span style="font-size: 10px; color: #999;">（＊）</span>
                  </template>
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="6">
                <v-checkbox
                  :model-value="propertyFeatures.limitations"
                  @update:model-value="updatePropertyFeatures('limitations', $event)"
                  label="営業時間制限あり"
                  value="営業時間制限あり"
                  multiple
                  hide-details
                  color="warning"
                  class="mb-2"
                />
                <v-checkbox
                  :model-value="propertyFeatures.limitations"
                  @update:model-value="updatePropertyFeatures('limitations', $event)"
                  label="故障している設備あり"
                  value="故障している設備あり"
                  multiple
                  hide-details
                  color="warning"
                  class="mb-2"
                />
              </v-col>
            </v-row>
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
                {{ Math.round(calculateSimpleValuation / 10000).toLocaleString() }}万円
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="text-caption grey--text text--darken-1">
                <div class="d-flex justify-space-between mb-1">
                  <span>立地評価:</span>
                  <span class="font-weight-medium">{{ Math.round(calculateLocationEvaluation / 10000).toLocaleString() }}万円</span>
                </div>
                <div class="d-flex justify-space-between mb-1">
                  <span>設備評価:</span>
                  <span class="font-weight-medium">{{ calculateEquipmentEvaluation.toLocaleString() }}万円</span>
                </div>
                <div class="d-flex justify-space-between mb-1">
                  <span>立地重み:</span>
                  <span class="font-weight-medium">{{ valuation.locationWeight !== undefined ? valuation.locationWeight : 0.6 }}</span>
                </div>
                <div class="d-flex justify-space-between mb-1">
                  <span>設備重み:</span>
                  <span class="font-weight-medium">{{ (1 - (valuation.locationWeight !== undefined ? valuation.locationWeight : 0.6)).toFixed(1) }}</span>
                </div>
                <div class="d-flex justify-space-between" style="border-top: 1px dashed #ccc; padding-top: 4px; margin-top: 4px;">
                  <span>物件特徴係数:</span>
                  <span class="font-weight-medium" :style="{ color: calculatePropertyCoefficient > 1 ? '#2e7d32' : calculatePropertyCoefficient < 1 ? '#f57c00' : 'inherit' }">
                    ×{{ calculatePropertyCoefficient.toFixed(2) }}
                  </span>
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
  propertyFeatures: {
    strengths: string[]
    limitations: string[]
    businessType: string
    floorType: string
  }
  locationInfo: {
    rent: number
    area: number
  }
  equipment: {
    constructionCost: number
    businessYears: number
    handoverCondition: string
    handoverAmount: number
  }
  valuation: {
    locationWeight: number
    equipmentWeight: number
  }
}>()

// Emits
const emit = defineEmits<{
  'update:propertyFeatures': [value: typeof props.propertyFeatures]
  'update:locationInfo': [value: typeof props.locationInfo]
  'update:equipment': [value: typeof props.equipment]
  'update:valuation': [value: typeof props.valuation]
}>()

// Internal state
const formValid = ref(false)
const showDetailRent = ref(false)
const showDetailArea = ref(false)
const showDetailConstructionCost = ref(false)
const showDetailHandoverAmount = ref(false)
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

  // 坪単価が高いほど良い立地
  if (tsuboPrice >= 50000) return { grade: '1等地A', coefficient: 6 }
  if (tsuboPrice >= 20000) return { grade: '1等地B', coefficient: 5 }
  if (tsuboPrice >= 15000) return { grade: '2等地A', coefficient: 4 }
  if (tsuboPrice >= 12000) return { grade: '2等地B', coefficient: 3 }
  if (tsuboPrice >= 10000) return { grade: '3等地A', coefficient: 2 }
  return { grade: '3等地B', coefficient: 1 }
})

const calculateAreaCoefficient = computed(() => {
  const area = Number(props.locationInfo.area)
  const locationCoef = calculateLocationCoefficient.value.coefficient

  if (area <= 0 || locationCoef === 0) return 0

  // 1〜20坪未満、20坪〜50坪未満、50坪以上
  if (area < 20) return locationCoef * 2
  if (area < 50) return locationCoef * 1.5
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

// 営業年数に基づく減価償却率
const getDepreciationRate = (years: number): number => {
  if (years <= 1) return 0.7   // 1年: 70%
  if (years === 2) return 0.6  // 2年: 60%
  if (years === 3) return 0.5  // 3年: 50%
  if (years === 4) return 0.4  // 4年: 40%
  if (years === 5) return 0.35 // 5年: 35%
  if (years === 6) return 0.3  // 6年: 30%
  if (years === 7) return 0.25 // 7年: 25%
  if (years === 8) return 0.2  // 8年: 20%
  if (years >= 9 && years <= 10) return 0.15 // 9〜10年: 15%
  return 0.1 // 10年以上: 10%
}

const calculateConstructionResidual = computed(() => {
  const constructionCost = Number(props.equipment.constructionCost) || 0
  const businessYears = Number(props.equipment.businessYears) || 0

  if (constructionCost <= 0) return 0

  const rate = getDepreciationRate(businessYears)
  const residualValue = constructionCost * rate

  return Math.round(residualValue * 10) / 10
})

// 居抜き（有償）の残存価値も同じ減価償却率を使用
const calculateHandoverResidual = computed(() => {
  const handoverAmount = Number(props.equipment.handoverAmount) || 0
  const businessYears = Number(props.equipment.businessYears) || 0

  if (handoverAmount <= 0) return 0

  const rate = getDepreciationRate(businessYears)
  const residualValue = handoverAmount * rate

  return Math.round(residualValue * 10) / 10
})

// 設備評価 = 内装・設備残存価値 + 居抜き残存価値（有償の場合のみ）
const calculateEquipmentEvaluation = computed(() => {
  const constructionResidual = calculateConstructionResidual.value
  const handoverResidual = props.equipment.handoverCondition === '居抜き（有償）'
    ? calculateHandoverResidual.value
    : 0

  const evaluation = constructionResidual + handoverResidual

  return Math.round(evaluation * 10) / 10
})

// 物件特徴係数の計算
const calculatePropertyCoefficient = computed(() => {
  let coefficient = 1.0
  const businessType = props.propertyFeatures.businessType
  const floorType = props.propertyFeatures.floorType
  const strengths = props.propertyFeatures.strengths || []
  const limitations = props.propertyFeatures.limitations || []
  const isLightFood = businessType === '軽飲食'

  // 業態係数
  if (businessType === '焼肉') coefficient *= 1.2
  else if (businessType === '重飲食') coefficient *= 1.1
  else if (businessType === '軽飲食') coefficient *= 0.8
  // 一般飲食、ナイトクラブは×1なのでそのまま

  // 階数係数
  if (floorType === '2階以下') coefficient *= 0.9
  else if (floorType === '3階以上') coefficient *= 0.8
  // 路面店は×1なのでそのまま

  // 強み（プラス係数）
  if (strengths.includes('食べログ3.5以上')) coefficient *= 1.2
  if (strengths.includes('ダクト屋上まで設置') && !isLightFood) coefficient *= 1.1
  if (strengths.includes('賃料が相場より安い')) coefficient *= 1.1
  if (strengths.includes('売上状況が良い')) coefficient *= 1.1

  // 注意（マイナス係数）
  if (limitations.includes('グリストラップなし') && !isLightFood) coefficient *= 0.9
  if (limitations.includes('営業時間制限あり')) coefficient *= 0.9

  return Math.round(coefficient * 100) / 100
})

const calculateSimpleValuation = computed(() => {
  const locationEvaluation = calculateLocationEvaluation.value
  const equipmentEvaluation = (calculateEquipmentEvaluation.value || 0) * 10000

  const locationWeight = props.valuation.locationWeight !== undefined ? Number(props.valuation.locationWeight) : 0.6
  const equipmentWeight = props.valuation.equipmentWeight !== undefined ? Number(props.valuation.equipmentWeight) : 0.4

  const baseValuation = (locationEvaluation * locationWeight) + (equipmentEvaluation * equipmentWeight)

  // 物件特徴係数を適用
  const valuation = baseValuation * calculatePropertyCoefficient.value

  return Math.round(valuation)
})

// Methods
const updatePropertyFeatures = (key: string, value: any) => {
  emit('update:propertyFeatures', { ...props.propertyFeatures, [key]: value })
}

const updateLocationInfo = (key: string, value: any) => {
  emit('update:locationInfo', { ...props.locationInfo, [key]: value })
}

const updateEquipment = (key: string, value: any) => {
  emit('update:equipment', { ...props.equipment, [key]: value })
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
