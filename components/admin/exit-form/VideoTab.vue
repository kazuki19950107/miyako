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

            <input
              ref="videoFileInput"
              type="file"
              multiple
              accept="video/*"
              style="display: none;"
              @change="onVideoFileChange"
            />
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              :loading="isUploading"
              @click="videoFileInput?.click()"
            >
              <v-icon start>mdi-paperclip</v-icon>
              動画を追加
            </v-btn>
            <span class="text-caption text-grey ml-2">MP4, MOV, AVI対応（500MB以下）</span>
          </v-col>

          <!-- アップロード済み動画一覧 -->
          <v-col cols="12" v-if="videos && videos.length > 0">
            <div class="mt-2">
              <v-chip
                v-for="(url, index) in videos"
                :key="`video-${index}`"
                size="small"
                color="primary"
                class="mr-2 mb-1"
              >
                <v-icon size="small" class="mr-1 cursor-pointer" @click="openPreviewModal(url)">mdi-eye</v-icon>
                <span class="text-truncate" style="max-width: 150px;">{{ getFileName(url) }}</span>
                <v-icon size="small" class="ml-1 cursor-pointer" @click="openDeleteConfirm(index, url)">mdi-close-circle</v-icon>
              </v-chip>
            </div>
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

    <!-- 動画プレビューモーダル -->
    <v-dialog v-model="showPreviewModal" max-width="800">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>動画プレビュー</span>
          <v-btn icon variant="text" @click="showPreviewModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-4">
          <video
            v-if="previewUrl"
            :src="previewUrl"
            controls
            style="width: 100%; max-height: 500px;"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 削除確認ダイアログ -->
    <v-dialog v-model="showDeleteConfirm" width="380">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2" color="warning">mdi-alert</v-icon>
          削除確認
        </v-card-title>
        <v-card-text>
          この動画を削除してもよろしいですか？
          <div v-if="deleteTarget" class="mt-2 text-caption text-grey">
            {{ getFileName(deleteTarget.url) }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showDeleteConfirm = false">キャンセル</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete">削除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadFiles } from '~/composables/useFileUpload'

// Props
const props = withDefaults(defineProps<{
  propertyId?: string | null
  videos?: string[]
}>(), {
  videos: () => []
})

// Emits
const emit = defineEmits<{
  'update:videos': [value: string[]]
}>()

// Internal state
const formValid = ref(false)
const videoForm = ref(null)
const videoFileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

// プレビューモーダル用
const showPreviewModal = ref(false)
const previewUrl = ref('')

// 削除確認用
const showDeleteConfirm = ref(false)
const deleteTarget = ref<{ index: number; url: string } | null>(null)

// ファイル名を取得
const getFileName = (url: string): string => {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]
    // タイムスタンプ部分を除去
    const match = fileName.match(/^\d+_(.+)$/)
    return match ? match[1] : fileName
  } catch {
    return url
  }
}

// ファイル選択ハンドラー
const onVideoFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const files = Array.from(input.files)

  // サイズチェック（500MB以下）
  const oversizedFiles = files.filter(f => f.size > 500000000)
  if (oversizedFiles.length > 0) {
    alert('500MB以下のファイルを選択してください')
    input.value = ''
    return
  }

  const id = props.propertyId || `temp_${Date.now()}`

  isUploading.value = true
  try {
    const urls = await uploadFiles(files, id, 'videos')
    if (urls.length > 0) {
      const allUrls = [...props.videos, ...urls]
      emit('update:videos', allUrls)
    }
  } catch (e) {
    console.error('動画アップロードエラー:', e)
  } finally {
    isUploading.value = false
    input.value = ''
  }
}

// プレビューモーダルを開く
const openPreviewModal = (url: string) => {
  previewUrl.value = url
  showPreviewModal.value = true
}

// 削除確認ダイアログを開く
const openDeleteConfirm = (index: number, url: string) => {
  deleteTarget.value = { index, url }
  showDeleteConfirm.value = true
}

// 動画削除
const confirmDelete = () => {
  if (!deleteTarget.value) return

  const newVideos = props.videos.filter((_, i) => i !== deleteTarget.value!.index)
  emit('update:videos', newVideos)

  showDeleteConfirm.value = false
  deleteTarget.value = null
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

/* クリック可能なアイコン */
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  opacity: 0.7;
}
</style>
