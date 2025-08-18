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
              <v-card-title class="contact-form-header d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                  <v-icon color="white" class="mr-2">mdi-message-text</v-icon>
                  お問い合わせフォーム
                </div>
                <!-- 進捗表示 -->
                <div class="text-body-2" v-if="contactProgressText">
                  {{ contactProgressText }}
                </div>
              </v-card-title>

              <v-card-text class="pa-8">
                <v-form ref="contactFormRef" @submit.prevent="submitContactForm">
                  <!-- 必須項目エリア（常時表示） -->
                  <div class="form-section mb-6">
                    <h3 class="section-header required-section">
                      <v-icon color="red" class="mr-2">mdi-asterisk</v-icon>
                      必須項目
                    </h3>
                    
                    <v-row>
                      <!-- 閉店検討理由 -->
                      <v-col cols="12">
                        <div class="mb-2">
                          <label class="text-body-1 font-weight-medium">閉店検討理由</label>
                          <span class="text-red ml-1">*</span>
                        </div>
                        <div class="chips-wrap">
                          <v-chip
                            v-for="option in reasonOptions"
                            :key="option"
                            :color="(contactForm.reason && contactForm.reason.includes(option)) ? 'primary' : 'default'"
                            :variant="(contactForm.reason && contactForm.reason.includes(option)) ? 'flat' : 'outlined'"
                            @click="toggleReason(option)"
                            class="cursor-pointer"
                          >
                            {{ option }}
                          </v-chip>
                        </div>
                        <!-- その他詳細 -->
                        <v-text-field
                          v-if="contactForm.reason && Array.isArray(contactForm.reason) && contactForm.reason.includes('その他')"
                          v-model="contactForm.reasonOther"
                          label="その他の詳細"
                          variant="outlined"
                          density="comfortable"
                          class="mt-3"
                          placeholder="詳細を入力してください"
                        ></v-text-field>
                      </v-col>

                      <!-- 解約予告状況 -->
                      <v-col cols="12">
                        <div class="mb-2">
                          <label class="text-body-1 font-weight-medium">解約予告状況</label>
                          <span class="text-red ml-1">*</span>
                        </div>
                        <div class="chips-wrap">
                          <v-chip
                            v-for="option in cancelStatusOptions"
                            :key="option"
                            :color="contactForm.cancel_status === option ? 'primary' : 'default'"
                            :variant="contactForm.cancel_status === option ? 'flat' : 'outlined'"
                            @click="contactForm.cancel_status = option"
                            class="cursor-pointer"
                          >
                            {{ option }}
                          </v-chip>
                        </div>
                      </v-col>

                      <!-- 退店時期 -->
                      <v-col cols="12">
                        <div class="mb-2">
                          <label class="text-body-1 font-weight-medium">退店時期</label>
                          <span class="text-red ml-1">*</span>
                        </div>
                        <div class="chips-wrap">
                          <v-chip
                            v-for="option in exitWhenOptions"
                            :key="option"
                            :color="contactForm.exit_when === option ? 'primary' : 'default'"
                            :variant="contactForm.exit_when === option ? 'flat' : 'outlined'"
                            @click="contactForm.exit_when = option"
                            class="cursor-pointer"
                          >
                            {{ option }}
                          </v-chip>
                        </div>
                      </v-col>

                      <!-- お問い合わせ内容 -->
                      <v-col cols="12">
                        <v-textarea
                          v-model="contactForm.inquiry"
                          label="お問い合わせ内容"
                          :rules="[rules.required]"
                          variant="outlined"
                          density="comfortable"
                          prepend-inner-icon="mdi-message-text"
                          placeholder="査定結果について詳しく聞きたい、売却を検討している等、お気軽にご記入ください"
                          required
                          rows="3"
                          counter="1000"
                          maxlength="1000"
                        >
                          <template v-slot:label>
                            お問い合わせ内容 <span class="text-red">*</span>
                          </template>
                        </v-textarea>
                      </v-col>

                      <!-- お名前 -->
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="contactForm.name"
                          label="氏名"
                          :rules="[rules.required]"
                          variant="outlined"
                          density="comfortable"
                          prepend-inner-icon="mdi-account"
                          placeholder="山田 太郎"
                          required
                        >
                          <template v-slot:label>
                            氏名 <span class="text-red">*</span>
                          </template>
                        </v-text-field>
                      </v-col>

                      <!-- ふりがな -->
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="contactForm.kana"
                          label="ふりがな"
                          :rules="[rules.required, rules.kana]"
                          variant="outlined"
                          density="comfortable"
                          prepend-inner-icon="mdi-alphabetical"
                          placeholder="やまだ たろう"
                          required
                        >
                          <template v-slot:label>
                            ふりがな <span class="text-red">*</span>
                          </template>
                        </v-text-field>
                      </v-col>

                      <!-- メールアドレス -->
                      <v-col cols="12">
                        <v-text-field
                          v-model="contactForm.email"
                          label="メールアドレス"
                          :rules="[rules.required, rules.email]"
                          variant="outlined"
                          density="comfortable"
                          prepend-inner-icon="mdi-email"
                          placeholder="example@email.com"
                          required
                        >
                          <template v-slot:label>
                            メールアドレス <span class="text-red">*</span>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- おすすめ項目エリア（アコーディオン） -->
                  <v-expansion-panels class="mb-6">
                    <v-expansion-panel>
                      <v-expansion-panel-title>
                        <div class="d-flex align-center">
                          <v-icon color="orange" class="mr-2">mdi-star</v-icon>
                          <span class="text-h6">あると助かる項目</span>
                          <v-chip size="small" color="orange" variant="tonal" class="ml-3">
                            ＋精度↑
                          </v-chip>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-row class="mt-4">
                          <!-- お店の賃料 -->
                          <v-col cols="12" sm="6">
                            <div class="mb-2">
                              <label class="text-body-2 font-weight-medium">お店の賃料</label>
                            </div>
                            <div class="chips-wrap">
                              <v-chip
                                v-for="option in rentRangeOptions"
                                :key="option"
                                :color="contactForm.rent_range === option ? 'orange' : 'default'"
                                :variant="contactForm.rent_range === option ? 'flat' : 'outlined'"
                                @click="contactForm.rent_range = option"
                                size="small"
                                class="cursor-pointer"
                              >
                                {{ option }}
                              </v-chip>
                            </div>
                          </v-col>

                          <!-- お店の坪数 -->
                          <v-col cols="12" sm="6">
                            <div class="mb-2">
                              <label class="text-body-2 font-weight-medium">お店の坪数</label>
                            </div>
                            <div class="chips-wrap">
                              <v-chip
                                v-for="option in tsuboRangeOptions"
                                :key="option"
                                :color="contactForm.tsubo_range === option ? 'orange' : 'default'"
                                :variant="contactForm.tsubo_range === option ? 'flat' : 'outlined'"
                                @click="contactForm.tsubo_range = option"
                                size="small"
                                class="cursor-pointer"
                              >
                                {{ option }}
                              </v-chip>
                            </div>
                          </v-col>

                          <!-- 郵便番号 -->
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="contactForm.address_zip"
                              label="郵便番号"
                              variant="outlined"
                              density="comfortable"
                              prepend-inner-icon="mdi-map-marker"
                              placeholder="123-4567"
                            ></v-text-field>
                          </v-col>

                          <!-- お店の住所 -->
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="contactForm.address"
                              label="お店の住所"
                              variant="outlined"
                              density="comfortable"
                              prepend-inner-icon="mdi-home"
                              placeholder="市区町村・番地（任意）"
                            ></v-text-field>
                          </v-col>

                          <!-- お店の屋号名 -->
                          <v-col cols="12">
                            <v-text-field
                              v-model="contactForm.shop_name"
                              label="お店の屋号名"
                              variant="outlined"
                              density="comfortable"
                              prepend-inner-icon="mdi-store"
                              placeholder="例：居酒屋○○"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>

                  <!-- 詳細項目エリア（アコーディオン） -->
                  <v-expansion-panels class="mb-6">
                    <v-expansion-panel>
                      <v-expansion-panel-title>
                        <div class="d-flex align-center">
                          <v-icon color="blue" class="mr-2">mdi-clipboard-list</v-icon>
                          <span class="text-h6">詳細項目</span>
                          <v-chip size="small" color="blue" variant="tonal" class="ml-3">
                            後でOK
                          </v-chip>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-row class="mt-4">
                          <!-- 法人として申し込む -->
                          <v-col cols="12">
                            <div class="d-flex align-center">
                              <v-switch
                                v-model="contactForm.corp_flag"
                                color="blue"
                                hide-details
                                inset
                                @change="console.log('法人フラグ変化:', contactForm.corp_flag)"
                              ></v-switch>
                              <label class="ml-3 text-body-1">法人として申し込む</label>
                            </div>
                          </v-col>

                          <!-- 法人名 -->
                          <v-col cols="12" v-if="contactForm.corp_flag">
                            <v-text-field
                              v-model="contactForm.corp_name"
                              label="法人名"
                              variant="outlined"
                              density="comfortable"
                              prepend-inner-icon="mdi-domain"
                              placeholder="株式会社○○"
                            ></v-text-field>
                          </v-col>

                          <!-- 売却希望金額 -->
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model.number="contactForm.ask_price"
                              label="売却希望金額"
                              variant="outlined"
                              density="comfortable"
                              prepend-inner-icon="mdi-currency-jpy"
                              prefix="¥"
                              type="number"
                              placeholder="3000000"
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

                          <!-- 設備リース有無 -->
                          <v-col cols="12">
                            <div class="d-flex align-center">
                              <v-switch
                                v-model="contactForm.lease_flag"
                                color="blue"
                                hide-details
                                inset
                                @change="console.log('リースフラグ変化:', contactForm.lease_flag)"
                              ></v-switch>
                              <label class="ml-3 text-body-1">設備リースあり</label>
                            </div>
                          </v-col>

                          <!-- リースの内容 -->
                          <v-col cols="12" v-if="contactForm.lease_flag">
                            <v-text-field
                              v-model="contactForm.lease_note"
                              label="リースの内容"
                              variant="outlined"
                              density="comfortable"
                              prepend-inner-icon="mdi-file-document"
                              placeholder="例：厨房機器、レジスター等"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>

                  <!-- プライバシーポリシー同意 -->
                  <v-checkbox
                    v-model="contactForm.privacy"
                    :rules="[rules.required]"
                    required
                    label="プライバシーポリシーに同意する"
                    class="mb-4"
                  ></v-checkbox>

                  <!-- 送信ボタン -->
                  <div class="text-center">
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
                  </div>
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
import { ref, computed, watch } from 'vue'
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

// 問い合わせフォーム関連 - YAMLのIDと完全一致させる
const contactForm = reactive({
  // 必須項目 (YAMLのidと一致)
  reason: [] as string[], // 閉店検討理由（複数選択）
  cancel_status: '', // 解約予告状況
  exit_when: '', // 退店時期
  inquiry: '', // お問い合わせ内容
  station_id: '', // お店の最寄駅（今回は未実装）
  name: '', // 氏名
  kana: '', // ふりがな
  email: '', // メールアドレス
  email_confirm: '', // メールアドレス（確認）
  
  // おすすめ項目
  rent_range: '', // お店の賃料
  tsubo_range: '', // お店の坪数
  address_zip: '', // 郵便番号
  address: '', // お店の住所
  shop_name: '', // お店の屋号名
  
  // 詳細項目
  corp_flag: false, // 法人として申し込む
  corp_name: '', // 法人名
  ask_price: null, // 売却希望金額
  lease_flag: false, // 設備リース有無
  lease_note: '', // リースの内容
  phone: '', // 電話番号
  
  // その他
  reasonOther: '', // その他詳細（UIコントロール用）
  privacy: false // プライバシーポリシー同意
})

const submitting = ref(false)
const contactFormRef = ref() // v-formのDOM参照用

// デバッグ用: フォームデータの変化を監視 (開発環境のみ)
if (import.meta.env.DEV) {
  watch(() => contactForm, (newVal) => {
    console.log('フォームデータ変化:', newVal)
  }, { deep: true })
}

// フォーム選択肢データ
const reasonOptions = ['売上不振', '人材不足', '他事業集中', '引退', 'その他']
const cancelStatusOptions = ['未提出', '提出予定', '提出済']
const exitWhenOptions = ['今月', '来月', '3ヶ月以内', '半年以内', '1年以内', '未定']
const rentRangeOptions = ['〜10万円', '10〜20万円', '20〜30万円', '30万円〜']
const tsuboRangeOptions = ['〜10坪', '10〜20坪', '20〜30坪', '30坪〜']

// 閉店検討理由の複数選択トグル関数
const toggleReason = (option: string) => {
  // reason配列の初期化確認
  if (!Array.isArray(contactForm.reason)) {
    contactForm.reason = []
  }
  
  const index = contactForm.reason.indexOf(option)
  if (index > -1) {
    contactForm.reason.splice(index, 1)
  } else {
    contactForm.reason.push(option)
  }
  
  console.log('理由選択更新:', contactForm.reason)
}

// バリデーションルール
const rules = {
  required: (v: any) => !!v || 'この項目は必須です',
  email: (v: string) => {
    if (!v) return 'この項目は必須です'
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || '正しいメールアドレスを入力してください'
  },
  kana: (v: string) => {
    if (!v) return 'この項目は必須です'
    const pattern = /^[ぁ-ゖー\s]+$/
    return pattern.test(v) || 'ひらがなで入力してください'
  }
}

// 必須項目の入力状況チェック
const requiredFieldsCount = computed(() => {
  let count = 0
  // reason配列のundefinedチェック
  if (contactForm.reason && Array.isArray(contactForm.reason) && contactForm.reason.length > 0) count++
  if (contactForm.cancel_status) count++
  if (contactForm.exit_when) count++
  if (contactForm.inquiry) count++
  if (contactForm.name) count++
  if (contactForm.kana) count++
  if (contactForm.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) count++
  return count
})

// おすすめ項目の入力状況チェック
const helpfulFieldsCount = computed(() => {
  let count = 0
  if (contactForm.rent_range) count++
  if (contactForm.tsubo_range) count++
  if (contactForm.address_zip) count++
  if (contactForm.address) count++
  if (contactForm.shop_name) count++
  return count
})

// 進捗表示テキスト
const contactProgressText = computed(() => {
  const required = requiredFieldsCount.value
  const helpful = helpfulFieldsCount.value
  
  if (required === 7) {
    if (helpful > 0) {
      return '必須項目完了！精度がアップしました✨'
    } else {
      return '必須項目完了！あと2項目で精度UP'
    }
  } else {
    const remaining = 7 - required
    return `あと${remaining}項目で送信できます`
  }
})

// フォームの妥当性チェック
const isContactFormValid = computed(() => {
  return requiredFieldsCount.value === 7 && contactForm.privacy
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
    // 送信データの準備
    const submitData = {
      ...contactForm,
      // reason配列を文字列に変換
      reason: Array.isArray(contactForm.reason) ? contactForm.reason.join(', ') : ''
    }
    
    console.log('送信データ:', submitData)
    
    // 実際の実装では API エンドポイントに送信
    await new Promise(resolve => setTimeout(resolve, 2000)) // デモ用
    
    // 成功時の処理
    alert('お問い合わせありがとうございます。1営業日以内にご返信いたします。')
    
    // フォームリセット
    Object.assign(contactForm, {
      // 必須項目
      reason: [],
      cancel_status: '',
      exit_when: '',
      inquiry: '',
      station_id: '',
      name: '',
      kana: '',
      email: '',
      email_confirm: '',
      
      // おすすめ項目
      rent_range: '',
      tsubo_range: '',
      address_zip: '',
      address: '',
      shop_name: '',
      
      // 詳細項目
      corp_flag: false,
      corp_name: '',
      ask_price: null,
      lease_flag: false,
      lease_note: '',
      phone: '',
      
      // その他
      reasonOther: '',
      privacy: false
    })
    
  } catch (error) {
    alert('送信中にエラーが発生しました。しばらく経ってから再度お試しください。')
  } finally {
    submitting.value = false
  }
}

// ページのメタデータ設定
useHead({
  title: 'みやこ不動産企画 - 飲食店居抜き物件マッチングシステム',
  meta: [
    { name: 'description', content: '飲食店の居抜き物件をスムーズにマッチング。60秒で分かる簡易査定で物件価値を即座に算出。' }
  ]
})
</script>

<style scoped>
/* カーソルポインタ */
.cursor-pointer {
  cursor: pointer !important;
}

/* チップのラッパー */
.chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

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