<template>
  <v-container class="pa-4" style="max-width: 1400px;">
    <!-- ヘッダー -->
    <v-card class="mb-4">
      <v-card-title class="text-h5 font-weight-bold text-white" style="background: linear-gradient(135deg, #1e50a2 0%, #154a8a 100%); color: white;">
        <v-icon start color="white">mdi-clipboard-list-outline</v-icon>
        店舗売却ヒアリングシート
      </v-card-title>
      
      <!-- 進捗バー -->
      <v-card-text class="pb-0">
        <div class="d-flex align-center mb-2">
          <span class="text-caption grey--text">入力進捗</span>
          <v-spacer></v-spacer>
          <span class="text-caption font-weight-bold">{{ progressPercentage }}%</span>
        </div>
        <v-progress-linear
          :value="progressPercentage"
          height="8"
          rounded
          :color="progressPercentage === 100 ? 'success' : 'primary'"
        ></v-progress-linear>
        <div class="text-caption grey--text mt-1">
          完了セクション: {{ sections.filter(s => getCompletionStatus(s.key)).length }} / {{ sections.length }}
        </div>
      </v-card-text>
    </v-card>

    <!-- タブナビゲーション -->
    <v-card class="mb-4">
      <v-tabs
        v-model="currentTab"
        grow
        show-arrows
        slider-color="primary"
        class="tabs-header header-tabs"
      >
        <v-tab
          v-for="(section, index) in sections"
          :key="index"
          :value="index"
          stacked
          class="tab-item"
          :class="{ 'tab-completed': getCompletionStatus(section.key) }"
        >
          <v-icon 
            :color="getTabIconColor(section.key, index)" 
            size="22"
            class="mb-1"
          >
            {{ getCompletionStatus(section.key) ? 'mdi-check-circle' : section.icon }}
          </v-icon>
          <span class="text-caption text-medium-emphasis">{{ section.title }}</span>
        </v-tab>
      </v-tabs>
    </v-card>

    <!-- メインフォーム -->
    <v-form ref="mainForm" v-model="formValid">
      <v-window v-model="currentTab" class="tab-content">
        <!-- セクション1: 連絡先・現状の把握 -->
        <v-window-item :value="0">
            <!-- 連絡先 -->
            <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-phone-outline</v-icon>
                連絡先
              </v-card-title>
              <v-card-text>
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
            <v-card outlined>
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-chart-line</v-icon>
                現状の把握
              </v-card-title>
              <v-card-text>
                <!-- 売却理由 -->
                <div class="mb-6">
                  <v-select
                    v-model="formData.status.reasonsForSale"
                    label="売却理由"
                    :items="saleReasons"
                    multiple
                    chips
                    small-chips
                    deletable-chips
                    outlined
                    dense
                    hide-details
                  ></v-select>
                  <v-text-field
                    v-if="formData.status.reasonsForSale.includes('その他')"
                    v-model="formData.status.reasonOtherText"
                    label="その他の詳細"
                    outlined
                    dense
                    class="mt-3"
                    placeholder="詳細を入力してください"
                  ></v-text-field>
                </div>

                <!-- メモ -->
                <v-textarea
                  v-model="formData.status.memo"
                  label="メモ"
                  outlined
                  dense
                  rows="3"
                  prepend-inner-icon="mdi-note-text"
                  placeholder="特記事項があれば記入してください"
                ></v-textarea>

                <!-- 解約通知状況 -->
                <div class="mb-6">
                  <v-select
                    v-model="formData.status.noticeStatus"
                    label="解約通知状況"
                    :items="['未提出', '提出予定', '提出済み']"
                    outlined
                    dense
                    hide-details
                  ></v-select>
                  <v-row v-if="formData.status.noticeStatus !== '未提出'" class="mt-3">
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.status.submissionMonth"
                        label="提出月"
                        outlined
                        dense
                        type="month"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.status.exitMonth"
                        label="退去月"
                        outlined
                        dense
                        type="month"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>

                <!-- 貸主への引継ぎ承諾 -->
                <v-row class="mb-6">
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="formData.status.handoverApproval"
                      label="貸主への引継ぎ承諾"
                      :items="['引継ぎ不可', '未確認', '確認中', '承諾済み(家主)', '承諾済み(管理会社)']"
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="formData.status.employeeNotificationStatus"
                      label="従業員への告知状況"
                      :items="['未告知', '告知済み', '告知予定']"
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>

                <!-- 告知予定日 -->
                <v-text-field
                  v-if="formData.status.employeeNotificationStatus === '告知予定'"
                  v-model="formData.status.employeeNotificationDate"
                  label="従業員への告知予定日"
                  outlined
                  dense
                  type="date"
                  class="mb-6"
                ></v-text-field>

                <!-- 売却依頼先 -->
                <div class="mb-6">
                  <v-checkbox
                    v-model="formData.status.hasBroker"
                    label="売却依頼先あり"
                    hide-details
                  ></v-checkbox>
                  <v-row v-if="formData.status.hasBroker" class="mt-3">
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.status.brokerName"
                        label="依頼先"
                        outlined
                        dense
                        placeholder="会社名・担当者名"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.status.brokerListingPrice"
                        label="募集金額"
                        outlined
                        dense
                        type="number"
                        prefix="¥"
                        placeholder="0"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>

                <!-- 希望売却時期・価格 -->
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.status.desiredSaleDate"
                      label="希望売却時期"
                      outlined
                      dense
                      placeholder="例: 2024年3月末"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.status.desiredSalePrice"
                      label="希望売却価格"
                      outlined
                      dense
                      type="number"
                      prefix="¥"
                      placeholder="0"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- 買主条件 -->
                <div class="mb-6">
                  <v-checkbox
                    v-model="formData.status.hasBuyerConditions"
                    label="買主条件あり"
                    hide-details
                  ></v-checkbox>
                  <v-text-field
                    v-if="formData.status.hasBuyerConditions"
                    v-model="formData.status.buyerConditionsText"
                    label="条件詳細"
                    outlined
                    dense
                    class="mt-3"
                    placeholder="例: 個人・法人・業態など"
                  ></v-text-field>
                </div>

                <!-- 今後の営業 -->
                <div>
                  <v-select
                    v-model="formData.status.futureBusinessPlan"
                    label="今後の営業"
                    :items="['売却先が見つかるまで続ける', '閉店予定時期は決まっている', '閉店している']"
                    outlined
                    dense
                    hide-details
                  ></v-select>
                </div>
              </v-card-text>
            </v-card>
        </v-window-item>

        <!-- セクション2: 基本情報 -->
        <v-window-item :value="1">
            <v-row>
              <!-- 営業年数 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.basicInfo.yearsInBusiness"
                  label="営業年数"
                  outlined
                  dense
                  suffix="年"
                  type="number"
                ></v-text-field>
              </v-col>

              <!-- 入居時の引渡し状態 -->
              <v-col cols="12" sm="6">
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
              </v-col>

              <!-- 前テナント情報 -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.basicInfo.previousTenantInfo"
                  label="前テナント情報"
                  outlined
                  dense
                  placeholder="業態・店舗名など"
                ></v-text-field>
              </v-col>

              <!-- 入居時の条件交渉 -->
              <v-col cols="12">
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
              </v-col>

              <!-- 物件の利用制限 -->
              <v-col cols="12">
                <v-text-field
                  v-model="formData.basicInfo.usageRestrictions"
                  label="物件の利用制限"
                  outlined
                  dense
                  placeholder="例: 営業時間・業種制限など"
                ></v-text-field>
              </v-col>

              <!-- 図面について -->
              <v-col cols="12">
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
              </v-col>

              <!-- 貸主のインボイス登録 -->
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.basicInfo.landlordInvoiceStatus"
                  label="貸主のインボイス登録状況"
                  :items="['登録済み', '未登録']"
                  outlined
                  dense
                  hide-details
                ></v-select>
              </v-col>

              <!-- 電気・ガス・水道の契約 -->
              <v-col cols="12">
                <v-divider class="my-4"></v-divider>
                <div class="text-subtitle-1 mb-4">
                  <v-icon left size="20">mdi-power-plug</v-icon>
                  光熱費の契約状況
                </div>
              </v-col>

              <!-- 電気・ガス・水道を横並び -->
              <v-col cols="12" sm="4">
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
              </v-col>

              <!-- お客様番号（直接契約の場合） -->
              <v-col cols="12" sm="4" v-if="formData.basicInfo.electricityContract === '直接契約'">
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
              </v-col>

              <!-- ゴミ出し -->
              <v-col cols="12">
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
              </v-col>

              <!-- その他費用 -->
              <v-col cols="12">
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
              </v-col>

              <!-- 事前申告事項 -->
              <v-col cols="12">
                <v-textarea
                  v-model="formData.basicInfo.declarations"
                  label="事前申告事項"
                  outlined
                  dense
                  rows="3"
                  placeholder="例: 家賃滞納・近隣トラブル・家主変更など"
                ></v-textarea>
              </v-col>

              <!-- 後継テナントの新条件 -->
              <v-col cols="12">
                <v-textarea
                  v-model="formData.basicInfo.newTenantConditions"
                  label="後継テナントの新条件"
                  outlined
                  dense
                  rows="3"
                  placeholder="例: 既に貸主から後継テナントの新条件を聞いている場合"
                ></v-textarea>
              </v-col>
            </v-row>
        </v-window-item>

        <!-- セクション3: 設備の確認 -->
        <v-window-item :value="2">
            <!-- 工事費用 -->
            <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-currency-usd</v-icon>
                工事費用
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="formData.equipment.interiorCost"
                      label="内装費"
                      outlined
                      dense
                      type="number"
                      prefix="¥"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="formData.equipment.facilityCost"
                      label="設備費"
                      outlined
                      dense
                      type="number"
                      prefix="¥"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="formData.equipment.additionalRenovationCost"
                      label="追加リフォーム費"
                      outlined
                      dense
                      type="number"
                      prefix="¥"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="formData.equipment.renovationYear"
                      label="実施年"
                      outlined
                      dense
                      placeholder="例: 2020年"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- 設備状況 -->
            <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-clipboard-check</v-icon>
                設備状況
              </v-card-title>
              <v-card-text>
                <!-- 譲渡しない設備 -->
                <v-checkbox
                  v-model="formData.equipment.hasNonTransferable"
                  label="譲渡しない設備あり"
                  hide-details
                ></v-checkbox>
                <v-text-field
                  v-if="formData.equipment.hasNonTransferable"
                  v-model="formData.equipment.nonTransferableDetails"
                  label="譲渡しない設備の詳細"
                  outlined
                  dense
                  class="mt-3 mb-4"
                ></v-text-field>

                <!-- 故障している設備 -->
                <v-checkbox
                  v-model="formData.equipment.hasBroken"
                  label="故障している設備あり"
                  hide-details
                ></v-checkbox>
                <v-text-field
                  v-if="formData.equipment.hasBroken"
                  v-model="formData.equipment.brokenDetails"
                  label="故障設備の詳細"
                  outlined
                  dense
                  class="mt-3 mb-4"
                ></v-text-field>

                <!-- リースの残債がある設備 -->
                <v-checkbox
                  v-model="formData.equipment.hasLeaseDebt"
                  label="リースの残債がある設備あり"
                  hide-details
                ></v-checkbox>
                <v-text-field
                  v-if="formData.equipment.hasLeaseDebt"
                  v-model="formData.equipment.leaseDebtDetails"
                  label="リース残債の詳細"
                  outlined
                  dense
                  class="mt-3 mb-4"
                ></v-text-field>

                <!-- 貸主設備 -->
                <v-checkbox
                  v-model="formData.equipment.hasLandlordEquipment"
                  label="貸主設備あり"
                  hide-details
                ></v-checkbox>
                <v-text-field
                  v-if="formData.equipment.hasLandlordEquipment"
                  v-model="formData.equipment.landlordEquipmentDetails"
                  label="貸主設備の詳細"
                  outlined
                  dense
                  class="mt-3 mb-4"
                ></v-text-field>

                <!-- 調理器具/皿/グラスと席数を横並び -->
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="formData.equipment.tablewareStatus"
                      label="調理器具やお皿グラスなどについて"
                      :items="['全て残置する', '全て撤去する', '一部撤去']"
                      outlined
                      dense
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.equipment.seatCount"
                      label="席数"
                      outlined
                      dense
                      suffix="席"
                      type="number"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- メモ -->
                <v-textarea
                  v-model="formData.equipment.memo"
                  label="設備に関するメモ"
                  outlined
                  dense
                  rows="3"
                ></v-textarea>
              </v-card-text>
            </v-card>

            <!-- 排気・排水設備 -->
            <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-air-filter</v-icon>
                排気・排水設備
              </v-card-title>
              <v-card-text>
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
            </v-card>

            <!-- メーター情報 -->
            <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-gauge</v-icon>
                メーター情報
              </v-card-title>
              <v-card-text>
                <!-- 電気メーター -->
                <div class="mb-4">
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
                </div>

                <!-- ガスメーター -->
                <div class="mb-4">
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
                </div>

                <!-- 水道メーター -->
                <div>
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
            </v-card>

            <!-- その他設備情報 -->
            <v-card outlined>
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-home-variant</v-icon>
                その他設備情報
              </v-card-title>
              <v-card-text>
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
                </v-row>

                <!-- 店舗の瑕疵と届出済みの許認可を横並び -->
                <v-row class="mb-4">
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
            </v-card>
        </v-window-item>

        <!-- セクション4: 募集に関わること -->
        <v-window-item :value="3">
            <!-- 売上情報 -->
            <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-cash</v-icon>
                売上情報
              </v-card-title>
              <v-card-text>
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
            <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-clock-outline</v-icon>
                営業情報
              </v-card-title>
              <v-card-text>
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
            </v-card>

            <!-- エリア・客層 -->
            <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-map-marker</v-icon>
                エリア・客層
              </v-card-title>
              <v-card-text>
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
            </v-card>

            <!-- アピールポイント -->
            <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-star</v-icon>
                おすすめポイント
              </v-card-title>
              <v-card-text>
                <v-textarea
                  v-model="formData.recruitment.appealPoints"
                  label="おすすめポイント"
                  outlined
                  dense
                  rows="4"
                  placeholder="物件の魅力・セールスポイントを記入"
                ></v-textarea>
              </v-card-text>
            </v-card>

            <!-- 売却条件 -->
            <v-card outlined class="mb-4">
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-handshake</v-icon>
                売却条件
              </v-card-title>
              <v-card-text>
                <div class="mb-4">
                  <v-select
                    v-model="formData.recruitment.priorityPoint"
                    label="最重要ポイント"
                    :items="['なるべく急ぎで売りたい', '金額も早さもバランスよく売りたい', '急いでないのでじっくり高く売りたい']"
                    outlined
                    dense
                    hide-details
                  ></v-select>
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
            <v-card outlined>
              <v-card-title class="text-subtitle-1 grey lighten-4">
                <v-icon left size="20">mdi-eye</v-icon>
                内覧・掲載条件
              </v-card-title>
              <v-card-text>
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
            </v-card>
        </v-window-item>

        <!-- セクション5: 連絡窓口 -->
        <v-window-item :value="4">
            <v-card
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
              <v-card-text>
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
            </v-btn>
        </v-window-item>
      </v-window>
    </v-form>
    
    <!-- FormButtons コンポーネント -->
    <FormButtons
      :is-first="currentTab === 0"
      :is-last="currentTab === sections.length - 1"
      :show-save-button="true"
      :is-saving="submitting"
      :is-processing="submitting"
      :can-proceed="formValid"
      complete-label="登録完了"
      @back="previousTab"
      @next="nextTab"
      @save="saveDraft"
      @submit="submitForm"
    />


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
import FormButtons from '@/components/shared/FormButtons.vue'
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

// 現在のタブ
const currentTab = ref(0)

// セクション定義
const sections = [
  {
    title: '基本情報',
    subtitle: '連絡先・売却理由',
    icon: 'mdi-account-details',
    key: 'contact'
  },
  {
    title: '店舗情報',
    subtitle: '物件・契約の詳細',
    icon: 'mdi-store',
    key: 'basicInfo'
  },
  {
    title: '設備情報',
    subtitle: '設備・工事費用',
    icon: 'mdi-tools',
    key: 'equipment'
  },
  {
    title: '売上情報',
    subtitle: '売上・営業データ',
    icon: 'mdi-chart-line',
    key: 'recruitment'
  },
  {
    title: '連絡先',
    subtitle: '関係者連絡先',
    icon: 'mdi-contacts',
    key: 'externalContacts'
  }
]

// バリデーションルール
const rules = {
  required: (v: any) => !!v || 'この項目は必須です',
  email: (v: string) => /.+@.+\..+/.test(v) || 'メールアドレスの形式が正しくありません',
  phone: (v: string) => !v || /^[0-9-]+$/.test(v) || '電話番号の形式が正しくありません'
}

// 選択肢データ
const saleReasons = ['売上不振', '事業縮小', '人材不足', '他事業に注力', '引退', 'その他']
const areaTypes = ['住宅街', '繁華街', 'ビジネス街', '学生街']
const customerSegments = ['若者', '中高年', '高齢者', '外国人', '学生', 'ビジネスマン', 'ファミリー']
const storeDefects = ['なし', '雨漏り', '水漏れ', '騒音問題', 'その他']
const permits = ['保健所', '消防署', '警察署']

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
    reasonsForSale: [],
    reasonOtherText: '',
    memo: '',
    noticeStatus: '',
    submissionMonth: '',
    exitMonth: '',
    handoverApproval: '',
    employeeNotificationStatus: '',
    employeeNotificationDate: '',
    hasBroker: false,
    brokerName: '',
    brokerListingPrice: '',
    desiredSaleDate: '',
    desiredSalePrice: '',
    hasBuyerConditions: false,
    buyerConditionsText: '',
    futureBusinessPlan: ''
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
    interiorCost: '',
    facilityCost: '',
    additionalRenovationCost: '',
    renovationYear: '',
    hasNonTransferable: false,
    nonTransferableDetails: '',
    hasBroken: false,
    brokenDetails: '',
    hasLeaseDebt: false,
    leaseDebtDetails: '',
    hasLandlordEquipment: false,
    landlordEquipmentDetails: '',
    tablewareStatus: '',
    seatCount: '',
    memo: '',
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
    progressReportMethod: ''
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

// タブナビゲーション
const nextTab = () => {
  if (currentTab.value < sections.length - 1) {
    currentTab.value++
  }
}

const previousTab = () => {
  if (currentTab.value > 0) {
    currentTab.value--
  }
}

// タブアイコンの色を取得
const getTabIconColor = (sectionKey: string, index: number) => {
  if (getCompletionStatus(sectionKey)) {
    return 'success'
  } else if (currentTab.value === index) {
    return 'primary'
  } else {
    return 'grey'
  }
}

// 進捗計算
const totalRequiredFields = computed(() => {
  return 3 // 氏名、住所、連絡先
})

const requiredFieldsCompleted = computed(() => {
  let count = 0
  if (formData.value.contact.ownerName) count++
  if (formData.value.contact.address) count++
  if (formData.value.contact.phoneNumber) count++
  return count
})

const progressPercentage = computed(() => {
  // タブベースの進捗計算
  const completedSections = sections.filter(section => getCompletionStatus(section.key)).length
  return Math.round((completedSections / sections.length) * 100)
})

// セクション完了状態
const getCompletionStatus = (section: string) => {
  switch (section) {
    case 'contact':
      return formData.value.contact.ownerName && 
             formData.value.contact.address && 
             formData.value.contact.phoneNumber
    case 'basicInfo':
      return formData.value.basicInfo.yearsInBusiness !== ''
    case 'equipment':
      return formData.value.equipment.seatCount !== ''
    case 'recruitment':
      return formData.value.recruitment.priorityPoint !== ''
    case 'externalContacts':
      return formData.value.externalContacts.length > 0
    default:
      return false
  }
}

// セクション進捗表示
const getSectionProgress = (section: string) => {
  const completed = getCompletionStatus(section)
  return completed ? '完了' : '未完了'
}

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
  window.location.reload()
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
.tabs-header {
  background: white;
  border-radius: 8px 8px 0 0;
}

.header-tabs { 
  min-height: 68px; 
}

.header-tabs .v-tab { 
  padding-top: 6px; 
  padding-bottom: 6px; 
}

.tab-item {
  min-height: 80px;
  padding: 8px;
  white-space: nowrap;
}

.tab-completed {
  background-color: rgba(76, 175, 80, 0.1);
}

.tab-content {
  min-height: 400px;
  padding: 24px;
  background: white;
  border-radius: 0 0 8px 8px;
}

.v-card {
  border-radius: 8px;
}

.v-text-field--outlined >>> fieldset {
  border-color: #e0e0e0;
}

.v-text-field--outlined:hover >>> fieldset {
  border-color: #bdbdbd;
}

@media (max-width: 600px) {
  .v-expansion-panel-content >>> .v-expansion-panel-content__wrap {
    padding: 16px;
  }
}
</style>