<template>
  <v-container class="px-4 pt-4 pb-4 exit-form-container" style="max-width: 1400px;">
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
          <v-tab><v-icon left>mdi-chart-line</v-icon>売上</v-tab>
          <v-tab><v-icon left>mdi-file-document-outline</v-icon>契約内容</v-tab>
          <v-tab><v-icon left>mdi-tools</v-icon>設備詳細</v-tab>
          <v-tab><v-icon left>mdi-video</v-icon>動画</v-tab>
          <v-tab><v-icon left>mdi-draw</v-icon>自由記述</v-tab>
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
          v-model:propertyFeatures="formData.propertyFeatures"
          v-model:locationInfo="formData.locationInfo"
          v-model:equipment="formData.equipment"
          v-model:valuation="formData.valuation"
        />
      </v-window-item>

      <!-- タブ3: 売上 -->
      <v-window-item :value="2">
        <AdminExitFormSalesInfoTab
          :detail-check="formData.detailCheck"
          @update:detail-check="formData.detailCheck = $event"
        />
      </v-window-item>

      <!-- タブ4: 契約内容 -->
      <v-window-item :value="3">
        <AdminExitFormContractInfoTab
          :property-features="formData.propertyFeatures"
          @update:property-features="formData.propertyFeatures = $event"
          :detail-check="formData.detailCheck"
          @update:detail-check="formData.detailCheck = $event"
          :customer-input="formData.customerInput"
          @update:customer-input="formData.customerInput = $event"
        />
      </v-window-item>

      <!-- タブ5: 設備詳細 -->
      <v-window-item :value="4">
        <AdminExitFormEquipmentDetailTab
          :detail-check="formData.detailCheck"
          @update:detail-check="formData.detailCheck = $event"
          :customer-input="formData.customerInput"
          @update:customer-input="formData.customerInput = $event"
        />
      </v-window-item>

      <!-- タブ6: 動画 -->
      <v-window-item :value="5">
        <AdminExitFormVideoTab
          :videos="formData.videos"
          @update:videos="formData.videos = $event"
        />
      </v-window-item>

      <!-- タブ7: 自由記述 -->
      <v-window-item :value="6">
        <AdminExitFormFreeDrawingTab
          v-model:canvasPagesData="canvasPages"
        />
      </v-window-item>

      <!-- タブ8: 販売戦略 -->
      <v-window-item :value="7">
        <AdminExitFormSalesStrategyTab
          v-model:salesOverview="formData.salesOverview"
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

// ========================================
// 開発用テストデータ設定（納品時はisDevelopment = falseに変更）
// ========================================
const isDevelopment = true // 🚨 納品時は false に変更すること

const TEST_DATA = {
  contact: {
    storeName: 'イタリアン食堂ベルパエーゼ',
    ownerName: '山田 太郎',
    address: '大阪府大阪市北区梅田1-2-3 梅田ビル1F',
    phoneNumber: '06-1234-5678'
  },
  status: {
    selectedClosingReasons: ['体調不良', '売上不振'],
    reasonOtherText: '',
    landlordNotification: 'している',
    nextTenantPermission: 'している',
    notifiedLandlord: true,
    landlordName: '田中 一郎',
    landlordContact: '本人',
    landlordPhone: '090-1111-2222',
    notifiedManagement: true,
    managementCompany: '梅田不動産管理',
    managementContact: '佐藤 花子',
    managementPhone: '06-9999-8888',
    terminationNotice: '有り',
    employeeNotification: 'している',
    otherConsultation: 'していない',
    consultationCompany: '',
    consultationStartDate: '',
    businessContinuation: 'すでに決めている',
    closingDate: '2024年12月31日',
    desiredSalePeriod: '3ヶ月以内',
    desiredSaleDate: '',
    desiredPrice: 5000000,
    desiredPriceReason: '初期投資の回収のため',
    marketPriceAwareness: 'ある程度理解している',
    equipmentTransferValue: 450
  },
  locationInfo: {
    rent: 50,
    area: 15,
    contractYear: '2020年',
    contractMonth: '4月',
    expectedRentPerTsubo: 0,
    locationConditions: ['駅近', '人通りが多い'],
    openingDate: '2020年4月1日',
    initialInvestment: 1200,
    investmentRecovery: '50%程度',
    currentRevenue: 0
  },
  salesInfo: {
    monthlyRevenue: 180,
    monthlyProfit: 20
  },
  basicInfo: {
    yearsInBusiness: '4年',
    initialState: '居抜き',
    initialStatePrice: '300万円',
    previousTenantInfo: '以前はフレンチレストラン',
    hasNegotiation: true,
    negotiationDetails: '改装時に原状回復の一部免除を交渉済み',
    usageRestrictions: '深夜営業不可',
    hasDrawings: true,
    drawingDetails: '契約時の図面あり（PDF）',
    landlordInvoiceStatus: '登録済み',
    electricityContract: '関西電力',
    electricityCustomerNumber: '1234567890',
    gasContract: '大阪ガス',
    gasCustomerNumber: '9876543210',
    waterContract: '大阪市水道局',
    waterCustomerNumber: '5555666677',
    garbageDisposalRules: 'ビル指定の収集日（月・木）',
    garbageDisposalCost: '月額5,000円',
    hasOtherCosts: false,
    otherCostsDetails: '',
    declarations: '特になし',
    newTenantConditions: '飲食店であれば業態自由'
  },
  equipment: {
    constructionCost: 1200,
    equipmentAge: '4年',
    interiorAge: '4年',
    businessYears: 4,
    handoverCondition: '現状渡し',
    handoverAmount: 500,
    equipmentStatus: ['問題なし'],
    hasNonTransferable: false,
    nonTransferableDetails: '',
    hasBroken: false,
    brokenDetails: '',
    hasLeaseDebt: false,
    leaseDebtDetails: '',
    hasLandlordEquipment: false,
    landlordEquipmentDetails: '',
    exhaustType: 'ダクト',
    exhaustRoute: '屋上まで直通',
    drainageType: 'グリストラップあり',
    electricityMeter: {
      location: '店舗奥',
      capacity: '60A',
      powerCapacity: '6kVA'
    },
    gasMeter: {
      location: '店舗入口横',
      capacity: '16号'
    },
    waterMeter: {
      location: '厨房内',
      pipeCapacity: '20mm'
    },
    outdoorUnitLocation: 'ビル裏側',
    mdfLocation: '店舗奥壁面',
    defects: ['なし'],
    defectOtherText: '',
    permits: ['保健所', '消防署']
  },
  recruitment: {
    highSales: '280万円',
    lowSales: '120万円',
    lunchHours: '11:30-14:30',
    dinnerHours: '18:00-22:00',
    lunchAvgSpend: '1,200円',
    dinnerAvgSpend: '3,500円',
    closingDays: '火曜日',
    salesMemo: '週末のディナーが好調',
    areaTypes: ['ビジネス街', '繁華街'],
    customerSegments: ['ビジネスマン', '若者'],
    areaMemo: '梅田駅から徒歩3分の好立地',
    appealPoints: '駅近、角地、視認性良好',
    priorityPoint: '立地の良さ',
    specialConditions: '特になし',
    sellingPrice: '500万円',
    listingPrice: '450万円',
    viewingAvailability: '営業時間外に可能',
    allowEmail: '可',
    allowWebListing: '可',
    progressReportMethod: 'メール',
    sellingStrategy: '立地を重視する買い手を優先',
    contractPhotos: [],
    mainCustomerAge: '30-40代',
    mainCustomerGender: '男性多め',
    businessType: 'イタリアン',
    viewingConditions: '営業終了後のみ',
    publicationConditions: '制限なし'
  },
  utilities: {
    electricMeterNumber: '1234567890',
    electricContract: '関西電力',
    electricCapacity: '60A',
    gasMeterNumber: '9876543210',
    gasType: '都市ガス',
    gasCapacity: '16号',
    waterMeterNumber: '5555666677',
    waterPressure: '標準'
  },
  business: {
    openingHours: '11:30-14:30, 18:00-22:00',
    closedDays: '火曜日',
    seatingCapacity: 28,
    staffCount: 4,
    businessMemo: 'ランチとディナーの二部営業'
  },
  externalContacts: [
    {
      type: '管理会社',
      companyName: '梅田不動産管理株式会社',
      contactPerson: '佐藤 花子',
      companyPhone: '06-9999-8888',
      personPhone: '090-1111-2222'
    }
  ],
  propertyFeatures: {
    strengths: ['重飲食可', 'グリストラップあり', 'ダクト屋上まで設置'],
    limitations: ['営業時間制限あり'],
    businessType: '一般飲食',
    floorType: '路面店'
  },
  detailCheck: {
    landlord_negotiation: true,
    landlord_negotiation_detail: '原状回復の一部免除を交渉済み',
    usage_restriction: true,
    usage_restriction_detail: '深夜営業不可（23時まで）',
    floor_plan: true,
    floor_plan_type: '契約時の図面あり',
    section_a_memo: '',
    // 写真: 賃貸借契約書・平面図
    lease_contract_photos: [],
    floor_plan_photos: [],
    contract_documents: [],
    electricity_company: '関西電力',
    electricity_customer_number: '1234567890',
    gas_company: '大阪ガス',
    gas_customer_number: '9876543210',
    water_company: '大阪市水道局',
    water_customer_number: '5555666677',
    landlord_payment: false,
    landlord_payment_detail: '',
    section_b_memo: '',
    // 写真: 請求書
    electricity_bill_photos: [],
    gas_bill_photos: [],
    water_bill_photos: [],
    garbage_disposal_cost: 5000,
    other_monthly_costs: false,
    other_monthly_costs_detail: '',
    other_monthly_costs_amount: 0,
    declarations: '特になし',
    new_tenant_conditions: '飲食店であれば業態自由',
    section_c_memo: '',
    equipment_investment: 800,
    equipment_age: 4,
    interior_investment: 400,
    interior_age: 4,
    non_transferable_equipment: false,
    non_transferable_equipment_detail: '',
    broken_equipment: false,
    broken_equipment_detail: '',
    lease_debt: false,
    lease_debt_amount: 0,
    landlord_equipment: false,
    landlord_equipment_detail: '',
    section_d_memo: '',
    exhaust_equipment: 'ダクト',
    exhaust_route: '屋上まで直通',
    drainage_equipment: 'グリストラップあり',
    electric_meter_location: '店舗奥',
    electric_capacity: '60A',
    power_capacity: '6kVA',
    gas_meter_location: '店舗入口横',
    gas_capacity: '16号',
    water_meter_location: '厨房内',
    water_pipe_capacity: '20mm',
    outdoor_unit_location: 'ビル裏側',
    section_e_memo: '',
    // 写真: 設備リスト
    kitchen_equipment_photos: [],
    duct_photos: [],
    grease_trap_photos: [],
    electric_meter_photos: [],
    gas_meter_photos: [],
    water_meter_photos: [],
    // 設備詳細タブ用
    duct_model_photo: null,
    duct_body_photo: null,
    duct_broken: false,
    duct_lease: false,
    duct_landlord_owned: false,
    duct_detail: 'ダクト式、屋上まで直通',
    grease_trap_model_photo: null,
    grease_trap_body_photo: null,
    grease_trap_broken: false,
    grease_trap_lease: false,
    grease_trap_landlord_owned: false,
    grease_trap_detail: 'グリストラップあり',
    aircon_indoor_units: [
      { model_photo: null, body_photo: null, broken: false, lease: false, landlord_owned: false, detail: '天井埋込式' },
      { model_photo: null, body_photo: null, broken: false, lease: false, landlord_owned: false, detail: '壁掛け式' }
    ],
    aircon_outdoor_units: [
      { model_photo: null, body_photo: null, location: '屋上', detail: '' },
      { model_photo: null, body_photo: null, location: 'ベランダ', detail: '' }
    ],
    seat_photo: null,
    counter_seats: '6',
    table_seats: '22',
    electric_meter_model_photo: null,
    electric_meter_body_photo: null,
    gas_meter_model_photo: null,
    gas_meter_body_photo: null,
    water_meter_model_photo: null,
    water_meter_body_photo: null,
    highest_sales_month: 280,
    lowest_sales_month: 120,
    lunch_hours: '11:30-14:30',
    dinner_hours: '18:00-22:00',
    lunch_avg_price: 1200,
    dinner_avg_price: 3500,
    closed_days: '火曜日',
    seat_count: 28,
    section_f_memo: '週末のディナーが好調',
    area_types: ['ビジネス街', '繁華街'],
    customer_segments: ['ビジネスマン', '若者'],
    main_customer_age: '30代',
    main_customer_gender: '男性中心',
    customer_type: 'サラリーマン',
    access_info: '梅田駅から徒歩3分',
    surrounding_environment: '周辺にオフィスビルと商業施設が多い',
    section_g_memo: ''
  },
  videos: [],
  salesOverview: {
    schedule: '',
    propertyOverview: '',
    currentTenant: '',
    ownerManagement: '',
    risks: ''
  },
  strategy: {
    locationFeatures: ['駅近', '角地'],
    locationDescription: '梅田駅徒歩3分の好立地',
    equipmentFeatures: ['問題なし'],
    equipmentDescription: '設備は良好な状態',
    targetBuyer: 'イタリアン・カフェ業態',
    recommendedBusiness: 'イタリアン、カフェ',
    sellingPrice: 500,
    minimumPrice: 450,
    negotiability: '応相談',
    catchCopy: '',
    salesPitch: '',
    specialNotes: '',
    internalMemo: ''
  },
  valuation: {
    locationWeight: 0.6,
    equipmentWeight: 0.4
  },
  customerInput: {
    property: {
      previousTenantInfo: '以前はフレンチレストラン',
      negotiation: {
        status: 'あり',
        detail: '原状回復の一部免除を交渉済み'
      },
      usageRestrictions: '深夜営業不可（23時まで）',
      floorPlan: {
        status: 'あり',
        detail: '契約時の図面あり（PDF）'
      },
      invoiceRegistration: {
        status: '登録済み',
        detail: ''
      }
    },
    scheduleDates: {
      terminationNoticeSubmitted: 'している',
      terminationNoticeDate: '2024-10-15',
      vacancyDate: '2025-01-31',
      contractEndDate: '2025-01-31',
      businessEndDate: '2024-12-31',
      handoverDesiredDate: '2025-02-01'
    },
    utilities: {
      electricity: {
        contractType: '直接契約',
        customerNumber: '1234567890'
      },
      gas: {
        contractType: '直接契約',
        customerNumber: '9876543210'
      },
      water: {
        contractType: '直接契約',
        customerNumber: '5555666677'
      },
      garbage: {
        rules: 'ビル指定の収集日（月・木）',
        cost: '月額5,000円'
      },
      otherCosts: {
        status: 'なし',
        detail: ''
      }
    },
    disclosure: {
      priorNotice: '特になし',
      newConditions: '飲食店であれば業態自由'
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
      seats: '',
      seatingList: [
        { floor: '1', capacity: '7', type: 'カウンター', count: 1 },
        { floor: '1', capacity: '4', type: 'テーブル', count: 1 },
        { floor: '1', capacity: '2', type: 'テーブル', count: 2 }
      ]
    },
    facilityDetails: {
      ventilation: {
        type: 'ダクト',
        route: ['屋上'],
        hasFan: false,
        fanRoute: [],
        hasDuct: true,
        ductRoute: ['屋上']
      },
      drainage: {
        type: 'グリストラップ'
      },
      electricityMeter: {
        location: '店舗奥',
        capacity: '60A',
        powerCapacity: '6kVA'
      },
      gasMeter: {
        location: '店舗入口横',
        capacity: '16号'
      },
      waterMeter: {
        location: '厨房内',
        drainageCapacity: '20mm'
      },
      outsideWall: 'ビル裏側',
      mdfLocation: '店舗奥壁面'
    },
    environment: {
      defect: {
        status: 'なし',
        detail: '',
        types: ['なし'],
        rainLeakDetail: '',
        waterLeakDetail: '',
        noiseDetail: '',
        otherDetail: ''
      },
      permits: ['保健所', '消防署']
    }
  }
}

// フォームデータ構造
const formData = ref(isDevelopment ? TEST_DATA : {
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
    notifiedLandlord: false,
    landlordName: '',
    landlordContact: '',
    landlordPhone: '',
    notifiedManagement: false,
    managementCompany: '',
    managementContact: '',
    managementPhone: '',
    terminationNotice: '',
    employeeNotification: '',
    otherConsultation: '',
    consultationCompany: '',
    consultationStartDate: '',
    businessContinuation: '',
    closingDate: '',
    desiredSalePeriod: '',
    desiredSaleDate: '',
    desiredPrice: 0,
    desiredPriceReason: '',
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
    constructionCost: 0,
    equipmentAge: '',
    interiorAge: '',
    businessYears: 0,
    handoverCondition: '',
    handoverAmount: 0,
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
  // セクション5: 連絡窓口
  externalContacts: [],
  // 物件の特徴
  propertyFeatures: {
    strengths: [],
    limitations: [],
    businessType: '',
    floorType: ''
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
    // 写真: 賃貸借契約書・平面図
    lease_contract_photos: [],
    floor_plan_photos: [],
    contract_documents: [],

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
    // 写真: 請求書
    electricity_bill_photos: [],
    gas_bill_photos: [],
    water_bill_photos: [],

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
    section_e_memo: '',
    // 写真: 設備リスト
    kitchen_equipment_photos: [],
    duct_photos: [],
    grease_trap_photos: [],
    electric_meter_photos: [],
    gas_meter_photos: [],
    water_meter_photos: [],
    // 設備詳細タブ用 - 店舗設備詳細
    ventilation_has_fan: false,
    ventilation_fan_route: [],
    ventilation_has_duct: false,
    ventilation_duct_route: [],
    drainage_type: '',
    facility_electricity_location: '',
    facility_electricity_capacity: '',
    facility_power_capacity: '',
    facility_gas_location: '',
    facility_gas_capacity: '',
    facility_water_location: '',
    facility_water_drainage_capacity: '',
    facility_outdoor_unit_location: '',
    facility_memo: '',
    // 厨房設備
    kitchen_equipment_photos: null,
    kitchen_equipment_detail: '',
    // 設備詳細タブ用 - ダクト
    duct_model_photo: null,
    duct_body_photo: null,
    duct_broken: false,
    duct_lease: false,
    duct_landlord_owned: false,
    duct_detail: '',
    grease_trap_model_photo: null,
    grease_trap_body_photo: null,
    grease_trap_broken: false,
    grease_trap_lease: false,
    grease_trap_landlord_owned: false,
    grease_trap_detail: '',
    aircon_indoor_units: [],
    aircon_outdoor_units: [],
    seat_photo: null,
    counter_seats: '',
    table_seats: '',
    electric_meter_model_photo: null,
    electric_meter_body_photo: null,
    gas_meter_model_photo: null,
    gas_meter_body_photo: null,
    water_meter_model_photo: null,
    water_meter_body_photo: null,

    // 環境情報 - 瑕疵
    defect_none: false,
    defect_rain_leak: false,
    defect_rain_leak_detail: '',
    defect_water_leak: false,
    defect_water_leak_detail: '',
    defect_noise: false,
    defect_noise_detail: '',
    defect_other: false,
    defect_other_detail: '',

    // 環境情報 - 許認可
    permit_health_center: false,
    permit_health_center_photo: null,
    permit_fire_department: false,
    permit_fire_department_photo: null,
    fire_alarm: false,
    fire_extinguisher: false,
    sprinkler: false,
    escape_ladder: false,
    emergency_light: false,
    permit_police: false,
    permit_police_photo: null,
    permit_police_detail: '',

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
  // 動画
  videos: [] as File[],
  // 販売用情報
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
    scheduleDates: {
      terminationNoticeSubmitted: '',
      terminationNoticeDate: '',
      vacancyDate: '',
      contractEndDate: '',
      businessEndDate: '',
      handoverDesiredDate: ''
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
      seats: '',
      seatingList: []
    },
    facilityDetails: {
      ventilation: {
        type: '換気扇',
        route: [],
        hasFan: false,
        fanRoute: [],
        hasDuct: false,
        ductRoute: []
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
        detail: '',
        types: [],
        rainLeakDetail: '',
        waterLeakDetail: '',
        noiseDetail: '',
        otherDetail: ''
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
  if (formData.value.equipment.businessYears > 0) completed++
  if (formData.value.equipment.constructionCost > 0) completed++

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

// 設備評価の計算（新しい減価償却ロジック）
const calculateEquipmentEvaluation = computed(() => {
  const constructionCost = Number(formData.value.equipment.constructionCost) || 0
  const businessYears = Number(formData.value.equipment.businessYears) || 0

  if (constructionCost <= 0) return 0

  const rate = getDepreciationRate(businessYears)
  const residualValue = constructionCost * rate

  return Math.round(residualValue * 10) / 10 // 小数点第1位まで
})

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
// ========================================
// AI生成プロンプトの初期設定
// ========================================
const AI_PROMPT_SETTINGS = {
  // 共通の注意事項
  commonRules: `【重要な注意事項】
- 入力されている情報のみを使用すること
- データがない項目は出力しないこと
- 推測や一般的な情報を追加しないこと
- 社内資料のため、「ですます調」ではなく簡潔な表現を使用すること`,

  // 1. スケジュール
  schedule: {
    format: '箇条書き',
    maxLength: 200,
    rules: `- 必ず箇条書き（• または -）で出力すること
- 日付は「YYYY年MM月DD日」形式で表示すること
- 「である調」または体言止めを使用すること（例：「〇月〇日 退店予定」）`,
    instruction: '以下の情報をもとに、販売用のスケジュール情報を箇条書き形式で生成すること。社内資料のため簡潔な表現で。'
  },

  // 2. 立地概要
  location: {
    format: '文章',
    maxLength: 200,
    rules: `- 具体的な施設名や駅名など、実際に入力されている情報のみを使用すること
- 「〇〇駅徒歩〇分」などの具体的な表現を優先すること
- 抽象的な表現（「商業施設」など）は避け、実際の施設名を使用すること
- 「である調」または名詞止めで簡潔に記載すること（例：「梅田駅徒歩3分。周辺にオフィスビル多数」）`,
    instruction: '以下の情報をもとに、販売用の立地概要を生成すること。社内資料のため簡潔な表現で。'
  },

  // 3. 現況テナント
  currentTenant: {
    format: '文章',
    maxLength: 250,
    rules: `- 営業時間、客単価、客層などを具体的に記載すること
- 売上実績がある場合は必ず含めること
- 「である調」または名詞止めで簡潔に記載すること（例：「イタリアン。ランチ1,200円、ディナー3,500円。30-40代ビジネスマン中心」）`,
    instruction: '以下の情報をもとに、現況テナントの営業概要を生成すること。社内資料のため簡潔な表現で。'
  },

  // 4. オーナー・管理会社
  landlord: {
    format: '文章',
    maxLength: 150,
    rules: `- 大家との関係性（良好、普通、注意が必要など）を明記すること
- 交渉済みの内容は必ず含めること
- 「である調」または名詞止めで簡潔に記載すること（例：「個人オーナー。原状回復一部免除で交渉済み」）`,
    instruction: '以下の情報をもとに、オーナー・管理会社との関係性をまとめること。社内資料のため簡潔な表現で。'
  },

  // 5. リスク
  risks: {
    format: '箇条書き',
    maxLength: 200,
    rules: `- 必ず箇条書き（• または -）で出力すること
- リスクがない場合は「特になし」と記載すること
- 金額が伴う項目（リース残債など）は必ず金額を明記すること
- 「である調」または体言止めを使用すること（例：「営業時間制限あり（23時まで）」）`,
    instruction: '以下の情報をもとに、リスク情報を箇条書きでまとめること。社内資料のため簡潔な表現で。'
  }
}

// データ収集関数
const collectDataForAI = () => {
  return {
    // 1. スケジュール情報
    schedule: {
      // BasicInfoTab
      landlordNotification: formData.value.status.landlordNotification || '',
      nextTenantPermission: formData.value.status.nextTenantPermission || '',
      businessContinuation: formData.value.status.businessContinuation || '',
      closingDate: formData.value.status.closingDate || '',
      desiredSalePeriod: formData.value.status.desiredSalePeriod || '',
      // CustomerInputTab
      terminationNoticeSubmitted: formData.value.customerInput.scheduleDates?.terminationNoticeSubmitted || '',
      terminationNoticeDate: formData.value.customerInput.scheduleDates?.terminationNoticeDate || '',
      vacancyDate: formData.value.customerInput.scheduleDates?.vacancyDate || '',
      contractEndDate: formData.value.customerInput.scheduleDates?.contractEndDate || '',
      businessEndDate: formData.value.customerInput.scheduleDates?.businessEndDate || '',
      handoverDesiredDate: formData.value.customerInput.scheduleDates?.handoverDesiredDate || ''
    },

    // 2. 立地概要情報
    location: {
      // BasicInfoTab
      address: formData.value.contact.address || '',
      // EquipmentCheckTab
      accessInfo: formData.value.detailCheck.access_info || '',
      areaTypes: formData.value.detailCheck.area_types || [],
      surroundingEnvironment: formData.value.detailCheck.surrounding_environment || ''
    },

    // 3. 現況テナント情報
    currentTenant: {
      // BasicInfoTab
      storeName: formData.value.contact.storeName || '',
      // EquipmentCheckTab
      lunchHours: formData.value.detailCheck.lunch_hours || '',
      dinnerHours: formData.value.detailCheck.dinner_hours || '',
      lunchAvgPrice: formData.value.detailCheck.lunch_avg_price || '',
      dinnerAvgPrice: formData.value.detailCheck.dinner_avg_price || '',
      closedDays: formData.value.detailCheck.closed_days || '',
      seatCount: formData.value.detailCheck.seat_count || '',
      mainCustomerAge: formData.value.detailCheck.main_customer_age || '',
      mainCustomerGender: formData.value.detailCheck.main_customer_gender || '',
      customerType: formData.value.detailCheck.customer_type || '',
      highestSalesMonth: formData.value.detailCheck.highest_sales_month || '',
      lowestSalesMonth: formData.value.detailCheck.lowest_sales_month || '',
      // 物件の特徴（強み）
      propertyStrengths: formData.value.propertyFeatures?.strengths || []
    },

    // 4. オーナー・管理会社情報
    landlord: {
      // BasicInfoTab
      landlordNotification: formData.value.status.landlordNotification || '',
      nextTenantPermission: formData.value.status.nextTenantPermission || '',
      // EquipmentCheckTab
      landlordNegotiation: formData.value.detailCheck.landlord_negotiation || '',
      landlordNegotiationDetail: formData.value.detailCheck.landlord_negotiation_detail || '',
      // CustomerInputTab
      negotiationStatus: formData.value.customerInput.property?.negotiation?.status || '',
      negotiationDetail: formData.value.customerInput.property?.negotiation?.detail || '',
      priorNotice: formData.value.customerInput.disclosure?.priorNotice || '',
      newConditions: formData.value.customerInput.disclosure?.newConditions || ''
    },

    // 5. リスク情報
    risks: {
      // EquipmentCheckTab
      limitations: formData.value.propertyFeatures?.limitations || [],
      usageRestriction: formData.value.detailCheck.usage_restriction || '',
      usageRestrictionDetail: formData.value.detailCheck.usage_restriction_detail || '',
      brokenEquipment: formData.value.detailCheck.broken_equipment || '',
      brokenEquipmentDetail: formData.value.detailCheck.broken_equipment_detail || '',
      leaseDebt: formData.value.detailCheck.lease_debt || '',
      leaseDebtAmount: formData.value.detailCheck.lease_debt_amount || '',
      // CustomerInputTab
      usageRestrictions: formData.value.customerInput.property?.usageRestrictions || '',
      equipmentBrokenStatus: formData.value.customerInput.equipment?.broken?.status || '',
      equipmentBrokenDetail: formData.value.customerInput.equipment?.broken?.detail || '',
      equipmentLeaseStatus: formData.value.customerInput.equipment?.lease?.status || '',
      equipmentLeaseDetail: formData.value.customerInput.equipment?.lease?.detail || '',
      defectStatus: formData.value.customerInput.environment?.defect?.status || '',
      defectDetail: formData.value.customerInput.environment?.defect?.detail || '',
      disclosurePriorNotice: formData.value.customerInput.disclosure?.priorNotice || ''
    }
  }
}

const handleFormatWithAI = async () => {
  try {
    // データ収集
    const collectedData = collectDataForAI()

    // 1. スケジュールのプロンプト生成
    const schedulePrompt = `
${AI_PROMPT_SETTINGS.schedule.instruction}

${AI_PROMPT_SETTINGS.commonRules}
${AI_PROMPT_SETTINGS.schedule.rules}

【出力形式】${AI_PROMPT_SETTINGS.schedule.format}（最大${AI_PROMPT_SETTINGS.schedule.maxLength}文字程度）

【収集データ】
- 解約通知: ${collectedData.schedule.terminationNoticeSubmitted}${collectedData.schedule.terminationNoticeDate ? ` (提出日: ${collectedData.schedule.terminationNoticeDate})` : ''}
- オーナー許可: ${collectedData.schedule.landlordNotification}
- 居抜き許可: ${collectedData.schedule.nextTenantPermission}
- 営業継続: ${collectedData.schedule.businessContinuation}${collectedData.schedule.closingDate ? ` (閉店予定日: ${collectedData.schedule.closingDate})` : ''}
- 営業終了日: ${collectedData.schedule.businessEndDate}
- 退店日: ${collectedData.schedule.vacancyDate}
- 契約終了日: ${collectedData.schedule.contractEndDate}
- 引き渡し希望日: ${collectedData.schedule.handoverDesiredDate}
- 販売希望時期: ${collectedData.schedule.desiredSalePeriod}
    `.trim()

    // 2. 立地概要のプロンプト生成
    const locationPrompt = `
${AI_PROMPT_SETTINGS.location.instruction}

${AI_PROMPT_SETTINGS.commonRules}
${AI_PROMPT_SETTINGS.location.rules}

【出力形式】${AI_PROMPT_SETTINGS.location.format}（最大${AI_PROMPT_SETTINGS.location.maxLength}文字程度）

【収集データ】
- 住所: ${collectedData.location.address}
- アクセス: ${collectedData.location.accessInfo}
- エリアタイプ: ${collectedData.location.areaTypes.join('、')}
- 周辺環境: ${collectedData.location.surroundingEnvironment}
    `.trim()

    // 3. 現況テナントのプロンプト生成
    const currentTenantPrompt = `
${AI_PROMPT_SETTINGS.currentTenant.instruction}

${AI_PROMPT_SETTINGS.commonRules}
${AI_PROMPT_SETTINGS.currentTenant.rules}

【出力形式】${AI_PROMPT_SETTINGS.currentTenant.format}（最大${AI_PROMPT_SETTINGS.currentTenant.maxLength}文字程度）

【収集データ】
- 屋号: ${collectedData.currentTenant.storeName}
- ランチ営業時間: ${collectedData.currentTenant.lunchHours}
- ディナー営業時間: ${collectedData.currentTenant.dinnerHours}
- ランチ客単価: ${collectedData.currentTenant.lunchAvgPrice}円
- ディナー客単価: ${collectedData.currentTenant.dinnerAvgPrice}円
- 席数: ${collectedData.currentTenant.seatCount}席
- 定休日: ${collectedData.currentTenant.closedDays}
- メイン客層年代: ${collectedData.currentTenant.mainCustomerAge}
- メイン客層性別: ${collectedData.currentTenant.mainCustomerGender}
- 客層タイプ: ${collectedData.currentTenant.customerType}
- 最高売上月: ${collectedData.currentTenant.highestSalesMonth}万円
- 最低売上月: ${collectedData.currentTenant.lowestSalesMonth}万円
- 強みとなる特徴: ${collectedData.currentTenant.propertyStrengths.length > 0 ? collectedData.currentTenant.propertyStrengths.join('、') : 'なし'}
    `.trim()

    // 4. オーナー・管理会社のプロンプト生成
    const landlordPrompt = `
${AI_PROMPT_SETTINGS.landlord.instruction}

${AI_PROMPT_SETTINGS.commonRules}
${AI_PROMPT_SETTINGS.landlord.rules}

【出力形式】${AI_PROMPT_SETTINGS.landlord.format}（最大${AI_PROMPT_SETTINGS.landlord.maxLength}文字程度）

【収集データ】
- 大家への閉店告知: ${collectedData.landlord.landlordNotification}
- 居抜き許可: ${collectedData.landlord.nextTenantPermission}
- 大家との交渉: ${collectedData.landlord.landlordNegotiation}${collectedData.landlord.landlordNegotiationDetail ? ` (内容: ${collectedData.landlord.landlordNegotiationDetail})` : ''}
- 契約時の条件交渉: ${collectedData.landlord.negotiationStatus}${collectedData.landlord.negotiationDetail ? ` (詳細: ${collectedData.landlord.negotiationDetail})` : ''}
- 事前申告: ${collectedData.landlord.priorNotice}
- 新条件: ${collectedData.landlord.newConditions}
    `.trim()

    // 5. リスクのプロンプト生成
    const risksPrompt = `
${AI_PROMPT_SETTINGS.risks.instruction}

${AI_PROMPT_SETTINGS.commonRules}
${AI_PROMPT_SETTINGS.risks.rules}

【出力形式】${AI_PROMPT_SETTINGS.risks.format}（最大${AI_PROMPT_SETTINGS.risks.maxLength}文字程度）

【収集データ】
- 注意が必要な特徴: ${collectedData.risks.limitations.length > 0 ? collectedData.risks.limitations.join('、') : 'なし'}
- 利用制限: ${collectedData.risks.usageRestriction}${collectedData.risks.usageRestrictionDetail ? ` (詳細: ${collectedData.risks.usageRestrictionDetail})` : ''}
- 物件の利用制限: ${collectedData.risks.usageRestrictions}
- 故障設備: ${collectedData.risks.brokenEquipment}${collectedData.risks.brokenEquipmentDetail ? ` (詳細: ${collectedData.risks.brokenEquipmentDetail})` : ''}
- 故障設備（お客様入力）: ${collectedData.risks.equipmentBrokenStatus}${collectedData.risks.equipmentBrokenDetail ? ` (詳細: ${collectedData.risks.equipmentBrokenDetail})` : ''}
- リース残債: ${collectedData.risks.leaseDebt}${collectedData.risks.leaseDebtAmount ? ` (金額: ${collectedData.risks.leaseDebtAmount}万円)` : ''}
- リース残債（お客様入力）: ${collectedData.risks.equipmentLeaseStatus}${collectedData.risks.equipmentLeaseDetail ? ` (詳細: ${collectedData.risks.equipmentLeaseDetail})` : ''}
- 店舗瑕疵: ${collectedData.risks.defectStatus}${collectedData.risks.defectDetail ? ` (詳細: ${collectedData.risks.defectDetail})` : ''}
- 事前申告: ${collectedData.risks.disclosurePriorNotice}
    `.trim()

    // 並行処理でAI生成を実行
    const [formattedSchedule, formattedLocation, formattedCurrentTenant, formattedLandlord, formattedRisks] = await Promise.all([
      processWithGpt('スケジュール情報', schedulePrompt),
      processWithGpt('立地概要情報', locationPrompt),
      processWithGpt('現況テナント情報', currentTenantPrompt),
      processWithGpt('オーナー・管理会社情報', landlordPrompt),
      processWithGpt('リスク情報', risksPrompt)
    ])

    // 生成結果を反映
    formData.value.salesOverview = {
      schedule: formattedSchedule,
      propertyOverview: formattedLocation,
      currentTenant: formattedCurrentTenant,
      ownerManagement: formattedLandlord,
      risks: formattedRisks
    }

    showSuccessMessage('AIで出力しました')
  } catch (error) {
    console.error('AI生成エラー:', error)
    showErrorMessage('生成中にエラーが発生しました')
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

<style>
/* ページ全体の背景（html/bodyレベル） */
:root,
html,
body,
#__nuxt,
.v-application,
.v-main,
.v-main__wrap {
  background-color: #e0e0e0 !important;
}

/* v-mainの内側padding除去 */
.v-main > .v-main__wrap {
  padding: 0 !important;
}

/* コンテナ内の背景 - exit-form専用 */
.exit-form-container,
.exit-form-container .v-window,
.exit-form-container .v-window-item,
.exit-form-container .v-form,
.sticky-stack {
  background-color: #e0e0e0 !important;
}

/* exit-form-containerのpaddingを背景色で埋める */
.exit-form-container {
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  background: #e0e0e0 !important;
}

/* v-containerの背景を確実に上書き */
.v-container.exit-form-container {
  background: #e0e0e0 !important;
  background-color: #e0e0e0 !important;
}

/* スティッキーカード（ヘッダーとタブ）の背景 */
.sticky-card {
  background-color: #ffffff !important;
}

/* タブの背景を白に */
.v-tabs {
  background-color: #ffffff !important;
}

/* セクション見出しを統一 - 濃い青で視認性向上 */
.section-title,
.v-card-title.section-title {
  font-weight: 700 !important;
  font-size: 17px !important;
  background: #1976d2 !important;
  color: #ffffff !important;
  border-bottom: none !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  border-radius: 0 !important;
}

.section-title .v-icon,
.v-card-title.section-title .v-icon {
  background: rgba(255, 255, 255, 0.3) !important;
  border-radius: 50% !important;
  padding: 6px !important;
  margin-right: 12px !important;
  color: #ffffff !important;
}

/* 入力欄の背景を明確に白に */
.v-field {
  background-color: #ffffff !important;
}

.v-input {
  background-color: transparent !important;
}

.v-field--variant-outlined > .v-field__overlay {
  background-color: #ffffff !important;
}

/* カードの間隔と角丸の統一 - 白背景でコントラスト向上 */
.v-card.section-card,
.section-card {
  border-radius: 12px !important;
  border: 1px solid #bdbdbd !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
  margin-bottom: 24px !important;
  overflow: hidden;
  background-color: #ffffff !important;
}

.v-card.section-card:hover,
.section-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18) !important;
  transition: box-shadow 0.3s ease;
}

/* カード内のコンテンツ背景 */
.v-card-text {
  background-color: #ffffff !important;
}

/* 入力欄のスタイル - 白背景＋濃いボーダー */
.v-field--variant-outlined .v-field__outline__start,
.v-field--variant-outlined .v-field__outline__end,
.v-field--variant-outlined .v-field__outline__notch::before,
.v-field--variant-outlined .v-field__outline__notch::after {
  border-color: #9e9e9e !important;
}

.v-field--variant-outlined:hover .v-field__outline__start,
.v-field--variant-outlined:hover .v-field__outline__end,
.v-field--variant-outlined:hover .v-field__outline__notch::before,
.v-field--variant-outlined:hover .v-field__outline__notch::after {
  border-color: #1565c0 !important;
}

.v-field--focused .v-field__outline__start,
.v-field--focused .v-field__outline__end,
.v-field--focused .v-field__outline__notch::before,
.v-field--focused .v-field__outline__notch::after {
  border-color: #1565c0 !important;
  border-width: 2px !important;
}

/* 入力欄の背景を白に */
.v-field__field {
  background-color: #ffffff !important;
}

.v-field--variant-outlined {
  background-color: #ffffff !important;
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

/* コンテナの美化 - exit-form専用 */
.v-container.exit-form-container {
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

