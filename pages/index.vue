<template>
  <v-container fluid class="pa-0">
    <!-- ヒーローセクション -->
    <section class="hero-section">
      <v-container>
        <v-row align="center" justify="center" class="hero-content">
          <v-col cols="12" md="10" lg="8">
            <h1 class="hero-title">
              飲食店居抜き物件の<br class="d-sm-none">最適なマッチングを
            </h1>
            <p class="hero-subtitle">
              退店希望者と出店希望者を繋ぐ、<br class="d-sm-none">信頼のプラットフォーム
            </p>
            <v-row class="mt-8" justify="center">
              <v-col cols="12" sm="5" md="4">
                <v-btn
                  block
                  size="x-large"
                  color="primary"
                  elevation="4"
                  @click="scrollToQuickEstimate"
                  class="hero-btn"
                >
                  <v-icon start>mdi-calculator</v-icon>
                  60秒で簡易査定
                </v-btn>
              </v-col>
              <v-col cols="12" sm="5" md="4">
                <v-btn
                  block
                  size="x-large"
                  color="white"
                  elevation="4"
                  @click="$router.push('/register')"
                  class="hero-btn-outline"
                >
                  <v-icon start>mdi-account-plus</v-icon>
                  新規会員登録
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 簡易査定セクション -->
    <section class="quick-estimate-section">
      <QuickEstimate />
    </section>

    <!-- サービス概要 -->
    <section class="py-16 bg-light">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center mb-12">
            <h2 class="section-title">サービスの特徴</h2>
            <p class="section-subtitle">
              居抜き物件の取引を、もっとスムーズに、もっと確実に
            </p>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12" md="4" class="mb-8">
            <v-card elevation="0" class="feature-card h-100">
              <v-card-text class="text-center pa-8">
                <v-avatar size="80" color="primary-lighten-4" class="mb-6">
                  <v-icon size="40" color="primary">mdi-speedometer</v-icon>
                </v-avatar>
                <h3 class="feature-title">スピード査定</h3>
                <p class="feature-description">
                  最短1分で物件の簡易査定が完了。市場価値を即座に把握できます。
                </p>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="4" class="mb-8">
            <v-card elevation="0" class="feature-card h-100">
              <v-card-text class="text-center pa-8">
                <v-avatar size="80" color="primary-lighten-4" class="mb-6">
                  <v-icon size="40" color="primary">mdi-target</v-icon>
                </v-avatar>
                <h3 class="feature-title">精度の高いマッチング</h3>
                <p class="feature-description">
                  エリア・業態・予算など、詳細な条件設定で最適な物件をご提案。
                </p>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="4" class="mb-8">
            <v-card elevation="0" class="feature-card h-100">
              <v-card-text class="text-center pa-8">
                <v-avatar size="80" color="primary-lighten-4" class="mb-6">
                  <v-icon size="40" color="primary">mdi-shield-check</v-icon>
                </v-avatar>
                <h3 class="feature-title">安心のサポート</h3>
                <p class="feature-description">
                  専門スタッフが取引完了まで丁寧にサポート。安心してお任せください。
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ユーザータイプ別案内 -->
    <section class="py-16">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center mb-12">
            <h2 class="section-title">ご利用方法</h2>
            <p class="section-subtitle">
              お客様のニーズに合わせて、2つのサービスをご用意しています
            </p>
          </v-col>
        </v-row>

        <v-row>
          <!-- 退店希望者 -->
          <v-col cols="12" lg="6" class="mb-8">
            <v-card elevation="8" class="user-type-card h-100">
              <v-card-text class="pa-8">
                <div class="user-type-header">
                  <v-icon size="48" color="primary">mdi-store-minus</v-icon>
                  <h3 class="user-type-title">退店希望者の方へ</h3>
                </div>
                
                <p class="user-type-description">
                  営業中の店舗を手放したい、スムーズに退店したい方のためのサービスです。
                </p>

                <v-divider class="my-6" />

                <div class="process-list">
                  <div class="process-item">
                    <v-icon color="primary" class="mr-3">mdi-numeric-1-circle</v-icon>
                    <div>
                      <h4>簡易査定</h4>
                      <p>物件情報を入力して、即座に査定結果を確認</p>
                    </div>
                  </div>
                  
                  <div class="process-item">
                    <v-icon color="primary" class="mr-3">mdi-numeric-2-circle</v-icon>
                    <div>
                      <h4>物件登録</h4>
                      <p>詳細情報と写真を登録して、出店希望者へアピール</p>
                    </div>
                  </div>
                  
                  <div class="process-item">
                    <v-icon color="primary" class="mr-3">mdi-numeric-3-circle</v-icon>
                    <div>
                      <h4>マッチング</h4>
                      <p>条件に合う出店希望者とのマッチングをサポート</p>
                    </div>
                  </div>
                </div>

                <v-btn
                  block
                  size="large"
                  color="primary"
                  class="mt-8"
                  @click="$router.push('/assessment')"
                >
                  無料査定を始める
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 出店希望者 -->
          <v-col cols="12" lg="6" class="mb-8">
            <v-card elevation="8" class="user-type-card h-100">
              <v-card-text class="pa-8">
                <div class="user-type-header">
                  <v-icon size="48" color="secondary">mdi-store-plus</v-icon>
                  <h3 class="user-type-title">出店希望者の方へ</h3>
                </div>
                
                <p class="user-type-description">
                  居抜き物件で新規出店をお考えの方のためのサービスです。
                </p>

                <v-divider class="my-6" />

                <div class="process-list">
                  <div class="process-item">
                    <v-icon color="secondary" class="mr-3">mdi-numeric-1-circle</v-icon>
                    <div>
                      <h4>会員登録</h4>
                      <p>希望条件を登録して、マッチング開始</p>
                    </div>
                  </div>
                  
                  <div class="process-item">
                    <v-icon color="secondary" class="mr-3">mdi-numeric-2-circle</v-icon>
                    <div>
                      <h4>物件検索</h4>
                      <p>条件に合う物件を検索・閲覧</p>
                    </div>
                  </div>
                  
                  <div class="process-item">
                    <v-icon color="secondary" class="mr-3">mdi-numeric-3-circle</v-icon>
                    <div>
                      <h4>商談</h4>
                      <p>気になる物件があれば、スタッフがサポート</p>
                    </div>
                  </div>
                </div>

                <v-btn
                  block
                  size="large"
                  color="secondary"
                  class="mt-8"
                  @click="$router.push('/register')"
                >
                  会員登録する
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 問い合わせセクション -->
    <section class="contact-section py-16">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center mb-12">
            <h2 class="section-title">お気軽にご相談ください</h2>
            <p class="section-subtitle">
              査定結果について詳しく知りたい、売却を検討している、<br class="d-sm-none">
              そんな時はお気軽にご連絡ください。専門スタッフが丁寧にサポートいたします。
            </p>
          </v-col>
        </v-row>

        <v-row>
          <!-- お問い合わせ方法選択（左側） -->
          <v-col cols="12" lg="4" class="mb-8">
            <div class="contact-methods">
              <h3 class="text-h6 font-weight-bold mb-6 text-center">ご相談方法をお選びください</h3>
              
              <!-- 電話での相談 -->
              <v-card elevation="2" class="contact-method-card mb-4" @click="selectContactMethod('phone')">
                <v-card-text class="pa-6">
                  <div class="d-flex align-center mb-3">
                    <v-avatar size="50" color="primary-lighten-4" class="mr-4">
                      <v-icon size="24" color="primary">mdi-phone</v-icon>
                    </v-avatar>
                    <div>
                      <h4 class="text-h6 font-weight-bold">お電話でのご相談</h4>
                      <p class="text-body-2 text-grey-darken-1 mb-0">すぐに専門スタッフと話せます</p>
                    </div>
                  </div>
                  <div class="contact-info">
                    <div class="text-h5 font-weight-bold text-primary mb-1">03-XXXX-XXXX</div>
                    <div class="text-body-2 text-grey-darken-2">営業時間: 平日 9:00-18:00</div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- LINE相談 -->
              <v-card elevation="2" class="contact-method-card mb-4" @click="selectContactMethod('line')">
                <v-card-text class="pa-6">
                  <div class="d-flex align-center mb-3">
                    <v-avatar size="50" color="green-lighten-4" class="mr-4">
                      <v-icon size="24" color="green">mdi-chat</v-icon>
                    </v-avatar>
                    <div>
                      <h4 class="text-h6 font-weight-bold">LINEでのご相談</h4>
                      <p class="text-body-2 text-grey-darken-1 mb-0">24時間いつでも気軽に</p>
                    </div>
                  </div>
                  <v-btn color="green" variant="tonal" size="small" block>
                    <v-icon start>mdi-line</v-icon>
                    LINE友達追加
                  </v-btn>
                </v-card-text>
              </v-card>

              <!-- メール相談 -->
              <v-card elevation="2" class="contact-method-card" @click="selectContactMethod('email')">
                <v-card-text class="pa-6">
                  <div class="d-flex align-center mb-3">
                    <v-avatar size="50" color="orange-lighten-4" class="mr-4">
                      <v-icon size="24" color="orange">mdi-email</v-icon>
                    </v-avatar>
                    <div>
                      <h4 class="text-h6 font-weight-bold">メールでのご相談</h4>
                      <p class="text-body-2 text-grey-darken-1 mb-0">じっくり詳細をお聞かせください</p>
                    </div>
                  </div>
                  <div class="text-body-2 text-grey-darken-2">
                    <v-icon size="16" class="mr-1">mdi-email-outline</v-icon>
                    info@miyako-inuki.jp
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-col>

          <!-- お問い合わせフォーム（右側） -->
          <v-col cols="12" lg="8">
            <v-card elevation="4" class="contact-form-card">
              <v-card-title class="contact-form-header">
                <v-icon color="white" class="mr-2">mdi-message-text</v-icon>
                お問い合わせフォーム
              </v-card-title>

              <v-card-text class="pa-8">
                <v-form ref="contactForm" @submit.prevent="submitContactForm">
                  <v-row>
                    <!-- お名前 -->
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="contactForm.name"
                        label="お名前"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-account"
                        placeholder="山田 太郎"
                        required
                      ></v-text-field>
                    </v-col>

                    <!-- メールアドレス -->
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="contactForm.email"
                        label="メールアドレス"
                        :rules="[rules.required, rules.email]"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-email"
                        placeholder="example@email.com"
                        required
                      ></v-text-field>
                    </v-col>

                    <!-- 電話番号 -->
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="contactForm.phone"
                        label="電話番号"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-phone"
                        placeholder="03-1234-5678"
                        hint="お電話での連絡をご希望の場合"
                        persistent-hint
                      ></v-text-field>
                    </v-col>

                    <!-- 相談内容のカテゴリ -->
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="contactForm.category"
                        :items="contactCategories"
                        label="ご相談内容"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-format-list-bulleted"
                        required
                      ></v-select>
                    </v-col>

                    <!-- 物件情報（任意） -->
                    <v-col cols="12">
                      <v-textarea
                        v-model="contactForm.propertyInfo"
                        label="物件情報（任意）"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-home"
                        placeholder="所在地、面積、業態など分かる範囲で"
                        hint="より具体的なアドバイスのために"
                        persistent-hint
                        rows="2"
                      ></v-textarea>
                    </v-col>

                    <!-- メッセージ -->
                    <v-col cols="12">
                      <v-textarea
                        v-model="contactForm.message"
                        label="メッセージ"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-message-text"
                        placeholder="査定結果について詳しく聞きたい、売却を検討している等、お気軽にご記入ください"
                        required
                        rows="4"
                      ></v-textarea>
                    </v-col>

                    <!-- プライバシーポリシー同意 -->
                    <v-col cols="12">
                      <v-checkbox
                        v-model="contactForm.privacy"
                        :rules="[rules.required]"
                        required
                        label="プライバシーポリシーに同意する"
                      >
                      </v-checkbox>
                    </v-col>

                    <!-- 送信ボタン -->
                    <v-col cols="12" class="text-center">
                      <v-btn
                        type="submit"
                        color="primary"
                        size="x-large"
                        elevation="4"
                        :loading="submitting"
                        :disabled="!isContactFormValid"
                        class="contact-submit-btn"
                      >
                        <v-icon start>mdi-send</v-icon>
                        お問い合わせを送信
                      </v-btn>
                      
                      <p class="text-body-2 text-grey-darken-2 mt-4 mb-0">
                        通常1営業日以内にご返信いたします
                      </p>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- フッター情報 -->
    <section class="py-8 bg-light">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center">
            <p class="footer-info">
              営業時間: 平日 9:00-18:00 | 電話: 03-XXXX-XXXX | メール: info@miyako-inuki.jp
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import QuickEstimate from '@/components/QuickEstimate.vue'

// 簡易査定セクションへのスムーズスクロール
const scrollToQuickEstimate = () => {
  const element = document.querySelector('.quick-estimate-section')
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// 問い合わせフォーム関連
const contactForm = ref({
  name: '',
  email: '',
  phone: '',
  category: '',
  propertyInfo: '',
  message: '',
  privacy: false
})

const submitting = ref(false)

// 相談内容のカテゴリ
const contactCategories = [
  { title: '査定結果について詳しく聞きたい', value: 'assessment' },
  { title: '売却を検討している', value: 'sell' },
  { title: '出店場所を探している', value: 'rent' },
  { title: 'サービス内容について', value: 'service' },
  { title: 'その他のご相談', value: 'other' }
]

// バリデーションルール
const rules = {
  required: (v: any) => !!v || 'この項目は必須です',
  email: (v: string) => {
    if (!v) return 'この項目は必須です'
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || '正しいメールアドレスを入力してください'
  }
}

// フォームの妥当性チェック
const isContactFormValid = computed(() => {
  return contactForm.value.name &&
         contactForm.value.email &&
         contactForm.value.category &&
         contactForm.value.message &&
         contactForm.value.privacy &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.value.email)
})

// 問い合わせ方法選択
const selectContactMethod = (method: string) => {
  if (method === 'phone') {
    // 電話番号をクリップボードにコピー
    navigator.clipboard?.writeText('03-XXXX-XXXX')
    // 実際の実装では電話アプリを開く
    // window.location.href = 'tel:03-XXXX-XXXX'
  } else if (method === 'line') {
    // LINEの友達追加リンクを開く
    // window.open('https://line.me/R/ti/p/@yourlineid', '_blank')
  } else if (method === 'email') {
    // メールアプリを開く
    window.location.href = 'mailto:info@miyako-inuki.jp'
  }
}

// フォーム送信
const submitContactForm = async () => {
  if (!isContactFormValid.value) return
  
  submitting.value = true
  
  try {
    // 実際の実装では API エンドポイントに送信
    await new Promise(resolve => setTimeout(resolve, 2000)) // デモ用
    
    // 成功時の処理
    alert('お問い合わせありがとうございます。1営業日以内にご返信いたします。')
    
    // フォームリセット
    contactForm.value = {
      name: '',
      email: '',
      phone: '',
      category: '',
      propertyInfo: '',
      message: '',
      privacy: false
    }
    
  } catch (error) {
    alert('送信中にエラーが発生しました。しばらく経ってから再度お試しください。')
  } finally {
    submitting.value = false
  }
}

// ページのメタデータ設定
useHead({
  title: 'みやこ - 飲食店居抜き物件マッチングシステム',
  meta: [
    { name: 'description', content: '飲食店の居抜き物件をスムーズにマッチング。60秒で分かる簡易査定で物件価値を即座に算出。' }
  ]
})
</script>

<style scoped>
/* ヒーローセクション */
.hero-section {
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  color: white;
  padding: 120px 0 100px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 80%;
  height: 200%;
  background: rgba(255, 255, 255, 0.05);
  transform: rotate(-45deg);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  font-weight: 400;
  opacity: 0.95;
  margin-bottom: 2rem;
}

.hero-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
  border-radius: 12px;
}

.hero-btn-outline {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
  border: 2px solid white;
  color: #2e7d32;
  border-radius: 12px;
}

/* 簡易査定セクション */
.quick-estimate-section {
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  border-top: 1px solid #e0e0e0;
  position: relative;
}

.quick-estimate-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #2e7d32 0%, #4caf50 50%, #2e7d32 100%);
}

/* セクション共通 */
.section-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.bg-light {
  background-color: #f8f9fa;
}

/* 特徴カード */
.feature-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  height: 100%;
  background: white;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.feature-description {
  color: #666;
  line-height: 1.7;
}

/* ユーザータイプカード */
.user-type-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  height: 100%;
}

.user-type-card:hover {
  transform: translateY(-4px);
}

.user-type-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.user-type-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.user-type-description {
  color: #666;
  line-height: 1.7;
  font-size: 1rem;
}

.process-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.process-item {
  display: flex;
  align-items: flex-start;
}

.process-item h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.process-item p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
}


/* フッター情報 */
.footer-info {
  color: #666;
  font-size: 0.95rem;
}

/* レスポンシブ調整 */
@media (max-width: 960px) {
  .hero-section {
    padding: 80px 0 60px;
  }
  
  .py-16 {
    padding: 48px 0;
  }
  
}

/* Vuetifyクラスの上書き */
.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
}

.h-100 {
  height: 100%;
}

/* 問い合わせセクション */
.contact-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
}

.contact-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #2e7d32 0%, #4caf50 50%, #2e7d32 100%);
}

.contact-method-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.contact-method-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.contact-form-card {
  border-radius: 16px;
  overflow: hidden;
}

.contact-form-header {
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  color: white;
  padding: 20px 24px;
}

.contact-submit-btn {
  min-width: 250px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
  border-radius: 12px;
}

.contact-submit-btn:hover {
  transform: translateY(-2px);
}

/* レスポンシブ調整 */
@media (max-width: 1024px) {
  .contact-methods {
    margin-bottom: 2rem;
  }
  
  .contact-method-card {
    margin-bottom: 1rem;
  }
}

@media (max-width: 600px) {
  .contact-section {
    padding: 48px 0;
  }
  
  .contact-submit-btn {
    min-width: auto;
    width: 100%;
  }
}
</style>