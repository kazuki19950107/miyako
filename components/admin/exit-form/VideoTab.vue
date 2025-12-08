<template>
  <v-form ref="videoForm" v-model="formValid">
    <!-- 内覧動画 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-video</v-icon>
        内覧動画素材
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-upload</v-icon>
              内覧動画用の撮影素材をアップロードしてください
            </div>
            <div class="text-caption mb-3 grey--text">
              ※複数の動画ファイルをアップロードできます（MP4, MOV, AVI形式推奨）
            </div>

            <v-file-input
              v-model="newFiles"
              @update:model-value="addVideos"
              label="動画ファイルを選択（クリックで追加）"
              outlined
              dense
              multiple
              accept="video/*"
              prepend-icon="mdi-video-plus"
              show-size
              clearable
              :rules="[v => !v || v.every(f => f.size < 500000000) || '1ファイル500MB以下にしてください']"
            />
          </v-col>

          <!-- アップロード済み動画一覧 -->
          <v-col cols="12" v-if="videos && videos.length > 0">
            <div class="text-subtitle-2 mb-3">
              <v-icon small class="mr-1">mdi-playlist-play</v-icon>
              アップロード済み動画（{{ videos.length }}件）
            </div>

            <v-row>
              <v-col
                v-for="(video, index) in videos"
                :key="index"
                cols="12"
                md="6"
                lg="4"
              >
                <v-card outlined class="video-card">
                  <div class="video-preview">
                    <video
                      v-if="getVideoUrl(video)"
                      :src="getVideoUrl(video)"
                      controls
                      class="preview-video"
                    />
                    <div v-else class="video-placeholder">
                      <v-icon size="48" color="grey-lighten-1">mdi-video-outline</v-icon>
                    </div>
                  </div>
                  <v-card-text class="pa-3">
                    <div class="d-flex align-center justify-space-between">
                      <div class="text-truncate" style="max-width: 200px;">
                        <v-icon size="small" class="mr-1">mdi-file-video</v-icon>
                        {{ video.name }}
                      </div>
                      <v-btn
                        icon
                        size="small"
                        color="error"
                        variant="text"
                        @click="removeVideo(index)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                    <div class="text-caption grey--text mt-1">
                      {{ formatFileSize(video.size) }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <!-- 撮影ガイド -->
          <v-col cols="12">
            <v-alert
              type="info"
              variant="tonal"
              density="compact"
              class="mt-4"
            >
              <div class="text-subtitle-2 mb-2">撮影のポイント</div>
              <ul class="text-caption pl-4">
                <li>入口から店内全体が見渡せるアングルで撮影</li>
                <li>厨房設備を順番に撮影（コンロ、シンク、冷蔵庫等）</li>
                <li>客席エリアを複数角度から撮影</li>
                <li>トイレ、バックヤード、倉庫なども撮影</li>
                <li>外観（看板、入口、周辺環境）も撮影</li>
              </ul>
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

// Props
const props = withDefaults(defineProps<{
  videos?: File[]
}>(), {
  videos: () => []
})

// Emits
const emit = defineEmits<{
  'update:videos': [value: File[]]
}>()

// Internal state
const formValid = ref(false)
const videoForm = ref(null)
const newFiles = ref<File[]>([])

// 動画を追加
const addVideos = (files: File[] | null) => {
  if (files && files.length > 0) {
    const updatedVideos = [...props.videos, ...files]
    emit('update:videos', updatedVideos)
    // 入力をクリア
    nextTick(() => {
      newFiles.value = []
    })
  }
}

// 動画のプレビューURL生成
const getVideoUrl = (file: File | null): string => {
  if (!file || !(file instanceof File)) return ''
  return URL.createObjectURL(file)
}

// ファイルサイズのフォーマット
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 動画削除
const removeVideo = (index: number) => {
  const newVideos = [...props.videos]
  newVideos.splice(index, 1)
  emit('update:videos', newVideos)
}

// Expose form validity for parent
defineExpose({
  formValid,
  videoForm
})
</script>

<style scoped>
/* セクション見出しを統一 */
.section-title {
  font-weight: 700 !important;
  font-size: 17px !important;
  background: linear-gradient(135deg, #e3eaf5 0%, #d4e0f0 100%) !important;
  color: #154a8a !important;
  border-bottom: 2px solid #c5d5eb !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  border-radius: 0 !important;
}

.section-title .v-icon {
  background: rgba(30, 80, 162, 0.15);
  border-radius: 50%;
  padding: 6px;
  margin-right: 12px !important;
}

/* カードの間隔と角丸の統一 */
.v-card.section-card,
.v-card.outlined {
  border-radius: 16px !important;
  border: 1px solid #c5d5eb !important;
  box-shadow: 0 4px 12px rgba(30, 80, 162, 0.08) !important;
  margin-bottom: 24px !important;
  overflow: hidden;
  background-color: #ffffff !important;
}

.v-card.section-card:hover {
  box-shadow: 0 6px 20px rgba(30, 80, 162, 0.12) !important;
  transition: box-shadow 0.3s ease;
}

/* inputフィールドの背景色 */
:deep(.v-field__field) {
  background-color: #f5f8fc !important;
}

:deep(.v-field--variant-outlined .v-field__outline) {
  --v-field-border-opacity: 0.4;
}

:deep(.v-field--focused .v-field__field) {
  background-color: #ffffff !important;
}

/* 動画カード */
.video-card {
  border-radius: 12px !important;
  overflow: hidden;
}

.video-preview {
  background: #f5f8fc;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
