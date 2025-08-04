<template>
  <div>
    <VRow>
      <VCol cols="12">
        <VCard elevation="2" class="mb-6">
          <VCardTitle class="text-h4 text-center py-6">
            <VIcon size="large" class="mr-3">mdi-calculator</VIcon>
            退店物件 簡易査定
          </VCardTitle>
          <VCardText class="text-center">
            <p class="text-h6 mb-4">
              物件情報を入力して査定を開始しましょう
            </p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12" md="8" class="mx-auto">
        <VCard elevation="2">
          <VCardTitle>
            <VIcon class="mr-2">mdi-form-select</VIcon>
            査定フォーム
          </VCardTitle>
          <VCardText>
            <VForm ref="assessmentForm" v-model="valid">
              <VStepper v-model="currentStep" alt-labels>
                <VStepperHeader>
                  <VStepperItem
                    :complete="currentStep > 1"
                    :value="1"
                    title="基本情報"
                  />
                  <VDivider />
                  <VStepperItem
                    :complete="currentStep > 2"
                    :value="2"
                    title="物件詳細"
                  />
                  <VDivider />
                  <VStepperItem
                    :complete="currentStep > 3"
                    :value="3"
                    title="連絡先情報"
                  />
                  <VDivider />
                  <VStepperItem
                    :value="4"
                    title="査定結果"
                  />
                </VStepperHeader>

                <VStepperWindow>
                  <!-- ステップ1: 基本情報 -->
                  <VStepperWindowItem :value="1">
                    <VCard flat>
                      <VCardTitle>基本情報の入力</VCardTitle>
                      <VCardText>
                        <VRow>
                          <VCol cols="12" md="6">
                            <VTextField
                              v-model="formData.location"
                              label="所在地（市区町村）"
                              :rules="[rules.required]"
                              outlined
                              required
                            />
                          </VCol>
                          <VCol cols="12" md="6">
                            <VTextField
                              v-model="formData.postalCode"
                              label="郵便番号"
                              placeholder="123-4567"
                              outlined
                            />
                          </VCol>
                          <VCol cols="12" md="6">
                            <VTextField
                              v-model.number="formData.area"
                              label="坪数"
                              type="number"
                              :rules="[rules.required, rules.number]"
                              outlined
                              required
                              suffix="坪"
                            />
                          </VCol>
                          <VCol cols="12" md="6">
                            <VTextField
                              v-model.number="formData.rent"
                              label="月額家賃"
                              type="number"
                              :rules="[rules.required, rules.number]"
                              outlined
                              required
                              suffix="円"
                            />
                          </VCol>
                          <VCol cols="12" md="6">
                            <VTextField
                              v-model="formData.contractPeriod"
                              label="残契約期間"
                              :rules="[rules.required]"
                              outlined
                              required
                              placeholder="例：1年6ヶ月"
                            />
                          </VCol>
                          <VCol cols="12" md="6">
                            <VSelect
                              v-model="formData.businessType"
                              label="業態"
                              :items="businessTypes"
                              :rules="[rules.required]"
                              outlined
                              required
                            />
                          </VCol>
                          <VCol cols="12" md="6">
                            <VSelect
                              v-model="formData.operatingStatus"
                              label="営業状態"
                              :items="operatingStatuses"
                              :rules="[rules.required]"
                              outlined
                              required
                            />
                          </VCol>
                        </VRow>
                      </VCardText>
                    </VCard>
                  </VStepperWindowItem>

                  <!-- ステップ2: 物件詳細 -->
                  <VStepperWindowItem :value="2">
                    <VCard flat>
                      <VCardTitle>設備・詳細情報</VCardTitle>
                      <VCardText>
                        <VRow>
                          <VCol cols="12">
                            <VSubheader>設備残存状況</VSubheader>
                            <VRow>
                              <VCol cols="12" md="6">
                                <VCheckbox
                                  v-model="formData.equipment.kitchen"
                                  label="厨房設備"
                                />
                              </VCol>
                              <VCol cols="12" md="6">
                                <VCheckbox
                                  v-model="formData.equipment.airCondition"
                                  label="空調設備"
                                />
                              </VCol>
                              <VCol cols="12" md="6">
                                <VCheckbox
                                  v-model="formData.equipment.furniture"
                                  label="家具・什器"
                                />
                              </VCol>
                              <VCol cols="12" md="6">
                                <VCheckbox
                                  v-model="formData.equipment.pos"
                                  label="POSシステム"
                                />
                              </VCol>
                              <VCol cols="12" md="6">
                                <VCheckbox
                                  v-model="formData.equipment.sound"
                                  label="音響設備"
                                />
                              </VCol>
                              <VCol cols="12" md="6">
                                <VCheckbox
                                  v-model="formData.equipment.lighting"
                                  label="照明設備"
                                />
                              </VCol>
                            </VRow>
                          </VCol>
                          <VCol cols="12">
                            <VTextField
                              v-model="formData.storeName"
                              label="店舗名（任意）"
                              outlined
                            />
                          </VCol>
                          <VCol cols="12">
                            <VTextField
                              v-model="formData.desiredExitDate"
                              label="退去希望時期"
                              outlined
                              placeholder="例：2025年12月末"
                            />
                          </VCol>
                          <VCol cols="12">
                            <VTextField
                              v-model.number="formData.desiredPrice"
                              label="希望譲渡金額（任意）"
                              type="number"
                              outlined
                              suffix="円"
                            />
                          </VCol>
                          <VCol cols="12">
                            <VFileInput
                              v-model="formData.photos"
                              label="物件写真（任意）"
                              multiple
                              accept="image/*"
                              outlined
                            />
                          </VCol>
                          <VCol cols="12">
                            <VTextarea
                              v-model="formData.remarks"
                              label="備考欄"
                              outlined
                              rows="3"
                            />
                          </VCol>
                        </VRow>
                      </VCardText>
                    </VCard>
                  </VStepperWindowItem>

                  <!-- ステップ3: 連絡先情報 -->
                  <VStepperWindowItem :value="3">
                    <VCard flat>
                      <VCardTitle>連絡先情報</VCardTitle>
                      <VCardText>
                        <VRow>
                          <VCol cols="12" md="6">
                            <VTextField
                              v-model="formData.ownerName"
                              label="オーナー氏名"
                              :rules="[rules.required]"
                              outlined
                              required
                            />
                          </VCol>
                          <VCol cols="12" md="6">
                            <VTextField
                              v-model="formData.email"
                              label="メールアドレス"
                              type="email"
                              :rules="[rules.required, rules.email]"
                              outlined
                              required
                            />
                          </VCol>
                          <VCol cols="12" md="6">
                            <VTextField
                              v-model="formData.phone"
                              label="電話番号"
                              :rules="[rules.required, rules.phone]"
                              outlined
                              required
                            />
                          </VCol>
                          <VCol cols="12">
                            <VCheckbox
                              v-model="formData.agreeTerms"
                              :rules="[rules.required]"
                              required
                            >
                              <template #label>
                                <span>
                                  <a href="#" @click.prevent="showTerms = true">利用規約</a>
                                  および
                                  <a href="#" @click.prevent="showPrivacy = true">プライバシーポリシー</a>
                                  に同意する
                                </span>
                              </template>
                            </VCheckbox>
                          </VCol>
                        </VRow>
                      </VCardText>
                    </VCard>
                  </VStepperWindowItem>

                  <!-- ステップ4: 査定結果 -->
                  <VStepperWindowItem :value="4">
                    <VCard flat>
                      <VCardTitle class="text-center">査定結果</VCardTitle>
                      <VCardText>
                        <div class="text-center mb-6">
                          <VCard color="primary" dark class="mx-auto" max-width="400">
                            <VCardTitle class="text-h5">推定譲渡価格</VCardTitle>
                            <VCardText>
                              <div class="text-h3">{{ assessmentResult.toLocaleString() }}円</div>
                              <div class="text-body-2">※この金額は概算です</div>
                            </VCardText>
                          </VCard>
                        </div>
                        
                        <VRow>
                          <VCol cols="12" md="6">
                            <VCard outlined>
                              <VCardTitle>査定の内訳</VCardTitle>
                              <VCardText>
                                <VList>
                                  <VListItem>
                                    <VListItemContent>
                                      <VListItemTitle>基本査定額</VListItemTitle>
                                      <VListItemSubtitle>{{ baseAssessment.toLocaleString() }}円</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                  <VListItem>
                                    <VListItemContent>
                                      <VListItemTitle>設備加算</VListItemTitle>
                                      <VListItemSubtitle>{{ equipmentBonus.toLocaleString() }}円</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                  <VListItem>
                                    <VListItemContent>
                                      <VListItemTitle>立地補正</VListItemTitle>
                                      <VListItemSubtitle>{{ locationBonus.toLocaleString() }}円</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                </VList>
                              </VCardText>
                            </VCard>
                          </VCol>
                          <VCol cols="12" md="6">
                            <VCard outlined>
                              <VCardTitle>次のステップ</VCardTitle>
                              <VCardText>
                                <VList>
                                  <VListItem>
                                    <VListItemIcon>
                                      <VIcon color="primary">mdi-check</VIcon>
                                    </VListItemIcon>
                                    <VListItemContent>
                                      <VListItemTitle>マイページ作成</VListItemTitle>
                                      <VListItemSubtitle>情報管理が可能になります</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                  <VListItem>
                                    <VListItemIcon>
                                      <VIcon color="primary">mdi-check</VIcon>
                                    </VListItemIcon>
                                    <VListItemContent>
                                      <VListItemTitle>マッチング開始</VListItemTitle>
                                      <VListItemSubtitle>適した出店者を探します</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                  <VListItem>
                                    <VListItemIcon>
                                      <VIcon color="primary">mdi-check</VIcon>
                                    </VListItemIcon>
                                    <VListItemContent>
                                      <VListItemTitle>営業担当連絡</VListItemTitle>
                                      <VListItemSubtitle>詳細な相談が可能です</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                </VList>
                              </VCardText>
                            </VCard>
                          </VCol>
                        </VRow>
                        
                        <div class="text-center mt-6">
                          <VBtn
                            color="primary"
                            size="large"
                            @click="completeAssessment"
                          >
                            <VIcon class="mr-2">mdi-account-plus</VIcon>
                            マイページを作成する
                          </VBtn>
                        </div>
                      </VCardText>
                    </VCard>
                  </VStepperWindowItem>
                </VStepperWindow>

                <VStepperActions>
                  <VBtn
                    v-if="currentStep > 1"
                    variant="outlined"
                    @click="currentStep--"
                  >
                    戻る
                  </VBtn>
                  <VSpacer />
                  <VBtn
                    v-if="currentStep < 4"
                    color="primary"
                    @click="nextStep"
                  >
                    次へ
                  </VBtn>
                </VStepperActions>
              </VStepper>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 利用規約ダイアログ -->
    <VDialog v-model="showTerms" max-width="600">
      <VCard>
        <VCardTitle>利用規約</VCardTitle>
        <VCardText>
          <p>利用規約の内容がここに表示されます。</p>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn color="primary" @click="showTerms = false">
            閉じる
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- プライバシーポリシーダイアログ -->
    <VDialog v-model="showPrivacy" max-width="600">
      <VCard>
        <VCardTitle>プライバシーポリシー</VCardTitle>
        <VCardText>
          <p>プライバシーポリシーの内容がここに表示されます。</p>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn color="primary" @click="showPrivacy = false">
            閉じる
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
// ページのメタデータ設定
useHead({
  title: '簡易査定 - 居抜き物件システム',
  meta: [
    { name: 'description', content: '退店物件の簡易査定を行います' }
  ]
})

// フォームの状態管理
const valid = ref(false)
const currentStep = ref(1)
const assessmentForm = ref(null)
const showTerms = ref(false)
const showPrivacy = ref(false)

// フォームデータ
const formData = ref({
  location: '',
  postalCode: '',
  area: null,
  rent: null,
  contractPeriod: '',
  businessType: '',
  operatingStatus: '',
  equipment: {
    kitchen: false,
    airCondition: false,
    furniture: false,
    pos: false,
    sound: false,
    lighting: false
  },
  storeName: '',
  desiredExitDate: '',
  desiredPrice: null,
  photos: [],
  remarks: '',
  ownerName: '',
  email: '',
  phone: '',
  agreeTerms: false
})

// バリデーションルール
const rules = {
  required: value => !!value || '必須項目です',
  number: value => (!isNaN(value) && value > 0) || '正の数値を入力してください',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'メールアドレスの形式が正しくありません'
  },
  phone: value => {
    const pattern = /^[0-9-]+$/
    return pattern.test(value) || '電話番号の形式が正しくありません'
  }
}

// 選択肢データ
const businessTypes = [
  '居酒屋',
  'カフェ',
  'レストラン',
  'ラーメン店',
  '焼肉店',
  '寿司店',
  'その他'
]

const operatingStatuses = [
  '営業中',
  '閉店済',
  '休業中'
]

// 査定結果（計算式）
const assessmentResult = computed(() => {
  if (!formData.value.area || !formData.value.rent) return 0
  return baseAssessment.value + equipmentBonus.value + locationBonus.value
})

const baseAssessment = computed(() => {
  if (!formData.value.area || !formData.value.rent) return 0
  return Math.floor(formData.value.area * 10000 + formData.value.rent * 2)
})

const equipmentBonus = computed(() => {
  const equipment = formData.value.equipment
  let bonus = 0
  if (equipment.kitchen) bonus += 100000
  if (equipment.airCondition) bonus += 50000
  if (equipment.furniture) bonus += 30000
  if (equipment.pos) bonus += 20000
  if (equipment.sound) bonus += 10000
  if (equipment.lighting) bonus += 10000
  return bonus
})

const locationBonus = computed(() => {
  const location = formData.value.location.toLowerCase()
  if (location.includes('渋谷') || location.includes('新宿') || location.includes('銀座')) {
    return 200000
  }
  if (location.includes('東京') || location.includes('大阪')) {
    return 100000
  }
  return 50000
})

// 次のステップに進む
const nextStep = async () => {
  if (currentStep.value === 3) {
    const { valid } = await assessmentForm.value.validate()
    if (!valid) return
  }
  
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

// 査定完了
const completeAssessment = () => {
  // 実際の実装では、ここでデータをSupabaseに保存
  // マイページにリダイレクト
  navigateTo('/mypage')
}
</script>