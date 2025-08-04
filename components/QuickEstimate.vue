<template>
  <v-container class="py-12" style="max-width: 1200px;">
    <!-- セクションヘッダー -->
    <div class="text-center mb-8">
      <h2 class="text-h4 font-weight-bold mb-4">
        <v-icon size="32" color="primary" class="mr-2">mdi-calculator-variant</v-icon>
        60秒で分かる簡易査定
      </h2>
      <p class="text-h6 text-grey-darken-1 mb-2">
        お店の概算譲渡額を今すぐ算出
      </p>
      <p class="text-body-1 text-grey-darken-2">
        設備・内装・立地・営業価値を総合的に評価し、あなたの物件価値を可視化します
      </p>
    </div>

    <!-- 上段: 入力フォーム（2列レイアウト） -->
    <v-card elevation="3" class="pa-6 mb-8">
      <v-card-title class="text-h5 mb-4 d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-form-select</v-icon>
        物件情報を入力
      </v-card-title>
      
      <v-row>
        <!-- 左列 -->
        <v-col cols="12" lg="6">
          <!-- 設備情報 -->
            <div class="section-group mb-6">
              <h3 class="section-title">
                <v-icon color="orange" class="mr-2">mdi-tools</v-icon>
                設備情報
              </h3>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="formData.equipCost"
                    label="設備取得額"
                    :rules="[validationRules.nonNegative]"
                    type="number"
                    prefix="¥"
                    outlined
                    density="comfortable"
                    placeholder="例: 3000000"
                    hint="厨房機器・空調設備等の取得費用"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="mb-2">
                    <label class="text-body-2 font-weight-medium">設備使用年数: {{ formData.usedEquipYr }}年</label>
                  </div>
                  <v-slider
                    v-model="formData.usedEquipYr"
                    :max="20"
                    :min="0"
                    step="1"
                    color="orange"
                    track-color="grey-lighten-2"
                    thumb-label
                    class="mt-2"
                  >
                    <template v-slot:prepend>
                      <span class="text-caption">新品</span>
                    </template>
                    <template v-slot:append>
                      <span class="text-caption">20年</span>
                    </template>
                  </v-slider>
                </v-col>
              </v-row>
              
              <!-- 設備詳細パラメータ -->
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="mb-2">
                    <label class="text-body-2 font-weight-medium">設備償却年数: {{ formData.equipDepreciationYears }}年</label>
                  </div>
                  <v-slider
                    v-model="formData.equipDepreciationYears"
                    :min="5"
                    :max="7"
                    step="1"
                    color="orange"
                    track-color="grey-lighten-2"
                    thumb-label
                    class="mt-2"
                  >
                    <template v-slot:prepend>
                      <span class="text-caption">5年</span>
                    </template>
                    <template v-slot:append>
                      <span class="text-caption">7年</span>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="mb-2">
                    <label class="text-body-2 font-weight-medium">設備係数: {{ formData.equipCoefficient }}</label>
                  </div>
                  <v-slider
                    v-model="formData.equipCoefficient"
                    :min="0.5"
                    :max="0.8"
                    step="0.05"
                    color="orange"
                    track-color="grey-lighten-2"
                    thumb-label
                    class="mt-2"
                  >
                    <template v-slot:prepend>
                      <span class="text-caption">0.5</span>
                    </template>
                    <template v-slot:append>
                      <span class="text-caption">0.8</span>
                    </template>
                  </v-slider>
                </v-col>
              </v-row>
            </div>

            <!-- 内装情報 -->
            <div class="section-group mb-6">
              <h3 class="section-title">
                <v-icon color="purple" class="mr-2">mdi-palette</v-icon>
                内装情報
              </h3>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="formData.interiorCost"
                    label="内装取得額"
                    :rules="[validationRules.nonNegative]"
                    type="number"
                    prefix="¥"
                    outlined
                    density="comfortable"
                    placeholder="例: 5000000"
                    hint="内装工事・家具等の取得費用"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="mb-2">
                    <label class="text-body-2 font-weight-medium">内装使用年数: {{ formData.usedInteriorYr }}年</label>
                  </div>
                  <v-slider
                    v-model="formData.usedInteriorYr"
                    :max="20"
                    :min="0"
                    step="1"
                    color="purple"
                    track-color="grey-lighten-2"
                    thumb-label
                    class="mt-2"
                  >
                    <template v-slot:prepend>
                      <span class="text-caption">新品</span>
                    </template>
                    <template v-slot:append>
                      <span class="text-caption">20年</span>
                    </template>
                  </v-slider>
                </v-col>
              </v-row>
              
              <!-- 内装詳細パラメータ -->
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="mb-2">
                    <label class="text-body-2 font-weight-medium">内装償却年数: {{ formData.interiorDepreciationYears }}年</label>
                  </div>
                  <v-slider
                    v-model="formData.interiorDepreciationYears"
                    :min="10"
                    :max="15"
                    step="1"
                    color="purple"
                    track-color="grey-lighten-2"
                    thumb-label
                    class="mt-2"
                  >
                    <template v-slot:prepend>
                      <span class="text-caption">10年</span>
                    </template>
                    <template v-slot:append>
                      <span class="text-caption">15年</span>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="mb-2">
                    <label class="text-body-2 font-weight-medium">内装係数: {{ formData.interiorCoefficient }}</label>
                  </div>
                  <v-slider
                    v-model="formData.interiorCoefficient"
                    :min="0.2"
                    :max="0.5"
                    step="0.05"
                    color="purple"
                    track-color="grey-lighten-2"
                    thumb-label
                    class="mt-2"
                  >
                    <template v-slot:prepend>
                      <span class="text-caption">0.2</span>
                    </template>
                    <template v-slot:append>
                      <span class="text-caption">0.5</span>
                    </template>
                  </v-slider>
                </v-col>
              </v-row>
            </div>

            <!-- 立地情報 -->
            <div class="section-group mb-6">
              <h3 class="section-title">
                <v-icon color="green" class="mr-2">mdi-map-marker</v-icon>
                立地情報
              </h3>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model.number="formData.unitPrice"
                    label="想定坪単価"
                    :rules="[validationRules.positiveNumber]"
                    type="number"
                    prefix="¥"
                    suffix="/坪"
                    outlined
                    density="comfortable"
                    placeholder="例: 150000"
                    hint="近隣相場の坪単価"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model.number="formData.floorArea"
                    label="面積"
                    :rules="[validationRules.positiveNumber]"
                    type="number"
                    suffix="坪"
                    outlined
                    density="comfortable"
                    placeholder="例: 25"
                    hint="店舗の延床面積"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-select
                    v-model="formData.locationRank"
                    :items="LOCATION_RANKS"
                    label="立地ランク"
                    outlined
                    density="comfortable"
                    hint="立地条件を選択"
                    persistent-hint
                  ></v-select>
                </v-col>
              </v-row>
            </div>

            <!-- 売上情報 -->
            <div class="section-group mb-6">
              <h3 class="section-title">
                <v-icon color="blue" class="mr-2">mdi-cash-multiple</v-icon>
                売上・収益情報
              </h3>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model.number="formData.monthlySales"
                    label="月商"
                    :rules="[validationRules.positiveNumber]"
                    type="number"
                    prefix="¥"
                    outlined
                    density="comfortable"
                    placeholder="例: 2000000"
                    hint="平均的な月商"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="mb-2">
                    <label class="text-body-2 font-weight-medium">原価率: {{ formData.costRate }}%</label>
                  </div>
                  <v-slider
                    v-model="formData.costRate"
                    :max="90"
                    :min="30"
                    step="5"
                    color="blue"
                    track-color="grey-lighten-2"
                    thumb-label
                    class="mt-2"
                  >
                    <template v-slot:prepend>
                      <span class="text-caption">30%</span>
                    </template>
                    <template v-slot:append>
                      <span class="text-caption">90%</span>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model.number="formData.sganda"
                    label="販管費"
                    :rules="[validationRules.nonNegative]"
                    type="number"
                    prefix="¥"
                    outlined
                    density="comfortable"
                    placeholder="例: 300000"
                    hint="月次の販売管理費"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
              
              <!-- 売上評価年数 -->
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="mb-2">
                    <label class="text-body-2 font-weight-medium">売上評価年数: {{ formData.salesEvaluationYears }}年</label>
                  </div>
                  <v-slider
                    v-model="formData.salesEvaluationYears"
                    :min="2"
                    :max="3"
                    step="0.5"
                    color="blue"
                    track-color="grey-lighten-2"
                    thumb-label
                    class="mt-2"
                  >
                    <template v-slot:prepend>
                      <span class="text-caption">2年</span>
                    </template>
                    <template v-slot:append>
                      <span class="text-caption">3年</span>
                    </template>
                  </v-slider>
                </v-col>
              </v-row>
            </div>
        </v-col>

        <!-- 右列 -->
        <v-col cols="12" lg="6">
            <!-- 重み配分 -->
            <div class="section-group mb-6">
              <h3 class="section-title">
                <v-icon color="deep-orange" class="mr-2">mdi-balance-scale</v-icon>
                重み配分
              </h3>
              <v-row>
                <v-col cols="12" sm="4">
                  <div class="mb-2">
                    <label class="text-body-2 font-weight-medium">設備重み: {{ Math.round(formData.equipmentWeight * 100) }}%</label>
                  </div>
                  <v-slider
                    v-model="formData.equipmentWeight"
                    :min="0.30"
                    :max="0.50"
                    step="0.05"
                    color="deep-orange"
                    track-color="grey-lighten-2"
                    thumb-label
                    class="mt-2"
                  >
                    <template v-slot:prepend>
                      <span class="text-caption">30%</span>
                    </template>
                    <template v-slot:append>
                      <span class="text-caption">50%</span>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="mb-2">
                    <label class="text-body-2 font-weight-medium">立地重み: {{ Math.round(formData.locationWeight * 100) }}%</label>
                  </div>
                  <v-slider
                    v-model="formData.locationWeight"
                    :min="0.50"
                    :max="0.70"
                    step="0.05"
                    color="deep-orange"
                    track-color="grey-lighten-2"
                    thumb-label
                    class="mt-2"
                  >
                    <template v-slot:prepend>
                      <span class="text-caption">50%</span>
                    </template>
                    <template v-slot:append>
                      <span class="text-caption">70%</span>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="mb-2">
                    <label class="text-body-2 font-weight-medium">売上重み: {{ Math.round(formData.salesWeight * 100) }}%</label>
                  </div>
                  <v-slider
                    v-model="formData.salesWeight"
                    :min="0.10"
                    :max="0.20"
                    step="0.05"
                    color="deep-orange"
                    track-color="grey-lighten-2"
                    thumb-label
                    class="mt-2"
                  >
                    <template v-slot:prepend>
                      <span class="text-caption">10%</span>
                    </template>
                    <template v-slot:append>
                      <span class="text-caption">20%</span>
                    </template>
                  </v-slider>
                </v-col>
              </v-row>
            </div>

            <!-- 加点・減点項目 -->
            <div class="section-group">
              <h3 class="section-title">
                <v-icon color="teal" class="mr-2">mdi-scale-balance</v-icon>
                特記事項
              </h3>
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="mb-3">
                    <h4 class="text-body-1 font-weight-medium mb-2 text-green-darken-2">
                      <v-icon size="20" color="green" class="mr-1">mdi-plus-circle</v-icon>
                      加点項目 (各+10%)
                    </h4>
                    <v-checkbox
                      v-for="item in BONUS_ITEMS"
                      :key="item.key"
                      v-model="formData.bonusItems"
                      :value="item.key"
                      :label="item.label"
                      :hint="item.description"
                      color="green"
                      density="comfortable"
                      hide-details="auto"
                      class="mb-1"
                    ></v-checkbox>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="mb-3">
                    <h4 class="text-body-1 font-weight-medium mb-2 text-red-darken-2">
                      <v-icon size="20" color="red" class="mr-1">mdi-minus-circle</v-icon>
                      減点項目 (各-10%)
                    </h4>
                    <v-checkbox
                      v-for="item in PENALTY_ITEMS"
                      :key="item.key"
                      v-model="formData.penaltyItems"
                      :value="item.key"
                      :label="item.label"
                      :hint="item.description"
                      color="red"
                      density="comfortable" 
                      hide-details="auto"
                      class="mb-1"
                    ></v-checkbox>
                  </div>
                </v-col>
              </v-row>
            </div>

            <!-- 右列内の査定結果表示 -->
            <v-card v-if="estimateResult" elevation="2" class="mt-6">
              <v-card-title class="text-h6 d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-calculator-variant-outline</v-icon>
                簡易査定結果
              </v-card-title>
              <v-card-text>
                <div class="text-center mb-4">
                  <div class="text-h4 font-weight-bold text-primary">
                    ¥{{ formatCurrency(estimateResult.totalValue) }}
                  </div>
                  <div class="text-body-2 text-grey-darken-1">
                    概算譲渡額
                  </div>
                </div>
                
                <!-- 簡易内訳 -->
                <v-list density="compact" class="bg-transparent">
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-body-2">設備・内装価値</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-body-2 font-weight-medium">¥{{ formatCurrency(estimateResult.equipmentInteriorTotal) }}</span>
                    </template>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-body-2">立地価値</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-body-2 font-weight-medium">¥{{ formatCurrency(estimateResult.locationValue) }}</span>
                    </template>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-body-2">営業価値</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-body-2 font-weight-medium">¥{{ formatCurrency(estimateResult.salesValue) }}</span>
                    </template>
                  </v-list-item>
                </v-list>
                
                <v-divider class="my-3"></v-divider>
                
                <div class="text-center">
                  <v-btn
                    color="primary"
                    variant="text"
                    @click="scrollToDetailedResult"
                    block
                  >
                    <v-icon start>mdi-arrow-down</v-icon>
                    詳細な査定結果を見る
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>

            <!-- 入力待ちメッセージ -->
            <v-card v-else elevation="1" color="grey-lighten-5" class="mt-6">
              <v-card-text class="text-center pa-6">
                <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-calculator-variant-outline</v-icon>
                <p class="text-body-2 text-grey-darken-1 mb-4">
                  必須項目を入力すると<br>ここに査定結果が表示されます
                </p>
                
                <!-- 必須項目チェックリスト -->
                <div class="text-left">
                  <div class="text-body-2 font-weight-medium mb-2">入力必須項目:</div>
                  <v-list density="compact" class="bg-transparent">
                    <v-list-item class="px-0">
                      <template v-slot:prepend>
                        <v-icon 
                          :color="formData.unitPrice > 0 ? 'green' : 'grey'" 
                          size="16"
                        >
                          {{ formData.unitPrice > 0 ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                        </v-icon>
                      </template>
                      <v-list-item-title class="text-body-2">想定坪単価</v-list-item-title>
                    </v-list-item>
                    <v-list-item class="px-0">
                      <template v-slot:prepend>
                        <v-icon 
                          :color="formData.floorArea > 0 ? 'green' : 'grey'" 
                          size="16"
                        >
                          {{ formData.floorArea > 0 ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                        </v-icon>
                      </template>
                      <v-list-item-title class="text-body-2">面積</v-list-item-title>
                    </v-list-item>
                    <v-list-item class="px-0">
                      <template v-slot:prepend>
                        <v-icon 
                          :color="formData.monthlySales > 0 ? 'green' : 'grey'" 
                          size="16"
                        >
                          {{ formData.monthlySales > 0 ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                        </v-icon>
                      </template>
                      <v-list-item-title class="text-body-2">月商</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>
              </v-card-text>
            </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- 下段: 結果表示（アコーディオン形式） -->
    <v-expansion-panels id="detailed-result" class="mt-8">
      <v-expansion-panel>
        <v-expansion-panel-title class="result-header">
          <div class="d-flex align-center justify-space-between w-100">
            <div class="d-flex align-center">
              <v-icon color="white" class="mr-2">mdi-currency-jpy</v-icon>
              <span class="text-h6">詳細査定結果</span>
            </div>
            <div v-if="estimateResult" class="text-h4 font-weight-bold">
              ¥{{ formatCurrency(estimateResult.totalValue) }}
            </div>
            <div v-else class="text-body-1 font-weight-medium">
              必須項目入力後に内訳を表示できます。
            </div>
          </div>
        </v-expansion-panel-title>
        
        <v-expansion-panel-text>
          <div v-if="estimateResult" class="pa-6">
            <v-row>
              <!-- アクションボタン（左側） -->
              <v-col cols="12" md="4" class="text-center">
                <div class="action-buttons-section">
                  <h3 class="text-h6 font-weight-bold mb-4">アクション</h3>
                  <v-btn
                    color="primary"
                    size="large"
                    variant="tonal"
                    @click="goToDetailedAssessment"
                    class="mb-3"
                    block
                  >
                    <v-icon start>mdi-file-document-edit</v-icon>
                    詳細査定へ進む
                  </v-btn>
                  <v-btn
                    color="grey-darken-1"
                    variant="outlined"
                    @click="resetForm"
                    block
                  >
                    <v-icon start>mdi-refresh</v-icon>
                    入力をリセット
                  </v-btn>
                </div>
          </v-col>

              <!-- 内訳表示（右側） -->
              <v-col cols="12" md="8">
                <div class="breakdown-details">
              <h3 class="text-h6 font-weight-bold mb-4">
                <v-icon color="primary" class="mr-2">mdi-chart-pie</v-icon>
                詳細内訳
              </h3>
              
              <div class="breakdown">
                <!-- 個別評価価値 -->
                <div class="text-body-2 font-weight-medium mb-3 text-grey-darken-2">
                  <v-icon size="16" class="mr-1">mdi-format-list-bulleted</v-icon>
                  個別評価
                </div>
                
                <div class="breakdown-item">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2">
                      <v-icon size="16" color="orange" class="mr-1">mdi-tools</v-icon>
                      設備価値
                    </span>
                    <span class="font-weight-medium">¥{{ formatCurrency(estimateResult.equipmentValue) }}</span>
                  </div>
                  <v-progress-linear 
                    :model-value="(estimateResult.equipmentValue / estimateResult.equipmentInteriorTotal) * 100"
                    color="orange"
                    height="4"
                    rounded
                    class="mb-3"
                  ></v-progress-linear>
                </div>

                <div class="breakdown-item">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2">
                      <v-icon size="16" color="purple" class="mr-1">mdi-palette</v-icon>
                      内装価値
                    </span>
                    <span class="font-weight-medium">¥{{ formatCurrency(estimateResult.interiorValue) }}</span>
                  </div>
                  <v-progress-linear 
                    :model-value="(estimateResult.interiorValue / estimateResult.equipmentInteriorTotal) * 100"
                    color="purple"
                    height="4"
                    rounded
                    class="mb-3"
                  ></v-progress-linear>
                </div>

                <div class="breakdown-item">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2">
                      <v-icon size="16" color="green" class="mr-1">mdi-map-marker</v-icon>
                      立地価値
                    </span>
                    <span class="font-weight-medium">¥{{ formatCurrency(estimateResult.locationValue) }}</span>
                  </div>
                </div>

                <div class="breakdown-item">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2">
                      <v-icon size="16" color="blue" class="mr-1">mdi-cash-multiple</v-icon>
                      営業価値
                    </span>
                    <span class="font-weight-medium">¥{{ formatCurrency(estimateResult.salesValue) }}</span>
                  </div>
                </div>

                <!-- 重み付け後の価値 -->
                <v-divider class="my-4"></v-divider>
                <div class="text-body-2 font-weight-medium mb-3 text-grey-darken-2">
                  <v-icon size="16" class="mr-1">mdi-weight</v-icon>
                  重み付け後評価
                </div>

                <div class="breakdown-item">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2">
                      <v-icon size="16" color="deep-orange" class="mr-1">mdi-tools</v-icon>
                      設備評価 (重み{{ Math.round(formData.equipmentWeight * 100) }}%)
                    </span>
                    <span class="font-weight-medium">¥{{ formatCurrency(estimateResult.weightedEquipmentValue) }}</span>
                  </div>
                  <v-progress-linear 
                    :model-value="(estimateResult.weightedEquipmentValue / estimateResult.subtotal) * 100"
                    color="deep-orange"
                    height="4"
                    rounded
                    class="mb-3"
                  ></v-progress-linear>
                </div>

                <div class="breakdown-item">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2">
                      <v-icon size="16" color="deep-orange" class="mr-1">mdi-map-marker</v-icon>
                      立地評価 (重み{{ Math.round(formData.locationWeight * 100) }}%)
                    </span>
                    <span class="font-weight-medium">¥{{ formatCurrency(estimateResult.weightedLocationValue) }}</span>
                  </div>
                  <v-progress-linear 
                    :model-value="(estimateResult.weightedLocationValue / estimateResult.subtotal) * 100"
                    color="deep-orange"
                    height="4"
                    rounded
                    class="mb-3"
                  ></v-progress-linear>
                </div>

                <div class="breakdown-item">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2">
                      <v-icon size="16" color="deep-orange" class="mr-1">mdi-cash-multiple</v-icon>
                      売上評価 (重み{{ Math.round(formData.salesWeight * 100) }}%)
                    </span>
                    <span class="font-weight-medium">¥{{ formatCurrency(estimateResult.weightedSalesValue) }}</span>
                  </div>
                  <v-progress-linear 
                    :model-value="(estimateResult.weightedSalesValue / estimateResult.subtotal) * 100"
                    color="deep-orange"
                    height="4"
                    rounded
                    class="mb-3"
                  ></v-progress-linear>
                </div>

                <!-- 小計 -->
                <v-divider class="my-3"></v-divider>
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-1 font-weight-medium">小計</span>
                  <span class="text-body-1 font-weight-bold">¥{{ formatCurrency(estimateResult.subtotal) }}</span>
                </div>

                <!-- 加点・減点 -->
                <div v-if="estimateResult.bonusAmount > 0" class="d-flex justify-space-between align-center mb-1">
                  <span class="text-body-2 text-green-darken-2">
                    <v-icon size="16" color="green" class="mr-1">mdi-plus</v-icon>
                    加点 ({{ estimateResult.details.bonusCount }}項目)
                  </span>
                  <span class="text-body-2 text-green-darken-2 font-weight-medium">
                    +¥{{ formatCurrency(estimateResult.bonusAmount) }}
                  </span>
                </div>

                <div v-if="estimateResult.penaltyAmount > 0" class="d-flex justify-space-between align-center mb-3">
                  <span class="text-body-2 text-red-darken-2">
                    <v-icon size="16" color="red" class="mr-1">mdi-minus</v-icon>
                    減点 ({{ estimateResult.details.penaltyCount }}項目)
                  </span>
                  <span class="text-body-2 text-red-darken-2 font-weight-medium">
                    -¥{{ formatCurrency(estimateResult.penaltyAmount) }}
                  </span>
                  </div>
                </div>
              </div>
            </v-col>
            </v-row>
          </div>
          <div v-else class="pa-8 text-center">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-chart-line</v-icon>
            <p class="text-body-1 text-grey-darken-1">
              必須項目（想定坪単価・面積・月商）を入力すると、<br>
              詳細な査定内訳をこちらで確認できます。
            </p>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useQuickEstimate } from '@/composables/useQuickEstimate'

const router = useRouter()

// コンポーザブルから機能を取得
const {
  formData,
  validationRules,
  isValid,
  estimateResult,
  resetForm: resetFormData,
  generateAssessmentQuery,
  LOCATION_RANKS,
  BONUS_ITEMS,
  PENALTY_ITEMS
} = useQuickEstimate()

// 数値フォーマット関数
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ja-JP').format(value)
}

// フォームリセット
const resetForm = () => {
  resetFormData()
}

// 詳細査定ページへの遷移
const goToDetailedAssessment = async () => {
  const query = generateAssessmentQuery()
  await router.push({
    path: '/assessment',
    query
  })
}

// 詳細結果へのスクロール
const scrollToDetailedResult = () => {
  const element = document.getElementById('detailed-result')
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>

<style scoped>
.section-group {
  border-left: 4px solid #e0e0e0;
  padding-left: 16px;
  margin-left: 8px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  color: #424242;
}

.sticky-results {
  position: sticky;
  top: 24px;
}

.result-header {
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  color: white;
  padding: 16px 24px;
}

.result-highlight {
  border: 2px solid #4caf50;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
}

.breakdown-item {
  margin-bottom: 16px;
}

.breakdown-item:last-child {
  margin-bottom: 0;
}

/* 新しいレイアウト用スタイル */
.total-amount-display {
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 16px;
  border: 2px solid #e0e0e0;
}

.breakdown-details {
  /* スクロールバーを削除して全体表示 */
}

/* アコーディオンパネルのスタイル */
:deep(.v-expansion-panel) {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}

:deep(.v-expansion-panel-title) {
  padding: 20px 24px !important;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0 !important;
}

.action-buttons-section {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

/* レスポンシブ調整 */
@media (max-width: 960px) {
  .section-group {
    margin-left: 0;
    border-left: none;
    border-top: 4px solid #e0e0e0;
    padding-left: 0;
    padding-top: 16px;
  }
  
  .total-amount-display {
    margin-bottom: 24px;
  }
  
  .breakdown-details {
    margin-top: 24px;
  }
}

/* アニメーション */
.result-highlight {
  animation: highlight-pulse 2s ease-in-out infinite;
}

@keyframes highlight-pulse {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
  }
  50% {
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.5);
  }
}

/* プログレスバーのカスタマイズ */
:deep(.v-progress-linear__determinate) {
  transition: width 0.5s ease;
}
</style>