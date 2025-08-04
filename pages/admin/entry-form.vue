<template>
  <v-container style="max-width: 1280px; overflow-x: hidden;">
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-card class="mt-5">
          <v-card-title class="text-center" style="background-color: #1976d2; color: white;">
            <v-icon left style="color: white;">mdi-store-plus</v-icon>
            出店希望者 営業入力フォーム
          </v-card-title>
          
          <v-card-text style="overflow-x: hidden;">
            <v-tabs
              v-model="currentTab"
              background-color="transparent"
              color="primary"
              grow
              show-arrows
              :mobile-breakpoint="960"
            >
              <v-tab v-for="tab in tabs" :key="tab.value">
                {{ tab.label }}
              </v-tab>
            </v-tabs>

            <v-window v-model="currentTab">
                <!-- タブ1: 管理情報・個人情報 -->
                <v-window-item class="pa-4">
                  <v-form ref="basicForm" v-model="basicValid" @submit.prevent>
                    <h3 class="text-h6 mb-4">
                      <v-icon left>mdi-account-details</v-icon>
                      基本情報
                    </h3>
                    
                    <v-row>
                      <!-- 管理情報 -->
                      <v-col cols="12">
                        <v-divider class="mb-4"></v-divider>
                        <h4 class="text-subtitle-1 mb-3">管理情報</h4>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.createdDate"
                          label="作成日"
                          type="date"
                          :rules="[v => !!v || '作成日は必須です']"
                          prepend-icon="mdi-calendar"
                          required
                        />
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.customerId"
                          label="顧客ID"
                          hint="自動生成または管理者入力"
                          prepend-icon="mdi-identifier"
                        />
                      </v-col>

                      <!-- 個人情報 -->
                      <v-col cols="12">
                        <v-divider class="mb-4"></v-divider>
                        <h4 class="text-subtitle-1 mb-3">個人情報</h4>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.companyName"
                          label="会社名"
                          prepend-icon="mdi-domain"
                        />
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.name"
                          label="氏名"
                          :rules="[v => !!v || '氏名は必須です']"
                          prepend-icon="mdi-account"
                          required
                        />
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.nameKana"
                          label="フリガナ"
                          :rules="[v => !!v || 'フリガナは必須です']"
                          prepend-icon="mdi-account-voice"
                          required
                        />
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="formData.nationality"
                          :items="nationalities"
                          label="国籍"
                          :rules="[v => !!v || '国籍は必須です']"
                          prepend-icon="mdi-earth"
                          required
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-window-item>

                <!-- タブ2: 連絡先・店舗情報 -->
                <v-window-item class="pa-4">
                  <v-form ref="contactForm" v-model="contactValid" @submit.prevent>
                    <h3 class="text-h6 mb-4">
                      <v-icon left>mdi-phone</v-icon>
                      連絡先・店舗情報
                    </h3>
                    
                    <v-row>
                      <!-- 連絡先 -->
                      <v-col cols="12">
                        <v-divider class="mb-4"></v-divider>
                        <h4 class="text-subtitle-1 mb-3">連絡先</h4>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.mobilePhone"
                          label="携帯電話番号"
                          :rules="[v => !!v || '携帯電話番号は必須です']"
                          prepend-icon="mdi-cellphone"
                          hint="ハイフンありOK"
                          required
                        />
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.otherPhone"
                          label="その他電話番号"
                          prepend-icon="mdi-phone"
                        />
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.fax"
                          label="FAX番号"
                          prepend-icon="mdi-fax"
                        />
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.loginEmail"
                          label="ログインメールアドレス"
                          :rules="[
                            v => !!v || 'メールアドレスは必須です',
                            v => /.+@.+\..+/.test(v) || 'メールアドレスの形式が正しくありません'
                          ]"
                          prepend-icon="mdi-email-lock"
                          type="email"
                          hint="1つのみ"
                          required
                        />
                      </v-col>
                      
                      <v-col cols="12">
                        <v-combobox
                          v-model="formData.contactEmails"
                          label="連絡先メールアドレス"
                          chips
                          multiple
                          prepend-icon="mdi-email-multiple"
                          hint="複数可・Enterで追加"
                        />
                      </v-col>

                      <!-- 既存店舗情報 -->
                      <v-col cols="12">
                        <v-divider class="mb-4"></v-divider>
                        <h4 class="text-subtitle-1 mb-3">既存店舗情報</h4>
                      </v-col>
                      
                      <v-col cols="12">
                        <v-combobox
                          v-model="formData.storeNames"
                          label="屋号"
                          chips
                          multiple
                          prepend-icon="mdi-store"
                          hint="複数可・Enterで追加"
                        />
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="formData.storeCount"
                          label="店舗数"
                          type="number"
                          prepend-icon="mdi-numeric"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-window-item>

                <!-- タブ3: 業態・業種 -->
                <v-window-item class="pa-4">
                  <v-form ref="businessForm" v-model="businessValid" @submit.prevent>
                    <h3 class="text-h6 mb-4">
                      <v-icon left>mdi-store-outline</v-icon>
                      業態・業種
                    </h3>
                    
                    <v-row>
                      <v-col cols="12">
                        <v-radio-group
                          v-model="formData.businessCategory"
                          label="業態（単一選択）"
                          :rules="[v => !!v || '業態は必須です']"
                          @change="onBusinessCategoryChange"
                          required
                        >
                          <v-radio
                            v-for="category in businessCategories"
                            :key="category.value"
                            :label="category.text"
                            :value="category.value"
                          />
                        </v-radio-group>
                      </v-col>
                      
                      <v-col cols="12" v-if="formData.businessCategory">
                        <v-card outlined>
                          <v-card-title class="text-subtitle-1">
                            業種（複数選択可）
                          </v-card-title>
                          <v-card-text>
                            <v-chip-group
                              v-model="formData.businessTypes"
                              multiple
                              column
                            >
                              <v-chip
                                v-for="type in currentBusinessTypes"
                                :key="type"
                                filter
                                outlined
                              >
                                {{ type }}
                              </v-chip>
                            </v-chip-group>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-window-item>

                <!-- タブ4: 出店条件 -->
                <v-window-item class="pa-4">
                  <v-form ref="conditionForm" v-model="conditionValid" @submit.prevent>
                    <h3 class="text-h6 mb-4">
                      <v-icon left>mdi-currency-jpy</v-icon>
                      出店条件
                    </h3>
                    
                    <v-row>
                      <!-- 予算条件 -->
                      <v-col cols="12">
                        <v-divider class="mb-4"></v-divider>
                        <h4 class="text-subtitle-1 mb-3">予算条件</h4>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="formData.acquisitionBudget"
                          label="物件取得予算上限"
                          type="number"
                          suffix="万円"
                          prepend-icon="mdi-cash"
                        />
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="formData.rentMin"
                          label="賃料下限"
                          type="number"
                          suffix="円"
                          prepend-icon="mdi-currency-jpy"
                        />
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="formData.rentMax"
                          label="賃料上限"
                          type="number"
                          suffix="円"
                          prepend-icon="mdi-currency-jpy"
                        />
                      </v-col>

                      <!-- 面積条件 -->
                      <v-col cols="12">
                        <v-divider class="mb-4"></v-divider>
                        <h4 class="text-subtitle-1 mb-3">面積条件</h4>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="formData.areaMinTsubo"
                          label="坪数下限"
                          type="number"
                          suffix="坪"
                          prepend-icon="mdi-ruler-square"
                          @input="updateAreaFromTsubo('min')"
                        />
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="formData.areaMaxTsubo"
                          label="坪数上限"
                          type="number"
                          suffix="坪"
                          prepend-icon="mdi-ruler-square"
                          @input="updateAreaFromTsubo('max')"
                        />
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="formData.areaMinM2"
                          label="㎡下限"
                          type="number"
                          suffix="㎡"
                          prepend-icon="mdi-ruler-square"
                          @input="updateTsuboFromArea('min')"
                        />
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="formData.areaMaxM2"
                          label="㎡上限"
                          type="number"
                          suffix="㎡"
                          prepend-icon="mdi-ruler-square"
                          @input="updateTsuboFromArea('max')"
                        />
                      </v-col>

                      <!-- その他条件 -->
                      <v-col cols="12">
                        <v-divider class="mb-4"></v-divider>
                        <h4 class="text-subtitle-1 mb-3">その他条件</h4>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-radio-group
                          v-model="formData.desiredCondition"
                          label="希望引き渡し状態"
                        >
                          <v-radio label="スケルトン" value="skeleton" />
                          <v-radio label="居抜き" value="furnished" />
                        </v-radio-group>
                      </v-col>
                      
                      <v-col cols="12">
                        <v-select
                          v-model="formData.desiredPrefectures"
                          :items="prefectures"
                          label="希望都道府県（近畿エリア）"
                          multiple
                          chips
                          prepend-icon="mdi-map-marker"
                        />
                      </v-col>
                      
                      <v-col cols="12" v-if="formData.desiredPrefectures.length > 0">
                        <v-expansion-panels>
                          <v-expansion-panel
                            v-for="prefecture in formData.desiredPrefectures"
                            :key="prefecture"
                          >
                            <v-expansion-panel-header>
                              {{ prefecture }}の市区町村
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                              <v-chip-group
                                v-model="formData.desiredCities[prefecture]"
                                multiple
                                column
                              >
                                <v-chip
                                  v-for="city in getCitiesForPrefecture(prefecture)"
                                  :key="city"
                                  filter
                                  outlined
                                >
                                  {{ city }}
                                </v-chip>
                              </v-chip-group>
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </v-col>
                      
                      <v-col cols="12">
                        <v-select
                          v-model="formData.possibleFloors"
                          :items="floors"
                          label="可能フロア（複数選択）"
                          multiple
                          chips
                          prepend-icon="mdi-office-building"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-window-item>

                <!-- タブ5: 特殊条件 -->
                <v-window-item class="pa-4">
                  <h3 class="text-h6 mb-4">
                    <v-icon left>mdi-filter-variant</v-icon>
                    特殊条件
                  </h3>
                  
                  <v-row>
                    <!-- 業態許可 -->
                    <v-col cols="12">
                      <v-expansion-panels>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            業態許可
                            <template v-slot:actions>
                              <span class="text--secondary mr-4">
                                {{ getSelectedCount('businessPermits') }}件選択
                              </span>
                            </template>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-checkbox
                              v-for="permit in specialConditions.businessPermits"
                              :key="permit.value"
                              v-model="formData.specialConditions.businessPermits"
                              :label="permit.text"
                              :value="permit.value"
                              hide-details
                            />
                          </v-expansion-panel-content>
                        </v-expansion-panel>

                        <!-- 業態以外許可 -->
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            業態以外許可
                            <template v-slot:actions>
                              <span class="text--secondary mr-4">
                                {{ getSelectedCount('otherPermits') }}件選択
                              </span>
                            </template>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-checkbox
                              v-for="permit in specialConditions.otherPermits"
                              :key="permit.value"
                              v-model="formData.specialConditions.otherPermits"
                              :label="permit.text"
                              :value="permit.value"
                              hide-details
                            />
                          </v-expansion-panel-content>
                        </v-expansion-panel>

                        <!-- 店舗外条件 -->
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            店舗外条件
                            <template v-slot:actions>
                              <span class="text--secondary mr-4">
                                {{ getSelectedCount('exteriorConditions') }}件選択
                              </span>
                            </template>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-checkbox
                              v-for="condition in specialConditions.exteriorConditions"
                              :key="condition.value"
                              v-model="formData.specialConditions.exteriorConditions"
                              :label="condition.text"
                              :value="condition.value"
                              hide-details
                            />
                          </v-expansion-panel-content>
                        </v-expansion-panel>

                        <!-- 店舗内条件 -->
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            店舗内条件
                            <template v-slot:actions>
                              <span class="text--secondary mr-4">
                                {{ getSelectedCount('interiorConditions') }}件選択
                              </span>
                            </template>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-checkbox
                              v-for="condition in specialConditions.interiorConditions"
                              :key="condition.value"
                              v-model="formData.specialConditions.interiorConditions"
                              :label="condition.text"
                              :value="condition.value"
                              hide-details
                            />
                          </v-expansion-panel-content>
                        </v-expansion-panel>

                        <!-- ロケーション -->
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            ロケーション
                            <template v-slot:actions>
                              <span class="text--secondary mr-4">
                                {{ getSelectedCount('locations') }}件選択
                              </span>
                            </template>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-checkbox
                              v-for="location in specialConditions.locations"
                              :key="location.value"
                              v-model="formData.specialConditions.locations"
                              :label="location.text"
                              :value="location.value"
                              hide-details
                            />
                          </v-expansion-panel-content>
                        </v-expansion-panel>

                        <!-- 予算条件 -->
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            予算条件
                            <template v-slot:actions>
                              <span class="text--secondary mr-4">
                                {{ getSelectedCount('budgetConditions') }}件選択
                              </span>
                            </template>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-checkbox
                              v-for="condition in specialConditions.budgetConditions"
                              :key="condition.value"
                              v-model="formData.specialConditions.budgetConditions"
                              :label="condition.text"
                              :value="condition.value"
                              hide-details
                            />
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-col>
                  </v-row>
                </v-window-item>

                <!-- タブ6: メモ・確認 -->
                <v-window-item class="pa-4">
                  <h3 class="text-h6 mb-4">
                    <v-icon left>mdi-note-text</v-icon>
                    メモ・確認
                  </h3>
                  
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.searchMemo"
                        label="検索用メモ"
                        rows="4"
                        prepend-icon="mdi-note-search"
                        hint="営業メモ・希望の背景など"
                      />
                    </v-col>
                    
                    <v-col cols="12">
                      <v-card outlined>
                        <v-card-title>
                          入力内容の確認
                        </v-card-title>
                        <v-card-text>
                          <v-simple-table dense>
                            <tbody>
                              <tr>
                                <td class="font-weight-bold">氏名</td>
                                <td>{{ formData.name }}</td>
                              </tr>
                              <tr>
                                <td class="font-weight-bold">会社名</td>
                                <td>{{ formData.companyName || '-' }}</td>
                              </tr>
                              <tr>
                                <td class="font-weight-bold">携帯電話</td>
                                <td>{{ formData.mobilePhone }}</td>
                              </tr>
                              <tr>
                                <td class="font-weight-bold">メールアドレス</td>
                                <td>{{ formData.loginEmail }}</td>
                              </tr>
                              <tr>
                                <td class="font-weight-bold">業態</td>
                                <td>{{ getBusinessCategoryText(formData.businessCategory) }}</td>
                              </tr>
                              <tr>
                                <td class="font-weight-bold">希望エリア</td>
                                <td>{{ formData.desiredPrefectures.join('、') || '-' }}</td>
                              </tr>
                              <tr>
                                <td class="font-weight-bold">予算</td>
                                <td>
                                  賃料: {{ formData.rentMin || '-' }}円 〜 {{ formData.rentMax || '-' }}円
                                </td>
                              </tr>
                            </tbody>
                          </v-simple-table>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  
                  <v-btn
                    color="success"
                    @click="submitForm"
                    :loading="submitting"
                    class="mt-4"
                    block
                    size="large"
                    height="56"
                  >
                    登録する
                    <v-icon right>mdi-check</v-icon>
                  </v-btn>
                </v-window-item>
              </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 成功メッセージ -->
    <v-snackbar
      v-model="showSuccess"
      color="success"
      timeout="5000"
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
// 認証機能は後で実装
// import { useAuthStore } from '@/stores/auth'
// const authStore = useAuthStore()
// if (!authStore.isAuthenticated) {
//   await navigateTo('/admin/login')
// }

// リアクティブデータ
const currentTab = ref(0)
const basicValid = ref(false)
const contactValid = ref(false)
const businessValid = ref(false)
const conditionValid = ref(false)
const submitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// フォームデータ
const formData = ref({
  // 管理情報
  createdDate: new Date().toISOString().split('T')[0],
  customerId: '',
  
  // 個人情報
  companyName: '',
  name: '',
  nameKana: '',
  nationality: '日本',
  
  // 連絡先
  mobilePhone: '',
  otherPhone: '',
  fax: '',
  loginEmail: '',
  contactEmails: [],
  
  // 既存店舗情報
  storeNames: [],
  storeCount: null,
  
  // 業態・業種
  businessCategory: '',
  businessTypes: [],
  
  // 出店条件
  acquisitionBudget: null,
  rentMin: null,
  rentMax: null,
  areaMinTsubo: null,
  areaMaxTsubo: null,
  areaMinM2: null,
  areaMaxM2: null,
  desiredCondition: '',
  desiredPrefectures: [],
  desiredCities: {},
  possibleFloors: [],
  
  // 特殊条件
  specialConditions: {
    businessPermits: [],
    otherPermits: [],
    exteriorConditions: [],
    interiorConditions: [],
    locations: [],
    budgetConditions: []
  },
  
  // メモ
  searchMemo: ''
})

// タブ定義
const tabs = [
  { value: 0, label: '基本情報' },
  { value: 1, label: '連絡先' },
  { value: 2, label: '業態・業種' },
  { value: 3, label: '出店条件' },
  { value: 4, label: '特殊条件' },
  { value: 5, label: '確認' }
]

// 選択肢データ
const nationalities = ['日本', '中国', '韓国', 'アメリカ', 'その他']

const businessCategories = [
  { text: '飲食', value: 'restaurant' },
  { text: '物販', value: 'retail' },
  { text: 'サービス', value: 'service' },
  { text: '美容', value: 'beauty' },
  { text: '医療', value: 'medical' },
  { text: '福祉', value: 'welfare' },
  { text: '娯楽', value: 'entertainment' }
]

// 業種マスターデータ
const businessTypesMap = {
  restaurant: [
    '中華料理', '韓国料理', 'フレンチ', 'イタリアン', 'スペイン料理', 'アメリカ料理',
    'エスニック料理', 'ネパール料理', 'インド料理', 'カレーライス', 'スパイスカレー',
    'スープカレー', '焼肉', '焼鳥', 'ステーキ・鉄板焼き', 'お好み焼き', 'とんかつ',
    '串カツ', '串焼き', '鍋', 'しゃぶしゃぶ', '居酒屋', 'ダイニングバー', '食堂',
    '定食', 'レストラン', '和食', '寿司', '丼', 'おでん', '唐揚げ', '創作料理',
    'ろばた焼き', 'たこ焼き', '天ぷら', 'うなぎ', '海鮮', 'ラーメン', 'うどん',
    '蕎麦', 'パスタ', '立ち飲み', 'バー', 'バル', 'シーシャ', 'ビアガーデン',
    'クラブ', 'カフェ', '喫茶店', 'スイーツ', 'パン', 'ハンバーガー', 'ピザ',
    '弁当', 'おにぎり', 'サンドイッチ'
  ],
  retail: [
    '食品物販（調理無し）', 'ファッション', '雑貨', 'コンビニ', 'ドラッグストア',
    'スーパーマーケット'
  ],
  service: [
    '事務所', 'スクール', '民泊', 'スポーツジム', '保育', '風営店'
  ],
  beauty: [
    'ヘアサロン', 'ネイルサロン', 'マツエクサロン', 'リラクサロン', 'エステサロン'
  ],
  medical: [
    '病院', '歯科', 'クリニック', '整体'
  ],
  welfare: [
    '保育施設', '老人施設', '障碍者施設'
  ],
  entertainment: [
    'カラオケ', 'ゴルフ', 'ネットカフェ', '漫画喫茶', 'ゲームセンター',
    'ボードゲーム', '写真スタジオ', '音楽スタジオ', 'ホール', 'パチンコ'
  ]
}

const prefectures = ['大阪府', '京都府', '兵庫県', '奈良県', '滋賀県', '和歌山県']

const floors = ['1階', '2階', '3階', '4階', '5階以上', '地下', '複数階', '1棟']

// 特殊条件の選択肢
const specialConditions = {
  businessPermits: [
    { text: '重飲食可（炭火まで可）', value: 'heavy_food_charcoal' },
    { text: '重飲食可（炭火以外）', value: 'heavy_food_no_charcoal' },
    { text: '軽飲食まで可', value: 'light_food' },
    { text: '美容可', value: 'beauty' },
    { text: 'サロン可', value: 'salon' },
    { text: '医療可', value: 'medical' },
    { text: '物販可', value: 'retail' },
    { text: '事務所可', value: 'office' },
    { text: 'スクール可', value: 'school' },
    { text: '民泊可', value: 'minpaku' },
    { text: 'スポーツジム可', value: 'gym' },
    { text: '保育可', value: 'childcare' },
    { text: '風営可', value: 'fuzoku' }
  ],
  otherPermits: [
    { text: '前面スペース利用可', value: 'front_space' },
    { text: '深夜営業可', value: 'late_night' },
    { text: 'カラオケ可', value: 'karaoke' },
    { text: '演奏可', value: 'music' },
    { text: 'ペット可', value: 'pets' },
    { text: '事業譲渡可', value: 'business_transfer' },
    { text: '検査済証有', value: 'inspection_cert' }
  ],
  exteriorConditions: [
    { text: '視認性有', value: 'visibility' },
    { text: '専用階段有', value: 'dedicated_stairs' },
    { text: 'エレベーター有', value: 'elevator' }
  ],
  interiorConditions: [
    { text: '換気扇有', value: 'ventilation' },
    { text: 'ダクト有', value: 'duct' },
    { text: '内階段有', value: 'interior_stairs' },
    { text: 'ダムウェーター有', value: 'dumbwaiter' },
    { text: 'グリストラップ有', value: 'grease_trap' },
    { text: '高天井', value: 'high_ceiling' },
    { text: '住居付き', value: 'with_residence' },
    { text: '高級店', value: 'luxury' }
  ],
  locations: [
    { text: '路面店', value: 'roadside' },
    { text: 'ビルイン', value: 'building' },
    { text: '角地', value: 'corner' },
    { text: '駅前', value: 'station_front' },
    { text: '駅ビル', value: 'station_building' },
    { text: '商業施設', value: 'commercial' },
    { text: '繁華街', value: 'downtown' },
    { text: '高架下', value: 'under_railway' },
    { text: '住宅街', value: 'residential' },
    { text: 'ビジネス街', value: 'business' },
    { text: '学生街', value: 'student' },
    { text: '商店街', value: 'shopping_street' },
    { text: 'インバウンド', value: 'inbound' },
    { text: 'ロードサイド', value: 'roadside_large' },
    { text: '駐車場有(近隣)', value: 'parking_nearby' },
    { text: '駐車場有(5台以下)', value: 'parking_5' },
    { text: '駐車場有(10台以上)', value: 'parking_10' }
  ],
  budgetConditions: [
    { text: '譲渡買取可能', value: 'purchase_possible' },
    { text: '譲渡買取不可', value: 'purchase_not_possible' }
  ]
}

// 市区町村データ
const citiesMap = {
  '大阪府': {
    '大阪市': [
      '北区', '中央区', '浪速区', '天王寺区', '西区', '港区', '大正区', '此花区',
      '福島区', '都島区', '旭区', '東淀川区', '淀川区', '東成区', '生野区', '城東区',
      '鶴見区', '阿倍野区', '住之江区', '住吉区', '東住吉区', '平野区', '西成区'
    ],
    '堺市': [
      '堺区', '中区', '東区', '西区', '南区', '北区', '美原区'
    ],
    '北摂': [
      '豊中市', '池田市', '吹田市', '高槻市', '茨木市', '箕面市', '摂津市', '島本町', '豊能町', '能勢町'
    ],
    '北河内': [
      '守口市', '枚方市', '寝屋川市', '大東市', '門真市', '四條畷市', '交野市'
    ],
    '中河内': [
      '八尾市', '柏原市', '東大阪市'
    ],
    '泉北': [
      '泉大津市', '和泉市', '高石市', '忠岡町'
    ],
    '泉南': [
      '岸和田市', '貝塚市', '泉佐野市', '泉南市', '阪南市', '熊取町', '田尻町', '岬町'
    ],
    '南河内': [
      '富田林市', '河内長野市', '松原市', '羽曳野市', '藤井寺市', '大阪狭山市', '太子町', '河南町', '千早赤阪村'
    ]
  },
  '京都府': ['京都市', '福知山市', '舞鶴市', '綾部市', '宇治市', '宮津市', '亀岡市', '城陽市', '向日市', '長岡京市', '八幡市', '京田辺市', '京丹後市', '南丹市', '木津川市'],
  '兵庫県': ['神戸市', '姫路市', '尼崎市', '明石市', '西宮市', '洲本市', '芦屋市', '伊丹市', '相生市', '豊岡市', '加古川市', '赤穂市', '西脇市', '宝塚市', '三木市', '高砂市', '川西市', '小野市', '三田市', '加西市', '丹波篠山市', '養父市', '丹波市', '南あわじ市', '朝来市', '淡路市', '宍粟市', '加東市', 'たつの市'],
  '奈良県': ['奈良市', '大和高田市', '大和郡山市', '天理市', '橿原市', '桜井市', '五條市', '御所市', '生駒市', '香芝市', '葛城市', '宇陀市'],
  '滋賀県': ['大津市', '彦根市', '長浜市', '近江八幡市', '草津市', '守山市', '栗東市', '甲賀市', '野洲市', '湖南市', '高島市', '東近江市', '米原市'],
  '和歌山県': ['和歌山市', '海南市', '橋本市', '有田市', '御坊市', '田辺市', '新宮市', '紀の川市', '岩出市']
}

// computed
const currentBusinessTypes = computed(() => {
  return businessTypesMap[formData.value.businessCategory] || []
})

// methods
const nextTab = () => {
  if (currentTab.value < tabs.length - 1) {
    currentTab.value++
  }
}

const prevTab = () => {
  if (currentTab.value > 0) {
    currentTab.value--
  }
}

const onBusinessCategoryChange = () => {
  formData.value.businessTypes = []
}

const getBusinessCategoryText = (value: string) => {
  const category = businessCategories.find(c => c.value === value)
  return category ? category.text : ''
}

// 坪⇔㎡変換
const TSUBO_TO_M2 = 3.30579

const updateAreaFromTsubo = (type: 'min' | 'max') => {
  if (type === 'min' && formData.value.areaMinTsubo) {
    formData.value.areaMinM2 = Math.round(formData.value.areaMinTsubo * TSUBO_TO_M2 * 100) / 100
  } else if (type === 'max' && formData.value.areaMaxTsubo) {
    formData.value.areaMaxM2 = Math.round(formData.value.areaMaxTsubo * TSUBO_TO_M2 * 100) / 100
  }
}

const updateTsuboFromArea = (type: 'min' | 'max') => {
  if (type === 'min' && formData.value.areaMinM2) {
    formData.value.areaMinTsubo = Math.round(formData.value.areaMinM2 / TSUBO_TO_M2 * 100) / 100
  } else if (type === 'max' && formData.value.areaMaxM2) {
    formData.value.areaMaxTsubo = Math.round(formData.value.areaMaxM2 / TSUBO_TO_M2 * 100) / 100
  }
}

// 市区町村取得
const getCitiesForPrefecture = (prefecture: string) => {
  if (prefecture === '大阪府') {
    const allCities: string[] = []
    Object.values(citiesMap['大阪府']).forEach(cities => {
      allCities.push(...cities)
    })
    return allCities
  }
  return citiesMap[prefecture] || []
}

// 選択数取得
const getSelectedCount = (category: string) => {
  return formData.value.specialConditions[category]?.length || 0
}

// フォーム送信
const submitForm = async () => {
  submitting.value = true
  
  try {
    const supabase = useSupabase()
    
    // 顧客IDを自動生成（空の場合）
    if (!formData.value.customerId) {
      formData.value.customerId = `E${Date.now().toString().slice(-8)}`
    }
    
    // データベースに保存
    const { data, error } = await supabase
      .from('entry_applications')
      .insert([
        {
          ...formData.value,
          created_at: new Date().toISOString(),
          input_type: 'staff',  // 営業による代理入力
          input_by: '営業スタッフ',  // 認証実装後はログインユーザー名
          input_at: new Date().toISOString()
        }
      ])
    
    if (error) throw error
    
    showSuccessMessage('出店希望者の登録が完了しました')
    
    // フォームリセット
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
  currentTab.value = 0
  Object.assign(formData.value, {
    createdDate: new Date().toISOString().split('T')[0],
    customerId: '',
    companyName: '',
    name: '',
    nameKana: '',
    nationality: '日本',
    mobilePhone: '',
    otherPhone: '',
    fax: '',
    loginEmail: '',
    contactEmails: [],
    storeNames: [],
    storeCount: null,
    businessCategory: '',
    businessTypes: [],
    acquisitionBudget: null,
    rentMin: null,
    rentMax: null,
    areaMinTsubo: null,
    areaMaxTsubo: null,
    areaMinM2: null,
    areaMaxM2: null,
    desiredCondition: '',
    desiredPrefectures: [],
    desiredCities: {},
    possibleFloors: [],
    specialConditions: {
      businessPermits: [],
      otherPermits: [],
      exteriorConditions: [],
      interiorConditions: [],
      locations: [],
      budgetConditions: []
    },
    searchMemo: ''
  })
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

// ページタイトル
useHead({
  title: '出店希望者 営業入力フォーム - 管理画面'
})
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}

.v-tabs {
  margin-bottom: 20px;
}

.v-window-item {
  min-height: 500px;
}

@media (max-width: 600px) {
  .v-tab {
    font-size: 0.75rem;
    min-width: auto !important;
    padding: 8px 4px !important;
  }
}

@media (min-width: 960px) {
  .v-tab {
    font-size: 1rem;
  }
}

.v-expansion-panel-content {
  padding: 16px;
}

.v-checkbox {
  margin-bottom: 8px;
}
</style>