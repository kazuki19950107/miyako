<template>
  <v-container class="px-4 pt-2 pb-4 exit-form-container" style="max-width: 1400px;">
    <!-- ★ 固定したい"ヘッダー＋タブ"をひとまとめにする -->
    <div class="sticky-stack">
      <!-- ヘッダー -->
      <v-card class="mb-2 elevation-2 sticky-card">
        <v-card-title
          class="text-h6 font-weight-bold text-white d-flex align-center"
          style="background: linear-gradient(135deg, #1e50a2 0%, #154a8a 100%); min-height: 48px; padding: 12px 16px;"
        >
          <v-icon size="24" class="mr-2" style="color: white !important;">mdi-clipboard-list-outline</v-icon>
          店舗売却ヒアリングシート
        </v-card-title>
      </v-card>

      <!-- タブ切り替え -->
      <v-card class="mb-4 elevation-1 sticky-card">
        <v-tabs
          v-model="activeTab"
          background-color="white"
          color="primary"
          grow
        >
          <v-tab><v-icon left>mdi-account-details</v-icon>基本情報</v-tab>
          <v-tab><v-icon left>mdi-calculator-variant</v-icon>簡易査定</v-tab>
          <v-tab><v-icon left>mdi-clipboard-check</v-icon>詳細確認</v-tab>
          <v-tab><v-icon left>mdi-draw</v-icon>自由記述</v-tab>
          <v-tab><v-icon left>mdi-tools</v-icon>設備詳細</v-tab>
          <v-tab><v-icon left>mdi-strategy</v-icon>販売戦略</v-tab>
        </v-tabs>
      </v-card>
    </div>

    <!-- タブコンテンツ -->
    <v-window v-model="activeTab" :touch="false">
      <!-- タブ1: 基本情報 -->
      <v-window-item :value="0">
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
                      v-model="formData.contact.storeName"
                      label="屋号名"
                      outlined
                      dense
                      prepend-inner-icon="mdi-store"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.contact.ownerName"
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
                      v-model="formData.contact.address"
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
                      v-model="formData.contact.phoneNumber"
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
                        v-model="formData.status.selectedClosingReasons"
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
                        v-if="formData.status.selectedClosingReasons.includes('その他')"
                        v-model="formData.status.reasonOtherText"
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
                        v-model="formData.status.landlordNotification"
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

                      <!-- 次居抜きの許可 -->
                      <div v-if="formData.status.landlordNotification === 'している'" class="mt-4">
                        <v-select
                          v-model="formData.status.nextTenantPermission"
                          label="次居抜きで探していいかの許可を取っているか"
                          :items="['している', 'していない']"
                          outlined
                          dense
                          prepend-inner-icon="mdi-check-circle"
                        ></v-select>
                      </div>
                    </div>

                    <!-- 従業員への告知 -->
                    <div class="mb-6">
                      <v-select
                        v-model="formData.status.employeeNotification"
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
                        v-model="formData.status.businessContinuation"
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
                        v-if="formData.status.businessContinuation === 'すでに決めている'"
                        v-model="formData.status.closingDate"
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
                        v-model="formData.status.desiredSalePeriod"
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
                    </div>

                    <!-- 他の会社への相談 -->
                    <div class="mb-6">
                      <v-select
                        v-model="formData.status.otherConsultation"
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
                      <v-text-field
                        v-if="formData.status.otherConsultation === 'している'"
                        v-model="formData.status.consultationCompany"
                        label="相談先の会社名"
                        outlined
                        dense
                        class="mt-3"
                        placeholder="会社名を入力"
                      ></v-text-field>
                    </div>

                    <!-- 相場感の認識 -->
                    <!-- <div class="mb-6">
                      <v-select
                        v-model="formData.status.marketPriceAwareness"
                        label="相場感の認識"
                        :items="marketAwareness"
                        :rules="[rules.required]"
                        outlined
                        dense
                        prepend-inner-icon="mdi-chart-line"
                        required
                      >
                        <template v-slot:label>
                          相場感の認識 <span class="red--text">*</span>
                        </template>
                      </v-select>
                    </div> -->
                  </v-col>
                </v-row>

                <!-- 設備譲渡価値セクション（フル幅） -->
                <!-- <v-divider class="my-6"></v-divider> -->

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
                        v-model="formData.status.desiredPrice"
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
                        v-model.number="formData.status.desiredPrice"
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
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
        </v-form>
      </v-window-item>

      <!-- タブ2: 簡易査定 -->
      <v-window-item :value="1">
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
                      v-model="formData.locationInfo.rent"
                      :max="100"
                      :min="0"
                      :step="0.1"
                      class="mt-4"
                      color="primary"
                    />
                    <div class="text-center text-h6">{{ formData.locationInfo.rent }}万円</div>
                  </v-col>

                  <!-- 坪数 -->
                  <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">
                      <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
                      坪数
                    </div>
                    <v-slider
                      v-model="formData.locationInfo.area"
                      :max="200"
                      :min="0"
                      :step="0.1"
                      class="mt-4"
                      color="primary"
                    />
                    <div class="text-center text-h6">{{ formData.locationInfo.area }}坪</div>
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

                  <!-- 開業時期 -->
                  <!-- <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.locationInfo.openingDate"
                      label="開業時期"
                      outlined
                      dense
                      type="date"
                      prepend-inner-icon="mdi-store-plus"
                    ></v-text-field>
                  </v-col> -->

                  <!-- 場所の条件 -->
                  <!-- <v-col cols="12">
                    <v-select
                      v-model="formData.locationInfo.locationConditions"
                      label="場所の条件"
                      :items="locationConditions"
                      multiple
                      chips
                      small-chips
                      deletable-chips
                      outlined
                      dense
                      prepend-inner-icon="mdi-map-marker"
                    ></v-select>
                  </v-col> -->

                  <!-- 開業投資額 -->
                  <!-- <v-col cols="12" sm="6">
                    <v-slider
                      v-model="formData.locationInfo.initialInvestment"
                      :max="5000"
                      :min="0"
                      :step="10"
                                            class="mt-4"
                    ></v-slider>
                    <div class="text-center">開業投資額: {{ formData.locationInfo.initialInvestment }}万円</div>
                  </v-col> -->

                  <!-- 投資回収状況 -->
                  <!-- <v-col cols="12" sm="6">
                    <v-select
                      v-model="formData.locationInfo.investmentRecovery"
                      label="投資回収状況"
                      :items="recoveryStatus"
                      outlined
                      dense
                      prepend-inner-icon="mdi-percent"
                    ></v-select>
                  </v-col> -->

                  <!-- 売上の現状 -->
                  <!-- <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">売上の現状</div>
                    <v-slider
                      v-model="formData.locationInfo.currentRevenue"
                      :max="2000"
                      :min="0"
                      :step="10"
                                            class="mt-4"
                    ></v-slider>
                    <div class="text-center text-h6">{{ formData.locationInfo.currentRevenue }}万円</div>
                  </v-col> -->
                </v-row>
              </v-card-text>
            </v-card>
            <!-- <div class="mb-4"> -->
              <!-- 営業年数 -->
              <!-- <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.basicInfo.yearsInBusiness"
                  label="営業年数"
                  outlined
                  dense
                  suffix="年"
                  type="number"
                ></v-text-field>
              </v-col> -->

              <!-- 入居時の引渡し状態 -->
              <!-- <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.basicInfo.initialState"
                  label="入居時の引渡し状態"
                  :items="['スケルトン', '居抜き(無償)', '居抜き(有償)']"
                  outlined
                  dense
                  hide-details
                ></v-select>
                <v-text-field
                  v-if="formData.basicInfo.initialState === '居抜き(有償)'"
                  v-model="formData.basicInfo.initialStatePrice"
                  label="金額"
                  outlined
                  dense
                  type="number"
                  prefix="¥"
                  class="mt-3"
                ></v-text-field>
              </v-col> -->

              <!-- 前テナント情報 -->
              <!-- <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.basicInfo.previousTenantInfo"
                  label="前テナント情報"
                  outlined
                  dense
                  placeholder="業態・店舗名など"
                ></v-text-field>
              </v-col> -->

              <!-- 入居時の条件交渉 -->
              <!-- <v-col cols="12">
                <v-checkbox
                  v-model="formData.basicInfo.hasNegotiation"
                  label="入居時の条件交渉あり"
                  hide-details
                ></v-checkbox>
                <v-text-field
                  v-if="formData.basicInfo.hasNegotiation"
                  v-model="formData.basicInfo.negotiationDetails"
                  label="交渉内容"
                  outlined
                  dense
                  class="mt-3"
                  placeholder="例: 賃料減額など"
                ></v-text-field>
              </v-col> -->

              <!-- 物件の利用制限 -->
              <!-- <v-col cols="12">
                <v-text-field
                  v-model="formData.basicInfo.usageRestrictions"
                  label="物件の利用制限"
                  outlined
                  dense
                  placeholder="例: 営業時間・業種制限など"
                ></v-text-field>
              </v-col> -->

              <!-- 図面について -->
              <!-- <v-col cols="12">
                <v-checkbox
                  v-model="formData.basicInfo.hasDrawings"
                  label="図面あり"
                  hide-details
                ></v-checkbox>
                <v-text-field
                  v-if="formData.basicInfo.hasDrawings"
                  v-model="formData.basicInfo.drawingDetails"
                  label="図面の種類"
                  outlined
                  dense
                  class="mt-3"
                  placeholder="例: 平面図・給排水図面など"
                ></v-text-field>
              </v-col> -->

              <!-- 貸主のインボイス登録 -->
              <!-- <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.basicInfo.landlordInvoiceStatus"
                  label="貸主のインボイス登録状況"
                  :items="['登録済み', '未登録']"
                  outlined
                  dense
                  hide-details
                ></v-select>
              </v-col> -->

              <!-- 電気・ガス・水道の契約 -->
              <!-- <v-col cols="12">
                <v-divider class="my-4"></v-divider>
                <div class="text-subtitle-1 mb-4">
                  <v-icon left size="20">mdi-power-plug</v-icon>
                  光熱費の契約状況
                </div>
              </v-col> -->

              <!-- 電気・ガス・水道を横並び -->
              <!-- <v-col cols="12" sm="4">
                <v-select
                  v-model="formData.basicInfo.electricityContract"
                  label="電気の契約"
                  :items="['家主検針', '直接契約']"
                  outlined
                  dense
                  hide-details
                  prepend-inner-icon="mdi-flash"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  v-model="formData.basicInfo.gasContract"
                  label="ガスの契約"
                  :items="['家主検針', '直接契約']"
                  outlined
                  dense
                  hide-details
                  prepend-inner-icon="mdi-fire"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  v-model="formData.basicInfo.waterContract"
                  label="水道の契約"
                  :items="['家主検針', '直接契約']"
                  outlined
                  dense
                  hide-details
                  prepend-inner-icon="mdi-water"
                ></v-select>
              </v-col> -->

              <!-- お客様番号（直接契約の場合） -->
              <!-- <v-col cols="12" sm="4" v-if="formData.basicInfo.electricityContract === '直接契約'">
                <v-text-field
                  v-model="formData.basicInfo.electricityCustomerNumber"
                  label="電気お客様番号"
                  outlined
                  dense
                  prepend-inner-icon="mdi-identifier"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" v-if="formData.basicInfo.gasContract === '直接契約'">
                <v-text-field
                  v-model="formData.basicInfo.gasCustomerNumber"
                  label="ガスお客様番号"
                  outlined
                  dense
                  prepend-inner-icon="mdi-identifier"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" v-if="formData.basicInfo.waterContract === '直接契約'">
                <v-text-field
                  v-model="formData.basicInfo.waterCustomerNumber"
                  label="水道お客様番号"
                  outlined
                  dense
                  prepend-inner-icon="mdi-identifier"
                ></v-text-field>
              </v-col> -->

              <!-- ゴミ出し -->
              <!-- <v-col cols="12">
                <v-divider class="my-4"></v-divider>
                <div class="text-subtitle-1 mb-4">
                  <v-icon left size="20">mdi-delete</v-icon>
                  ゴミ出し
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.basicInfo.garbageDisposalRules"
                  label="ゴミ出し規則"
                  outlined
                  dense
                  placeholder="ゴミ出しのルール・場所など"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.basicInfo.garbageDisposalCost"
                  label="ゴミ出し費用"
                  outlined
                  dense
                  type="number"
                  suffix="円"
                ></v-text-field>
              </v-col> -->

              <!-- その他費用 -->
              <!-- <v-col cols="12">
                <v-checkbox
                  v-model="formData.basicInfo.hasOtherCosts"
                  label="その他費用あり"
                  hide-details
                ></v-checkbox>
                <v-text-field
                  v-if="formData.basicInfo.hasOtherCosts"
                  v-model="formData.basicInfo.otherCostsDetails"
                  label="費用の詳細"
                  outlined
                  dense
                  class="mt-3"
                  placeholder="例: 商店街費・町内会費など"
                ></v-text-field>
              </v-col> -->

              <!-- 事前申告事項 -->
              <!-- <v-col cols="12">
                <v-textarea
                  v-model="formData.basicInfo.declarations"
                  label="事前申告事項"
                  outlined
                  dense
                  rows="3"
                  placeholder="例: 家賃滞納・近隣トラブル・家主変更など"
                ></v-textarea>
              </v-col> -->

              <!-- 後継テナントの新条件 -->
              <!-- <v-col cols="12">
                <v-textarea
                  v-model="formData.basicInfo.newTenantConditions"
                  label="後継テナントの新条件"
                  outlined
                  dense
                  rows="3"
                  placeholder="例: 既に貸主から後継テナントの新条件を聞いている場合"
                ></v-textarea>
              </v-col> -->
            <!-- </div> -->

            <!-- 設備の状態 -->
            <v-card outlined class="mb-4 section-card">
              <v-card-title class="section-title">
                <v-icon left size="24" class="mr-2">mdi-wrench</v-icon>
                設備情報
              </v-card-title>
              <v-card-text class="pt-6">
                <v-row>
                  <!-- 設備取得額 -->
                  <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">
                      <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
                      設備費用
                    </div>

                    <v-row class="align-center">
                      <v-col cols="12" md="8">
                        <v-slider
                          v-model="formData.equipment.equipmentCost"
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
                          v-model.number="formData.equipment.equipmentCost"
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
                        <div class="text-center text-h6">{{ formData.equipment.equipmentCost }}万円</div>
                      </v-col>
                    </v-row>
                  </v-col>

                  <!-- 内装取得額 -->
                  <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">
                      <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
                      内装費用
                    </div>

                    <v-row class="align-center">
                      <v-col cols="12" md="8">
                        <v-slider
                          v-model="formData.equipment.interiorCost"
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
                          v-model.number="formData.equipment.interiorCost"
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
                        <div class="text-center text-h6">{{ formData.equipment.interiorCost }}万円</div>
                      </v-col>
                    </v-row>
                  </v-col>

                  <!-- 営業年数 -->
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.equipment.businessYears"
                      label="営業年数"
                      :items="businessYearsOptions"
                      outlined
                      dense
                      prepend-inner-icon="mdi-store-clock"
                      hint="店舗の営業年数を選択してください"
                      persistent-hint
                    />
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
                          <span class="font-weight-medium">{{ formData.equipment.equipmentCoefficient !== undefined ? formData.equipment.equipmentCoefficient : 0.8 }}</span>
                        </div>
                        <div class="d-flex justify-space-between">
                          <span>内装係数:</span>
                          <span class="font-weight-medium">{{ (1 - (formData.equipment.equipmentCoefficient !== undefined ? formData.equipment.equipmentCoefficient : 0.8)).toFixed(1) }}</span>
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
                                  <span class="text-subtitle-2">設備重み {{ formData.equipment.equipmentCoefficient !== undefined ? formData.equipment.equipmentCoefficient : 0.8 }}</span>
                                  <span class="text-subtitle-2">内装重み {{ (1 - (formData.equipment.equipmentCoefficient !== undefined ? formData.equipment.equipmentCoefficient : 0.8)).toFixed(1) }}</span>
                                </div>
                                <v-slider
                                  v-model="formData.equipment.equipmentCoefficient"
                                  :min="0"
                                  :max="1"
                                  :step="0.1"
                                  thumb-label
                                  color="primary"
                                  track-color="secondary"
                                  @input="updateInteriorCoefficient"
                                >
                                  <template v-slot:prepend>
                                    <v-icon color="primary">mdi-tools</v-icon>
                                  </template>
                                  <template v-slot:append>
                                    <v-icon color="secondary">mdi-palette</v-icon>
                                  </template>
                                </v-slider>
                                <div class="text-center text-caption grey--text">
                                  設備 {{ ((formData.equipment.equipmentCoefficient !== undefined ? formData.equipment.equipmentCoefficient : 0.8) * 10).toFixed(0) }} : 内装 {{ ((1 - (formData.equipment.equipmentCoefficient !== undefined ? formData.equipment.equipmentCoefficient : 0.8)) * 10).toFixed(0) }}
                                </div>
                              </v-col>

                              <v-col cols="12">
                                <v-btn
                                  block
                                  outlined
                                  color="primary"
                                  small
                                  @click="resetCoefficients"
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
                          <span class="font-weight-medium">{{ formData.valuation.locationWeight !== undefined ? formData.valuation.locationWeight : 0.6 }}</span>
                        </div>
                        <div class="d-flex justify-space-between">
                          <span>設備重み:</span>
                          <span class="font-weight-medium">{{ (1 - (formData.valuation.locationWeight !== undefined ? formData.valuation.locationWeight : 0.6)).toFixed(1) }}</span>
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
                                  <span class="text-subtitle-2">立地重み {{ formData.valuation.locationWeight !== undefined ? formData.valuation.locationWeight : 0.6 }}</span>
                                  <span class="text-subtitle-2">設備重み {{ (1 - (formData.valuation.locationWeight !== undefined ? formData.valuation.locationWeight : 0.6)).toFixed(1) }}</span>
                                </div>
                                <v-slider
                                  v-model="formData.valuation.locationWeight"
                                  :min="0"
                                  :max="1"
                                  :step="0.1"
                                  thumb-label
                                  color="primary"
                                  track-color="secondary"
                                  @input="updateEquipmentWeight"
                                >
                                  <template v-slot:prepend>
                                    <v-icon color="primary">mdi-map-marker</v-icon>
                                  </template>
                                  <template v-slot:append>
                                    <v-icon color="secondary">mdi-tools</v-icon>
                                  </template>
                                </v-slider>
                                <div class="text-center text-caption grey--text">
                                  立地 {{ ((formData.valuation.locationWeight !== undefined ? formData.valuation.locationWeight : 0.6) * 10).toFixed(0) }} : 設備 {{ ((1 - (formData.valuation.locationWeight !== undefined ? formData.valuation.locationWeight : 0.6)) * 10).toFixed(0) }}
                                </div>
                              </v-col>

                              <v-col cols="12">
                                <v-btn
                                  block
                                  outlined
                                  color="primary"
                                  small
                                  @click="resetValuationWeights"
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

            <!-- 今の売上情報 -->
            <!-- <v-card outlined class="mb-4 section-card">
              <v-card-title class="section-title">
                <v-icon left size="24" class="mr-2">mdi-chart-line</v-icon>
                今の売上情報
              </v-card-title>
              <v-card-text class="pt-6">
                <v-row>

                  <v-col cols="12" md="6">
                    <div class="text-subtitle-2 mb-2">
                      <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
                      売上（月間）
                    </div>
                    <v-slider
                      v-model="formData.salesInfo.monthlyRevenue"
                      :max="5000"
                      :min="0"
                      :step="10"
                      class="mt-4"
                    />
                    <div class="text-center text-h6">{{ formData.salesInfo.monthlyRevenue }}万円</div>
                  </v-col>


                  <v-col cols="12" md="6">
                    <div class="text-subtitle-2 mb-2">
                      <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
                      利益（月間）
                    </div>
                    <v-slider
                      v-model="formData.salesInfo.monthlyProfit"
                      :max="2000"
                      :min="0"
                      :step="10"
                      class="mt-4"
                    />
                    <div class="text-center text-h6">{{ formData.salesInfo.monthlyProfit }}万円</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card> -->


            <!-- 排気・排水設備 -->
            <!-- <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-air-filter</v-icon>
                排気・排水設備
              </v-card-title>
              <v-card-text class="pt-6">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="formData.equipment.exhaustType"
                      label="排気設備の種類"
                      :items="['換気扇', 'ダクト']"
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="formData.equipment.exhaustRoute"
                      label="排気ルート"
                      :items="['店舗側面', '店舗前面', '店舗背面', '屋上']"
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="formData.equipment.drainageType"
                      label="排水設備の種類"
                      :items="['グリストラップ(床下埋め込み・置き型)', 'ドライキッチン']"
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card> -->

            <!-- メーター情報 -->
            <!-- <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-gauge</v-icon>
                メーター情報
              </v-card-title>
              <v-card-text class="pt-6">
                <!-- 電気メーター -->
                <!-- <div class="mb-4">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="amber" class="mr-2">mdi-flash</v-icon>
                    <span class="text-subtitle-2">電気メーター</span>
                  </div>
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="formData.equipment.electricityMeter.location"
                        label="場所"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="formData.equipment.electricityMeter.capacity"
                        label="電気容量"
                        outlined
                        dense
                        placeholder="例: 30A"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="formData.equipment.electricityMeter.powerCapacity"
                        label="動力容量"
                        outlined
                        dense
                        placeholder="例: 15kW"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div> -->

                <!-- ガスメーター -->
                <!-- <div class="mb-4">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="blue" class="mr-2">mdi-fire</v-icon>
                    <span class="text-subtitle-2">ガスメーター</span>
                  </div>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.equipment.gasMeter.location"
                        label="場所"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.equipment.gasMeter.capacity"
                        label="ガス容量"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div> -->

                <!-- 水道メーター -->
                <!-- <div>
                  <div class="d-flex align-center mb-3">
                    <v-icon color="light-blue" class="mr-2">mdi-water</v-icon>
                    <span class="text-subtitle-2">水道メーター</span>
                  </div>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.equipment.waterMeter.location"
                        label="場所"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.equipment.waterMeter.pipeCapacity"
                        label="排水管の容量"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card> -->

            <!-- その他設備情報 -->
            <!-- <v-card outlined>
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-home-variant</v-icon>
                その他設備情報
              </v-card-title>
              <v-card-text class="pt-6">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.equipment.outdoorUnitLocation"
                      label="室外機の場所"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.equipment.mdfLocation"
                      label="MDF盤の場所"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row> -->

                <!-- 店舗の瑕疵と届出済みの許認可を横並び -->
                <!-- <v-row class="mb-4">
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="formData.equipment.defects"
                      label="店舗の瑕疵"
                      :items="storeDefects"
                      multiple
                      chips
                      small-chips
                      deletable-chips
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="formData.equipment.permits"
                      label="届出済みの許認可"
                      :items="permits"
                      multiple
                      chips
                      small-chips
                      deletable-chips
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
                <v-text-field
                  v-if="formData.equipment.defects.includes('その他')"
                  v-model="formData.equipment.defectOtherText"
                  label="その他の詳細（瑕疵）"
                  outlined
                  dense
                  class="mb-4"
                ></v-text-field>
              </v-card-text>
            </v-card> -->

            <!-- 営業情報 -->
            <!-- <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-clock-outline</v-icon>
                営業情報
              </v-card-title>
              <v-card-text class="pt-6">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.recruitment.lunchHours"
                      label="営業時間(昼)"
                      outlined
                      dense
                      placeholder="例: 11時〜14時"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.recruitment.dinnerHours"
                      label="営業時間(夜)"
                      outlined
                      dense
                      placeholder="例: 17時〜23時"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.recruitment.lunchAvgSpend"
                      label="客単価(昼)"
                      outlined
                      dense
                      type="number"
                      suffix="円"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.recruitment.dinnerAvgSpend"
                      label="客単価(夜)"
                      outlined
                      dense
                      type="number"
                      suffix="円"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.recruitment.closingDays"
                      label="定休日"
                      outlined
                      dense
                      placeholder="例: 毎週月曜日"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card> -->

            <!-- エリア・客層 -->
            <!-- <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-map-marker</v-icon>
                エリア・客層
              </v-card-title>
              <v-card-text class="pt-6">
                <v-row class="mb-4">
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="formData.recruitment.areaTypes"
                      label="エリア"
                      :items="areaTypes"
                      multiple
                      chips
                      small-chips
                      deletable-chips
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="formData.recruitment.customerSegments"
                      label="客層"
                      :items="customerSegments"
                      multiple
                      chips
                      small-chips
                      deletable-chips
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
                <v-textarea
                  v-model="formData.recruitment.areaMemo"
                  label="エリア・客層に関するメモ"
                  outlined
                  dense
                  rows="2"
                ></v-textarea>
              </v-card-text>
            </v-card> -->

            <!-- アピールポイント -->
            <!-- <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-star</v-icon>
                おすすめポイント
              </v-card-title>
              <v-card-text class="pt-6">
                <v-textarea
                  v-model="formData.recruitment.appealPoints"
                  label="おすすめポイント"
                  outlined
                  dense
                  rows="4"
                  placeholder="物件の魅力・セールスポイントを記入"
                ></v-textarea>
              </v-card-text>
            </v-card> -->


            <!-- 内覧・掲載条件 -->
            <!-- <v-card outlined>
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-eye</v-icon>
                内覧・掲載条件
              </v-card-title>
              <v-card-text class="pt-6">
                <v-textarea
                  v-model="formData.recruitment.viewingAvailability"
                  label="内覧可能日時"
                  outlined
                  dense
                  rows="2"
                  placeholder="例: 平日14時〜17時、土日終日可"
                ></v-textarea>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="formData.recruitment.allowEmail"
                      label="物件紹介のメール送信"
                      :items="['可', '不可']"
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="formData.recruitment.allowWebListing"
                      label="物件募集のネット掲載"
                      :items="['可(写真あり)', '可(写真なし)', '不可']"
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="formData.recruitment.progressReportMethod"
                      label="進捗報告の連絡手段"
                      :items="['メール', '電話']"
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card> -->

            <!-- 契約書の写真 -->
            <!-- <v-card outlined>
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-camera</v-icon>
                契約書の写真
              </v-card-title>
              <v-card-text class="pt-6">
                <div class="text-caption mb-2">開業時や設備の記録をアップロード</div>
                <v-file-input
                  v-model="formData.recruitment.contractPhotos"
                  label="写真を選択"
                  multiple
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  outlined
                  dense
                  chips
                  counter
                  show-size
                >
                  <template v-slot:selection="{ file, index, text }">
                    <v-chip
                      v-if="index < 2"
                      color="primary"
                      dark
                      label
                      small
                    >
                      {{ text }}
                    </v-chip>
                    <span
                      v-else-if="index === 2"
                      class="overline grey--text text--darken-3 mx-2"
                    >
                      +{{ formData.recruitment.contractPhotos.length - 2 }} 件
                    </span>
                  </template>
                </v-file-input>
              </v-card-text>
            </v-card> -->

            <!-- 連絡窓口 -->
            <!-- <v-card
              v-for="(contact, index) in formData.externalContacts"
              :key="index"
              outlined
              class="mb-3"
            >
              <v-card-title class="text-subtitle-1 grey lighten-4 d-flex align-center">
                <span>連絡先 {{ index + 1 }}</span>
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  small
                  @click="removeContact(index)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text class="pt-6">
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="contact.type"
                      label="連絡先種別"
                      :items="['家主', '管理会社', '専任不動産会社']"
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="contact.companyName"
                      label="会社名"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="contact.contactPerson"
                      label="担当者"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="contact.companyPhone"
                      label="会社電話"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="contact.personPhone"
                      label="担当電話"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-btn
              color="primary"
              outlined
              @click="addContact"
              class="mb-3"
            >
              <v-icon left>mdi-plus</v-icon>
              連絡先を追加
            </v-btn>-->
        </v-form>
      </v-window-item>

      <!-- タブ3: 詳細確認 -->
      <v-window-item :value="2">
        <v-form ref="detailForm" v-model="detailFormValid">

          <!-- 物件の特徴チェック -->
          <v-card outlined class="mb-4 section-card">
            <v-card-title class="section-title">
              <v-icon left size="24" class="mr-2">mdi-check-circle-outline</v-icon>
              物件の特徴
            </v-card-title>
            <v-card-text class="pt-6">
              <v-row>
                <!-- 強みとなる特徴 -->
                <v-col cols="12" md="6">
                  <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
                    <v-icon small class="mr-1" color="success">mdi-plus-circle</v-icon>
                    強みとなる特徴
                  </div>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-checkbox
                        v-model="formData.propertyFeatures.strengths"
                        label="重飲食可"
                        value="重飲食可"
                        multiple
                        hide-details
                        color="success"
                        class="mb-2"
                      />
                      <v-checkbox
                        v-model="formData.propertyFeatures.strengths"
                        label="食べログ3.5以上"
                        value="食べログ3.5以上"
                        multiple
                        hide-details
                        color="success"
                        class="mb-2"
                      />
                      <v-checkbox
                        v-model="formData.propertyFeatures.strengths"
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
                        v-model="formData.propertyFeatures.strengths"
                        label="ダクト屋上まで設置"
                        value="ダクト屋上まで設置"
                        multiple
                        hide-details
                        color="success"
                        class="mb-2"
                      />
                      <v-checkbox
                        v-model="formData.propertyFeatures.strengths"
                        label="専門設備・内装あり"
                        value="専門設備・内装あり"
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
                        v-model="formData.propertyFeatures.limitations"
                        label="軽飲食のみ"
                        value="軽飲食のみ"
                        multiple
                        hide-details
                        color="warning"
                        class="mb-2"
                      />
                      <v-checkbox
                        v-model="formData.propertyFeatures.limitations"
                        label="業種制限あり"
                        value="業種制限あり"
                        multiple
                        hide-details
                        color="warning"
                        class="mb-2"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-checkbox
                        v-model="formData.propertyFeatures.limitations"
                        label="営業時間制限あり"
                        value="営業時間制限あり"
                        multiple
                        hide-details
                        color="warning"
                        class="mb-2"
                      />
                      <v-checkbox
                        v-model="formData.propertyFeatures.limitations"
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

          <!-- A. 交渉・制限・図面 -->
          <v-card outlined class="mb-4 section-card">
            <v-card-title class="section-title">
              <v-icon left size="24" class="mr-2">mdi-handshake</v-icon>
              交渉・制限・図面
            </v-card-title>
            <v-card-text class="pt-6">
              <v-row>
                <!-- 大家との交渉 -->
                <v-col cols="12" sm="6" md="6">
                  <v-radio-group
                    v-model="formData.detailCheck.landlord_negotiation"
                    label="大家との交渉"
                    row
                  >
                    <v-radio label="あり" value="あり"></v-radio>
                    <v-radio label="なし" value="なし"></v-radio>
                  </v-radio-group>
                  <v-text-field
                    v-if="formData.detailCheck.landlord_negotiation === 'あり'"
                    v-model="formData.detailCheck.landlord_negotiation_detail"
                    label="交渉内容"
                    outlined
                    dense
                    placeholder="交渉内容を入力"
                    class="mt-2"
                  />
                </v-col>

                <!-- 利用制限 -->
                <v-col cols="12" sm="6" md="6">
                  <v-radio-group
                    v-model="formData.detailCheck.usage_restriction"
                    label="利用制限"
                    row
                  >
                    <v-radio label="あり" value="あり"></v-radio>
                    <v-radio label="なし" value="なし"></v-radio>
                  </v-radio-group>
                  <v-text-field
                    v-if="formData.detailCheck.usage_restriction === 'あり'"
                    v-model="formData.detailCheck.usage_restriction_detail"
                    label="制限内容"
                    outlined
                    dense
                    placeholder="制限内容を入力"
                    class="mt-2"
                  />
                </v-col>

                <!-- 図面 -->
                <v-col cols="12" sm="6" md="6">
                  <v-radio-group
                    v-model="formData.detailCheck.floor_plan"
                    label="図面"
                    row
                  >
                    <v-radio label="あり" value="あり"></v-radio>
                    <v-radio label="なし" value="なし"></v-radio>
                  </v-radio-group>
                  <v-text-field
                    v-if="formData.detailCheck.floor_plan === 'あり'"
                    v-model="formData.detailCheck.floor_plan_type"
                    label="図面の種類"
                    outlined
                    dense
                    placeholder="例: 竣工図、レイアウト図"
                    class="mt-2"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="formData.detailCheck.section_a_memo"
                    label="交渉・制限・図面 メモ"
                    outlined
                    dense
                    rows="2"
                    placeholder="特記事項があれば記載"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- B. ライフライン契約・支払い -->
          <v-card outlined class="mb-4 section-card">
            <v-card-title class="section-title">
              <v-icon left size="24" class="mr-2">mdi-flash</v-icon>
              ライフライン契約・支払い
            </v-card-title>
            <v-card-text class="pt-6">
              <v-row>
                <!-- 電気契約 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.electricity_company"
                    label="電気契約会社"
                    outlined
                    dense
                    placeholder="例: 東京電力、関西電力"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.electricity_customer_number"
                    label="電気お客様番号"
                    outlined
                    dense
                  />
                </v-col>

                <!-- ガス契約 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.gas_company"
                    label="ガス契約会社"
                    outlined
                    dense
                    placeholder="例: 東京ガス、大阪ガス"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.gas_customer_number"
                    label="ガスお客様番号"
                    outlined
                    dense
                  />
                </v-col>

                <!-- 水道契約 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.water_company"
                    label="水道契約会社"
                    outlined
                    dense
                    placeholder="例: 東京都水道局"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.water_customer_number"
                    label="水道お客様番号"
                    outlined
                    dense
                  />
                </v-col>

                <!-- 家主支払い項目 -->
                <v-col cols="12" md="6">
                  <v-radio-group
                    v-model="formData.detailCheck.landlord_payment"
                    label="家主支払い項目"
                    row
                  >
                    <v-radio label="あり" value="あり"></v-radio>
                    <v-radio label="なし" value="なし"></v-radio>
                  </v-radio-group>
                  <v-text-field
                    v-if="formData.detailCheck.landlord_payment === 'あり'"
                    v-model="formData.detailCheck.landlord_payment_detail"
                    label="支払い項目"
                    outlined
                    dense
                    placeholder="例: 共益費、管理費"
                    class="mt-2"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="formData.detailCheck.section_b_memo"
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

          <!-- C. その他申告・費用 -->
          <v-card outlined class="mb-4 section-card">
            <v-card-title class="section-title">
              <v-icon left size="24" class="mr-2">mdi-receipt</v-icon>
              その他申告・費用
            </v-card-title>
            <v-card-text class="pt-6">
              <v-row>
                <!-- ゴミ回収費用 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.garbage_disposal_cost"
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
                    v-model="formData.detailCheck.other_monthly_costs"
                    label="その他月額費用"
                    row
                  >
                    <v-radio label="あり" value="あり"></v-radio>
                    <v-radio label="なし" value="なし"></v-radio>
                  </v-radio-group>
                </v-col>

                <v-col cols="12" md="6" v-if="formData.detailCheck.other_monthly_costs === 'あり'">
                  <v-text-field
                    v-model="formData.detailCheck.other_monthly_costs_detail"
                    label="その他費用詳細"
                    outlined
                    dense
                    placeholder="例: 防虫サービス、清掃費"
                  />
                </v-col>

                <v-col cols="12" md="6" v-if="formData.detailCheck.other_monthly_costs === 'あり'">
                  <v-text-field
                    v-model="formData.detailCheck.other_monthly_costs_amount"
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
                    v-model="formData.detailCheck.declarations"
                    label="申告事項"
                    outlined
                    dense
                    placeholder="例: 保健所許可、消防署届出"
                  />
                </v-col>

                <!-- 新テナント条件 -->
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.detailCheck.new_tenant_conditions"
                    label="新テナント条件"
                    outlined
                    dense
                    rows="3"
                    placeholder="新しいテナントに対する条件や要求事項"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="formData.detailCheck.section_c_memo"
                    label="その他申告・費用 メモ"
                    outlined
                    dense
                    rows="2"
                    placeholder="特記事項があれば記載"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- D. 設備・内装・譲渡 -->
          <v-card outlined class="mb-4 section-card">
            <v-card-title class="section-title">
              <v-icon left size="24" class="mr-2">mdi-tools</v-icon>
              設備・内装・譲渡
            </v-card-title>
            <v-card-text class="pt-6">
              <v-row>

                <!-- <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.equipment_investment"
                    label="設備投資額"
                    outlined
                    dense
                    type="number"
                    suffix="万円"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.equipment_age"
                    label="設備年数"
                    outlined
                    dense
                    type="number"
                    suffix="年"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.interior_investment"
                    label="内装投資額"
                    outlined
                    dense
                    type="number"
                    suffix="万円"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.interior_age"
                    label="内装年数"
                    outlined
                    dense
                    type="number"
                    suffix="年"
                  />
                </v-col> -->

                <!-- 譲渡しない設備 -->
                <v-col cols="12" sm="6" md="6">
                  <v-radio-group
                    v-model="formData.detailCheck.non_transferable_equipment"
                    label="譲渡しない設備"
                    row
                  >
                    <v-radio label="あり" value="あり"></v-radio>
                    <v-radio label="なし" value="なし"></v-radio>
                  </v-radio-group>
                  <v-textarea
                    v-if="formData.detailCheck.non_transferable_equipment === 'あり'"
                    v-model="formData.detailCheck.non_transferable_equipment_detail"
                    label="譲渡しない設備詳細"
                    outlined
                    dense
                    rows="3"
                    placeholder="持ち出し予定の設備を記載"
                    class="mt-2"
                  />
                </v-col>

                <!-- 故障設備 -->
                <v-col cols="12" sm="6" md="6">
                  <v-radio-group
                    v-model="formData.detailCheck.broken_equipment"
                    label="故障設備"
                    row
                  >
                    <v-radio label="あり" value="あり"></v-radio>
                    <v-radio label="なし" value="なし"></v-radio>
                  </v-radio-group>
                  <v-textarea
                    v-if="formData.detailCheck.broken_equipment === 'あり'"
                    v-model="formData.detailCheck.broken_equipment_detail"
                    label="故障設備詳細"
                    outlined
                    dense
                    rows="3"
                    placeholder="故障している設備と状況"
                    class="mt-2"
                  />
                </v-col>

                <!-- リース残債 -->
                <v-col cols="12" sm="6" md="6">
                  <v-radio-group
                    v-model="formData.detailCheck.lease_debt"
                    label="リース残債"
                    row
                  >
                    <v-radio label="あり" value="あり"></v-radio>
                    <v-radio label="なし" value="なし"></v-radio>
                  </v-radio-group>
                  <v-text-field
                    v-if="formData.detailCheck.lease_debt === 'あり'"
                    v-model="formData.detailCheck.lease_debt_amount"
                    label="リース残債額"
                    outlined
                    dense
                    type="number"
                    suffix="万円"
                    class="mt-2"
                  />
                </v-col>

                <!-- 家主所有設備 -->
                <v-col cols="12" sm="6" md="6">
                  <v-radio-group
                    v-model="formData.detailCheck.landlord_equipment"
                    label="家主所有設備"
                    row
                  >
                    <v-radio label="あり" value="あり"></v-radio>
                    <v-radio label="なし" value="なし"></v-radio>
                  </v-radio-group>
                  <v-text-field
                    v-if="formData.detailCheck.landlord_equipment === 'あり'"
                    v-model="formData.detailCheck.landlord_equipment_detail"
                    label="家主所有設備詳細"
                    outlined
                    dense
                    placeholder="例: エアコン、給湯器"
                    class="mt-2"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="formData.detailCheck.section_d_memo"
                    label="設備・内装・譲渡 メモ"
                    outlined
                    dense
                    rows="2"
                    placeholder="特記事項があれば記載"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- E. メーター・容量・機器位置 -->
          <v-card outlined class="mb-4 section-card">
            <v-card-title class="section-title">
              <v-icon left size="24" class="mr-2">mdi-gauge</v-icon>
              メーター・容量・機器位置
            </v-card-title>
            <v-card-text class="pt-6">
              <v-row>
                <!-- 排気設備 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.exhaust_equipment"
                    label="排気設備種類"
                    outlined
                    dense
                    placeholder="例: ダクト式、フード付き"
                  />
                </v-col>

                <!-- 排気ルート -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.exhaust_route"
                    label="排気ルート"
                    outlined
                    dense
                    placeholder="例: 屋上、壁面"
                  />
                </v-col>

                <!-- 排水設備 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.drainage_equipment"
                    label="排水設備種類"
                    outlined
                    dense
                    placeholder="例: 厨房専用排水、グリストラップ"
                  />
                </v-col>

                <!-- 電気メーター位置 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.electric_meter_location"
                    label="電気メーター位置"
                    outlined
                    dense
                    placeholder="例: 1階入口、地下"
                  />
                </v-col>

                <!-- 電気容量 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.electric_capacity"
                    label="電気容量"
                    outlined
                    dense
                    placeholder="例: 30A、動力15kW"
                  />
                </v-col>

                <!-- 動力容量 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.power_capacity"
                    label="動力容量"
                    outlined
                    dense
                    placeholder="例: 15kW"
                  />
                </v-col>

                <!-- ガスメーター位置 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.gas_meter_location"
                    label="ガスメーター位置"
                    outlined
                    dense
                    placeholder="例: 1階入口、地下"
                  />
                </v-col>

                <!-- ガス容量 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.gas_capacity"
                    label="ガス容量"
                    outlined
                    dense
                    placeholder="例: 都市ガス13A"
                  />
                </v-col>

                <!-- 水道メーター位置 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.water_meter_location"
                    label="水道メーター位置"
                    outlined
                    dense
                    placeholder="例: 1階入口、地下"
                  />
                </v-col>

                <!-- 給排水管径 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.water_pipe_capacity"
                    label="給排水管径"
                    outlined
                    dense
                    placeholder="例: 20mm"
                  />
                </v-col>

                <!-- 室外機設置場所 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.outdoor_unit_location"
                    label="室外機設置場所"
                    outlined
                    dense
                    placeholder="例: 屋上、ベランダ"
                  />
                </v-col>

                <!-- MDF設置場所 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.mdf_location"
                    label="MDF設置場所"
                    outlined
                    dense
                    placeholder="例: 1階電気室、事務所"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="formData.detailCheck.section_e_memo"
                    label="メーター・容量・機器位置 メモ"
                    outlined
                    dense
                    rows="2"
                    placeholder="特記事項があれば記載"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

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
                    v-model="formData.detailCheck.highest_sales_month"
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
                    v-model="formData.detailCheck.lowest_sales_month"
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
                    v-model="formData.detailCheck.lunch_hours"
                    label="ランチ営業時間"
                    outlined
                    dense
                    placeholder="例: 11:00-14:00"
                  />
                </v-col>

                <!-- ディナー営業時間 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.dinner_hours"
                    label="ディナー営業時間"
                    outlined
                    dense
                    placeholder="例: 17:00-22:00"
                  />
                </v-col>

                <!-- ランチ客単価 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.lunch_avg_price"
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
                    v-model="formData.detailCheck.dinner_avg_price"
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
                    v-model="formData.detailCheck.closed_days"
                    label="定休日"
                    outlined
                    dense
                    placeholder="例: 月曜日、年中無休"
                  />
                </v-col>

                <!-- 席数 -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.detailCheck.seat_count"
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
                    v-model="formData.detailCheck.section_f_memo"
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
                    v-model="formData.detailCheck.area_types"
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
                    v-model="formData.detailCheck.customer_segments"
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
                    v-model="formData.detailCheck.main_customer_age"
                    :items="['10代', '20代', '30代', '40代', '50代', '60代以上', '幅広い年齢層']"
                    label="メイン客層（年代）"
                    outlined
                    dense
                  />
                </v-col>

                <!-- メイン客層性別 -->
                <v-col cols="12" md="4">
                  <v-select
                    v-model="formData.detailCheck.main_customer_gender"
                    :items="['男性中心', '女性中心', '男女半々', 'ファミリー中心']"
                    label="メイン客層（性別）"
                    outlined
                    dense
                  />
                </v-col>

                <!-- 客層タイプ -->
                <v-col cols="12" md="4">
                  <v-select
                    v-model="formData.detailCheck.customer_type"
                    :items="['サラリーマン', '地元住民', '観光客', '学生', 'ファミリー', '会社員', 'その他']"
                    label="客層タイプ"
                    outlined
                    dense
                  />
                </v-col>

                <!-- アクセス -->
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.detailCheck.access_info"
                    label="アクセス情報"
                    outlined
                    dense
                    placeholder="例: 駅徒歩5分、バス停前"
                  />
                </v-col>

                <!-- 周辺環境 -->
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.detailCheck.surrounding_environment"
                    label="周辺環境"
                    outlined
                    dense
                    rows="3"
                    placeholder="周辺の建物、競合店、人通りなどの特徴"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="formData.detailCheck.section_g_memo"
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
      </v-window-item>

      <!-- タブ4: 自由記述 -->
      <v-window-item :value="3">
        <v-card outlined class="section-card">
          <v-card-title class="section-title">
            <v-icon left size="24" class="mr-2">mdi-draw</v-icon>
            自由記述（手書きメモ）
          </v-card-title>
          <v-card-text class="pt-6">
            <div class="canvas-container">
              <div class="canvas-toolbar mb-3">
                <div class="d-flex tool-buttons-group">
                  <v-btn
                    size="small"
                    @click="setDrawingMode('pen')"
                    :class="['tool-btn', 'd-flex', 'align-center', drawingMode === 'pen' ? 'tool-btn-active' : 'tool-btn-inactive']"
                  >
                    <v-icon left>mdi-pen</v-icon>
                    <span class="btn-text">ペン</span>
                  </v-btn>
                  <v-btn
                    size="small"
                    @click="setDrawingMode('eraser')"
                    :class="['tool-btn', 'd-flex', 'align-center', drawingMode === 'eraser' ? 'tool-btn-active' : 'tool-btn-inactive']"
                  >
                    <v-icon left>mdi-eraser</v-icon>
                    <span class="btn-text">消しゴム</span>
                  </v-btn>
                </div>
                <v-spacer></v-spacer>
                <v-btn size="small" class="clear-btn d-flex align-center" @click="clearCanvas">
                  <v-icon left>mdi-delete</v-icon>
                  <span class="btn-text">全消去</span>
                </v-btn>
              </div>

              <div class="color-picker mb-3">
                <span class="mr-2">色:</span>
                <v-btn
                  v-for="color in colors"
                  :key="color"
                  size="small"
                  :color="color"
                  class="mr-2"
                  @click="setColor(color)"
                  :style="{ border: selectedColor === color ? '3px solid #1e50a2' : 'none' }"
                >
                </v-btn>
              </div>

              <div class="pen-size mb-3 d-flex align-center">
                <span class="mr-2">太さ:</span>
                <v-slider
                  v-model="penSize"
                  :min="1"
                  :max="20"
                  :step="1"
                  hide-details
                  class="slider-control"
                ></v-slider>
                <div class="size-preview ml-4">
                  <div
                    class="size-preview-circle"
                    :style="{
                      width: (drawingMode === 'pen' ? penSize : penSize * 3) + 'px',
                      height: (drawingMode === 'pen' ? penSize : penSize * 3) + 'px',
                      backgroundColor: drawingMode === 'pen' ? selectedColor : 'transparent',
                      border: drawingMode === 'eraser' ? '2px solid #999' : 'none'
                    }"
                  ></div>
                  <span class="ml-2 text-caption">{{ drawingMode === 'pen' ? penSize : penSize * 3 }}px</span>
                </div>
              </div>

              <canvas
                ref="drawingCanvas"
                class="drawing-canvas"
                @mousedown="startDrawing"
                @mousemove="onMouseMove"
                @mouseup="stopDrawing"
                @touchstart="startDrawing"
                @touchmove="onTouchMove"
                @touchend="stopDrawing"
              ></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- タブ5: 設備詳細 -->
      <v-window-item :value="4">
        <v-card outlined class="section-card">
          <v-card-title class="section-title">
            <v-icon left size="24" class="mr-2">mdi-tools</v-icon>
            設備詳細
          </v-card-title>
          <v-card-text class="pt-6">
            <!-- PDFダウンロードボタン -->
            <div class="d-flex justify-end mb-4 no-print">
              <v-btn
                color="primary"
                @click="printEquipmentDetails"
                :loading="isGeneratingPDF"
                :disabled="isGeneratingPDF"
                prepend-icon="mdi-file-pdf-box"
              >
                {{ isGeneratingPDF ? 'PDF生成中...' : 'PDFダウンロード' }}
              </v-btn>
            </div>

            <!-- 印刷用コンテナ -->
            <div id="equipment-print-area">
              <!-- 1ページ目：設備リスト -->
              <div class="equipment-list-page print-page">
                <h2 class="page-title">設備リスト</h2>
                <v-table class="equipment-table">
                  <thead>
                    <tr>
                      <th class="text-center">No.</th>
                      <th>設置場所</th>
                      <th>品目</th>
                      <th>メーカー</th>
                      <th>型式・サイズ</th>
                      <th class="text-center">数量</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in equipmentItems" :key="index">
                      <td class="text-center">{{ index + 1 }}</td>
                      <td>{{ item.location }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.maker }}</td>
                      <td>{{ item.model }}</td>
                      <td class="text-center">{{ item.quantity }}</td>
                    </tr>
                  </tbody>
                </v-table>

                <!-- 備考セクション -->
                <div class="equipment-notes">
                  <h3 class="notes-title">備考</h3>

                  <div class="note-section">
                    <h4 class="note-subtitle">【買取対象物について】</h4>
                    <p class="note-text">
                      目的物リスト及び内装・外装の造作物、厨房機器、インフラ設備、その他譲渡人が残置するもの一切が買取対象物となります。<br>
                      （スケルトン状態から付加されたダクト設備、グリストラップ、床下や天井上の各種インフラ設備。外部の給湯器や室外機、各種メーターから室内に至る電気・ガス等のインフラ設備、吸排水・吸排気等のインフラ設備を含みます。）
                    </p>
                  </div>

                  <div class="note-section">
                    <h4 class="note-subtitle">【性能保証について】</h4>
                    <p class="note-text">
                      対象物はあくまで中古品であり、性能保証はありません。
                    </p>
                  </div>

                  <div class="note-section">
                    <h4 class="note-subtitle">【引き渡しについて】</h4>
                    <p class="note-text">
                      本物件及び買取対象物は現状有姿での引渡しとなります。
                    </p>
                  </div>

                  <div class="note-footer">
                    <p class="note-text">
                      ※お皿（残置）、グラス（残置）、調理器具（残置）、その他備品（残置）
                    </p>
                  </div>
                </div>
              </div>

              <!-- 2ページ目：写真シート -->
              <div class="equipment-photos-page print-page">
                <h2 class="page-title">設備写真</h2>
                <div class="photo-grid">
                  <div v-for="(item, index) in equipmentItems" :key="index" class="photo-item">
                    <div class="photo-header">{{ item.name }}</div>
                    <div class="photo-placeholder">
                      <v-icon size="48" color="grey-lighten-1">mdi-image-outline</v-icon>
                      <div class="text-caption text-grey">写真 {{ index + 1 }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- タブ6: 販売戦略 -->
      <v-window-item :value="5">
        <v-form ref="strategyForm" v-model="strategyFormValid">
          <!-- 販売概要情報 -->
          <v-card outlined class="mb-4 section-card">
            <v-card-title class="section-title">
              <v-icon left size="24" class="mr-2">mdi-clipboard-text-outline</v-icon>
              販売概要情報
            </v-card-title>
            <v-card-text class="pt-6">
              <v-row>
                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="formData.salesOverview.schedule"
                    label="スケジュール予定"
                    outlined
                    dense
                    rows="3"
                    placeholder="例: 2024年3月末閉店予定、4月から引き渡し可能"
                    prepend-inner-icon="mdi-calendar-clock"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="formData.salesOverview.propertyOverview"
                    label="物件概要"
                    outlined
                    dense
                    rows="3"
                    placeholder="例: 1階路面店、角地、視認性良好"
                    prepend-inner-icon="mdi-home-outline"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="formData.salesOverview.currentTenant"
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
                    v-model="formData.salesOverview.ownerManagement"
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
                    v-model="formData.salesOverview.risks"
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

          <!-- 物件の特徴・メリット -->
          <!-- <v-card outlined class="mb-4 section-card">
            <v-card-title class="section-title">
              <v-icon left size="24" class="mr-2">mdi-star-circle</v-icon>
              物件の特徴・メリット
            </v-card-title>
            <v-card-text class="pt-6">
              <v-row>

                <v-col cols="12">
                  <div class="text-subtitle-2 mb-3">
                    <v-icon small color="primary" class="mr-1">mdi-map-marker-star</v-icon>
                    立地の魅力ポイント
                  </div>
                  <v-checkbox
                    v-model="formData.strategy.locationFeatures"
                    label="駅から徒歩5分以内"
                    value="station5min"
                    hide-details
                    class="mb-2"
                  />
                  <v-checkbox
                    v-model="formData.strategy.locationFeatures"
                    label="人通りが多い商店街"
                    value="shoppingStreet"
                    hide-details
                    class="mb-2"
                  />
                  <v-checkbox
                    v-model="formData.strategy.locationFeatures"
                    label="駐車場完備"
                    value="parking"
                    hide-details
                    class="mb-2"
                  />
                  <v-checkbox
                    v-model="formData.strategy.locationFeatures"
                    label="角地・視認性良好"
                    value="corner"
                    hide-details
                    class="mb-2"
                  />
                  <v-textarea
                    v-model="formData.strategy.locationDescription"
                    label="立地の詳細説明"
                    outlined
                    dense
                    rows="3"
                    placeholder="周辺環境、客層、アクセスなど"
                    class="mt-3"
                  />
                </v-col>


                <v-col cols="12">
                  <v-divider class="mb-4"></v-divider>
                  <div class="text-subtitle-2 mb-3">
                    <v-icon small color="primary" class="mr-1">mdi-tools</v-icon>
                    設備面での強み
                  </div>
                  <v-checkbox
                    v-model="formData.strategy.equipmentFeatures"
                    label="厨房設備充実"
                    value="fullKitchen"
                    hide-details
                    class="mb-2"
                  />
                  <v-checkbox
                    v-model="formData.strategy.equipmentFeatures"
                    label="内装きれい（最近改装）"
                    value="recentRenovation"
                    hide-details
                    class="mb-2"
                  />
                  <v-checkbox
                    v-model="formData.strategy.equipmentFeatures"
                    label="すぐに営業可能"
                    value="readyToOpen"
                    hide-details
                    class="mb-2"
                  />
                  <v-checkbox
                    v-model="formData.strategy.equipmentFeatures"
                    label="高額設備あり"
                    value="expensiveEquipment"
                    hide-details
                    class="mb-2"
                  />
                  <v-textarea
                    v-model="formData.strategy.equipmentDescription"
                    label="設備の詳細説明"
                    outlined
                    dense
                    rows="3"
                    placeholder="特筆すべき設備、状態など"
                    class="mt-3"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card> -->

          <!-- 販売方針の決定 -->
          <v-card outlined class="mb-4 section-card">
            <v-card-title class="section-title">
              <v-icon left size="24" class="mr-2">mdi-target</v-icon>
              販売方針の決定
            </v-card-title>
            <v-card-text class="pt-6">
              <v-row>
                <!-- <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.strategy.targetBuyer"
                    label="ターゲット層"
                    :items="['個人事業主', '法人（中小企業）', '法人（大手）', '投資家', '不問']"
                    outlined
                    dense
                    prepend-inner-icon="mdi-account-group"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.strategy.recommendedBusiness"
                    label="推奨業態"
                    :items="['飲食店全般', 'カフェ・喫茶店', 'バー・居酒屋', 'レストラン', '物販店', 'サービス業', '不問']"
                    outlined
                    dense
                    prepend-inner-icon="mdi-store"
                  />
                </v-col> -->
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.strategy.sellingPrice"
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
                    v-model="formData.strategy.minimumPrice"
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
                    v-model="formData.strategy.negotiability"
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

          <!-- 販促文章作成 -->
          <v-card outlined class="mb-4 section-card">
            <v-card-title class="section-title">
              <v-icon left size="24" class="mr-2">mdi-text-box-edit</v-icon>
              販促文章作成
            </v-card-title>
            <v-card-text class="pt-6">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.strategy.catchCopy"
                    label="キャッチコピー"
                    outlined
                    dense
                    placeholder="例: 駅近好立地！即営業可能な居抜き物件"
                    counter="50"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.strategy.salesPitch"
                    label="セールスポイント（募集文章）"
                    outlined
                    dense
                    rows="5"
                    placeholder="物件の魅力を詳しく記載"
                    counter="500"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.strategy.specialNotes"
                    label="特記事項"
                    outlined
                    dense
                    rows="3"
                    placeholder="条件、制限事項など"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- 営業戦略メモ -->
          <v-card outlined class="mb-4 section-card">
            <v-card-title class="section-title">
              <v-icon left size="24" class="mr-2">mdi-note-text</v-icon>
              営業戦略メモ
            </v-card-title>
            <v-card-text class="pt-6">
              <v-textarea
                v-model="formData.strategy.internalMemo"
                label="社内共有用メモ"
                outlined
                dense
                rows="4"
                placeholder="営業上の注意点、アプローチ方法など"
              />
            </v-card-text>
          </v-card>
        </v-form>
      </v-window-item>
    </v-window>

    <!-- 固定アクションバー -->
    <v-sheet class="action-bar elevation-4">
      <div class="d-flex align-center" style="gap: 12px; width: 100%; max-width: 1400px; margin: 0 auto;">
        <v-btn outlined :disabled="submitting" @click="resetForm" class="flex-shrink-0">
          <v-icon left size="20">mdi-refresh</v-icon>
          <span class="d-none d-sm-inline">クリア</span>
        </v-btn>
        <v-spacer />
        <v-btn text :disabled="submitting" @click="saveDraft" class="flex-shrink-0">
          <v-icon left size="20">mdi-content-save-outline</v-icon>
          <span class="d-none d-sm-inline">下書き保存</span>
        </v-btn>
        <v-btn
          color="primary"
          :loading="submitting"
          :disabled="!formValid"
          @click="submitForm"
          large
          class="flex-shrink-0"
        >
          <v-icon left size="20">mdi-send</v-icon>
          送信する
        </v-btn>
      </div>
    </v-sheet>


    <!-- 成功メッセージ -->
    <v-snackbar
      v-model="showSuccess"
      color="success"
      timeout="5000"
      top
    >
      {{ successMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="showSuccess = false"
        >
          閉じる
        </v-btn>
      </template>
    </v-snackbar>

    <!-- エラーメッセージ -->
    <v-snackbar
      v-model="showError"
      color="error"
      timeout="5000"
      top
    >
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="showError = false"
        >
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref, computed, watch, nextTick } from 'vue'

// テスト段階のため認証チェックをスキップ
// 本番環境では以下のコメントを外して認証を有効化
/*
const authStore = useAuthStore()
if (!authStore.isAuthenticated) {
  await navigateTo('/admin/login')
}
*/

/* [ADD] 詳細入力の表示/非表示 */
const showDetailPrice = ref(false)
const showDetailEquipmentCost = ref(false)
const showDetailInteriorCost = ref(false)
const showCoefficientSettings = ref(false)
const showValuationSettings = ref(false)

/* [ADD] プリセット（任意・編集OK） */
const pricePresets = [
  500000, 800000, 1000000, 1500000, 2000000,
  5000000, 8000000, 10000000, 15000000, 20000000, 30000000
]
const detailPreset = ref<number | null>(null)

// チップ用のプリセットデータ
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
const selectedPresetChip = ref<number | null>(null)

// チップ選択時の価格更新
const updatePriceFromChip = (value: number | null) => {
  if (value !== null) {
    formData.value.status.desiredPrice = value
  }
}

// 設備詳細タブのダミーデータ（42件）
const equipmentItems = ref([
  { location: '厨房', name: '業務用冷蔵庫', maker: 'ホシザキ', model: 'HR-120A3', quantity: 1 },
  { location: '厨房', name: '業務用冷凍庫', maker: 'ホシザキ', model: 'HF-120A3', quantity: 1 },
  { location: '厨房', name: 'ガスコンロ', maker: 'タニコー', model: 'TGC-120', quantity: 1 },
  { location: '厨房', name: 'フライヤー', maker: 'タニコー', model: 'TGFL-45', quantity: 1 },
  { location: '厨房', name: '製氷機', maker: 'ホシザキ', model: 'IM-55M', quantity: 1 },
  { location: '厨房', name: '食器洗浄機', maker: 'ホシザキ', model: 'JWE-400TUA3', quantity: 1 },
  { location: '厨房', name: '作業台', maker: 'タニコー', model: 'TX-WT-120', quantity: 2 },
  { location: '厨房', name: 'シンク（三槽）', maker: 'タニコー', model: 'TX-3S-120', quantity: 1 },
  { location: '厨房', name: 'ガスレンジ', maker: 'リンナイ', model: 'RSB-206A', quantity: 1 },
  { location: '厨房', name: '電子レンジ', maker: 'パナソニック', model: 'NE-1802', quantity: 1 },
  { location: '厨房', name: '炊飯器', maker: 'タイガー', model: 'JNO-A360', quantity: 1 },
  { location: '厨房', name: '包丁まな板殺菌庫', maker: 'エイシン', model: 'ESK-1H', quantity: 1 },
  { location: '厨房', name: 'グリストラップ', maker: 'カネソウ', model: 'GXH-50E', quantity: 1 },
  { location: '厨房', name: '換気扇', maker: '三菱', model: 'EF-35UBT', quantity: 2 },
  { location: 'ホール', name: 'エアコン', maker: 'ダイキン', model: 'SZRC140BF', quantity: 2 },
  { location: 'ホール', name: 'テーブル4人用', maker: 'ニトリ', model: 'T-4P-120', quantity: 8 },
  { location: 'ホール', name: 'テーブル2人用', maker: 'ニトリ', model: 'T-2P-80', quantity: 4 },
  { location: 'ホール', name: '椅子', maker: 'ニトリ', model: 'C-WD-01', quantity: 40 },
  { location: 'ホール', name: 'カウンター席', maker: 'カリモク', model: 'CT-10', quantity: 6 },
  { location: 'ホール', name: 'レジカウンター', maker: 'タカラスタンダード', model: 'RC-150', quantity: 1 },
  { location: 'ホール', name: 'POSレジ', maker: 'カシオ', model: 'VT-8000', quantity: 1 },
  { location: 'ホール', name: '券売機', maker: 'グローリー', model: 'VT-B20', quantity: 1 },
  { location: 'ホール', name: '照明器具', maker: 'パナソニック', model: 'LGB50633LB1', quantity: 15 },
  { location: 'ホール', name: '看板（LED）', maker: 'タカショー', model: 'HFD-W06S', quantity: 2 },
  { location: 'ホール', name: '防犯カメラ', maker: 'パナソニック', model: 'WV-S1531LN', quantity: 4 },
  { location: 'ホール', name: 'BGMスピーカー', maker: 'BOSE', model: 'DS40SE', quantity: 6 },
  { location: '客席', name: 'テーブルクロス', maker: 'シンコール', model: 'TC-W120', quantity: 12 },
  { location: '客席', name: '食器棚', maker: 'イトーキ', model: 'SC-180', quantity: 2 },
  { location: '客席', name: '観葉植物', maker: 'グリーンポット', model: 'GP-L01', quantity: 5 },
  { location: '事務所', name: '事務机', maker: 'コクヨ', model: 'SD-ISN1275', quantity: 2 },
  { location: '事務所', name: '事務椅子', maker: 'オカムラ', model: 'CP81BR', quantity: 2 },
  { location: '事務所', name: 'パソコン', maker: 'Dell', model: 'OptiPlex 3080', quantity: 1 },
  { location: '事務所', name: 'プリンター', maker: 'エプソン', model: 'PX-M7110F', quantity: 1 },
  { location: '事務所', name: 'キャビネット', maker: 'イトーキ', model: 'HE-046-3', quantity: 2 },
  { location: 'トイレ', name: '便器', maker: 'TOTO', model: 'CES9898', quantity: 3 },
  { location: 'トイレ', name: '洗面台', maker: 'LIXIL', model: 'LCYH-906', quantity: 2 },
  { location: 'トイレ', name: 'ハンドドライヤー', maker: '三菱', model: 'JT-MC105G', quantity: 2 },
  { location: '倉庫', name: 'スチールラック', maker: 'アイリスオーヤマ', model: 'MR-1218J', quantity: 4 },
  { location: '倉庫', name: '台車', maker: 'トラスコ', model: 'MWP-500', quantity: 2 },
  { location: '倉庫', name: '掃除機', maker: 'ダイソン', model: 'V11 Fluffy', quantity: 2 },
  { location: '外部', name: '室外機', maker: 'ダイキン', model: 'RCU-AP140C', quantity: 2 },
  { location: '外部', name: 'ゴミ箱（業務用）', maker: 'テラモト', model: 'DS-224-012-0', quantity: 3 }
])

// PDF生成中の状態管理
const isGeneratingPDF = ref(false)

// 設備詳細PDF生成関数（html2canvas使用）
const printEquipmentDetails = async () => {
  // クライアントサイドチェック
  if (!process.client) return

  // 既に処理中の場合は実行しない
  if (isGeneratingPDF.value) return

  isGeneratingPDF.value = true

  try {
    // 動的インポート
    const { default: jsPDF } = await import('jspdf')
    const html2canvas = (await import('html2canvas')).default

    // PDF作成
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = 210
    const pageHeight = 297

    // 余白設定
    const marginTop = 10 // 上下の余白
    const marginSide = 10 // 左右の余白

    // 1ページ目：設備リスト（左右センター、上下余白あり）
    const listPage = document.querySelector('.equipment-list-page') as HTMLElement
    if (listPage) {
      const canvas1 = await html2canvas(listPage, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData1 = canvas1.toDataURL('image/png')

      // 左右余白を考慮した幅
      const availableWidth = pageWidth - (marginSide * 2)
      const availableHeight = pageHeight - (marginTop * 2)

      let imgWidth = availableWidth
      let imgHeight = (canvas1.height * availableWidth) / canvas1.width

      // 高さが超える場合はスケール調整
      if (imgHeight > availableHeight) {
        imgHeight = availableHeight
        imgWidth = (canvas1.width * availableHeight) / canvas1.height
      }

      // 左右センタリング
      const xOffset = (pageWidth - imgWidth) / 2
      // 上余白
      const yOffset = marginTop

      doc.addImage(imgData1, 'PNG', xOffset, yOffset, imgWidth, imgHeight)
    }

    // 2ページ目：写真グリッド（上下左右センター）
    doc.addPage()
    const photosPage = document.querySelector('.equipment-photos-page') as HTMLElement
    if (photosPage) {
      const canvas2 = await html2canvas(photosPage, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData2 = canvas2.toDataURL('image/png')

      // 左右余白を考慮した幅
      const availableWidth = pageWidth - (marginSide * 2)
      const availableHeight = pageHeight - (marginTop * 2)

      let imgWidth = availableWidth
      let imgHeight = (canvas2.height * availableWidth) / canvas2.width

      // 高さが超える場合はスケール調整
      if (imgHeight > availableHeight) {
        imgHeight = availableHeight
        imgWidth = (canvas2.width * availableHeight) / canvas2.height
      }

      // 左右センタリング
      const xOffset = (pageWidth - imgWidth) / 2
      // 上下センタリング
      const yOffset = (pageHeight - imgHeight) / 2

      doc.addImage(imgData2, 'PNG', xOffset, yOffset, imgWidth, imgHeight)
    }

    // PDF保存
    doc.save('設備詳細.pdf')
  } catch (error) {
    console.error('PDF生成エラー:', error)
    alert('PDF生成に失敗しました。')
  } finally {
    // 処理完了後にローディング状態を解除
    isGeneratingPDF.value = false
  }
}

// タブの状態管理
const activeTab = ref(0)

// タブ切り替え時の処理
watch(activeTab, (newTab) => {
  if (newTab === 3) { // 自由記述タブ（4番目）
    nextTick(() => {
      initCanvas()
    })
  }
})

// 手書きキャンバスの状態管理
const drawingCanvas = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const drawingMode = ref('pen')
const selectedColor = ref('black')
const penSize = ref(3)
const colors = ['black', 'red', 'blue', 'green', 'orange', 'purple']
let ctx: CanvasRenderingContext2D | null = null
let lastX = 0
let lastY = 0

// フォーム全体の状態
const formValid = ref(false)
const detailFormValid = ref(true)
const strategyFormValid = ref(true)
const submitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const successMessage = ref('')
const errorMessage = ref('')


// バリデーションルール
const rules = {
  required: (v: any) => !!v || 'この項目は必須です',
  email: (v: string) => /.+@.+\..+/.test(v) || 'メールアドレスの形式が正しくありません',
  phone: (v: string) => !v || /^[0-9-]+$/.test(v) || '電話番号の形式が正しくありません'
}

// 選択肢データ
const closingReasons = ['売上不振', '体調不良', '後継者不在', '他事業に注力', '家族の事情', '賃料が高い', '人材不足', 'その他']
const salePeriods = ['1ヶ月以内', '3ヶ月以内', '6ヶ月以内', '1年以内', '急いでいない']
const marketAwareness = ['よく理解している', 'ある程度理解', 'あまり分からない', '全く分からない']
const contractYears = ['2024年', '2023年', '2022年', '2021年', '2020年', '2019年', '2018年', '2017年以前']
const recoveryStatus = ['全額回収済み', '80%回収', '60%回収', '40%回収', '20%回収', 'ほとんど回収できていない']
const operatingDaysOptions = ['20日以下', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日', '毎日']
const profitMargins = ['3%未満', '3%', '4%', '5%', '6%', '7%', '8%', '9%', '10%以上']
const contractDurationOptions = ['1年前', '2年前', '3年前', '4年前', '5年前', '6年前', '7年前', '8年前', '9年前', '10年以上前']
const locationConditions = ['駅近', '車アクセス良好', '人通りが多い', '駐車場あり', '角地', '1階', '2階以上', 'ビルテナント']

// 契約年リスト（2015年から現在まで）
const contractYearsList = (() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = currentYear; year >= 2015; year--) {
    years.push(`${year}年`)
  }
  return years
})()

// 月リスト
const monthsList = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
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
const equipmentIssues = ['故障なし', '一部故障あり', 'リース残債あり', 'リース残債なし']
const areaTypes = ['住宅街', '繁華街', 'ビジネス街', '学生街']
const customerSegments = ['若者', '中高年', '高齢者', '外国人', '学生', 'ビジネスマン', 'ファミリー']
const storeDefects = ['なし', '雨漏り', '水漏れ', '騒音問題', 'その他']
const permits = ['保健所', '消防署', '警察署']
const equipmentStatusOptions = ['問題なし', '譲渡しない設備あり', '故障している設備あり', 'リースの残債がある設備あり', '貸主設備あり']

// フォームデータ構造
const formData = ref({
  // セクション1: 連絡先・現状の把握
  contact: {
    storeName: '',
    ownerName: '',
    address: '',
    phoneNumber: ''
  },
  status: {
    selectedClosingReasons: [],
    reasonOtherText: '',
    landlordNotification: '',
    nextTenantPermission: '',
    employeeNotification: '',
    otherConsultation: '',
    consultationCompany: '',
    businessContinuation: '',
    closingDate: '',
    desiredSalePeriod: '',
    desiredPrice: 0,
    marketPriceAwareness: '',
    equipmentTransferValue: 0
  },
  // 場所関連の金額情報
  locationInfo: {
    rent: 0,
    area: 0,
    contractYear: '',
    contractMonth: '',
    expectedRentPerTsubo: 0,
    locationConditions: [],
    openingDate: '',
    initialInvestment: 0,
    investmentRecovery: '',
    currentRevenue: 0
  },
  // 売上情報
  salesInfo: {
    monthlyRevenue: 0,
    monthlyProfit: 0
  },
  // セクション2: 基本情報
  basicInfo: {
    yearsInBusiness: '',
    initialState: '',
    initialStatePrice: '',
    previousTenantInfo: '',
    hasNegotiation: false,
    negotiationDetails: '',
    usageRestrictions: '',
    hasDrawings: false,
    drawingDetails: '',
    landlordInvoiceStatus: '',
    electricityContract: '',
    electricityCustomerNumber: '',
    gasContract: '',
    gasCustomerNumber: '',
    waterContract: '',
    waterCustomerNumber: '',
    garbageDisposalRules: '',
    garbageDisposalCost: '',
    hasOtherCosts: false,
    otherCostsDetails: '',
    declarations: '',
    newTenantConditions: ''
  },
  // セクション3: 設備の確認
  equipment: {
    equipmentCost: 0,
    equipmentAge: '',
    interiorCost: 0,
    interiorAge: '',
    businessYears: 0,
    equipmentCoefficient: 0.8,
    interiorCoefficient: 0.2,
    equipmentStatus: [],
    hasNonTransferable: false,
    nonTransferableDetails: '',
    hasBroken: false,
    brokenDetails: '',
    hasLeaseDebt: false,
    leaseDebtDetails: '',
    hasLandlordEquipment: false,
    landlordEquipmentDetails: '',
    exhaustType: '',
    exhaustRoute: '',
    drainageType: '',
    electricityMeter: {
      location: '',
      capacity: '',
      powerCapacity: ''
    },
    gasMeter: {
      location: '',
      capacity: ''
    },
    waterMeter: {
      location: '',
      pipeCapacity: ''
    },
    outdoorUnitLocation: '',
    mdfLocation: '',
    defects: [],
    defectOtherText: '',
    permits: []
  },
  // セクション4: 募集に関わること
  recruitment: {
    highSales: '',
    lowSales: '',
    lunchHours: '',
    dinnerHours: '',
    lunchAvgSpend: '',
    dinnerAvgSpend: '',
    closingDays: '',
    salesMemo: '',
    areaTypes: [],
    customerSegments: [],
    areaMemo: '',
    appealPoints: '',
    priorityPoint: '',
    specialConditions: '',
    sellingPrice: '',
    listingPrice: '',
    viewingAvailability: '',
    allowEmail: '',
    allowWebListing: '',
    progressReportMethod: '',
    sellingStrategy: '',
    contractPhotos: [],
    // メーター情報
    mainCustomerAge: '',
    mainCustomerGender: '',
    businessType: '',
    viewingConditions: '',
    publicationConditions: ''
  },
  // ユーティリティ情報
  utilities: {
    electricMeterNumber: '',
    electricContract: '',
    electricCapacity: '',
    gasMeterNumber: '',
    gasType: '',
    gasCapacity: '',
    waterMeterNumber: '',
    waterPressure: ''
  },
  // 営業情報
  business: {
    openingHours: '',
    closedDays: '',
    seatingCapacity: 0,
    staffCount: 0,
    businessMemo: ''
  },
  // 設備追加情報
  equipment: {
    issueStatus: [],
    exhaustType: '',
    drainageType: '',
    exhaustDrainageMemo: '',
    internetType: '',
    securitySystem: '',
    otherEquipment: ''
  },
  // セクション5: 連絡窓口
  externalContacts: [],
  // 物件の特徴
  propertyFeatures: {
    strengths: [],
    limitations: []
  },
  // タブ2: 詳細確認
  detailCheck: {
    // A. 交渉・制限・図面
    landlord_negotiation: null,
    landlord_negotiation_detail: '',
    usage_restriction: null,
    usage_restriction_detail: '',
    floor_plan: null,
    floor_plan_type: '',
    section_a_memo: '',

    // B. ライフライン契約・支払い
    electricity_company: '',
    electricity_customer_number: '',
    gas_company: '',
    gas_customer_number: '',
    water_company: '',
    water_customer_number: '',
    landlord_payment: null,
    landlord_payment_detail: '',
    section_b_memo: '',

    // C. その他申告・費用
    garbage_disposal_cost: 0,
    other_monthly_costs: null,
    other_monthly_costs_detail: '',
    other_monthly_costs_amount: 0,
    declarations: '',
    new_tenant_conditions: '',
    section_c_memo: '',

    // D. 設備・内装・譲渡
    equipment_investment: 0,
    equipment_age: 0,
    interior_investment: 0,
    interior_age: 0,
    non_transferable_equipment: null,
    non_transferable_equipment_detail: '',
    broken_equipment: null,
    broken_equipment_detail: '',
    lease_debt: null,
    lease_debt_amount: 0,
    landlord_equipment: null,
    landlord_equipment_detail: '',
    section_d_memo: '',

    // E. メーター・容量・機器位置
    exhaust_equipment: '',
    exhaust_route: '',
    drainage_equipment: '',
    electric_meter_location: '',
    electric_capacity: '',
    power_capacity: '',
    gas_meter_location: '',
    gas_capacity: '',
    water_meter_location: '',
    water_pipe_capacity: '',
    outdoor_unit_location: '',
    mdf_location: '',
    section_e_memo: '',

    // F. 売上・営業時間
    highest_sales_month: 0,
    lowest_sales_month: 0,
    lunch_hours: '',
    dinner_hours: '',
    lunch_avg_price: 0,
    dinner_avg_price: 0,
    closed_days: '',
    seat_count: 0,
    section_f_memo: '',

    // G. エリア・客層
    area_types: [],
    customer_segments: [],
    main_customer_age: '',
    main_customer_gender: '',
    customer_type: '',
    access_info: '',
    surrounding_environment: '',
    section_g_memo: ''
  },
  // 販売概要情報
  salesOverview: {
    schedule: '',
    propertyOverview: '',
    currentTenant: '',
    ownerManagement: '',
    risks: ''
  },
  // タブ3: 販売戦略
  strategy: {
    // 物件の特徴
    locationFeatures: [],
    locationDescription: '',
    equipmentFeatures: [],
    equipmentDescription: '',
    // 販売方針
    targetBuyer: '',
    recommendedBusiness: '',
    sellingPrice: 0,
    minimumPrice: 0,
    negotiability: '応相談',
    // 販促文章
    catchCopy: '',
    salesPitch: '',
    specialNotes: '',
    // 内部メモ
    internalMemo: ''
  },
  // 簡易査定
  valuation: {
    locationWeight: 0.6,
    equipmentWeight: 0.4
  }
})

// 連絡先の追加・削除
const addContact = () => {
  formData.value.externalContacts.push({
    type: '',
    companyName: '',
    contactPerson: '',
    companyPhone: '',
    personPhone: ''
  })
}

const removeContact = (index: number) => {
  formData.value.externalContacts.splice(index, 1)
}



/* [ADD] 表示用（3桁区切り＋円） */
const priceJP = computed(() =>
  `${new Intl.NumberFormat('ja-JP').format(Number(formData.value.status.desiredPrice || 0))} 円`
)

const progressPercentage = computed(() => {
  // 必須フィールドベースの進捗計算
  let completed = 0
  let total = 0

  // 基本情報 (3項目)
  total += 3
  if (formData.value.contact.ownerName) completed++
  if (formData.value.contact.address) completed++
  if (formData.value.contact.phoneNumber) completed++

  // 場所情報 (2項目)
  total += 2
  if (formData.value.locationInfo.rent > 0) completed++
  if (formData.value.locationInfo.area > 0) completed++

  // 設備情報 (2項目)
  total += 2
  if (formData.value.equipment.equipmentAge !== '') completed++
  if (formData.value.equipment.interiorCost > 0) completed++

  // 売却戦略 (1項目)
  total += 1
  if (formData.value.recruitment.sellingStrategy !== '') completed++

  return Math.round((completed / total) * 100)
})

// 坪単価の自動計算（万円から円に変換して計算）
const calculateRentPerTsubo = computed(() => {
  const rent = Number(formData.value.locationInfo.rent) * 10000 // 万円を円に変換
  const area = Number(formData.value.locationInfo.area)
  if (rent > 0 && area > 0) {
    return Math.round(rent / area).toLocaleString()
  }
  return '0'
})

// 立地係数の計算（坪単価に基づく）
const calculateLocationCoefficient = computed(() => {
  const rent = Number(formData.value.locationInfo.rent) * 10000 // 万円を円に変換
  const area = Number(formData.value.locationInfo.area)
  if (rent <= 0 || area <= 0) return { grade: '', coefficient: 0 }

  const tsuboPrice = rent / area // 坪単価（円）

  if (tsuboPrice <= 10000) return { grade: '1等地A', coefficient: 1 }
  if (tsuboPrice <= 15000) return { grade: '1等地B', coefficient: 2 }
  if (tsuboPrice <= 20000) return { grade: '2等地A', coefficient: 3 }
  if (tsuboPrice <= 30000) return { grade: '2等地B', coefficient: 4 }
  if (tsuboPrice <= 50000) return { grade: '3等地A', coefficient: 5 }
  return { grade: '3等地B', coefficient: 6 }
})

// 面積係数の計算（坪数に基づく）
const calculateAreaCoefficient = computed(() => {
  const area = Number(formData.value.locationInfo.area)
  const locationCoef = calculateLocationCoefficient.value.coefficient

  if (area <= 0 || locationCoef === 0) return 0

  if (area <= 20) return locationCoef * 2
  if (area <= 50) return locationCoef * 1.5
  return locationCoef * 1.2
})

// 立地評価の計算
const calculateLocationEvaluation = computed(() => {
  const rent = Number(formData.value.locationInfo.rent) * 10000 // 万円を円に変換
  const area = Number(formData.value.locationInfo.area)
  const areaCoef = calculateAreaCoefficient.value

  if (rent <= 0 || area <= 0 || areaCoef === 0) return 0

  const tsuboPrice = rent / area // 坪単価
  const evaluation = tsuboPrice * area * areaCoef // 立地評価

  return Math.round(evaluation) // 円単位で返す
})

// 設備残存価値の計算（減価償却後）
const calculateEquipmentResidual = computed(() => {
  const equipmentCost = Number(formData.value.equipment.equipmentCost) || 0
  const businessYears = Number(formData.value.equipment.businessYears) || 0
  const depreciationYears = 7 // 設備の減価償却年数

  if (equipmentCost <= 0) return 0

  // 営業年数が償却年数を超えている場合は0
  if (businessYears >= depreciationYears) return 0

  // 残存価値 = 取得額 × (償却年数 - 営業年数) / 償却年数
  const residualValue = equipmentCost * (depreciationYears - businessYears) / depreciationYears

  return Math.round(residualValue * 10) / 10 // 小数点第1位まで
})

// 内装残存価値の計算（減価償却後）
const calculateInteriorResidual = computed(() => {
  const interiorCost = Number(formData.value.equipment.interiorCost) || 0
  const businessYears = Number(formData.value.equipment.businessYears) || 0
  const depreciationYears = 15 // 内装の減価償却年数

  if (interiorCost <= 0) return 0

  // 営業年数が償却年数を超えている場合は0
  if (businessYears >= depreciationYears) return 0

  // 残存価値 = 取得額 × (償却年数 - 営業年数) / 償却年数
  const residualValue = interiorCost * (depreciationYears - businessYears) / depreciationYears

  return Math.round(residualValue * 10) / 10 // 小数点第1位まで
})

// 設備評価の計算
const calculateEquipmentEvaluation = computed(() => {
  const equipmentResidual = calculateEquipmentResidual.value
  const interiorResidual = calculateInteriorResidual.value

  const equipmentCoefficient = Number(formData.value.equipment.equipmentCoefficient) || 0.8
  const interiorCoefficient = Number(formData.value.equipment.interiorCoefficient) || 0.2

  // 設備評価 = 設備残存価値 × 設備係数 + 内装残存価値 × 内装係数
  const evaluation = (equipmentResidual * equipmentCoefficient) + (interiorResidual * interiorCoefficient)

  return Math.round(evaluation * 10) / 10 // 小数点第1位まで
})

// 係数調整関数（設備・内装）
const updateInteriorCoefficient = () => {
  const equipmentCoef = Number(formData.value.equipment.equipmentCoefficient) || 0
  formData.value.equipment.interiorCoefficient = Math.round((1 - equipmentCoef) * 10) / 10
}

const resetCoefficients = () => {
  formData.value.equipment.equipmentCoefficient = 0.8
  formData.value.equipment.interiorCoefficient = 0.2
}

// 簡易査定の計算
const calculateSimpleValuation = computed(() => {
  const locationEvaluation = calculateLocationEvaluation.value
  const equipmentEvaluation = (calculateEquipmentEvaluation.value || 0) * 10000 // 万円を円に変換

  const locationWeight = Number(formData.value.valuation.locationWeight) || 0.6
  const equipmentWeight = Number(formData.value.valuation.equipmentWeight) || 0.4

  // 簡易査定額 = 立地評価 × 立地重み + 設備評価 × 設備重み
  const valuation = (locationEvaluation * locationWeight) + (equipmentEvaluation * equipmentWeight)

  return Math.round(valuation) // 円単位で返す
})

// 係数調整関数（簡易査定）
const updateEquipmentWeight = () => {
  const locationWeight = Number(formData.value.valuation.locationWeight) || 0
  formData.value.valuation.equipmentWeight = Math.round((1 - locationWeight) * 10) / 10
}

const resetValuationWeights = () => {
  formData.value.valuation.locationWeight = 0.6
  formData.value.valuation.equipmentWeight = 0.4
}

// 初期値設定
onMounted(() => {
  if (!formData.value.equipment.equipmentCoefficient) {
    formData.value.equipment.equipmentCoefficient = 0.8
  }
  if (!formData.value.equipment.interiorCoefficient) {
    formData.value.equipment.interiorCoefficient = 0.2
  }
  if (!formData.value.valuation.locationWeight) {
    formData.value.valuation.locationWeight = 0.6
  }
  if (!formData.value.valuation.equipmentWeight) {
    formData.value.valuation.equipmentWeight = 0.4
  }
})


// 下書き保存
const saveDraft = async () => {
  try {
    // ローカルストレージに保存
    localStorage.setItem('exitFormDraft', JSON.stringify(formData.value))
    showSuccessMessage('下書きを保存しました')
  } catch (error) {
    console.error('下書き保存エラー:', error)
    showErrorMessage('下書きの保存に失敗しました')
  }
}

// フォーム送信
const submitForm = async () => {
  if (!formValid.value || progressPercentage.value < 100) {
    showErrorMessage('必須項目を全て入力してください')
    return
  }

  submitting.value = true
  
  try {
    // Supabaseに保存
    /*
    const supabase = useSupabase()
    const { data, error } = await supabase
      .from('hearing_sheets')
      .insert([{
        ...formData.value,
        created_at: new Date().toISOString(),
        created_by: authStore.userId
      }])
    
    if (error) throw error
    */
    
    // 成功処理
    showSuccessMessage('ヒアリングシートを登録しました')
    
    // フォームリセット
    await new Promise(resolve => setTimeout(resolve, 2000))
    resetForm()
    
  } catch (error) {
    console.error('登録エラー:', error)
    showErrorMessage('登録中にエラーが発生しました')
  } finally {
    submitting.value = false
  }
}

// フォームリセット
const resetForm = () => {
  if (confirm('入力内容をすべてクリアしますか？')) {
    window.location.reload()
  }
}

// メッセージ表示
const showSuccessMessage = (message: string) => {
  successMessage.value = message
  showSuccess.value = true
}

const showErrorMessage = (message: string) => {
  errorMessage.value = message
  showError.value = true
}

// 手書きキャンバス関数
const initCanvas = () => {
  const canvas = drawingCanvas.value
  if (!canvas) return

  // 既存の描画内容を保存
  let imageData: ImageData | null = null
  if (ctx && canvas.width > 0 && canvas.height > 0) {
    try {
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    } catch (e) {
      console.warn('キャンバス内容の保存に失敗:', e)
    }
  }

  // キャンバスサイズを設定
  const newWidth = canvas.offsetWidth
  const newHeight = 600
  canvas.width = newWidth
  canvas.height = newHeight

  // コンテキストを再取得
  ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // 保存した描画内容を復元
    if (imageData) {
      ctx.putImageData(imageData, 0, 0)
    }
  }
}

const setDrawingMode = (mode: string) => {
  drawingMode.value = mode
}

const setColor = (color: string) => {
  selectedColor.value = color
}

const clearCanvas = () => {
  if (!ctx || !drawingCanvas.value) return
  ctx.clearRect(0, 0, drawingCanvas.value.width, drawingCanvas.value.height)
}

const getCoordinates = (e: MouseEvent | TouchEvent) => {
  const canvas = drawingCanvas.value
  if (!canvas) return { x: 0, y: 0 }

  const rect = canvas.getBoundingClientRect()

  if (e instanceof MouseEvent) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  } else {
    const touch = e.touches[0]
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    }
  }
}

const startDrawing = (e: MouseEvent | TouchEvent) => {
  if (e instanceof TouchEvent) {
    e.preventDefault()
  }

  isDrawing.value = true
  const coords = getCoordinates(e)
  lastX = coords.x
  lastY = coords.y
}

const onMouseMove = (e: MouseEvent) => {
  if (isDrawing.value) {
    draw(e)
  }
}

const onTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  if (isDrawing.value) {
    draw(e)
  }
}

const draw = (e: MouseEvent | TouchEvent) => {
  if (!isDrawing.value || !ctx) return

  const coords = getCoordinates(e)

  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(coords.x, coords.y)

  if (drawingMode.value === 'pen') {
    ctx.strokeStyle = selectedColor.value
    ctx.lineWidth = penSize.value
  } else {
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = penSize.value * 3
  }

  ctx.stroke()

  lastX = coords.x
  lastY = coords.y
}

const stopDrawing = () => {
  isDrawing.value = false
}

// 下書き読み込み
onMounted(() => {
  const draft = localStorage.getItem('exitFormDraft')
  if (draft) {
    try {
      const parsedDraft = JSON.parse(draft)
      // 確認ダイアログを表示
      if (confirm('保存された下書きがあります。読み込みますか？')) {
        formData.value = parsedDraft
      }
    } catch (error) {
      console.error('下書き読み込みエラー:', error)
    }
  }

  // キャンバス初期化
  nextTick(() => {
    initCanvas()
  })
})

// ウィンドウリサイズ時にキャンバスを再初期化
onMounted(() => {
  window.addEventListener('resize', initCanvas)
})

onUnmounted(() => {
  window.removeEventListener('resize', initCanvas)
})

// ページタイトル
useHead({
  title: '店舗売却ヒアリングシート - 営業入力フォーム'
})
</script>

<style scoped>
/* 手書きキャンバス */
.canvas-container {
  width: 100%;
}

.canvas-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f7f9fc;
  border-radius: 8px;
}

.tool-buttons-group {
  gap: 4px;
}

.tool-btn {
  padding: 8px 16px !important;
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  margin-right: 4px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.tool-btn:last-child {
  margin-right: 0 !important;
}

.btn-text {
  line-height: 1 !important;
  display: flex !important;
  align-items: center !important;
}

.tool-btn-active {
  background: linear-gradient(135deg, #1e50a2 0%, #154a8a 100%) !important;
  color: white !important;
  box-shadow: 0 2px 8px rgba(30, 80, 162, 0.3) !important;
}

.tool-btn-active .v-icon {
  color: white !important;
}

.tool-btn-inactive {
  background: white !important;
  color: #1e50a2 !important;
  border: 2px solid #e1ecff !important;
}

.tool-btn-inactive .v-icon {
  color: #1e50a2 !important;
}

.tool-btn-inactive:hover {
  border-color: #1e50a2 !important;
  background: #f7f9fc !important;
}

.clear-btn {
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%) !important;
  color: white !important;
  padding: 8px 16px !important;
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 500 !important;
  box-shadow: 0 2px 8px rgba(211, 47, 47, 0.3) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.clear-btn .v-icon {
  color: white !important;
}

.clear-btn:hover {
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4) !important;
}

.color-picker {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f7f9fc;
  border-radius: 8px;
}

.pen-size {
  padding: 8px 12px;
  background: #f7f9fc;
  border-radius: 8px;
}

.slider-control {
  max-width: 200px;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.size-preview {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  padding: 4px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e1ecff;
}

.size-preview-circle {
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
}

.drawing-canvas {
  width: 100%;
  height: 600px;
  border: 2px solid #e1ecff;
  border-radius: 8px;
  background: white;
  cursor: crosshair;
  touch-action: none;
}

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

/* フォーム要素の美化 */
.v-text-field--outlined >>> fieldset {
  border-color: #e1ecff !important;
  border-width: 1.5px !important;
}

.v-text-field--outlined:hover >>> fieldset {
  border-color: #1e50a2 !important;
}

.v-text-field--outlined.v-input--is-focused >>> fieldset {
  border-color: #1e50a2 !important;
  border-width: 2px !important;
}

/* セレクトボックスの美化 */
.v-select.v-text-field--outlined >>> .v-select__selection {
  font-weight: 500;
}

/* スライダーの美化 */
.v-slider >>> .v-slider__track-container {
  border-radius: 8px;
}

.v-slider >>> .v-slider__thumb {
  background: linear-gradient(135deg, #1e50a2 0%, #154a8a 100%) !important;
  border: 3px solid white !important;
  box-shadow: 0 2px 8px rgba(30, 80, 162, 0.3) !important;
}

/* iPadでスライダー操作時にタブが移動しないようにする */
.v-slider {
  touch-action: pan-y !important; /* 縦方向のスクロールのみ許可、横方向のタッチジェスチャーを無効化 */
}

.v-slider >>> .v-slider__track-container,
.v-slider >>> .v-slider__thumb {
  touch-action: none !important; /* スライダー本体とサムでタッチジェスチャーを完全に制御 */
}

/* チップの美化 */
.v-chip {
  border-radius: 12px !important;
  font-weight: 500 !important;
}

.v-chip.v-chip--outlined {
  border-color: #1e50a2 !important;
}

/* 進捗バーの美化 */
.v-progress-linear >>> .v-progress-linear__bar {
  background: linear-gradient(90deg, #1e50a2 0%, #2196f3 100%) !important;
}

/* 画面下部：固定アクションバー */
.action-bar {
  position: sticky;
  bottom: 0;
  width: 100%;
  background: rgba(255,255,255,0.98);
  backdrop-filter: saturate(140%) blur(12px);
  padding: 16px 20px;
  z-index: 100;
  border-top: 1px solid #e1ecff;
  box-shadow: 0 -4px 20px rgba(30, 80, 162, 0.1);
}

/* ボタンの美化 */
.v-btn {
  border-radius: 12px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
}

.v-btn.v-btn--outlined {
  border-width: 1.5px !important;
}

/* 必須マーカーの美化 */
.red--text {
  color: #ff6b35 !important;
  font-weight: 700 !important;
}

/* Vuetifyの内部要素まで確実に届かせる */
:deep(.v-chip .v-icon.force-white-icon) {
  color: #fff !important;
}

/* ワンタッププリセットチップのスタイル */
.preset-chip {
  background: linear-gradient(135deg, #f2f6ff 0%, #e8efff 100%) !important;
  color: #154a8a !important;
  border: 1px solid #e1ecff !important;
  font-weight: 500;
  transition: all 0.2s ease;
}

.preset-chip:hover {
  background: linear-gradient(135deg, #e8efff 0%, #dde8ff 100%) !important;
  border-color: #c8dbff !important;
}

.preset-chip-selected {
  background: linear-gradient(135deg, #a8c5ff 0%, #8fb3ff 100%) !important;
  color: #0d3a7a !important;
  border: 2px solid #1e50a2 !important;
  font-weight: 700;
}

/* iPad縦向き対応 */
@media (max-width: 768px) {
  .v-container {
    padding: 12px !important;
  }

  .v-card-text {
    padding: 16px !important;
  }

  .v-chip {
    font-size: 14px !important;
    height: 42px !important;
    padding: 0 16px !important;
  }

  .v-slider {
    margin-top: 28px !important;
  }

  .section-title {
    font-size: 16px !important;
    padding-top: 14px !important;
    padding-bottom: 14px !important;
  }

  .action-bar {
    padding: 12px 16px !important;
  }
}

@media (max-width: 600px) {
  .section-title {
    font-size: 15px !important;
    padding-top: 12px !important;
    padding-bottom: 12px !important;
  }

  .v-chip {
    font-size: 13px !important;
    height: 38px !important;
  }

  .action-bar .d-none.d-sm-inline {
    display: none !important;
  }
}

/* ホバーエフェクト */
.v-btn:not(.v-btn--disabled):hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* フォーカス状態の美化 */
.v-input--is-focused {
  transform: scale(1.01);
  transition: transform 0.2s ease;
}

/* 美しいアニメーション */
.v-card.section-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* テキストエリアの美化 */
.v-textarea >>> .v-text-field__slot textarea {
  line-height: 1.6 !important;
}

/* コンテナの美化 */
.v-container {
  background: linear-gradient(135deg, #fafbff 0%, #f5f8ff 100%);
  min-height: 100vh;
}

/* 数値フィールドの右寄せ */
.v-text-field[type="number"] input {
  text-align: right !important;
}

/* 補助テキスト用 */
.helper-muted {
  color: #6b7280 !important;
  font-size: 12px !important;
  font-style: italic;
}

/* 区切り線の美化 */
.v-divider {
  border-color: #e1ecff !important;
  opacity: 0.7;
}

/* ラベルの美化 */
.v-label {
  font-weight: 500 !important;
  color: #374151 !important;
}

/* 必須項目の自動付与（改良版） */
.v-input--is-required .v-label::after {
  content: '＊';
  color: #ff6b35;
  margin-left: 4px;
  font-weight: 700;
  font-size: 14px;
}

/* アイコンの美化 */
.v-icon {
  color: #1e50a2 !important;
}

/* 影の統一 */
.elevation-2 {
  box-shadow: 0 3px 10px rgba(30, 80, 162, 0.08) !important;
}

.elevation-3 {
  box-shadow: 0 4px 12px rgba(30, 80, 162, 0.1) !important;
}

.elevation-4 {
  box-shadow: 0 6px 20px rgba(30, 80, 162, 0.12) !important;
}

/* スムーズなトランジション */
* {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* プレースホルダーの美化 */
::placeholder {
  color: #9ca3af !important;
  opacity: 0.8;
}

/* ========================================
   設備詳細タブ 印刷用スタイル
   ======================================== */

/* 印刷時の基本設定 */
@media print {
  /* A4サイズ設定 */
  @page {
    size: A4;
    margin: 10mm 12mm;
  }

  /* 印刷時に不要な要素を非表示 */
  .no-print,
  .sticky-stack,
  .v-footer,
  header,
  nav {
    display: none !important;
  }

  /* ページ全体の設定 */
  body {
    margin: 0;
    padding: 0;
  }

  .v-container {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* v-window構造を保持 */
  .v-window {
    display: block !important;
  }

  /* 全てのタブ内容を非表示 */
  .v-window-item {
    display: none !important;
  }

  /* 設備詳細タブ（value=4）のみ表示 */
  .v-window-item:nth-child(5) {
    display: block !important;
  }

  /* 他のタブのv-cardを非表示 */
  .v-window-item:not(:nth-child(5)) .v-card {
    display: none !important;
  }

  /* 設備詳細タブのv-card-titleとアラートを非表示 */
  .v-window-item:nth-child(5) .v-card-title,
  .v-window-item:nth-child(5) .section-title {
    display: none !important;
  }

  /* 設備詳細タブのv-cardの枠線を削除 */
  .v-window-item:nth-child(5) .v-card {
    border: none !important;
    box-shadow: none !important;
  }

  /* 印刷用コンテナを確実に表示 */
  #equipment-print-area {
    display: block !important;
    visibility: visible !important;
  }

  /* ページ区切り設定 */
  .print-page {
    page-break-after: always;
    page-break-inside: avoid;
  }

  .print-page:last-child {
    page-break-after: auto;
  }

  /* ページタイトル */
  .page-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
    padding-bottom: 5px;
    border-bottom: 2px solid #333;
    text-align: center;
  }

  /* 1ページ目：設備リストテーブル */
  .equipment-list-page {
    width: 100%;
  }

  .equipment-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8px;
  }

  .equipment-table thead tr {
    background-color: #f0f0f0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .equipment-table th,
  .equipment-table td {
    border: 1px solid #333 !important;
    padding: 2px 4px;
    text-align: left;
    line-height: 1.2;
  }

  .equipment-table th {
    font-weight: bold;
    background-color: #e0e0e0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-size: 9px;
  }

  .equipment-table tbody tr:nth-child(even) {
    background-color: #f9f9f9 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* 備考セクション（印刷用） */
  .equipment-notes {
    margin-top: 8px;
    padding: 6px;
    border: 1px solid #333;
    background-color: #ffffff !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .notes-title {
    font-size: 11px;
    font-weight: bold;
    margin-bottom: 5px;
    padding-bottom: 3px;
    border-bottom: 1px solid #333;
  }

  .note-section {
    margin-bottom: 4px;
  }

  .note-subtitle {
    font-size: 9px;
    font-weight: bold;
    margin-bottom: 2px;
  }

  .note-text {
    font-size: 7px;
    line-height: 1.3;
    margin: 0;
  }

  .note-footer {
    margin-top: 4px;
    padding-top: 3px;
    border-top: 1px solid #ddd;
  }

  /* 2ページ目：写真グリッド */
  .equipment-photos-page {
    width: 100%;
    height: 100%;
  }

  .equipment-photos-page .page-title {
    margin-bottom: 5px;
    padding-bottom: 3px;
  }

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(7, 1fr);
    gap: 2px;
    width: 100%;
    height: 252mm;
  }

  .photo-item {
    border: 1px solid #999;
    display: flex;
    flex-direction: column;
    page-break-inside: avoid;
    height: 100%;
  }

  .photo-header {
    background-color: #f0f0f0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    padding: 2px 3px;
    font-size: 7px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .photo-placeholder {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fafafa !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    padding: 3px;
  }

  .photo-placeholder .v-icon {
    opacity: 0.3;
    font-size: 20px !important;
  }

  .photo-placeholder .text-caption {
    font-size: 6px;
    color: #999 !important;
  }
}

/* 画面表示用スタイル */
.equipment-list-page,
.equipment-photos-page {
  margin-bottom: 30px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(30, 80, 162, 0.08);
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 3px solid #1976d2;
  color: #1e50a2;
  display: flex;
  align-items: center;
}

.page-title::before {
  content: '';
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #1e50a2 0%, #1976d2 100%);
  margin-right: 12px;
  border-radius: 2px;
}

.equipment-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.equipment-table th,
.equipment-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e1ecff;
  text-align: left;
}

.equipment-table th {
  background-color: #e3f2fd;
  color: #1565c0;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
  border: none;
}

.equipment-table th:first-child {
  border-top-left-radius: 8px;
}

.equipment-table th:last-child {
  border-top-right-radius: 8px;
}

.equipment-table tbody tr {
  background-color: white;
  transition: all 0.2s ease;
}

.equipment-table tbody tr:nth-child(even) {
  background-color: #f8faff;
}

.equipment-table tbody tr:hover {
  background-color: #e8f4ff;
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(30, 80, 162, 0.12);
}

.equipment-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 8px;
}

.equipment-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 8px;
}

.equipment-table tbody tr:last-child td {
  border-bottom: none;
}

.equipment-table td {
  color: #374151;
  font-size: 13px;
}

.equipment-table td:first-child,
.equipment-table td:last-child {
  text-align: center;
  font-weight: 600;
  color: #1976d2;
}

/* 備考セクション（画面表示用） */
.equipment-notes {
  margin-top: 25px;
  padding: 20px 24px;
  border: 2px solid #e1ecff;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
  box-shadow: 0 1px 3px rgba(30, 80, 162, 0.08);
}

.notes-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1976d2;
  color: #1e50a2;
  display: flex;
  align-items: center;
}

.notes-title::before {
  content: '📝';
  margin-right: 8px;
  font-size: 18px;
}

.note-section {
  margin-bottom: 15px;
  padding: 12px;
  background-color: white;
  border-radius: 6px;
}

.note-subtitle {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #1e50a2;
}

.note-text {
  font-size: 13px;
  line-height: 1.7;
  margin: 0;
  color: #4b5563;
}

.note-footer {
  margin-top: 15px;
  padding-top: 12px;
  border-top: 2px dashed #e1ecff;
}

.note-footer .note-text {
  font-style: italic;
  color: #6b7280;
  font-size: 12px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-top: 20px;
}

.photo-item {
  border: 2px solid #e1ecff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.photo-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(30, 80, 162, 0.15);
  border-color: #1976d2;
}

.photo-header {
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
}

.photo-placeholder {
  aspect-ratio: 4/3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
  padding: 20px;
}

.photo-placeholder .v-icon {
  opacity: 0.25;
  margin-bottom: 8px;
  color: #1976d2;
}

.photo-placeholder .text-caption {
  color: #9ca3af;
  font-weight: 500;
}

/* レスポンシブ対応 */
@media (max-width: 1200px) {
  .photo-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .photo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* スクロールバーの美化 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #1e50a2, #2196f3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #154a8a, #1976d2);
}
</style>

