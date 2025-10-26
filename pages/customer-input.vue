<template>
  <v-container class="px-4 pt-16 pt-md-8 pb-4 customer-input-container" style="max-width: 1400px;">
    <!-- ヘッダー -->
    <div class="sticky-stack">
      <v-card class="mb-4 elevation-2 sticky-card">
        <v-card-title
          class="text-h6 font-weight-bold text-white d-flex align-center"
          style="background: linear-gradient(135deg, #1e50a2 0%, #154a8a 100%); min-height: 48px; padding: 12px 16px;"
        >
          <v-icon size="24" class="mr-2" style="color: white !important;">mdi-file-document-edit-outline</v-icon>
          お客様情報入力フォーム
        </v-card-title>
      </v-card>
    </div>

    <v-form ref="customerForm" v-model="formValid">
      <!-- 物件・契約情報 -->
      <v-card outlined class="mt-8 mt-md-4 mb-4 section-card">
        <v-card-title class="section-title">
          <v-icon left size="24" class="mr-2">mdi-home-outline</v-icon>
          物件・契約情報
        </v-card-title>
        <v-card-text class="pt-6">
          <v-row>
            <!-- 前テナント情報 -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.property.previousTenantInfo"
                label="前テナント情報について教えてください"
                outlined
                dense
                rows="3"
                prepend-inner-icon="mdi-information-outline"
                placeholder="前テナントに関する情報をご記入ください"
              ></v-textarea>
            </v-col>

            <!-- 契約時の条件交渉 -->
            <v-col cols="12">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-handshake-outline</v-icon>
                契約時の条件交渉について教えてください
              </div>
              <div class="text-caption mb-2 grey--text">例）賃料減額など</div>
              <v-radio-group v-model="formData.property.negotiation.status" row>
                <v-radio label="なし" value="なし"></v-radio>
                <v-radio label="あり" value="あり"></v-radio>
              </v-radio-group>
              <v-text-field
                v-if="formData.property.negotiation.status === 'あり'"
                v-model="formData.property.negotiation.detail"
                label="詳細"
                outlined
                dense
                class="mt-2"
                placeholder="条件交渉の内容を記入してください"
              ></v-text-field>
            </v-col>

            <!-- 物件の利用制限 -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.property.usageRestrictions"
                label="物件の利用制限について教えてください"
                outlined
                dense
                rows="3"
                prepend-inner-icon="mdi-alert-circle-outline"
                placeholder="例）営業時間・業種制限など"
              ></v-textarea>
            </v-col>

            <!-- 面図 -->
            <v-col cols="12">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-floor-plan</v-icon>
                面図について教えてください
              </div>
              <div class="text-caption mb-2 grey--text">例）平面図・給排水図面など</div>
              <v-radio-group v-model="formData.property.floorPlan.status" row>
                <v-radio label="なし" value="なし"></v-radio>
                <v-radio label="あり" value="あり"></v-radio>
              </v-radio-group>
              <v-text-field
                v-if="formData.property.floorPlan.status === 'あり'"
                v-model="formData.property.floorPlan.detail"
                label="詳細"
                outlined
                dense
                class="mt-2"
                placeholder="面図の種類を記入してください"
              ></v-text-field>
            </v-col>

            <!-- 貸主のインボイス登録状況 -->
            <v-col cols="12">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-file-document-outline</v-icon>
                貸主のインボイス登録状況について教えてください
              </div>
              <v-radio-group v-model="formData.property.invoiceRegistration.status" row>
                <v-radio label="登録済み" value="登録済み"></v-radio>
                <v-radio label="未登録" value="未登録"></v-radio>
              </v-radio-group>
              <v-text-field
                v-if="formData.property.invoiceRegistration.status === '未登録'"
                v-model="formData.property.invoiceRegistration.detail"
                label="詳細"
                outlined
                dense
                class="mt-2"
                placeholder="未登録の理由などを記入してください"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ライフライン・契約情報 -->
      <v-card outlined class="mb-4 section-card">
        <v-card-title class="section-title">
          <v-icon left size="24" class="mr-2">mdi-lightning-bolt-outline</v-icon>
          ライフライン・契約情報
        </v-card-title>
        <v-card-text class="pt-6">
          <v-row>
            <!-- 電気の契約状況 -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-flash</v-icon>
                電気の契約状況と支払いについて教えてください
              </div>
              <v-radio-group v-model="formData.utilities.electricity.contractType" column>
                <v-radio label="家主検針" value="家主検針"></v-radio>
                <v-radio label="直接契約（関電・新電力）" value="直接契約"></v-radio>
              </v-radio-group>
              <v-text-field
                v-if="formData.utilities.electricity.contractType === '直接契約'"
                v-model="formData.utilities.electricity.customerNumber"
                label="お客様番号"
                outlined
                dense
                class="mt-2"
                prepend-inner-icon="mdi-identifier"
              ></v-text-field>
            </v-col>

            <!-- ガスの契約状況 -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-fire</v-icon>
                ガスの契約状況と支払いについて教えてください
              </div>
              <v-radio-group v-model="formData.utilities.gas.contractType" column>
                <v-radio label="家主検針" value="家主検針"></v-radio>
                <v-radio label="直接契約（都市ガス・プロパン）" value="直接契約"></v-radio>
              </v-radio-group>
              <v-text-field
                v-if="formData.utilities.gas.contractType === '直接契約'"
                v-model="formData.utilities.gas.customerNumber"
                label="お客様番号"
                outlined
                dense
                class="mt-2"
                prepend-inner-icon="mdi-identifier"
              ></v-text-field>
            </v-col>

            <!-- 水道の契約状況 -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-water</v-icon>
                水道の契約状況と支払いについて教えてください
              </div>
              <v-radio-group v-model="formData.utilities.water.contractType" column>
                <v-radio label="家主検針" value="家主検針"></v-radio>
                <v-radio label="直接契約" value="直接契約"></v-radio>
              </v-radio-group>
              <v-text-field
                v-if="formData.utilities.water.contractType === '直接契約'"
                v-model="formData.utilities.water.customerNumber"
                label="お客様番号"
                outlined
                dense
                class="mt-2"
                prepend-inner-icon="mdi-identifier"
              ></v-text-field>
            </v-col>

            <!-- ゴミ出し方法 -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-3">
                <v-icon small class="mr-1">mdi-delete-outline</v-icon>
                ゴミ出し方法について教えてください
              </div>
              <v-text-field
                v-model="formData.utilities.garbage.rules"
                label="規則"
                outlined
                dense
                class="mb-3"
                prepend-inner-icon="mdi-clipboard-text-outline"
              ></v-text-field>
              <v-text-field
                v-model="formData.utilities.garbage.cost"
                label="費用"
                outlined
                dense
                prepend-inner-icon="mdi-currency-jpy"
              ></v-text-field>
            </v-col>

            <!-- その他費用 -->
            <v-col cols="12">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-cash-multiple</v-icon>
                その他費用について教えてください
              </div>
              <div class="text-caption mb-2 grey--text">例）商店街費・町内会費など</div>
              <v-radio-group v-model="formData.utilities.otherCosts.status" row>
                <v-radio label="なし" value="なし"></v-radio>
                <v-radio label="あり" value="あり"></v-radio>
              </v-radio-group>
              <v-text-field
                v-if="formData.utilities.otherCosts.status === 'あり'"
                v-model="formData.utilities.otherCosts.detail"
                label="詳細"
                outlined
                dense
                class="mt-2"
                placeholder="費用の種類と金額を記入してください"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 申告・条件情報 -->
      <v-card outlined class="mb-4 section-card">
        <v-card-title class="section-title">
          <v-icon left size="24" class="mr-2">mdi-alert-decagram-outline</v-icon>
          申告・条件情報
        </v-card-title>
        <v-card-text class="pt-6">
          <v-row>
            <!-- 事前申告 -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.disclosure.priorNotice"
                label="事前申告について教えてください"
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
                v-model="formData.disclosure.newConditions"
                label="新条件について教えてください"
                outlined
                dense
                rows="3"
                prepend-inner-icon="mdi-file-document-edit-outline"
                placeholder="例）既に貸主から後継テナントの新条件を聞いている場合"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 設備情報 -->
      <v-card outlined class="mb-4 section-card">
        <v-card-title class="section-title">
          <v-icon left size="24" class="mr-2">mdi-tools</v-icon>
          設備情報
        </v-card-title>
        <v-card-text class="pt-6">
          <v-row>
            <!-- 譲渡しない設備 -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-package-variant-closed-remove</v-icon>
                譲渡しない設備について教えてください
              </div>
              <v-radio-group v-model="formData.equipment.notTransfer.status" row>
                <v-radio label="なし" value="なし"></v-radio>
                <v-radio label="あり" value="あり"></v-radio>
              </v-radio-group>
              <v-text-field
                v-if="formData.equipment.notTransfer.status === 'あり'"
                v-model="formData.equipment.notTransfer.detail"
                label="詳細"
                outlined
                dense
                class="mt-2"
                placeholder="譲渡しない設備を記入してください"
              ></v-text-field>
            </v-col>

            <!-- 故障している設備 -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-wrench-clock</v-icon>
                故障している設備について教えてください
              </div>
              <v-radio-group v-model="formData.equipment.broken.status" row>
                <v-radio label="なし" value="なし"></v-radio>
                <v-radio label="あり" value="あり"></v-radio>
              </v-radio-group>
              <v-text-field
                v-if="formData.equipment.broken.status === 'あり'"
                v-model="formData.equipment.broken.detail"
                label="詳細"
                outlined
                dense
                class="mt-2"
                placeholder="故障している設備を記入してください"
              ></v-text-field>
            </v-col>

            <!-- リースの残債がある設備 -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-file-document-alert-outline</v-icon>
                リースの残債がある設備について教えてください
              </div>
              <v-radio-group v-model="formData.equipment.lease.status" row>
                <v-radio label="なし" value="なし"></v-radio>
                <v-radio label="あり" value="あり"></v-radio>
              </v-radio-group>
              <v-text-field
                v-if="formData.equipment.lease.status === 'あり'"
                v-model="formData.equipment.lease.detail"
                label="詳細"
                outlined
                dense
                class="mt-2"
                placeholder="リースの残債がある設備を記入してください"
              ></v-text-field>
            </v-col>

            <!-- 貸主設備 -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-account-tie-outline</v-icon>
                貸主設備について教えてください
              </div>
              <v-radio-group v-model="formData.equipment.landlordEquipment.status" row>
                <v-radio label="なし" value="なし"></v-radio>
                <v-radio label="あり" value="あり"></v-radio>
              </v-radio-group>
              <v-text-field
                v-if="formData.equipment.landlordEquipment.status === 'あり'"
                v-model="formData.equipment.landlordEquipment.detail"
                label="詳細"
                outlined
                dense
                class="mt-2"
                placeholder="貸主設備を記入してください"
              ></v-text-field>
            </v-col>

            <!-- 調理器具やお皿グラスなど -->
            <v-col cols="12">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-silverware-fork-knife</v-icon>
                調理器具やお皿グラスなどについて教えてください
              </div>
              <v-radio-group v-model="formData.equipment.kitchenware.status" column>
                <v-radio label="全て残置する" value="全て残置する"></v-radio>
                <v-radio label="全て持ち去る" value="全て持ち去る"></v-radio>
                <v-radio label="一部撤去" value="一部撤去"></v-radio>
              </v-radio-group>
              <v-text-field
                v-if="formData.equipment.kitchenware.status === '一部撤去'"
                v-model="formData.equipment.kitchenware.detail"
                label="詳細"
                outlined
                dense
                class="mt-2"
                placeholder="撤去する内容を記入してください"
              ></v-text-field>
            </v-col>

            <!-- 席数 -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.equipment.seats"
                label="席数について教えてください"
                outlined
                dense
                prepend-inner-icon="mdi-chair-rolling"
                placeholder="メモ"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 店舗設備詳細 -->
      <v-card outlined class="mb-4 section-card">
        <v-card-title class="section-title">
          <v-icon left size="24" class="mr-2">mdi-cog-outline</v-icon>
          店舗設備詳細
        </v-card-title>
        <v-card-text class="pt-6">
          <v-row>
            <!-- 排気設備の種類 -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-air-filter</v-icon>
                排気設備の種類について教えてください
              </div>
              <v-radio-group v-model="formData.facilityDetails.ventilation.type" row>
                <v-radio label="換気扇" value="換気扇"></v-radio>
                <v-radio label="ダクト" value="ダクト"></v-radio>
              </v-radio-group>
            </v-col>

            <!-- 排気ルート -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-directions-fork</v-icon>
                排気ルートについて教えてください
              </div>
              <v-select
                v-model="formData.facilityDetails.ventilation.route"
                :items="['店舗側面', '店舗前面', '店舗背面', '屋上']"
                outlined
                dense
                multiple
                chips
                small-chips
              ></v-select>
            </v-col>

            <!-- 排水設備の種類 -->
            <v-col cols="12">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-water-pump</v-icon>
                排水設備の種類について教えてください
              </div>
              <v-radio-group v-model="formData.facilityDetails.drainage.type" row>
                <v-radio label="グリストラップ（床下埋め込み・露出型）" value="グリストラップ"></v-radio>
                <v-radio label="ドライキッチン" value="ドライキッチン"></v-radio>
              </v-radio-group>
            </v-col>

            <!-- 電気メーターの場所と容量 -->
            <v-col cols="12">
              <div class="text-subtitle-2 mb-3">
                <v-icon small class="mr-1">mdi-flash-outline</v-icon>
                電気メーターの場所と電気と動力の容量について教えてください
              </div>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.facilityDetails.electricityMeter.location"
                    label="場所"
                    outlined
                    dense
                    prepend-inner-icon="mdi-map-marker"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.facilityDetails.electricityMeter.capacity"
                    label="電気容量"
                    outlined
                    dense
                    prepend-inner-icon="mdi-flash"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.facilityDetails.electricityMeter.powerCapacity"
                    label="動力容量"
                    outlined
                    dense
                    prepend-inner-icon="mdi-flash-circle"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>

            <!-- ガスメーターの場所と容量 -->
            <v-col cols="12">
              <div class="text-subtitle-2 mb-3">
                <v-icon small class="mr-1">mdi-fire-circle</v-icon>
                ガスメーターの場所とガスの容量について教えてください
              </div>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.facilityDetails.gasMeter.location"
                    label="場所"
                    outlined
                    dense
                    prepend-inner-icon="mdi-map-marker"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.facilityDetails.gasMeter.capacity"
                    label="ガス容量"
                    outlined
                    dense
                    prepend-inner-icon="mdi-fire"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>

            <!-- 水道メーターの場所と排水管の容量 -->
            <v-col cols="12">
              <div class="text-subtitle-2 mb-3">
                <v-icon small class="mr-1">mdi-water-outline</v-icon>
                水道メーターの場所と排水管の容量について教えてください
              </div>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.facilityDetails.waterMeter.location"
                    label="場所"
                    outlined
                    dense
                    prepend-inner-icon="mdi-map-marker"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.facilityDetails.waterMeter.drainageCapacity"
                    label="排水容量"
                    outlined
                    dense
                    prepend-inner-icon="mdi-water-pump"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>

            <!-- 室外機の場所 -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.facilityDetails.outsideWall"
                label="室外機の場所について教えてください"
                outlined
                dense
                rows="2"
                prepend-inner-icon="mdi-air-conditioner"
              ></v-textarea>
            </v-col>

            <!-- MDF盤の場所 -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.facilityDetails.mdfLocation"
                label="MDF盤の場所について教えてください"
                outlined
                dense
                prepend-inner-icon="mdi-network-outline"
                placeholder="場所"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 環境情報 -->
      <v-card outlined class="mb-4 section-card">
        <v-card-title class="section-title">
          <v-icon left size="24" class="mr-2">mdi-nature-people-outline</v-icon>
          環境情報
        </v-card-title>
        <v-card-text class="pt-6">
          <v-row>
            <!-- 店舗の瑕疵 -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-alert-circle-outline</v-icon>
                店舗の瑕疵について教えてください
              </div>
              <v-radio-group v-model="formData.environment.defect.status" column>
                <v-radio label="なし" value="なし"></v-radio>
                <v-radio label="雨漏り" value="雨漏り"></v-radio>
                <v-radio label="水漏れ" value="水漏れ"></v-radio>
                <v-radio label="騒音問題" value="騒音問題"></v-radio>
                <v-radio label="その他" value="その他"></v-radio>
              </v-radio-group>
              <v-text-field
                v-if="formData.environment.defect.status === 'その他'"
                v-model="formData.environment.defect.detail"
                label="詳細"
                outlined
                dense
                class="mt-2"
                placeholder="瑕疵の詳細を記入してください"
              ></v-text-field>
            </v-col>

            <!-- 届出済の許認可 -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">
                <v-icon small class="mr-1">mdi-file-certificate-outline</v-icon>
                届出済の許認可について教えてください
              </div>
              <v-select
                v-model="formData.environment.permits"
                :items="['保健所', '消防署', '警察署']"
                outlined
                dense
                multiple
                chips
                small-chips
                placeholder="該当する許認可を選択してください"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 送信ボタン -->
      <v-card outlined class="section-card">
        <v-card-text class="text-center py-6">
          <v-btn
            color="primary"
            size="large"
            elevation="2"
            :disabled="!formValid"
            @click="submitForm"
            class="px-8"
          >
            <v-icon left>mdi-check-circle-outline</v-icon>
            送信する
          </v-btn>
        </v-card-text>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// フォームのバリデーション状態
const formValid = ref(false)

// フォームデータ
const formData = ref({
  property: {
    previousTenantInfo: '',
    negotiation: {
      status: 'なし',
      detail: ''
    },
    usageRestrictions: '',
    floorPlan: {
      status: 'なし',
      detail: ''
    },
    invoiceRegistration: {
      status: '登録済み',
      detail: ''
    }
  },
  utilities: {
    electricity: {
      contractType: '家主検針',
      customerNumber: ''
    },
    gas: {
      contractType: '家主検針',
      customerNumber: ''
    },
    water: {
      contractType: '家主検針',
      customerNumber: ''
    },
    garbage: {
      rules: '',
      cost: ''
    },
    otherCosts: {
      status: 'なし',
      detail: ''
    }
  },
  disclosure: {
    priorNotice: '',
    newConditions: ''
  },
  equipment: {
    notTransfer: {
      status: 'なし',
      detail: ''
    },
    broken: {
      status: 'なし',
      detail: ''
    },
    lease: {
      status: 'なし',
      detail: ''
    },
    landlordEquipment: {
      status: 'なし',
      detail: ''
    },
    kitchenware: {
      status: '全て残置する',
      detail: ''
    },
    seats: ''
  },
  facilityDetails: {
    ventilation: {
      type: '換気扇',
      route: []
    },
    drainage: {
      type: 'グリストラップ'
    },
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
      drainageCapacity: ''
    },
    outsideWall: '',
    mdfLocation: ''
  },
  environment: {
    defect: {
      status: 'なし',
      detail: ''
    },
    permits: []
  }
})

// フォーム送信処理
const submitForm = () => {
  console.log('フォームデータ:', formData.value)
  alert('フォームを送信しました')
  // TODO: APIへの送信処理を実装
}
</script>

<style scoped>
.customer-input-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100vh;
}

.sticky-stack {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #f5f7fa;
  padding-bottom: 24px;
}

.sticky-card {
  border-radius: 8px;
}

.section-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 4px 16px rgba(30, 80, 162, 0.1);
}

.section-title {
  background: linear-gradient(135deg, #f8f9fb 0%, #e9ecf1 100%);
  border-bottom: 2px solid #1e50a2;
  color: #1e50a2;
  font-weight: 600;
  padding: 16px 20px;
}
</style>
