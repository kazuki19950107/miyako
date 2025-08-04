<template>
  <v-container style="max-width: 1280px; overflow-x: hidden;">
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-card class="mt-5">
          <v-card-title class="text-center" style="background-color: #2e7d32; color: white;">
            <v-icon left style="color: white;">mdi-store-remove</v-icon>
            退店入力フォーム
          </v-card-title>
          
          <v-card-text style="overflow-x: hidden;">
            <v-stepper
              v-model="currentStep"
              class="elevation-0"
              style="max-width: 100%; overflow-x: hidden;"
            >
              <v-stepper-header>
                <template v-for="(step, index) in steps" :key="step.number">
                  <v-stepper-step 
                    :complete="currentStep > step.number" 
                    :step="step.number"
                    class="pa-2"
                  >
                    <span class="stepper-text">{{ step.label }}</span>
                  </v-stepper-step>
                  <v-divider 
                    v-if="index < steps.length - 1"
                    class="mx-1 mx-sm-4"
                  ></v-divider>
                </template>
              </v-stepper-header>

              <v-stepper-items>
                <!-- ステップ1: 簡易査定 -->
                <v-stepper-content step="1" class="pa-4">
                  <v-form ref="assessmentForm" v-model="assessmentValid">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.location"
                          label="所在地（市区町村）"
                          :rules="[v => !!v || '所在地は必須です']"
                          prepend-icon="mdi-map-marker"
                          required
                          class="mb-3"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.area"
                          label="坪数・面積"
                          :rules="[v => !!v || '坪数・面積は必須です']"
                          prepend-icon="mdi-ruler-square"
                          suffix="坪"
                          type="number"
                          required
                          class="mb-3"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.rent"
                          label="家賃（月額）"
                          :rules="[v => !!v || '家賃は必須です']"
                          prepend-icon="mdi-currency-jpy"
                          suffix="円"
                          type="number"
                          required
                          class="mb-3"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.contractPeriod"
                          label="残契約期間"
                          :rules="[v => !!v || '残契約期間は必須です']"
                          prepend-icon="mdi-calendar"
                          suffix="ヶ月"
                          type="number"
                          required
                          class="mb-3"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="formData.businessType"
                          :items="businessTypes"
                          label="業態"
                          :rules="[v => !!v || '業態は必須です']"
                          prepend-icon="mdi-store"
                          required
                          class="mb-3"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="formData.operationStatus"
                          :items="operationStatuses"
                          label="営業状態"
                          :rules="[v => !!v || '営業状態は必須です']"
                          prepend-icon="mdi-information"
                          required
                          class="mb-3"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-card outlined>
                          <v-card-title class="text-subtitle-1">
                            <v-icon left>mdi-wrench</v-icon>
                            設備残存状況
                          </v-card-title>
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" md="4" v-for="equipment in equipmentList" :key="equipment.key">
                                <v-checkbox
                                  v-model="formData.equipmentStatus[equipment.key]"
                                  :label="equipment.label"
                                  :value="true"
                                />
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-form>
                  
                  <v-btn
                    color="primary"
                    @click="nextStep"
                    :disabled="!assessmentValid"
                    class="mt-4"
                  >
                    次へ
                    <v-icon right>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-stepper-content>

                <!-- ステップ2: 詳細情報 -->
                <v-stepper-content step="2">
                  <v-form ref="detailForm" v-model="detailValid">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.storeName"
                          label="店舗名（任意）"
                          prepend-icon="mdi-store"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.ownerName"
                          label="オーナー氏名"
                          :rules="[v => !!v || 'オーナー氏名は必須です']"
                          prepend-icon="mdi-account"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.email"
                          label="メールアドレス"
                          :rules="[
                            v => !!v || 'メールアドレスは必須です',
                            v => /.+@.+\..+/.test(v) || 'メールアドレスの形式が正しくありません'
                          ]"
                          prepend-icon="mdi-email"
                          type="email"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.phone"
                          label="電話番号"
                          :rules="[v => !!v || '電話番号は必須です']"
                          prepend-icon="mdi-phone"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.exitDate"
                          label="退去希望時期"
                          :rules="[v => !!v || '退去希望時期は必須です']"
                          prepend-icon="mdi-calendar-export"
                          type="date"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.desiredPrice"
                          label="希望譲渡金額（任意）"
                          prepend-icon="mdi-currency-jpy"
                          suffix="円"
                          type="number"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-file-input
                          v-model="formData.photos"
                          label="写真（任意）"
                          prepend-icon="mdi-camera"
                          accept="image/*"
                          multiple
                          chips
                          show-size
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="formData.remarks"
                          label="備考欄"
                          prepend-icon="mdi-note-text"
                          rows="3"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                  
                  <v-btn
                    text
                    @click="prevStep"
                    class="mt-4 mr-2"
                  >
                    <v-icon left>mdi-arrow-left</v-icon>
                    戻る
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="calculateAssessment"
                    :disabled="!detailValid"
                    :loading="calculating"
                    class="mt-4"
                  >
                    査定実行
                    <v-icon right>mdi-calculator</v-icon>
                  </v-btn>
                </v-stepper-content>

                <!-- ステップ3: 完了 -->
                <v-stepper-content step="3">
                  <v-card outlined class="mb-4">
                    <v-card-title class="d-flex align-center justify-center py-4" style="background-color: #4caf50; color: white;">
                      <v-icon size="28" class="mr-2" style="color: white;">mdi-check-circle</v-icon>
                      <span class="text-h5">査定が完了しました</span>
                    </v-card-title>
                    <v-card-text class="pa-4 pa-md-6">
                      <v-row justify="center" align="center">
                        <v-col cols="12" md="10" lg="8">
                          <v-card class="mb-4" color="green lighten-5" flat>
                            <v-card-text class="text-center pa-4 pa-md-6">
                              <div class="text-overline mb-2">査定金額</div>
                              <div class="text-h3 text-md-h2 font-weight-bold green--text text--darken-3">
                                ¥{{ assessmentResult.toLocaleString() }}
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                      
                      <v-row justify="center">
                        <v-col cols="12" md="10" lg="8">
                          <v-card outlined>
                            <v-card-title class="text-subtitle-1 grey lighten-4">
                              <v-icon left>mdi-account-circle</v-icon>
                              マイページログイン情報
                            </v-card-title>
                            <v-card-text class="pa-4">
                              <v-row>
                                <v-col cols="12" sm="6">
                                  <div class="text-overline mb-1">ログインID</div>
                                  <div class="text-h6 font-weight-medium">{{ generatedId }}</div>
                                </v-col>
                                <v-col cols="12" sm="6">
                                  <div class="text-overline mb-1">パスワード</div>
                                  <div class="text-h6 font-weight-medium">{{ generatedPassword }}</div>
                                </v-col>
                              </v-row>
                              <v-alert 
                                type="info" 
                                dense 
                                text 
                                class="mt-3 mb-0"
                              >
                                ※ログイン情報は退店希望者様へお渡しください
                              </v-alert>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                  
                  <v-btn
                    color="success"
                    @click="completeRegistration"
                    :loading="submitting"
                    class="mt-4"
                  >
                    登録完了
                    <v-icon right>mdi-check</v-icon>
                  </v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
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
import { useAuthStore } from '@/stores/auth'

// テスト段階のため認証チェックをスキップ
// 本番環境では以下のコメントを外して認証を有効化
/*
const authStore = useAuthStore()
if (!authStore.isAuthenticated) {
  await navigateTo('/admin/login')
}
*/

// リアクティブデータ
const currentStep = ref(1)
const assessmentValid = ref(false)
const detailValid = ref(false)
const calculating = ref(false)
const submitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// 査定結果とマイページ情報
const assessmentResult = ref(0)
const generatedId = ref('')
const generatedPassword = ref('')

// フォームデータ
const formData = ref({
  location: '',
  area: '',
  rent: '',
  contractPeriod: '',
  businessType: '',
  operationStatus: '',
  equipmentStatus: {
    kitchen: false,
    airConditioning: false,
    refrigerator: false,
    cashRegister: false,
    furniture: false,
    lightingSound: false
  },
  storeName: '',
  ownerName: '',
  email: '',
  phone: '',
  exitDate: '',
  desiredPrice: '',
  photos: [],
  remarks: ''
})

// ステップ定義
const steps = [
  { number: 1, label: '簡易査定' },
  { number: 2, label: '詳細情報' },
  { number: 3, label: '完了' }
]

// 選択肢データ
const businessTypes = [
  '居酒屋',
  'レストラン',
  'カフェ',
  'ラーメン店',
  'バー',
  'ファストフード',
  'その他'
]

const operationStatuses = [
  '営業中',
  '閉店済',
  '休業中'
]

const equipmentList = [
  { key: 'kitchen', label: '厨房設備' },
  { key: 'airConditioning', label: '空調設備' },
  { key: 'refrigerator', label: '冷蔵・冷凍設備' },
  { key: 'cashRegister', label: 'レジ・POS' },
  { key: 'furniture', label: '家具・什器' },
  { key: 'lightingSound', label: '照明・音響' }
]

// ステップ制御
const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 査定計算
const calculateAssessment = async () => {
  calculating.value = true
  
  try {
    // 簡易査定ロジック（実際の査定アルゴリズムに置き換える）
    const baseValue = parseInt(formData.value.rent) * 12 * 2 // 家賃の2年分を基準
    const areaBonus = parseInt(formData.value.area) * 10000 // 坪数ボーナス
    const equipmentBonus = Object.values(formData.value.equipmentStatus).filter(Boolean).length * 50000 // 設備ボーナス
    
    assessmentResult.value = baseValue + areaBonus + equipmentBonus
    
    // マイページ情報生成
    generatedId.value = `T${Date.now().toString().slice(-6)}`
    generatedPassword.value = Math.random().toString(36).slice(-8)
    
    await new Promise(resolve => setTimeout(resolve, 2000)) // 査定計算シミュレーション
    
    nextStep()
  } catch (error) {
    console.error('査定エラー:', error)
    showErrorMessage('査定中にエラーが発生しました')
  } finally {
    calculating.value = false
  }
}

// 登録完了
const completeRegistration = async () => {
  submitting.value = true
  
  try {
    const supabase = useSupabase()
    
    // データベースに保存
    const { data, error } = await supabase
      .from('tenant_applications')
      .insert([
        {
          ...formData.value,
          assessment_result: assessmentResult.value,
          mypage_id: generatedId.value,
          mypage_password: generatedPassword.value,
          created_by: authStore.userId,
          created_at: new Date().toISOString()
        }
      ])
    
    if (error) throw error
    
    showSuccessMessage('退店希望者の登録が完了しました')
    
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
  currentStep.value = 1
  formData.value = {
    location: '',
    area: '',
    rent: '',
    contractPeriod: '',
    businessType: '',
    operationStatus: '',
    equipmentStatus: {
      kitchen: false,
      airConditioning: false,
      refrigerator: false,
      cashRegister: false,
      furniture: false,
      lightingSound: false
    },
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    exitDate: '',
    desiredPrice: '',
    photos: [],
    remarks: ''
  }
  assessmentResult.value = 0
  generatedId.value = ''
  generatedPassword.value = ''
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
  title: '退店希望者 代理入力フォーム - 管理画面'
})
</script>

<style scoped>
.v-stepper {
  box-shadow: none;
}

.v-stepper-header {
  box-shadow: none;
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 0;
}

.v-stepper-header .v-divider {
  margin: 0 8px;
}

@media (max-width: 959px) {
  .v-stepper-header {
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
  }
  
  .v-stepper-header::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
  }
  
  .v-stepper-header .v-stepper-step {
    flex-shrink: 0;
  }
}

.v-card-title {
  font-weight: bold;
}

.green--text.text--darken-3 {
  color: #2e7d32 !important;
}

/* ステッパーのテキストサイズ調整 */
.stepper-text {
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 600px) {
  .stepper-text {
    font-size: 0.75rem;
  }
  
  .v-stepper-step {
    min-width: auto !important;
    padding: 8px 4px !important;
  }
}

@media (min-width: 960px) {
  .stepper-text {
    font-size: 1rem;
  }
}
</style>