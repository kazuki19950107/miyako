<template>
  <v-container class="px-4 pt-4 pt-md-0 pb-4 exit-form-container" style="max-width: 1400px;">
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
      <v-card class="mb-2 elevation-1 sticky-card">
        <v-tabs
          v-model="activeTab"
          background-color="white"
          color="primary"
          grow
        >
          <v-tab><v-icon left>mdi-account-details</v-icon>基本情報</v-tab>
          <v-tab><v-icon left>mdi-calculator-variant</v-icon>簡易査定</v-tab>
          <v-tab><v-icon left>mdi-clipboard-check</v-icon>詳細確認</v-tab>
          <v-tab><v-icon left>mdi-account-check</v-icon>お客様入力確認</v-tab>
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
        <AdminExitFormBasicInfoTab
          v-model:contact="formData.contact"
          v-model:status="formData.status"
        />
      </v-window-item>

      <!-- タブ2: 簡易査定 -->
      <v-window-item :value="1">
        <AdminExitFormQuickValuationTab
          v-model:locationInfo="formData.locationInfo"
          v-model:equipment="formData.equipment"
          v-model:valuation="formData.valuation"
        />
      </v-window-item>


      <!-- タブ3: 詳細確認 -->
      <v-window-item :value="2">
        <AdminExitFormEquipmentCheckTab
          :property-features="formData.propertyFeatures"
          @update:property-features="formData.propertyFeatures = $event"
          :detail-check="formData.detailCheck"
          @update:detail-check="formData.detailCheck = $event"
        />
      </v-window-item>

      <!-- タブ4: お客様入力確認 -->
      <v-window-item :value="3">
        <AdminExitFormCustomerInputTab
          :customer-input="formData.customerInput"
          @update:customer-input="formData.customerInput = $event"
          @open-customer-input="openCustomerInput"
        />
      </v-window-item>

      <!-- タブ5: 自由記述 -->
      <v-window-item :value="4">
        <AdminExitFormFreeDrawingTab
          v-model:canvasPagesData="canvasPages"
        />
      </v-window-item>

      <!-- タブ6: 設備詳細 -->
      <v-window-item :value="5">
        <AdminExitFormEquipmentDetailTab
          :equipmentItems="equipmentItems"
        />
      </v-window-item>

      <!-- タブ7: 販売戦略 -->
      <v-window-item :value="6">
        <AdminExitFormSalesStrategyTab
          v-model:salesOverview="formData.salesOverview"
          v-model:formattedSalesOverview="formData.formattedSalesOverview"
          v-model:strategy="formData.strategy"
          @format-with-ai="handleFormatWithAI"
        />
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
          <v-icon left size="20" style="color: white !important;">mdi-send</v-icon>
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
import { useGpt } from '@/composables/useGpt'

// テスト段階のため認証チェックをスキップ
// 本番環境では以下のコメントを外して認証を有効化
/*
const authStore = useAuthStore()
if (!authStore.isAuthenticated) {
  await navigateTo('/admin/login')
}
*/

// GPT composable
const { isProcessing, processWithGpt } = useGpt()

/* [ADD] 詳細入力の表示/非表示 */
const showDetailPrice = ref(false)
const showDetailEquipmentCost = ref(false)
const showDetailInteriorCost = ref(false)
const showDetailHandoverAmount = ref(false)
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

// タブの状態管理
const activeTab = ref(0)

// キャンバスページ管理（FreeDrawingTabコンポーネントで使用）
const canvasPages = ref<string[]>([''])

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
    handoverCondition: '',
    handoverAmount: 0,
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
  // 販売用情報
  salesOverview: {
    schedule: '',
    propertyOverview: '',
    currentTenant: '',
    ownerManagement: '',
    risks: ''
  },
  // AI整形後の販売用情報
  formattedSalesOverview: {
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
  },
  // お客様入力情報
  customerInput: {
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

// お客様入力画面を開く
const openCustomerInput = () => {
  window.open('/customer-input', '_blank')
}

// AIで整形処理
const handleFormatWithAI = async () => {
  try {
    // 住所と立地概要を組み合わせて整形
    const address = formData.value.contact.address || ''
    const propertyOverview = formData.value.salesOverview.propertyOverview || ''

    // 立地概要のプロンプト
    const propertyPrompt = `
以下の情報を基に、不動産販売用の魅力的な立地概要を200文字程度で作成してください。

【住所】
${address}

【現在の立地概要】
${propertyOverview}

【要件】
- 具体的な地名や最寄り駅などの情報を含める
- 周辺環境や立地の特徴を強調する
- 簡潔で分かりやすい文章にする
- 購入検討者が興味を持つような表現にする
    `.trim()

    // GPT APIで立地概要を整形
    const formattedPropertyOverview = await processWithGpt(
      address + '\n' + propertyOverview,
      propertyPrompt
    )

    // その他のフィールドも同様に整形
    const schedulePrompt = `
以下のスケジュール情報を整形して、分かりやすく簡潔にまとめてください（100文字程度）。

${formData.value.salesOverview.schedule || '情報なし'}
    `.trim()

    const currentTenantPrompt = `
以下の現況テナント情報を整形して、分かりやすく簡潔にまとめてください（150文字程度）。

${formData.value.salesOverview.currentTenant || '情報なし'}
    `.trim()

    const ownerManagementPrompt = `
以下のオーナー・管理会社情報を整形して、分かりやすく簡潔にまとめてください（100文字程度）。

${formData.value.salesOverview.ownerManagement || '情報なし'}
    `.trim()

    const risksPrompt = `
以下のリスク情報を整形して、明確かつ簡潔にまとめてください（150文字程度）。

${formData.value.salesOverview.risks || '情報なし'}
    `.trim()

    // 並行処理でAI整形を実行
    const [formattedSchedule, formattedCurrentTenant, formattedOwnerManagement, formattedRisks] = await Promise.all([
      formData.value.salesOverview.schedule ? processWithGpt(formData.value.salesOverview.schedule, schedulePrompt) : Promise.resolve(''),
      formData.value.salesOverview.currentTenant ? processWithGpt(formData.value.salesOverview.currentTenant, currentTenantPrompt) : Promise.resolve(''),
      formData.value.salesOverview.ownerManagement ? processWithGpt(formData.value.salesOverview.ownerManagement, ownerManagementPrompt) : Promise.resolve(''),
      formData.value.salesOverview.risks ? processWithGpt(formData.value.salesOverview.risks, risksPrompt) : Promise.resolve('')
    ])

    // 整形結果を反映
    formData.value.formattedSalesOverview = {
      schedule: formattedSchedule,
      propertyOverview: formattedPropertyOverview,
      currentTenant: formattedCurrentTenant,
      ownerManagement: formattedOwnerManagement,
      risks: formattedRisks
    }

    showSuccessMessage('AIで整形しました')
  } catch (error) {
    console.error('AI整形エラー:', error)
    showErrorMessage('整形中にエラーが発生しました')
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

/* メインコンテンツエリア：フッター分の余白を確保 */
.v-window {
  padding-bottom: 100px;
}

/* 画面下部：固定アクションバー */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: rgba(255,255,255,0.98);
  backdrop-filter: saturate(140%) blur(12px);
  padding: 16px 20px;
  z-index: 1000;
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

/* タブレット画面でタブの余白を調整 */
@media (max-width: 960px) {
  .v-tab {
    padding-left: 10px !important;
    padding-right: 10px !important;
    font-size: 13px !important;
    min-width: 80px !important;
  }

  .v-tab .v-icon {
    margin-right: 4px !important;
    font-size: 18px !important;
  }
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

