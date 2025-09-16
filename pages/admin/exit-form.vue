<template>
  <v-container class="pa-4" style="max-width: 1400px;">
    <!-- ヘッダー -->
    <v-card class="mb-4 elevation-3" style="border-radius: 16px; overflow: hidden;">
      <v-card-title
        class="text-h5 font-weight-bold text-white d-flex align-center"
        style="background: linear-gradient(135deg, #1e50a2 0%, #154a8a 100%); min-height: 72px;"
      >
        <v-icon start color="white" size="32" class="mr-3">mdi-clipboard-list-outline</v-icon>
        店舗売却ヒアリングシート
        <v-spacer></v-spacer>
        <v-chip color="rgba(255,255,255,0.2)" text-color="white" small outlined>
          <v-icon left small>mdi-timer-outline</v-icon>
          5-10分
        </v-chip>
      </v-card-title>

      <!-- <v-card-text class="py-3 white--text" style="background: linear-gradient(135deg, #1e50a2 0%, #154a8a 100%); opacity: .95;">
        <div class="d-flex align-center">
          <v-icon color="white" class="mr-2" size="20">mdi-information-outline</v-icon>
          入力にかかる目安時間：5〜10分。必須項目は<b>＊</b>が付いています。
        </div>
      </v-card-text> -->

      <!-- 進捗バー復活 -->
      <v-card-text class="pb-4 pt-3" style="background:#f7f9fc;">
        <div class="d-flex align-center mb-2">
          <span class="text-caption font-weight-medium" style="color: #154a8a;">入力進捗</span>
          <v-spacer></v-spacer>
          <span class="text-caption font-weight-bold text-primary">{{ progressPercentage }}%</span>
        </div>
        <v-progress-linear
          :value="progressPercentage"
          height="10"
          rounded
          :color="progressPercentage === 100 ? 'success' : 'primary'"
          background-color="rgba(30, 80, 162, 0.1)"
        />
        <div class="text-caption mt-1" style="color: #6b7280;">
          必須項目の入力状況
        </div>
      </v-card-text>
    </v-card>

    <!-- メインフォーム -->
    <v-form ref="mainForm" v-model="formValid">
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

                    <!-- 相場感の認識 -->
                    <div class="mb-6">
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
                    </div>

                    <!-- 希望金額 -->
                    <div class="mb-6">
                      <div class="text-subtitle-2 mb-2">
                        <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
                        希望金額（いくらぐらい）
                      </div>
                      <v-slider
                        v-model="formData.status.desiredPrice"
                        :max="5000"
                        :min="0"
                        :step="10"
                        class="mt-4"
                      ></v-slider>
                      <div class="text-center text-h6">{{ formData.status.desiredPrice }}万円</div>
                    </div>
                  </v-col>
                </v-row>

                <!-- 設備譲渡価値セクション（フル幅） -->
                <!-- <v-divider class="my-6"></v-divider> -->

                <!-- 中の設備譲渡価値の希望 -->
                <div class="mb-6">
                  <div class="text-subtitle-2 mb-2">
                    <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
                    中の設備譲渡価値の希望
                  </div>
                  <v-slider
                    v-model="formData.status.equipmentTransferValue"
                    :max="3000"
                    :min="0"
                    :step="10"
                    class="mt-4"
                  ></v-slider>
                  <div class="text-center text-h6">{{ formData.status.equipmentTransferValue }}万円</div>
                </div>
              </v-card-text>
            </v-card>

            <!-- 場所関連の金額情報 -->
            <v-card outlined class="section-card">
              <v-card-title class="section-title">
                <v-icon left size="24" class="mr-2">mdi-map-marker-outline</v-icon>
                場所関連の金額情報
              </v-card-title>
              <v-card-text class="pt-6">
                <v-row>
                  <!-- 家賃 -->
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.locationInfo.rent"
                      label="家賃"
                      :rules="[rules.required]"
                      outlined
                      dense
                      type="number"
                      suffix="円"
                      prepend-inner-icon="mdi-cash"
                      required
                    >
                      <template v-slot:label>
                        家賃 <span class="red--text">*</span>
                      </template>
                    </v-text-field>
                  </v-col>

                  <!-- 坪数 -->
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.locationInfo.area"
                      label="坪数"
                      :rules="[rules.required]"
                      outlined
                      dense
                      type="number"
                      suffix="坪"
                      prepend-inner-icon="mdi-ruler-square"
                      required
                    >
                      <template v-slot:label>
                        坪数 <span class="red--text">*</span>
                      </template>
                    </v-text-field>
                  </v-col>

                  <!-- 坪単価（自動計算） -->
                  <v-col cols="12" sm="6">
                    <v-text-field
                      :value="calculateRentPerTsubo"
                      label="坪単価（自動計算）"
                      outlined
                      dense
                      readonly
                      suffix="円/坪"
                      prepend-inner-icon="mdi-calculator"
                    ></v-text-field>
                  </v-col>

                  <!-- 契約した年 -->
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="formData.locationInfo.contractYear"
                      label="いつ（契約した年）"
                      :items="contractYears"
                      outlined
                      dense
                      hide-details
                      prepend-inner-icon="mdi-calendar"
                    ></v-select>
                  </v-col>

                  <!-- 契約年数 -->
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="formData.locationInfo.contractDuration"
                      label="契約年数（何年前の契約か）"
                      :items="contractDurationOptions"
                      outlined
                      dense
                      hide-details
                      prepend-inner-icon="mdi-clock-outline"
                    ></v-select>
                  </v-col>

                  <!-- 開業時期 -->
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.locationInfo.openingDate"
                      label="開業時期"
                      outlined
                      dense
                      type="date"
                      prepend-inner-icon="mdi-store-plus"
                    ></v-text-field>
                  </v-col>

                  <!-- 現在の坪単価 -->
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.locationInfo.currentRentPerTsubo"
                      label="現在の坪単価"
                      outlined
                      dense
                      type="number"
                      suffix="円/坪"
                      prepend-inner-icon="mdi-trending-up"
                    ></v-text-field>
                  </v-col>

                  <!-- 場所の条件 -->
                  <v-col cols="12">
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
                  </v-col>

                  <!-- 開業投資額 -->
                  <v-col cols="12" sm="6">
                    <v-slider
                      v-model="formData.locationInfo.initialInvestment"
                      :max="5000"
                      :min="0"
                      :step="10"
                                            class="mt-4"
                    ></v-slider>
                    <div class="text-center">開業投資額: {{ formData.locationInfo.initialInvestment }}万円</div>
                  </v-col>

                  <!-- 投資回収状況 -->
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="formData.locationInfo.investmentRecovery"
                      label="投資回収状況"
                      :items="recoveryStatus"
                      outlined
                      dense
                      prepend-inner-icon="mdi-percent"
                    ></v-select>
                  </v-col>

                  <!-- 売上の現状 -->
                  <v-col cols="12">
                    <div class="text-subtitle-2 mb-2">売上の現状</div>
                    <v-slider
                      v-model="formData.locationInfo.currentRevenue"
                      :max="2000"
                      :min="0"
                      :step="10"
                                            class="mt-4"
                    ></v-slider>
                    <div class="text-center text-h6">{{ formData.locationInfo.currentRevenue }}万円</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <div class="mb-4">
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
            </div>
            <!-- 設備の状態 -->
            <v-card outlined class="mb-4 section-card">
              <v-card-title class="section-title">
                <v-icon left size="24" class="mr-2">mdi-wrench</v-icon>
                設備の状態
              </v-card-title>
              <v-card-text class="pt-6">
                <!-- 何年前に導入したか -->
                <div class="mb-4">
                  <v-select
                    v-model="formData.equipment.equipmentAge"
                    label="何年前に導入したか"
                    :items="equipmentAgeOptions"
                    :rules="[rules.required]"
                    outlined
                    dense
                    prepend-inner-icon="mdi-clock-outline"
                    required
                  >
                    <template v-slot:label>
                      何年前に導入したか <span class="red--text">*</span>
                    </template>
                  </v-select>
                </div>

                <!-- 内装にどのくらいかけたか -->
                <div class="mb-4">
                  <div class="text-subtitle-2 mb-2">
                    <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
                    内装にどのくらいかけたか
                  </div>
                  <v-slider
                    v-model="formData.equipment.interiorCost"
                    :max="5000"
                    :min="0"
                    :step="10"
                                      ></v-slider>
                  <div class="text-center text-h6">{{ formData.equipment.interiorCost }}万円</div>
                </div>

                <!-- 故障・リースの有無 -->
                <div class="mb-4">
                  <v-select
                    v-model="formData.equipment.issueStatus"
                    label="故障・リースの有無"
                    :items="equipmentIssues"
                    :rules="[rules.required]"
                    multiple
                    chips
                    small-chips
                    deletable-chips
                    outlined
                    dense
                    prepend-inner-icon="mdi-alert-circle-outline"
                    required
                  >
                    <template v-slot:label>
                      故障・リースの有無 <span class="red--text">*</span>
                    </template>
                  </v-select>
                </div>

                <!-- 入居時いくらかかったか -->
                <div class="mb-4">
                  <div class="text-subtitle-2 mb-2">
                    <v-icon small color="error" class="mr-1">mdi-asterisk</v-icon>
                    入居時いくらかかったか
                  </div>
                  <v-slider
                    v-model="formData.equipment.moveInCost"
                    :max="3000"
                    :min="0"
                    :step="10"
                                      ></v-slider>
                  <div class="text-center text-h6">{{ formData.equipment.moveInCost }}万円</div>
                </div>
              </v-card-text>
            </v-card>

            <!-- 今の売上情報 -->
            <v-card outlined class="mb-4 section-card">
              <v-card-title class="section-title">
                <v-icon left size="24" class="mr-2">mdi-chart-line</v-icon>
                今の売上情報
              </v-card-title>

              <v-card-text class="pt-6">
                <!-- 1段目：設備情報 / 営業日数 -->
                <v-row>
                  <!-- 左列：設備情報（そのまま） -->
                  <v-col cols="12" md="6">
                    <div class="text-subtitle-2 mb-3">
                      <v-icon small color="primary" class="mr-1">mdi-wrench</v-icon>
                      設備情報
                    </div>

                    <!-- 設備の状況（複数選択） -->
                    <v-select
                      v-model="formData.equipment.equipmentStatus"
                      label="設備の状況"
                      :items="equipmentStatusOptions"
                      multiple
                      chips
                      small-chips
                      deletable-chips
                      outlined
                      dense
                      prepend-inner-icon="mdi-cog"
                      class="mb-4"
                    />

                    <!-- 詳細入力フィールド -->
                    <v-text-field
                      v-if="formData.equipment.equipmentStatus.includes('譲渡しない設備あり')"
                      v-model="formData.equipment.nonTransferableDetails"
                      label="譲渡しない設備の詳細"
                      outlined dense class="mb-3" placeholder="詳細を入力"
                    />
                    <v-text-field
                      v-if="formData.equipment.equipmentStatus.includes('故障している設備あり')"
                      v-model="formData.equipment.brokenDetails"
                      label="故障設備の詳細"
                      outlined dense class="mb-3" placeholder="故障箇所・内容を入力"
                    />
                    <v-text-field
                      v-if="formData.equipment.equipmentStatus.includes('リースの残債がある設備あり')"
                      v-model="formData.equipment.leaseDebtDetails"
                      label="リース残債の詳細"
                      outlined dense class="mb-3" placeholder="残債額・期間など"
                    />
                    <v-text-field
                      v-if="formData.equipment.equipmentStatus.includes('貸主設備あり')"
                      v-model="formData.equipment.landlordEquipmentDetails"
                      label="貸主設備の詳細"
                      outlined dense class="mb-3" placeholder="設備名・仕様など"
                    />
                  </v-col>

                  <!-- 右列：営業日数のみ -->
                  <v-col cols="12" md="6">
                    <div class="text-subtitle-2 mb-3">
                      <v-icon small color="primary" class="mr-1">mdi-calendar</v-icon>
                      営業情報
                    </div>

                    <v-select
                      v-model="formData.salesInfo.operatingDays"
                      label="営業日数（月間）"
                      :items="operatingDaysOptions"
                      :rules="[rules.required]"
                      outlined dense prepend-inner-icon="mdi-calendar"
                      required class="mb-4"
                    >
                      <template v-slot:label>
                        営業日数（月間） <span class="red--text">*</span>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>

                <!-- 2段目：利益率（左だけ使う / 右は空白） -->
                <v-row class="mt-2">
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.salesInfo.profitMargin"
                      label="売上に対する利益率"
                      :items="profitMargins"
                      :rules="[rules.required]"
                      outlined dense prepend-inner-icon="mdi-percent"
                      required
                    >
                      <template v-slot:label>
                        売上に対する利益率 <span class="red--text">*</span>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="6"><!-- 空白 --></v-col>
                </v-row>

                <!-- 3段目：良い時 / 悪い時 を左右で並べる -->
                <v-row class="mt-2">
                  <v-col cols="12" md="6">
                    <div class="text-subtitle-2 mb-2">良い時の売上</div>
                    <v-slider
                      v-model="formData.salesInfo.goodRevenue"
                      :max="5000" :min="0" :step="10"
                      :thumb-label="false"
                    />
                    <div class="text-center">
                      {{ formData.salesInfo.goodRevenue === 0 ? '0円' : `${formData.salesInfo.goodRevenue}万円` }}
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="text-subtitle-2 mb-2">悪い時の売上</div>
                    <v-slider
                      v-model="formData.salesInfo.badRevenue"
                      :max="5000" :min="0" :step="10"
                      :thumb-label="false"
                    />
                    <div class="text-center">
                      {{ formData.salesInfo.badRevenue === 0 ? '0円' : `${formData.salesInfo.badRevenue}万円` }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>


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
            <!-- 売上情報 -->
            <v-card outlined class="mb-4 section-card">
              <v-card-title class="section-title">
                <v-icon left size="24" class="mr-2">mdi-cash</v-icon>
                売上情報
              </v-card-title>
              <v-card-text class="pt-6">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.recruitment.highSales"
                      label="良かった時の月商"
                      outlined
                      dense
                      type="number"
                      suffix="万円"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.recruitment.lowSales"
                      label="悪かった時の月商"
                      outlined
                      dense
                      type="number"
                      suffix="万円"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-textarea
                  v-model="formData.recruitment.salesMemo"
                  label="売上に関するメモ"
                  outlined
                  dense
                  rows="2"
                ></v-textarea>
              </v-card-text>
            </v-card>

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

            <!-- 売却戦略 -->
            <v-card outlined class="mb-4 section-card">
              <v-card-title class="section-title">
                <v-icon left size="24" class="mr-2">mdi-handshake</v-icon>
                希望する売却戦略
              </v-card-title>
              <v-card-text class="pt-6">
                <div class="mb-4">
                  <v-select
                    v-model="formData.recruitment.sellingStrategy"
                    label="売却方針"
                    :items="['高値でゆっくり売りたい', '安くても早く売りたい']"
                    :rules="[rules.required]"
                    outlined
                    dense
                    prepend-inner-icon="mdi-handshake"
                    required
                  >
                    <template v-slot:label>
                      売却方針 <span class="red--text">*</span>
                    </template>
                  </v-select>
                </div>
                <v-textarea
                  v-model="formData.recruitment.specialConditions"
                  label="特殊条件"
                  outlined
                  dense
                  rows="3"
                  placeholder="例: 名義変更・従業員の引継ぎなど"
                ></v-textarea>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.recruitment.sellingPrice"
                      label="販売価格"
                      outlined
                      dense
                      type="number"
                      prefix="¥"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.recruitment.listingPrice"
                      label="募集価格"
                      outlined
                      dense
                      type="number"
                      prefix="¥"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

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

// テスト段階のため認証チェックをスキップ
// 本番環境では以下のコメントを外して認証を有効化
/*
const authStore = useAuthStore()
if (!authStore.isAuthenticated) {
  await navigateTo('/admin/login')
}
*/

// フォーム全体の状態
const formValid = ref(false)
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
const equipmentAgeOptions = ['1年前', '2年前', '3年前', '4年前', '5年前', '6年前', '7年前', '8年前', '9年前', '10年以上前']
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
    contractDuration: '',
    currentRentPerTsubo: 0,
    locationConditions: [],
    openingDate: '',
    initialInvestment: 0,
    investmentRecovery: '',
    currentRevenue: 0
  },
  // 売上情報
  salesInfo: {
    operatingDays: '',
    goodRevenue: 0,
    badRevenue: 0,
    profitMargin: ''
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
    equipmentAge: '',
    interiorCost: 0,
    issueStatus: [],
    moveInCost: 0,
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
    contractPhotos: []
  },
  // セクション5: 連絡窓口
  externalContacts: []
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

// 坪単価の自動計算
const calculateRentPerTsubo = computed(() => {
  const rent = Number(formData.value.locationInfo.rent)
  const area = Number(formData.value.locationInfo.area)
  if (rent > 0 && area > 0) {
    return Math.round(rent / area).toLocaleString()
  }
  return '0'
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
})

// ページタイトル
useHead({
  title: '店舗売却ヒアリングシート - 営業入力フォーム'
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