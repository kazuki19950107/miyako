<template>
  <v-card outlined class="section-card">
    <v-card-title class="section-title">
      <v-icon left size="24" class="mr-2">mdi-draw</v-icon>
      自由記述（手書きメモ）
    </v-card-title>
    <v-card-text class="pt-6">
      <div class="canvas-container">
        <div class="canvas-toolbar mb-3">
          <div class="d-flex tool-buttons-group">
            <v-btn
              size="small"
              @click="setDrawingMode('pen')"
              :class="['tool-btn', 'd-flex', 'align-center', drawingMode === 'pen' ? 'tool-btn-active' : 'tool-btn-inactive']"
            >
              <v-icon left>mdi-pen</v-icon>
              <span class="btn-text">ペン</span>
            </v-btn>
            <v-btn
              size="small"
              @click="setDrawingMode('eraser')"
              :class="['tool-btn', 'd-flex', 'align-center', drawingMode === 'eraser' ? 'tool-btn-active' : 'tool-btn-inactive']"
            >
              <v-icon left>mdi-eraser</v-icon>
              <span class="btn-text">消しゴム</span>
            </v-btn>
          </div>
          <v-spacer></v-spacer>
          <v-btn size="small" class="clear-btn d-flex align-center" @click="clearCanvas">
            <v-icon left>mdi-delete</v-icon>
            <span class="btn-text">全消去</span>
          </v-btn>
        </div>

        <div class="color-picker mb-3">
          <span class="mr-2">色:</span>
          <v-btn
            v-for="color in colors"
            :key="color"
            size="small"
            :color="color"
            class="mr-2"
            @click="setColor(color)"
            :style="{ border: selectedColor === color ? '3px solid #1e50a2' : 'none' }"
          >
          </v-btn>
        </div>

        <div class="pen-size mb-3 d-flex align-center">
          <span class="mr-2">太さ:</span>
          <v-slider
            v-model="penSize"
            :min="1"
            :max="20"
            :step="1"
            hide-details
            class="slider-control"
          ></v-slider>
          <div class="size-preview ml-4">
            <div
              class="size-preview-circle"
              :style="{
                width: (drawingMode === 'pen' ? penSize : penSize * 3) + 'px',
                height: (drawingMode === 'pen' ? penSize : penSize * 3) + 'px',
                backgroundColor: drawingMode === 'pen' ? selectedColor : 'transparent',
                border: drawingMode === 'eraser' ? '2px solid #999' : 'none'
              }"
            ></div>
            <span class="ml-2 text-caption">{{ drawingMode === 'pen' ? penSize : penSize * 3 }}px</span>
          </div>
        </div>

        <!-- ページタブ -->
        <div class="page-tabs-container mb-3">
          <div class="page-tabs-scroll d-flex align-center ga-2">
            <v-chip
              v-for="(page, index) in canvasPages"
              :key="index"
              small
              :color="currentPage === index ? 'primary' : ''"
              :variant="currentPage === index ? 'flat' : 'outlined'"
              class="page-chip"
              @click="currentPage = index"
            >
              <span class="page-number">{{ index + 1 }}</span>
              <v-icon
                v-if="canvasPages.length > 1"
                small
                class="ml-1 close-icon"
                @click.stop="removePage(index)"
              >
                mdi-close
              </v-icon>
            </v-chip>
            <v-chip
              small
              color="primary"
              outlined
              @click="addPage"
              class="add-page-chip"
            >
              <v-icon small>mdi-plus</v-icon>
            </v-chip>
          </div>
        </div>

        <canvas
          ref="drawingCanvas"
          class="drawing-canvas"
          @mousedown="startDrawing"
          @mousemove="onMouseMove"
          @mouseup="stopDrawing"
          @touchstart="startDrawing"
          @touchmove="onTouchMove"
          @touchend="stopDrawing"
        ></canvas>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps<{
  canvasPagesData: string[]
}>()

// Emits
const emit = defineEmits<{
  'update:canvasPagesData': [value: string[]]
}>()

// 手書きキャンバスの状態管理
const drawingCanvas = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const drawingMode = ref('pen')
const selectedColor = ref('black')
const penSize = ref(1)
const colors = ['black', 'red', 'blue', 'green', 'orange', 'purple']
let ctx: CanvasRenderingContext2D | null = null
let lastX = 0
let lastY = 0

// ページ管理
const currentPage = ref(0)
const canvasPages = ref<string[]>([...props.canvasPagesData])
const skipSave = ref(false)

// ページ切り替え時の処理
watch(currentPage, (newPage, oldPage) => {
  if (oldPage !== undefined && !skipSave.value) {
    // 前のページを保存してから新しいページを読み込む
    saveCurrentPage(oldPage)
  }
  skipSave.value = false
  nextTick(() => {
    loadPage(newPage)
  })
})

// キャンバス初期化
const initCanvas = () => {
  const canvas = drawingCanvas.value
  if (!canvas) return

  // 既存の描画内容を保存
  let imageData: ImageData | null = null
  if (ctx && canvas.width > 0 && canvas.height > 0) {
    try {
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    } catch (e) {
      console.warn('キャンバス内容の保存に失敗:', e)
    }
  }

  // キャンバスサイズを設定
  const newWidth = canvas.offsetWidth
  const newHeight = 1800
  canvas.width = newWidth
  canvas.height = newHeight

  // コンテキストを再取得
  ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // 保存した描画内容を復元
    if (imageData) {
      ctx.putImageData(imageData, 0, 0)
    }
  }
}

const setDrawingMode = (mode: string) => {
  drawingMode.value = mode
}

const setColor = (color: string) => {
  selectedColor.value = color
}

const clearCanvas = () => {
  if (!ctx || !drawingCanvas.value) return
  ctx.clearRect(0, 0, drawingCanvas.value.width, drawingCanvas.value.height)
}

// ページ管理関数
const saveCurrentPage = (pageIndex?: number) => {
  const canvas = drawingCanvas.value
  if (!canvas) return

  const targetIndex = pageIndex !== undefined ? pageIndex : currentPage.value

  try {
    const dataUrl = canvas.toDataURL()
    canvasPages.value[targetIndex] = dataUrl
    emit('update:canvasPagesData', [...canvasPages.value])
  } catch (e) {
    console.warn('キャンバスの保存に失敗:', e)
  }
}

const loadPage = (pageIndex: number) => {
  const canvas = drawingCanvas.value
  if (!canvas || !ctx) return

  // キャンバスをクリア
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const pageData = canvasPages.value[pageIndex]
  if (pageData) {
    const img = new Image()
    img.onload = () => {
      ctx?.drawImage(img, 0, 0)
    }
    img.src = pageData
  }
}

const addPage = () => {
  // 現在のページを保存
  saveCurrentPage()

  // 新しいページを追加
  canvasPages.value.push('')
  currentPage.value = canvasPages.value.length - 1
  emit('update:canvasPagesData', [...canvasPages.value])
}

const removePage = (index: number) => {
  if (canvasPages.value.length <= 1) return

  // 削除前に現在のページを保存
  if (currentPage.value !== index) {
    saveCurrentPage()
  }

  // ページを削除
  canvasPages.value.splice(index, 1)

  // 現在のページインデックスを調整（watchの保存をスキップ）
  skipSave.value = true
  if (currentPage.value >= canvasPages.value.length) {
    currentPage.value = canvasPages.value.length - 1
  } else if (currentPage.value > index) {
    currentPage.value--
  } else if (currentPage.value === index) {
    // 削除したページが現在のページの場合、強制的に再読み込み
    nextTick(() => {
      loadPage(currentPage.value)
    })
  }

  emit('update:canvasPagesData', [...canvasPages.value])
}

const getCoordinates = (e: MouseEvent | TouchEvent) => {
  const canvas = drawingCanvas.value
  if (!canvas) return { x: 0, y: 0 }

  const rect = canvas.getBoundingClientRect()

  if (e instanceof MouseEvent) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  } else {
    const touch = e.touches[0]
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    }
  }
}

const startDrawing = (e: MouseEvent | TouchEvent) => {
  if (e instanceof TouchEvent) {
    // 2本指以上のタッチはスクロールとして扱う
    if (e.touches.length >= 2) {
      return
    }
    e.preventDefault()
  }

  isDrawing.value = true
  const coords = getCoordinates(e)
  lastX = coords.x
  lastY = coords.y
}

const onMouseMove = (e: MouseEvent) => {
  if (isDrawing.value) {
    draw(e)
  }
}

const onTouchMove = (e: TouchEvent) => {
  // 2本指以上のタッチはスクロールとして扱う
  if (e.touches.length >= 2) {
    return  // preventDefault()を呼ばずにreturnすることでスクロールを許可
  }
  e.preventDefault()  // 1本指の場合のみスクロールを防止
  if (isDrawing.value) {
    draw(e)
  }
}

const draw = (e: MouseEvent | TouchEvent) => {
  if (!isDrawing.value || !ctx) return

  const coords = getCoordinates(e)

  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(coords.x, coords.y)

  if (drawingMode.value === 'pen') {
    ctx.strokeStyle = selectedColor.value
    ctx.lineWidth = penSize.value
  } else {
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = penSize.value * 3
  }

  ctx.stroke()

  lastX = coords.x
  lastY = coords.y
}

const stopDrawing = () => {
  isDrawing.value = false
}

// コンポーネント初期化時
onMounted(() => {
  nextTick(() => {
    initCanvas()
  })

  // ウィンドウリサイズ時にキャンバスを再初期化
  window.addEventListener('resize', initCanvas)
})

onUnmounted(() => {
  window.removeEventListener('resize', initCanvas)

  // アンマウント時に現在のページを保存
  saveCurrentPage()
})

// Expose methods for parent
defineExpose({
  saveCurrentPage
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

.canvas-container {
  max-width: 100%;
}

.canvas-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-buttons-group {
  gap: 8px;
}

.tool-btn-active {
  background-color: #1e50a2 !important;
  color: white !important;
}

.tool-btn-inactive {
  background-color: #f5f5f5 !important;
}

.clear-btn {
  background-color: #f44336 !important;
  color: white !important;
}

.btn-text {
  margin-left: 4px;
}

.color-picker {
  display: flex;
  align-items: center;
}

.pen-size {
  max-width: 400px;
}

.slider-control {
  flex: 1;
  max-width: 200px;
}

.size-preview {
  display: flex;
  align-items: center;
  min-width: 100px;
}

.size-preview-circle {
  border-radius: 50%;
  transition: all 0.2s;
}

/* ページタブのスクロール対応 */
.page-tabs-container {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.page-tabs-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 4px 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #1e50a2 #f5f5f5;
}

.page-tabs-scroll::-webkit-scrollbar {
  height: 6px;
}

.page-tabs-scroll::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.page-tabs-scroll::-webkit-scrollbar-thumb {
  background: #1e50a2;
  border-radius: 3px;
}

.page-tabs-scroll::-webkit-scrollbar-thumb:hover {
  background: #154a8a;
}

.page-chip {
  cursor: pointer;
  flex-shrink: 0;
  min-width: 60px;
  height: 32px !important;
  padding: 0 8px !important;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
}

.page-number {
  font-weight: 600;
  font-size: 14px;
  min-width: 16px;
  text-align: center;
}

.close-icon {
  font-size: 16px !important;
  cursor: pointer;
  transition: transform 0.2s;
}

.close-icon:hover {
  transform: scale(1.2);
}

.add-page-chip {
  flex-shrink: 0;
  min-width: 40px !important;
  height: 32px !important;
}

.drawing-canvas {
  border: 2px solid #ccc;
  border-radius: 4px;
  cursor: crosshair;
  background-color: white;
  width: 100%;
  height: 1800px;
  touch-action: pan-y;  /* 縦スクロールは許可、1本指の横スクロールとピンチズームは無効 */
}
</style>
