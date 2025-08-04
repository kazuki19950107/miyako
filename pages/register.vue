<template>
  <div>
    <VRow>
      <VCol cols="12">
        <VCard elevation="2" class="mb-6">
          <VCardTitle class="text-h4 text-center py-6">
            <VIcon size="large" class="mr-3">mdi-account-plus</VIcon>
            出店希望者 会員登録
          </VCardTitle>
          <VCardText class="text-center">
            <p class="text-h6 mb-4">
              希望条件を登録して最適な物件をマッチング
            </p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12" md="10" class="mx-auto">
        <VCard elevation="2">
          <VCardTitle>
            <VIcon class="mr-2">mdi-form-select</VIcon>
            会員登録フォーム
          </VCardTitle>
          <VCardText>
            <VForm ref="registerForm" v-model="valid">
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
                    title="希望条件"
                  />
                  <VDivider />
                  <VStepperItem
                    :value="3"
                    title="登録完了"
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
                              v-model="formData.name"
                              label="氏名"
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
                          <VCol cols="12" md="6">
                            <VSelect
                              v-model="formData.registrationSource"
                              label="登録経路"
                              :items="registrationSources"
                              :rules="[rules.required]"
                              outlined
                              required
                            />
                          </VCol>
                        </VRow>
                      </VCardText>
                    </VCard>
                  </VStepperWindowItem>

                  <!-- ステップ2: 希望条件 -->
                  <VStepperWindowItem :value="2">
                    <VCard flat>
                      <VCardTitle>希望条件の設定</VCardTitle>
                      <VCardText>
                        <VRow>
                          <VCol cols="12" md="6">
                            <VTextField
                              v-model="formData.desiredArea"
                              label="希望エリア"
                              :rules="[rules.required]"
                              outlined
                              required
                              placeholder="例：渋谷区、新宿区"
                            />
                          </VCol>
                          <VCol cols="12" md="6">
                            <VSelect
                              v-model="formData.desiredBusinessType"
                              label="希望業態"
                              :items="businessTypes"
                              :rules="[rules.required]"
                              outlined
                              required
                            />
                          </VCol>
                          <VCol cols="12" md="6">
                            <VTextField
                              v-model="formData.desiredSize"
                              label="希望坪数"
                              :rules="[rules.required]"
                              outlined
                              required
                              placeholder="例：10-20坪"
                            />
                          </VCol>
                          <VCol cols="12" md="6">
                            <VTextField
                              v-model.number="formData.maxRent"
                              label="希望賃料（上限）"
                              type="number"
                              :rules="[rules.required, rules.number]"
                              outlined
                              required
                              suffix="円"
                            />
                          </VCol>
                          <VCol cols="12" md="6">
                            <VSelect
                              v-model="formData.openingPeriod"
                              label="出店時期"
                              :items="openingPeriods"
                              :rules="[rules.required]"
                              outlined
                              required
                            />
                          </VCol>
                          <VCol cols="12" md="6">
                            <VTextField
                              v-model.number="formData.budget"
                              label="初期投資予算"
                              type="number"
                              outlined
                              suffix="円"
                              placeholder="任意"
                            />
                          </VCol>
                          <VCol cols="12">
                            <VSubheader>こだわり条件（該当するものを選択）</VSubheader>
                            <VRow>
                              <VCol cols="12" md="6">
                                <VCheckbox
                                  v-model="formData.preferences.groundFloor"
                                  label="1階路面店"
                                />
                              </VCol>
                              <VCol cols="12" md="6">
                                <VCheckbox
                                  v-model="formData.preferences.kitchenEquipped"
                                  label="厨房設備付き"
                                />
                              </VCol>
                              <VCol cols="12" md="6">
                                <VCheckbox
                                  v-model="formData.preferences.parkingAvailable"
                                  label="駐車場あり"
                                />
                              </VCol>
                              <VCol cols="12" md="6">
                                <VCheckbox
                                  v-model="formData.preferences.nearStation"
                                  label="駅近（徒歩5分以内）"
                                />
                              </VCol>
                              <VCol cols="12" md="6">
                                <VCheckbox
                                  v-model="formData.preferences.renovationOk"
                                  label="改装可能"
                                />
                              </VCol>
                              <VCol cols="12" md="6">
                                <VCheckbox
                                  v-model="formData.preferences.lateNightOk"
                                  label="深夜営業可能"
                                />
                              </VCol>
                            </VRow>
                          </VCol>
                          <VCol cols="12">
                            <VTextarea
                              v-model="formData.additionalRequirements"
                              label="その他の要望・質問"
                              outlined
                              rows="3"
                            />
                          </VCol>
                        </VRow>
                      </VCardText>
                    </VCard>
                  </VStepperWindowItem>

                  <!-- ステップ3: 登録完了 -->
                  <VStepperWindowItem :value="3">
                    <VCard flat>
                      <VCardTitle class="text-center">登録完了</VCardTitle>
                      <VCardText>
                        <div class="text-center mb-6">
                          <VIcon size="64" color="success">mdi-check-circle</VIcon>
                          <p class="text-h5 mt-4">会員登録が完了しました！</p>
                        </div>
                        
                        <VRow>
                          <VCol cols="12" md="6">
                            <VCard outlined>
                              <VCardTitle>登録内容の確認</VCardTitle>
                              <VCardText>
                                <VList>
                                  <VListItem>
                                    <VListItemContent>
                                      <VListItemTitle>氏名</VListItemTitle>
                                      <VListItemSubtitle>{{ formData.name }}</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                  <VListItem>
                                    <VListItemContent>
                                      <VListItemTitle>メールアドレス</VListItemTitle>
                                      <VListItemSubtitle>{{ formData.email }}</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                  <VListItem>
                                    <VListItemContent>
                                      <VListItemTitle>希望エリア</VListItemTitle>
                                      <VListItemSubtitle>{{ formData.desiredArea }}</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                  <VListItem>
                                    <VListItemContent>
                                      <VListItemTitle>希望業態</VListItemTitle>
                                      <VListItemSubtitle>{{ formData.desiredBusinessType }}</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                  <VListItem>
                                    <VListItemContent>
                                      <VListItemTitle>希望坪数</VListItemTitle>
                                      <VListItemSubtitle>{{ formData.desiredSize }}</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                  <VListItem>
                                    <VListItemContent>
                                      <VListItemTitle>希望賃料</VListItemTitle>
                                      <VListItemSubtitle>{{ formData.maxRent?.toLocaleString() }}円以下</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                  <VListItem>
                                    <VListItemContent>
                                      <VListItemTitle>出店時期</VListItemTitle>
                                      <VListItemSubtitle>{{ formData.openingPeriod }}</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                </VList>
                              </VCardText>
                            </VCard>
                          </VCol>
                          <VCol cols="12" md="6">
                            <VCard outlined>
                              <VCardTitle>今後の流れ</VCardTitle>
                              <VCardText>
                                <VList>
                                  <VListItem>
                                    <VListItemIcon>
                                      <VIcon color="success">mdi-check</VIcon>
                                    </VListItemIcon>
                                    <VListItemContent>
                                      <VListItemTitle>マッチング開始</VListItemTitle>
                                      <VListItemSubtitle>条件に合う物件を自動検索</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                  <VListItem>
                                    <VListItemIcon>
                                      <VIcon color="info">mdi-email</VIcon>
                                    </VListItemIcon>
                                    <VListItemContent>
                                      <VListItemTitle>メール通知</VListItemTitle>
                                      <VListItemSubtitle>新着物件情報をお知らせ</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                  <VListItem>
                                    <VListItemIcon>
                                      <VIcon color="primary">mdi-account-circle</VIcon>
                                    </VListItemIcon>
                                    <VListItemContent>
                                      <VListItemTitle>マイページ利用</VListItemTitle>
                                      <VListItemSubtitle>いつでも情報確認・編集可能</VListItemSubtitle>
                                    </VListItemContent>
                                  </VListItem>
                                  <VListItem>
                                    <VListItemIcon>
                                      <VIcon color="warning">mdi-phone</VIcon>
                                    </VListItemIcon>
                                    <VListItemContent>
                                      <VListItemTitle>営業担当サポート</VListItemTitle>
                                      <VListItemSubtitle>専任担当者がサポート</VListItemSubtitle>
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
                            @click="goToMypage"
                          >
                            <VIcon class="mr-2">mdi-account-circle</VIcon>
                            マイページへ
                          </VBtn>
                        </div>
                      </VCardText>
                    </VCard>
                  </VStepperWindowItem>
                </VStepperWindow>

                <VStepperActions>
                  <VBtn
                    v-if="currentStep > 1 && currentStep < 3"
                    variant="outlined"
                    @click="currentStep--"
                  >
                    戻る
                  </VBtn>
                  <VSpacer />
                  <VBtn
                    v-if="currentStep < 3"
                    color="primary"
                    @click="nextStep"
                  >
                    {{ currentStep === 2 ? '登録完了' : '次へ' }}
                  </VBtn>
                </VStepperActions>
              </VStepper>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
// ページのメタデータ設定
useHead({
  title: '会員登録 - 居抜き物件システム',
  meta: [
    { name: 'description', content: '出店希望者の会員登録を行います' }
  ]
})

// フォームの状態管理
const valid = ref(false)
const currentStep = ref(1)
const registerForm = ref(null)

// フォームデータ
const formData = ref({
  name: '',
  email: '',
  phone: '',
  registrationSource: '',
  desiredArea: '',
  desiredBusinessType: '',
  desiredSize: '',
  maxRent: null,
  openingPeriod: '',
  budget: null,
  preferences: {
    groundFloor: false,
    kitchenEquipped: false,
    parkingAvailable: false,
    nearStation: false,
    renovationOk: false,
    lateNightOk: false
  },
  additionalRequirements: ''
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
const registrationSources = [
  'HPから直接',
  'DM・チラシ',
  'ポータルサイト',
  '紹介',
  '電話営業',
  'その他'
]

const businessTypes = [
  'カフェ',
  'レストラン',
  'ラーメン店',
  '居酒屋',
  '焼肉店',
  '寿司店',
  'バー',
  'ファストフード',
  'テイクアウト',
  'その他'
]

const openingPeriods = [
  '1ヶ月以内',
  '3ヶ月以内',
  '6ヶ月以内',
  '1年以内',
  '未定'
]

// 次のステップに進む
const nextStep = async () => {
  if (currentStep.value === 1) {
    // 基本情報のバリデーション
    const { valid } = await registerForm.value.validate()
    if (!valid) return
  }
  
  if (currentStep.value === 2) {
    // 希望条件のバリデーション
    const { valid } = await registerForm.value.validate()
    if (!valid) return
    
    // 登録処理を実行
    await registerUser()
  }
  
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

// ユーザー登録処理
const registerUser = async () => {
  try {
    // 実際の実装では、ここでSupabaseにデータを保存
    console.log('登録データ:', formData.value)
    
    // 登録成功の処理
    // メール送信、マイページ作成など
    
  } catch (error) {
    console.error('登録エラー:', error)
  }
}

// マイページへ移動
const goToMypage = () => {
  navigateTo('/mypage')
}
</script>