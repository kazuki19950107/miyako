<template>
  <v-form ref="detailForm" v-model="formValid">

    <!-- 物件・契約情報 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-home-outline</v-icon>
        物件・契約情報
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 契約書アップロード -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-file-document-edit-outline</v-icon>
              契約書をアップロードしてください
            </div>
            <v-file-input
              :model-value="null"
              @update:model-value="addContractDocuments($event)"
              label="契約書ファイルを追加"
              outlined
              dense
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              prepend-icon="mdi-paperclip"
              show-size
              hide-details
            />
            <div class="text-caption grey--text mb-2">
              ※PDF、画像ファイル（JPG, PNG）、Wordファイルに対応しています
            </div>
            <!-- アップロード済みファイル一覧 -->
            <div v-if="detailCheck.contract_documents?.length" class="mt-2">
              <div class="text-caption mb-1">アップロード済み（{{ detailCheck.contract_documents.length }}件）</div>
              <v-chip
                v-for="(file, index) in detailCheck.contract_documents"
                :key="index"
                size="small"
                color="primary"
                closable
                class="me-2 mb-1"
                @click:close="removeContractDocument(index)"
              >
                {{ file.name }}
              </v-chip>
            </div>
          </v-col>

          <!-- 前テナント情報 -->
          <v-col cols="12">
            <v-textarea
              :model-value="customerInput?.property?.previousTenantInfo"
              @update:model-value="updateProperty('previousTenantInfo', $event)"
              label="前テナント情報について教えてください"
              outlined
              dense
              rows="3"
              prepend-inner-icon="mdi-information-outline"
              placeholder="前テナントに関する情報をご記入ください"
            ></v-textarea>
          </v-col>

          <!-- 契約時の条件交渉 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-handshake-outline</v-icon>
              契約時の条件交渉について教えてください
            </div>
            <div class="text-caption mb-2 grey--text">例）賃料減額など</div>
            <v-radio-group
              :model-value="customerInput?.property?.negotiation?.status"
              @update:model-value="updateNegotiation('status', $event)"
              inline
              hide-details
            >
              <v-radio label="なし" value="なし"></v-radio>
              <v-radio label="あり" value="あり"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput?.property?.negotiation?.status === 'あり'"
              :model-value="customerInput?.property?.negotiation?.detail"
              @update:model-value="updateNegotiation('detail', $event)"
              label="詳細"
              outlined
              dense
              class="mt-2"
              placeholder="条件交渉の内容を記入してください"
            ></v-text-field>
          </v-col>

          <!-- 物件の利用制限 -->
          <v-col cols="12">
            <v-textarea
              :model-value="customerInput?.property?.usageRestrictions"
              @update:model-value="updateProperty('usageRestrictions', $event)"
              label="物件の利用制限について教えてください"
              outlined
              dense
              rows="3"
              prepend-inner-icon="mdi-alert-circle-outline"
              placeholder="例）営業時間・業種制限など"
            ></v-textarea>
          </v-col>

          <!-- 面図 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-floor-plan</v-icon>
              面図について教えてください
            </div>
            <div class="text-caption mb-2 grey--text">例）平面図・給排水図面など</div>
            <v-radio-group
              :model-value="customerInput?.property?.floorPlan?.status"
              @update:model-value="updateFloorPlan('status', $event)"
              inline
              hide-details
            >
              <v-radio label="なし" value="なし"></v-radio>
              <v-radio label="あり" value="あり"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput?.property?.floorPlan?.status === 'あり'"
              :model-value="customerInput?.property?.floorPlan?.detail"
              @update:model-value="updateFloorPlan('detail', $event)"
              label="詳細"
              outlined
              dense
              class="mt-2"
              placeholder="面図の種類を記入してください"
            ></v-text-field>
          </v-col>

        </v-row>
      </v-card-text>
    </v-card>

    <!-- B. ライフライン契約・支払い（統合版） -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-flash</v-icon>
        ライフライン契約・支払い
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 電気 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-flash</v-icon>
              電気
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <v-radio-group
              :model-value="customerInput?.utilities?.electricity?.contractType"
              @update:model-value="updateElectricity('contractType', $event)"
              label="契約状況"
              inline
              density="compact"
              hide-details
            >
              <v-radio label="家主検針" value="家主検針"></v-radio>
              <v-radio label="直接契約" value="直接契約"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.electricity_company"
              @update:model-value="updateDetailCheck('electricity_company', $event)"
              label="契約会社"
              outlined
              dense
              placeholder="例: 関西電力、新電力"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.electricity_customer_number"
              @update:model-value="updateDetailCheck('electricity_customer_number', $event)"
              label="お客様番号"
              outlined
              dense
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.electricity_monthly_cost"
              @update:model-value="updateDetailCheck('electricity_monthly_cost', $event)"
              label="月額費用"
              outlined
              dense
              placeholder="例: 15,000"
              suffix="円"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-file-input
              @update:model-value="handleFileUpload($event, 'electricity_bill', 'electricity_bill_photos')"
              label="請求書写真"
              outlined
              dense
              multiple
              accept="image/*"
              prepend-icon="mdi-camera"
              show-size
              chips
              small-chips
              :loading="isUploading"
            />
            <!-- アップロード済みファイル一覧 -->
            <div v-if="detailCheck.electricity_bill_photos?.length" class="mt-2">
              <v-chip
                v-for="(url, index) in detailCheck.electricity_bill_photos"
                :key="index"
                class="mr-2 mb-1"
                size="small"
              >
                <v-icon size="small" class="mr-1 cursor-pointer" @click="openPreviewModal(url)">mdi-eye</v-icon>
                <span class="text-truncate" style="max-width: 120px;">{{ getFileName(url) }}</span>
                <v-icon size="small" class="ml-1 cursor-pointer" @click="openDeleteConfirm('electricity_bill_photos', index, url)">mdi-close</v-icon>
              </v-chip>
            </div>
          </v-col>

          <v-col cols="12"><v-divider /></v-col>

          <!-- ガス -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-fire</v-icon>
              ガス
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <v-radio-group
              :model-value="customerInput?.utilities?.gas?.contractType"
              @update:model-value="updateGas('contractType', $event)"
              label="契約状況"
              inline
              density="compact"
              hide-details
            >
              <v-radio label="家主検針" value="家主検針"></v-radio>
              <v-radio label="直接契約" value="直接契約"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.gas_company"
              @update:model-value="updateDetailCheck('gas_company', $event)"
              label="契約会社"
              outlined
              dense
              placeholder="例: 大阪ガス、プロパン"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.gas_customer_number"
              @update:model-value="updateDetailCheck('gas_customer_number', $event)"
              label="お客様番号"
              outlined
              dense
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.gas_monthly_cost"
              @update:model-value="updateDetailCheck('gas_monthly_cost', $event)"
              label="月額費用"
              outlined
              dense
              placeholder="例: 8,000"
              suffix="円"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-file-input
              @update:model-value="handleFileUpload($event, 'gas_bill', 'gas_bill_photos')"
              label="請求書写真"
              outlined
              dense
              multiple
              accept="image/*"
              prepend-icon="mdi-camera"
              show-size
              chips
              small-chips
              :loading="isUploading"
            />
            <!-- アップロード済みファイル一覧 -->
            <div v-if="detailCheck.gas_bill_photos?.length" class="mt-2">
              <v-chip
                v-for="(url, index) in detailCheck.gas_bill_photos"
                :key="index"
                class="mr-2 mb-1"
                size="small"
              >
                <v-icon size="small" class="mr-1 cursor-pointer" @click="openPreviewModal(url)">mdi-eye</v-icon>
                <span class="text-truncate" style="max-width: 120px;">{{ getFileName(url) }}</span>
                <v-icon size="small" class="ml-1 cursor-pointer" @click="openDeleteConfirm('gas_bill_photos', index, url)">mdi-close</v-icon>
              </v-chip>
            </div>
          </v-col>

          <v-col cols="12"><v-divider /></v-col>

          <!-- 水道 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-water</v-icon>
              水道
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <v-radio-group
              :model-value="customerInput?.utilities?.water?.contractType"
              @update:model-value="updateWater('contractType', $event)"
              label="契約状況"
              inline
              density="compact"
              hide-details
            >
              <v-radio label="家主検針" value="家主検針"></v-radio>
              <v-radio label="直接契約" value="直接契約"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.water_company"
              @update:model-value="updateDetailCheck('water_company', $event)"
              label="契約会社"
              outlined
              dense
              placeholder="例: 水道局"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.water_customer_number"
              @update:model-value="updateDetailCheck('water_customer_number', $event)"
              label="お客様番号"
              outlined
              dense
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="detailCheck.water_monthly_cost"
              @update:model-value="updateDetailCheck('water_monthly_cost', $event)"
              label="月額費用"
              outlined
              dense
              placeholder="例: 5,000"
              suffix="円"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-file-input
              @update:model-value="handleFileUpload($event, 'water_bill', 'water_bill_photos')"
              label="請求書写真"
              outlined
              dense
              multiple
              accept="image/*"
              prepend-icon="mdi-camera"
              show-size
              chips
              small-chips
              :loading="isUploading"
            />
            <!-- アップロード済みファイル一覧 -->
            <div v-if="detailCheck.water_bill_photos?.length" class="mt-2">
              <v-chip
                v-for="(url, index) in detailCheck.water_bill_photos"
                :key="index"
                class="mr-2 mb-1"
                size="small"
              >
                <v-icon size="small" class="mr-1 cursor-pointer" @click="openPreviewModal(url)">mdi-eye</v-icon>
                <span class="text-truncate" style="max-width: 120px;">{{ getFileName(url) }}</span>
                <v-icon size="small" class="ml-1 cursor-pointer" @click="openDeleteConfirm('water_bill_photos', index, url)">mdi-close</v-icon>
              </v-chip>
            </div>
          </v-col>

          <v-col cols="12"><v-divider /></v-col>

          <!-- ゴミ出し・その他費用 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-delete-outline</v-icon>
              ゴミ出し方法
            </div>
            <v-text-field
              :model-value="customerInput?.utilities?.garbage?.rules"
              @update:model-value="updateGarbage('rules', $event)"
              label="規則"
              outlined
              dense
              class="mb-2"
            ></v-text-field>
            <v-text-field
              :model-value="customerInput?.utilities?.garbage?.cost"
              @update:model-value="updateGarbage('cost', $event)"
              label="費用"
              outlined
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-cash-multiple</v-icon>
              家主支払い項目
            </div>
            <v-radio-group
              :model-value="detailCheck.landlord_payment"
              @update:model-value="updateDetailCheck('landlord_payment', $event)"
              inline
              density="compact"
              hide-details
            >
              <v-radio label="なし" value="なし"></v-radio>
              <v-radio label="あり" value="あり"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="detailCheck.landlord_payment === 'あり'"
              :model-value="detailCheck.landlord_payment_detail"
              @update:model-value="updateDetailCheck('landlord_payment_detail', $event)"
              label="支払い項目詳細"
              outlined
              dense
              placeholder="例: 共益費、管理費"
              class="mt-2"
            />
          </v-col>

          <!-- その他費用 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-currency-jpy</v-icon>
              その他費用（商店街費・町内会費など）
            </div>
            <v-radio-group
              :model-value="customerInput?.utilities?.otherCosts?.status"
              @update:model-value="updateOtherCosts('status', $event)"
              inline
              density="compact"
              hide-details
            >
              <v-radio label="なし" value="なし"></v-radio>
              <v-radio label="あり" value="あり"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput?.utilities?.otherCosts?.status === 'あり'"
              :model-value="customerInput?.utilities?.otherCosts?.detail"
              @update:model-value="updateOtherCosts('detail', $event)"
              label="詳細"
              outlined
              dense
              class="mt-2"
              placeholder="費用の種類と金額を記入してください"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.section_b_memo"
              @update:model-value="updateDetailCheck('section_b_memo', $event)"
              label="ライフライン契約・支払い メモ"
              outlined
              dense
              rows="2"
              placeholder="特記事項があれば記載"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 申告・条件情報・費用・その他 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-alert-decagram-outline</v-icon>
        申告・条件情報・費用・その他
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 事前申告 -->
          <v-col cols="12">
            <v-textarea
              :model-value="customerInput?.disclosure?.priorNotice"
              @update:model-value="updateDisclosure('priorNotice', $event)"
              label="事前申告"
              outlined
              dense
              rows="3"
              prepend-inner-icon="mdi-clipboard-alert-outline"
              placeholder="例）家賃滞納・近隣トラブル・家主変更など"
            ></v-textarea>
          </v-col>

          <!-- 新条件 -->
          <v-col cols="12">
            <v-textarea
              :model-value="customerInput?.disclosure?.newConditions"
              @update:model-value="updateDisclosure('newConditions', $event)"
              label="新条件"
              outlined
              dense
              rows="3"
              prepend-inner-icon="mdi-file-document-edit-outline"
              placeholder="例）既に貸主から後継テナントの新条件を聞いている場合"
            ></v-textarea>
          </v-col>

          <!-- その他月額費用 -->
          <v-col cols="12" md="6">
            <v-radio-group
              :model-value="detailCheck.other_monthly_costs"
              @update:model-value="updateDetailCheck('other_monthly_costs', $event)"
              label="その他月額費用"
              inline
              hide-details
            >
              <v-radio label="あり" value="あり"></v-radio>
              <v-radio label="なし" value="なし"></v-radio>
            </v-radio-group>
          </v-col>

          <v-col cols="12" md="6" v-if="detailCheck.other_monthly_costs === 'あり'">
            <v-text-field
              :model-value="detailCheck.other_monthly_costs_detail"
              @update:model-value="updateDetailCheck('other_monthly_costs_detail', $event)"
              label="その他費用詳細"
              outlined
              dense
              placeholder="例: 防虫サービス、清掃費"
            />
          </v-col>

          <v-col cols="12" md="6" v-if="detailCheck.other_monthly_costs === 'あり'">
            <v-text-field
              :model-value="detailCheck.other_monthly_costs_amount"
              @update:model-value="updateDetailCheck('other_monthly_costs_amount', $event)"
              label="費用（月額）"
              outlined
              dense
              type="number"
              suffix="円"
            />
          </v-col>

          <!-- 申告事項 -->
          <v-col cols="12">
            <v-text-field
              :model-value="detailCheck.declarations"
              @update:model-value="updateDetailCheck('declarations', $event)"
              label="申告事項"
              outlined
              dense
              placeholder="例: 保健所許可、消防署届出"
            />
          </v-col>

          <!-- 新テナント条件 -->
          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.new_tenant_conditions"
              @update:model-value="updateDetailCheck('new_tenant_conditions', $event)"
              label="新テナント条件"
              outlined
              dense
              rows="3"
              placeholder="新しいテナントに対する条件や要求事項"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.section_c_memo"
              @update:model-value="updateDetailCheck('section_c_memo', $event)"
              label="メモ"
              outlined
              dense
              rows="2"
              placeholder="特記事項があれば記載"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 画像プレビューモーダル -->
    <v-dialog v-model="showPreviewModal" max-width="800">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>画像プレビュー</span>
          <v-btn icon variant="text" @click="showPreviewModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="text-center pa-4">
          <v-img
            :src="previewUrl"
            max-height="600"
            contain
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
          このファイルを削除してもよろしいですか？
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
const props = defineProps<{
  propertyId?: string | null
  propertyFeatures: {
    strengths: string[]
    limitations: string[]
  }
  customerInput?: {
    property: {
      previousTenantInfo: string
      negotiation: {
        status: string
        detail: string
      }
      usageRestrictions: string
      floorPlan: {
        status: string
        detail: string
      }
      invoiceRegistration: {
        status: string
        detail: string
      }
    }
    scheduleDates: {
      terminationNoticeSubmitted: string
      terminationNoticeDate: string
      vacancyDate: string
      contractEndDate: string
      businessEndDate: string
      handoverDesiredDate: string
    }
    utilities: {
      electricity: {
        contractType: string
        customerNumber: string
      }
      gas: {
        contractType: string
        customerNumber: string
      }
      water: {
        contractType: string
        customerNumber: string
      }
      garbage: {
        rules: string
        cost: string
      }
      otherCosts: {
        status: string
        detail: string
      }
    }
    disclosure: {
      priorNotice: string
      newConditions: string
    }
  }
  detailCheck: {
    // A. 交渉・制限・図面
    landlord_negotiation: string
    landlord_negotiation_detail: string
    usage_restriction: string
    usage_restriction_detail: string
    floor_plan: string
    floor_plan_type: string
    section_a_memo: string
    // 写真: 賃貸借契約書・平面図
    lease_contract_photos: File[]
    floor_plan_photos: File[]
    contract_documents: File[]

    // B. ライフライン契約・支払い
    electricity_company: string
    electricity_customer_number: string
    electricity_monthly_cost: string
    gas_company: string
    gas_customer_number: string
    gas_monthly_cost: string
    water_company: string
    water_customer_number: string
    water_monthly_cost: string
    landlord_payment: string
    landlord_payment_detail: string
    section_b_memo: string
    // 写真: 請求書
    electricity_bill_photos: File[]
    gas_bill_photos: File[]
    water_bill_photos: File[]

    // C. その他申告・費用
    garbage_disposal_cost: string
    other_monthly_costs: string
    other_monthly_costs_detail: string
    other_monthly_costs_amount: string
    declarations: string
    new_tenant_conditions: string
    section_c_memo: string

    // D. 設備・内装・譲渡
    non_transferable_equipment: string
    non_transferable_equipment_detail: string
    broken_equipment: string
    broken_equipment_detail: string
    lease_debt: string
    lease_debt_amount: string
    landlord_equipment: string
    landlord_equipment_detail: string
    section_d_memo: string

    // E. メーター・容量・機器位置
    exhaust_equipment: string
    exhaust_route: string
    drainage_equipment: string
    electric_meter_location: string
    electric_capacity: string
    power_capacity: string
    gas_meter_location: string
    gas_capacity: string
    water_meter_location: string
    water_pipe_capacity: string
    outdoor_unit_location: string
    mdf_location: string
    section_e_memo: string
    // 写真: 設備リスト
    kitchen_equipment_photos: File[]
    duct_photos: File[]
    grease_trap_photos: File[]
    electric_meter_photos: File[]
    gas_meter_photos: File[]
    water_meter_photos: File[]

    // F. 売上・営業時間
    highest_sales_month: string
    lowest_sales_month: string
    lunch_hours: string
    dinner_hours: string
    lunch_avg_price: string
    dinner_avg_price: string
    closed_days: string
    seat_count: string
    section_f_memo: string

    // G. エリア・客層
    area_types: string[]
    customer_segments: string[]
    main_customer_age: string
    main_customer_gender: string
    customer_type: string
    access_info: string
    surrounding_environment: string
    section_g_memo: string
  }
}>()

// Emits
const emit = defineEmits<{
  'update:propertyFeatures': [value: typeof props.propertyFeatures]
  'update:detailCheck': [value: typeof props.detailCheck]
  'update:customerInput': [value: typeof props.customerInput]
}>()

// Internal state
const formValid = ref(false)
const detailForm = ref(null)

// プレビューモーダル用
const showPreviewModal = ref(false)
const previewUrl = ref('')

// 削除確認用
const showDeleteConfirm = ref(false)
const deleteTarget = ref<{ fieldName: string; index: number; url: string } | null>(null)

// ファイル名を取得
const getFileName = (url: string): string => {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]
    // タイムスタンプ部分を除去（例: 1234567890_filename.jpg → filename.jpg）
    const match = fileName.match(/^\d+_(.+)$/)
    return match ? match[1] : fileName
  } catch {
    return url
  }
}

// プレビューモーダルを開く
const openPreviewModal = (url: string) => {
  previewUrl.value = url
  showPreviewModal.value = true
}

// 削除確認ダイアログを開く
const openDeleteConfirm = (fieldName: string, index: number, url: string) => {
  deleteTarget.value = { fieldName, index, url }
  showDeleteConfirm.value = true
}

// ファイルを削除
const confirmDelete = () => {
  if (!deleteTarget.value) return

  const { fieldName, index } = deleteTarget.value
  const currentUrls = props.detailCheck?.[fieldName] || []
  const newUrls = currentUrls.filter((_: string, i: number) => i !== index)
  updateDetailCheck(fieldName, newUrls)

  showDeleteConfirm.value = false
  deleteTarget.value = null
}

// 写真のプレビューURL生成
const getPhotoUrls = (files: File[] | null): string[] => {
  if (!files || !Array.isArray(files)) return []
  return files.map(file => {
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }
    return ''
  }).filter(url => url !== '')
}

// Methods
const updatePropertyFeatures = (key: string, value: any) => {
  emit('update:propertyFeatures', { ...props.propertyFeatures, [key]: value })
}

const updateDetailCheck = (key: string, value: any) => {
  emit('update:detailCheck', { ...props.detailCheck, [key]: value })
}

// ファイルアップロード処理
const isUploading = ref(false)
const handleFileUpload = async (files: File[] | File | null, category: string, fieldName: string) => {
  if (!files) return

  const fileArray = Array.isArray(files) ? files : [files]
  if (fileArray.length === 0) return

  // propertyIdがない場合は一時的なIDを使用
  const id = props.propertyId || `temp_${Date.now()}`

  isUploading.value = true
  try {
    const urls = await uploadFiles(fileArray, id, category)
    if (urls.length > 0) {
      // 既存のURLと結合
      const existingUrls = props.detailCheck?.[fieldName] || []
      const allUrls = Array.isArray(existingUrls) ? [...existingUrls, ...urls] : urls
      updateDetailCheck(fieldName, allUrls)
    }
  } catch (e) {
    console.error('ファイルアップロードエラー:', e)
  } finally {
    isUploading.value = false
  }
}

// 契約書ファイルの追加
const addContractDocuments = (files: File[] | File | null) => {
  if (!files) return
  const newFiles = Array.isArray(files) ? files : [files]
  const currentFiles = props.detailCheck?.contract_documents || []
  emit('update:detailCheck', {
    ...props.detailCheck,
    contract_documents: [...currentFiles, ...newFiles]
  })
}

// 契約書ファイルの削除
const removeContractDocument = (index: number) => {
  const currentFiles = props.detailCheck?.contract_documents || []
  const newFiles = currentFiles.filter((_: File, i: number) => i !== index)
  emit('update:detailCheck', {
    ...props.detailCheck,
    contract_documents: newFiles
  })
}

// CustomerInput update methods
const updateElectricity = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      electricity: { ...props.customerInput.utilities.electricity, [key]: value }
    }
  })
}

const updateGas = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      gas: { ...props.customerInput.utilities.gas, [key]: value }
    }
  })
}

const updateWater = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      water: { ...props.customerInput.utilities.water, [key]: value }
    }
  })
}

const updateGarbage = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      garbage: { ...props.customerInput.utilities.garbage, [key]: value }
    }
  })
}

const updateOtherCosts = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      otherCosts: { ...props.customerInput.utilities.otherCosts, [key]: value }
    }
  })
}

const updateDisclosure = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    disclosure: { ...props.customerInput.disclosure, [key]: value }
  })
}

// Update methods for property
const updateProperty = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    property: { ...props.customerInput.property, [key]: value }
  })
}

const updateNegotiation = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    property: {
      ...props.customerInput.property,
      negotiation: { ...props.customerInput.property.negotiation, [key]: value }
    }
  })
}

const updateFloorPlan = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    property: {
      ...props.customerInput.property,
      floorPlan: { ...props.customerInput.property.floorPlan, [key]: value }
    }
  })
}

const updateInvoiceRegistration = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    property: {
      ...props.customerInput.property,
      invoiceRegistration: { ...props.customerInput.property.invoiceRegistration, [key]: value }
    }
  })
}

const updateScheduleDates = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    scheduleDates: { ...props.customerInput.scheduleDates, [key]: value }
  })
}

// Expose form validity for parent
defineExpose({
  formValid,
  detailForm
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

/* クリック可能なアイコン */
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  opacity: 0.7;
}

</style>
