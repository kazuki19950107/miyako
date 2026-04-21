<template>
  <v-container class="login-wrapper" fluid>
    <v-row justify="center" align="center" style="min-height: 100vh;">
      <v-col cols="12" sm="8" md="5" lg="4">

        <!-- ロゴ・ヘッダー -->
        <div class="text-center mb-6">
          <v-icon size="48" color="primary" class="mb-2">mdi-store</v-icon>
          <h1 class="text-h5 font-weight-bold text-primary">みやこ不動産企画</h1>
          <p class="text-body-2 text-medium-emphasis mt-1">出店希望者向けポータル</p>
        </div>

        <v-card rounded="xl" elevation="4" class="pa-2">
          <!-- タブ切り替え -->
          <v-tabs v-model="activeTab" color="primary" grow class="mb-2">
            <v-tab value="login" class="text-none font-weight-medium">ログイン</v-tab>
            <v-tab value="signup" class="text-none font-weight-medium">新規登録</v-tab>
          </v-tabs>

          <v-divider />

          <v-card-text class="pa-5">
            <v-window v-model="activeTab">

              <!-- ========== ログイン ========== -->
              <v-window-item value="login">
                <v-form ref="loginFormRef" @submit.prevent="handleLogin" lazy-validation>
                  <v-text-field
                    v-model="loginEmail"
                    label="メールアドレス"
                    type="email"
                    prepend-inner-icon="mdi-email-outline"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                    class="mb-3"
                    :rules="emailRules"
                  />
                  <v-text-field
                    v-model="loginPassword"
                    label="パスワード"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                    class="mb-4"
                    :rules="passwordRules"
                  />
                  <v-btn
                    type="submit"
                    color="primary"
                    block
                    size="large"
                    rounded="lg"
                    :loading="loading"
                    :disabled="loading"
                  >
                    <v-icon start>mdi-login</v-icon>
                    ログイン
                  </v-btn>
                </v-form>
              </v-window-item>

              <!-- ========== 新規登録 ========== -->
              <v-window-item value="signup">
                <v-form ref="signupFormRef" @submit.prevent="handleSignup" lazy-validation>
                  <v-text-field
                    v-model="signupName"
                    label="お名前"
                    prepend-inner-icon="mdi-account-outline"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                    class="mb-3"
                    :rules="nameRules"
                  />
                  <v-text-field
                    v-model="signupPhone"
                    label="電話番号"
                    type="tel"
                    prepend-inner-icon="mdi-phone-outline"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                    class="mb-3"
                    placeholder="090-1234-5678"
                  />
                  <v-text-field
                    v-model="signupEmail"
                    label="メールアドレス"
                    type="email"
                    prepend-inner-icon="mdi-email-outline"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                    class="mb-3"
                    :rules="emailRules"
                  />
                  <v-text-field
                    v-model="signupPassword"
                    label="パスワード"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                    class="mb-3"
                    :rules="passwordRules"
                    hint="6文字以上"
                  />
                  <v-text-field
                    v-model="signupPasswordConfirm"
                    label="パスワード（確認）"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock-check-outline"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                    class="mb-4"
                    :rules="confirmPasswordRules"
                  />
                  <v-btn
                    type="submit"
                    color="primary"
                    block
                    size="large"
                    rounded="lg"
                    :loading="loading"
                    :disabled="loading"
                  >
                    <v-icon start>mdi-account-plus</v-icon>
                    アカウント作成
                  </v-btn>
                </v-form>
              </v-window-item>

            </v-window>
          </v-card-text>
        </v-card>

        <!-- 戻るリンク -->
        <div class="text-center mt-4">
          <v-btn variant="text" color="primary" size="small" to="/" class="text-none">
            <v-icon start size="16">mdi-arrow-left</v-icon>
            トップページに戻る
          </v-btn>
        </div>

      </v-col>
    </v-row>

    <!-- スナックバー -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000" location="top">
      {{ snackbar.message }}
    </v-snackbar>

    <!-- 過去に登録あり（削除済みアカウント）案内モーダル -->
    <v-dialog v-model="showDeletedAccountDialog" max-width="400" persistent>
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center pa-4">
          <v-icon start color="warning" size="24">mdi-account-alert-outline</v-icon>
          <span class="text-h6 font-weight-bold">過去に登録があります</span>
        </v-card-title>
        <v-card-text class="pa-4 pt-0">
          <div class="text-body-2 mb-3" style="line-height: 1.7;">
            このメールアドレスまたは電話番号は、過去にご登録いただいたアカウントで使用されています。<br>
            アカウントの再開をご希望の場合は、下記までお問い合わせください。
          </div>
          <div
            class="d-flex align-center justify-space-between pa-3 rounded-lg"
            style="background: #f1f5f9; border: 1px solid #e2e8f0;"
          >
            <div class="d-flex align-center ga-2 flex-grow-1" style="min-width: 0;">
              <v-icon size="18" color="primary">mdi-email-outline</v-icon>
              <span
                class="text-body-1 font-weight-medium text-truncate"
                style="user-select: all;"
              >{{ SUPPORT_EMAIL }}</span>
            </div>
            <v-btn
              variant="tonal"
              color="primary"
              size="small"
              rounded="lg"
              @click="copySupportEmail"
            >
              <v-icon start size="16">{{ emailCopied ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
              {{ emailCopied ? 'コピー済み' : 'コピー' }}
            </v-btn>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn
            variant="text"
            rounded="lg"
            href="mailto:info@miyako-inuki.jp"
          >
            <v-icon start size="16">mdi-email-arrow-right-outline</v-icon>
            メールを開く
          </v-btn>
          <v-btn color="primary" variant="flat" rounded="lg" @click="showDeletedAccountDialog = false">
            閉じる
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { useClientAuth, SUPPORT_EMAIL } from '~/composables/useClientAuth'

useHead({ title: 'ログイン - みやこ不動産企画' })

const router = useRouter()
const route = useRoute()
const { signIn, signUp, loading, error: authError, errorType: authErrorType } = useClientAuth()

// 削除済みアカウント案内モーダル
const showDeletedAccountDialog = ref(false)
const emailCopied = ref(false)

async function copySupportEmail() {
  try {
    await navigator.clipboard.writeText(SUPPORT_EMAIL)
    emailCopied.value = true
    setTimeout(() => { emailCopied.value = false }, 2000)
  } catch {
    // フォールバック: 何もしない（user-select: all で手動コピー可能）
  }
}

// ─── 状態 ───
const activeTab = ref(route.query.tab === 'signup' ? 'signup' : 'login')
const showPassword = ref(false)
const loginFormRef = ref()
const signupFormRef = ref()

// ログインフォーム
const loginEmail = ref('')
const loginPassword = ref('')

// 新規登録フォーム
const signupName = ref('')
const signupPhone = ref('')
const signupEmail = ref('')
const signupPassword = ref('')
const signupPasswordConfirm = ref('')

// スナックバー
const snackbar = ref({ show: false, message: '', color: 'success' })

// ─── バリデーション ───
const emailRules = [
  (v: string) => !!v || 'メールアドレスは必須です',
  (v: string) => /.+@.+\..+/.test(v) || '正しいメールアドレスを入力してください',
]
const passwordRules = [
  (v: string) => !!v || 'パスワードは必須です',
  (v: string) => (v && v.length >= 6) || 'パスワードは6文字以上で入力してください',
]
const nameRules = [
  (v: string) => !!v || 'お名前は必須です',
]
const confirmPasswordRules = [
  (v: string) => !!v || 'パスワード確認は必須です',
  (v: string) => v === signupPassword.value || 'パスワードが一致しません',
]

// ─── ログイン処理 ───
const handleLogin = async () => {
  const { valid } = await loginFormRef.value.validate()
  if (!valid) return

  const success = await signIn(loginEmail.value, loginPassword.value)
  if (success) {
    snackbar.value = { show: true, message: 'ログインしました', color: 'success' }
    await router.push('/mypage')
  } else if (authErrorType.value === 'deleted_account') {
    showDeletedAccountDialog.value = true
  } else {
    snackbar.value = { show: true, message: authError.value || 'ログインに失敗しました', color: 'error' }
  }
}

// ─── 新規登録処理 ───
const handleSignup = async () => {
  const { valid } = await signupFormRef.value.validate()
  if (!valid) return

  const success = await signUp({
    email: signupEmail.value,
    password: signupPassword.value,
    name: signupName.value,
    phone: signupPhone.value || undefined,
  })

  if (success) {
    snackbar.value = { show: true, message: 'アカウントを作成しました', color: 'success' }
    await router.push('/mypage')
  } else if (authErrorType.value === 'deleted_account') {
    showDeletedAccountDialog.value = true
  } else {
    snackbar.value = { show: true, message: authError.value || 'アカウント作成に失敗しました', color: 'error' }
  }
}
</script>

<style scoped>
.login-wrapper {
  background: linear-gradient(135deg, #f0f4f8 0%, #e8eef5 50%, #dfe7f0 100%);
  min-height: 100vh;
}
</style>
