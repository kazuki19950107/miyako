<template>
  <v-card outlined class="section-card">
    <v-card-title class="section-title">
      <v-icon left size="24" class="mr-2">mdi-tools</v-icon>
      設備詳細
    </v-card-title>
    <v-card-text class="pt-6">
      <!-- PDFダウンロードボタン -->
      <div class="d-flex justify-end mb-4 no-print">
        <v-btn
          color="primary"
          @click="printEquipmentDetails"
          :loading="isGeneratingPDF"
          :disabled="isGeneratingPDF"
          prepend-icon="mdi-file-pdf-box"
        >
          {{ isGeneratingPDF ? 'PDF生成中...' : 'PDFダウンロード' }}
        </v-btn>
      </div>

      <!-- 印刷用コンテナ -->
      <div id="equipment-print-area">
        <!-- 1ページ目：設備リスト -->
        <div class="equipment-list-page print-page">
          <h2 class="page-title">設備リスト</h2>
          <v-table class="equipment-table">
            <thead>
              <tr>
                <th class="text-center">No.</th>
                <th>設置場所</th>
                <th>品目</th>
                <th>メーカー</th>
                <th>型式・サイズ</th>
                <th class="text-center">数量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in equipmentItems" :key="index">
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ item.location }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.maker }}</td>
                <td>{{ item.model }}</td>
                <td class="text-center">{{ item.quantity }}</td>
              </tr>
            </tbody>
          </v-table>

          <!-- 備考セクション -->
          <div class="equipment-notes">
            <h3 class="notes-title">備考</h3>

            <div class="note-section">
              <h4 class="note-subtitle">【買取対象物について】</h4>
              <p class="note-text">
                目的物リスト及び内装・外装の造作物、厨房機器、インフラ設備、その他譲渡人が残置するもの一切が買取対象物となります。<br>
                （スケルトン状態から付加されたダクト設備、グリストラップ、床下や天井上の各種インフラ設備。外部の給湯器や室外機、各種メーターから室内に至る電気・ガス等のインフラ設備、吸排水・吸排気等のインフラ設備を含みます。）
              </p>
            </div>

            <div class="note-section">
              <h4 class="note-subtitle">【性能保証について】</h4>
              <p class="note-text">
                対象物はあくまで中古品であり、性能保証はありません。
              </p>
            </div>

            <div class="note-section">
              <h4 class="note-subtitle">【引き渡しについて】</h4>
              <p class="note-text">
                本物件及び買取対象物は現状有姿での引渡しとなります。
              </p>
            </div>

            <div class="note-footer">
              <p class="note-text">
                ※お皿（残置）、グラス（残置）、調理器具（残置）、その他備品（残置）
              </p>
            </div>
          </div>
        </div>

        <!-- 2ページ目：写真シート -->
        <div class="equipment-photos-page print-page">
          <h2 class="page-title">設備写真</h2>
          <div class="photo-grid">
            <div v-for="(item, index) in equipmentItems" :key="index" class="photo-item">
              <div class="photo-header">No.{{ index + 1 }} {{ item.name }}</div>
              <div class="photo-placeholder">
                <v-icon size="48" color="grey-lighten-1">mdi-image-outline</v-icon>
                <div class="text-caption text-grey">写真 {{ index + 1 }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props
const props = defineProps<{
  equipmentItems: Array<{
    location: string
    name: string
    maker: string
    model: string
    quantity: number
  }>
}>()

// PDF生成中の状態管理
const isGeneratingPDF = ref(false)

// 設備詳細PDF生成関数（html2canvas使用）
const printEquipmentDetails = async () => {
  // クライアントサイドチェック
  if (!process.client) return

  // 既に処理中の場合は実行しない
  if (isGeneratingPDF.value) return

  isGeneratingPDF.value = true

  try {
    // 動的インポート
    const { default: jsPDF } = await import('jspdf')
    const html2canvas = (await import('html2canvas')).default

    // PDF作成
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = 210
    const pageHeight = 297

    // 余白設定
    const marginTop = 10 // 上下の余白
    const marginSide = 10 // 左右の余白

    // 1ページ目：設備リスト（左右センター、上下余白あり）
    const listPage = document.querySelector('.equipment-list-page') as HTMLElement
    if (listPage) {
      const canvas1 = await html2canvas(listPage, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData1 = canvas1.toDataURL('image/png')

      // 左右余白を考慮した幅
      const availableWidth = pageWidth - (marginSide * 2)
      const availableHeight = pageHeight - (marginTop * 2)

      let imgWidth = availableWidth
      let imgHeight = (canvas1.height * availableWidth) / canvas1.width

      // 高さが超える場合はスケール調整
      if (imgHeight > availableHeight) {
        imgHeight = availableHeight
        imgWidth = (canvas1.width * availableHeight) / canvas1.height
      }

      // 左右センタリング
      const xOffset = (pageWidth - imgWidth) / 2
      // 上余白
      const yOffset = marginTop

      doc.addImage(imgData1, 'PNG', xOffset, yOffset, imgWidth, imgHeight)
    }

    // 2ページ目：写真グリッド（上下左右センター）
    doc.addPage()
    const photosPage = document.querySelector('.equipment-photos-page') as HTMLElement
    if (photosPage) {
      const canvas2 = await html2canvas(photosPage, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData2 = canvas2.toDataURL('image/png')

      // 左右余白を考慮した幅
      const availableWidth = pageWidth - (marginSide * 2)
      const availableHeight = pageHeight - (marginTop * 2)

      let imgWidth = availableWidth
      let imgHeight = (canvas2.height * availableWidth) / canvas2.width

      // 高さが超える場合はスケール調整
      if (imgHeight > availableHeight) {
        imgHeight = availableHeight
        imgWidth = (canvas2.width * availableHeight) / canvas2.height
      }

      // 左右センタリング
      const xOffset = (pageWidth - imgWidth) / 2
      // 上下センタリング
      const yOffset = (pageHeight - imgHeight) / 2

      doc.addImage(imgData2, 'PNG', xOffset, yOffset, imgWidth, imgHeight)
    }

    // PDF保存
    doc.save('設備詳細.pdf')
  } catch (error) {
    console.error('PDF生成エラー:', error)
    alert('PDF生成に失敗しました。')
  } finally {
    // 処理完了後にローディング状態を解除
    isGeneratingPDF.value = false
  }
}
</script>

<style scoped>
/* セクション見出しを統一 */
.section-title {
  font-weight: 700 !important;
  font-size: 17px !important;
  background: linear-gradient(135deg, #f2f6ff 0%, #e8efff 100%) !important;
  color: #154a8a !important;
  border-bottom: 2px solid #e1ecff !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  border-radius: 0 !important;
}

.section-title .v-icon {
  background: rgba(30, 80, 162, 0.1);
  border-radius: 50%;
  padding: 6px;
  margin-right: 12px !important;
}

/* カードの間隔と角丸の統一 */
.v-card.section-card,
.v-card.outlined {
  border-radius: 16px !important;
  border: 1px solid #e1ecff !important;
  box-shadow: 0 4px 12px rgba(30, 80, 162, 0.08) !important;
  margin-bottom: 24px !important;
  overflow: hidden;
}

.v-card.section-card:hover {
  box-shadow: 0 6px 20px rgba(30, 80, 162, 0.12) !important;
  transition: box-shadow 0.3s ease;
}

@media print {
  .print-page {
    page-break-after: always;
    page-break-inside: avoid;
  }

  .print-page:last-child {
    page-break-after: auto;
  }

  /* ページタイトル */
  .page-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
    padding-bottom: 5px;
    border-bottom: 2px solid #333;
    text-align: center;
  }

  /* 1ページ目：設備リストテーブル */
  .equipment-list-page {
    width: 100%;
  }

  .equipment-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8px;
  }

  .equipment-table thead tr {
    background-color: #f0f0f0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .equipment-table th,
  .equipment-table td {
    border: 1px solid #333 !important;
    padding: 2px 4px;
    text-align: left;
    line-height: 1.2;
  }

  .equipment-table th {
    font-weight: bold;
    background-color: #e0e0e0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-size: 9px;
  }

  .equipment-table tbody tr:nth-child(even) {
    background-color: #f9f9f9 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* 備考セクション（印刷用） */
  .equipment-notes {
    margin-top: 8px;
    padding: 6px;
    border: 1px solid #333;
    background-color: #ffffff !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .notes-title {
    font-size: 11px;
    font-weight: bold;
    margin-bottom: 5px;
    padding-bottom: 3px;
    border-bottom: 1px solid #333;
  }

  .note-section {
    margin-bottom: 4px;
  }

  .note-subtitle {
    font-size: 9px;
    font-weight: bold;
    margin-bottom: 2px;
  }

  .note-text {
    font-size: 7px;
    line-height: 1.3;
    margin: 0;
  }

  .note-footer {
    margin-top: 4px;
    padding-top: 3px;
    border-top: 1px solid #ddd;
  }

  /* 2ページ目：写真グリッド */
  .equipment-photos-page {
    width: 100%;
    height: 100%;
  }

  .equipment-photos-page .page-title {
    margin-bottom: 5px;
    padding-bottom: 3px;
  }

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(7, 1fr);
    gap: 2px;
    width: 100%;
    height: 252mm;
  }

  .photo-item {
    border: 1px solid #999;
    display: flex;
    flex-direction: column;
    page-break-inside: avoid;
    height: 100%;
  }

  .photo-header {
    background-color: #f0f0f0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    padding: 2px 3px;
    font-size: 7px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .photo-placeholder {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fafafa !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    padding: 3px;
  }

  .photo-placeholder .v-icon {
    opacity: 0.3;
    font-size: 20px !important;
  }

  .photo-placeholder .text-caption {
    font-size: 6px;
    color: #999 !important;
  }
}

/* 画面表示用スタイル */
.equipment-list-page,
.equipment-photos-page {
  margin-bottom: 30px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(30, 80, 162, 0.08);
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 3px solid #1976d2;
  color: #1e50a2;
  display: flex;
  align-items: center;
}

.page-title::before {
  content: '';
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #1e50a2 0%, #1976d2 100%);
  margin-right: 12px;
  border-radius: 2px;
}

.equipment-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.equipment-table th,
.equipment-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e1ecff;
  text-align: left;
}

.equipment-table th {
  background-color: #e3f2fd;
  color: #1565c0;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
  border: none;
}

.equipment-table th:first-child {
  border-top-left-radius: 8px;
}

.equipment-table th:last-child {
  border-top-right-radius: 8px;
}

.equipment-table tbody tr {
  background-color: white;
  transition: all 0.2s ease;
}

.equipment-table tbody tr:nth-child(even) {
  background-color: #f8faff;
}

.equipment-table tbody tr:hover {
  background-color: #e8f4ff;
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(30, 80, 162, 0.12);
}

.equipment-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 8px;
}

.equipment-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 8px;
}

.equipment-table tbody tr:last-child td {
  border-bottom: none;
}

.equipment-table td {
  color: #374151;
  font-size: 13px;
}

.equipment-table td:first-child,
.equipment-table td:last-child {
  text-align: center;
  font-weight: 600;
  color: #1976d2;
}

/* 備考セクション（画面表示用） */
.equipment-notes {
  margin-top: 25px;
  padding: 20px 24px;
  border: 2px solid #e1ecff;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
  box-shadow: 0 1px 3px rgba(30, 80, 162, 0.08);
}

.notes-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1976d2;
  color: #1e50a2;
  display: flex;
  align-items: center;
}

.notes-title::before {
  content: '📝';
  margin-right: 8px;
  font-size: 18px;
}

.note-section {
  margin-bottom: 15px;
  padding: 12px;
  background-color: white;
  border-radius: 6px;
}

.note-subtitle {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #1e50a2;
}

.note-text {
  font-size: 13px;
  line-height: 1.7;
  margin: 0;
  color: #4b5563;
}

.note-footer {
  margin-top: 15px;
  padding-top: 12px;
  border-top: 2px dashed #e1ecff;
}

.note-footer .note-text {
  font-style: italic;
  color: #6b7280;
  font-size: 12px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-top: 20px;
}

.photo-item {
  border: 2px solid #e1ecff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.photo-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(30, 80, 162, 0.15);
  border-color: #1976d2;
}

.photo-header {
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
}

.photo-placeholder {
  aspect-ratio: 4/3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
  padding: 20px;
}

.photo-placeholder .v-icon {
  opacity: 0.25;
  margin-bottom: 8px;
  color: #1976d2;
}

.photo-placeholder .text-caption {
  color: #9ca3af;
  font-weight: 500;
}

/* レスポンシブ対応 */
@media (max-width: 1200px) {
  .photo-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .photo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
