<template>
  <div class="d-flex justify-space-between align-center mt-6 px-6 mb-8">

    <!-- 戻るボタン -->
    <div>
      <v-btn
        v-if="!isFirst"
        color="grey"
        @click="$emit('back')"
        prepend-icon="mdi-arrow-left"
        size="large"
        variant="tonal"
      >
        戻る
      </v-btn>
    </div>

    <!-- 中央：一時保存ボタン（オプション） -->
    <div v-if="showSaveButton">
      <v-btn
        color="info"
        @click="$emit('save')"
        prepend-icon="mdi-content-save"
        variant="outlined"
        :loading="isSaving"
      >
        一時保存
      </v-btn>
    </div>

    <!-- 次へ or 最終ボタン -->
    <div>
      <v-btn
        v-if="!isLast"
        color="primary"
        @click="$emit('next')"
        append-icon="mdi-arrow-right"
        size="large"
        :disabled="!canProceed"
      >
        次へ
      </v-btn>
      <v-btn
        v-else
        color="success"
        @click="$emit('submit')"
        :loading="isProcessing"
        :disabled="isProcessing || !canProceed"
        append-icon="mdi-check-circle"
        size="large"
      >
        {{ completeLabel }}
      </v-btn>
    </div>

  </div>
</template>

<script setup>
defineProps({
  isLast: { type: Boolean, default: false },
  isFirst: { type: Boolean, default: false },
  isProcessing: { type: Boolean, default: false },
  completeLabel: { type: String, default: '登録完了' },
  showSaveButton: { type: Boolean, default: false },
  isSaving: { type: Boolean, default: false },
  canProceed: { type: Boolean, default: true }
})

defineEmits(['back', 'next', 'submit', 'save'])
</script>
