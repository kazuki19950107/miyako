<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5">
        <div class="text-center mb-6 mt-8">
          <v-icon size="48" color="primary">mdi-shield-account</v-icon>
          <h1 class="text-h5 font-weight-bold mt-2">管理者ログイン</h1>
        </div>

        <v-card rounded="xl" elevation="3">
          <v-card-text class="pa-6">
            <v-form ref="formRef" @submit.prevent="handleSubmit" lazy-validation>
              <v-text-field
                v-model="accountName"
                label="アカウント名"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                class="mb-3"
                :rules="[v => !!v || 'アカウント名は必須です']"
              />
              <v-text-field
                v-model="password"
                label="パスワード"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                class="mb-4"
                :rules="[v => !!v || 'パスワードは必須です']"
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="showError" color="error" :timeout="4000" location="top">
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref()
const accountName = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true

  try {
    const result = await authStore.login(accountName.value, password.value)

    if (result.success) {
      await router.push('/admin/exit-form')
    } else {
      errorMessage.value = result.error || 'ログインに失敗しました'
      showError.value = true
    }
  } catch (error) {
    errorMessage.value = 'エラーが発生しました'
    showError.value = true
  } finally {
    loading.value = false
  }
}

useHead({ title: '管理者ログイン' })
</script>
