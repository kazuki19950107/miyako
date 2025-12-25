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
              row
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

          <!-- スケジュール詳細 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-calendar-clock</v-icon>
              スケジュール詳細について教えてください
            </div>
          </v-col>

          <!-- 解約通知 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">解約通知の提出</div>
            <v-radio-group
              :model-value="customerInput?.scheduleDates?.terminationNoticeSubmitted"
              @update:model-value="updateScheduleDates('terminationNoticeSubmitted', $event)"
              row
            >
              <v-radio label="している" value="している"></v-radio>
              <v-radio label="していない" value="していない"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput?.scheduleDates?.terminationNoticeSubmitted === 'している'"
              :model-value="customerInput?.scheduleDates?.terminationNoticeDate"
              @update:model-value="updateScheduleDates('terminationNoticeDate', $event)"
              label="解約通知提出日"
              outlined
              dense
              type="date"
              class="mt-2"
            ></v-text-field>
          </v-col>

          <!-- 退店日 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="customerInput?.scheduleDates?.vacancyDate"
              @update:model-value="updateScheduleDates('vacancyDate', $event)"
              label="退店予定日"
              outlined
              dense
              type="date"
              prepend-inner-icon="mdi-exit-run"
            ></v-text-field>
          </v-col>

          <!-- 契約終了日 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="customerInput?.scheduleDates?.contractEndDate"
              @update:model-value="updateScheduleDates('contractEndDate', $event)"
              label="契約終了日"
              outlined
              dense
              type="date"
              prepend-inner-icon="mdi-calendar-end"
            ></v-text-field>
          </v-col>

          <!-- 営業終了日 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="customerInput?.scheduleDates?.businessEndDate"
              @update:model-value="updateScheduleDates('businessEndDate', $event)"
              label="営業終了日"
              outlined
              dense
              type="date"
              prepend-inner-icon="mdi-store-off"
            ></v-text-field>
          </v-col>

          <!-- 引き渡し希望日 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="customerInput?.scheduleDates?.handoverDesiredDate"
              @update:model-value="updateScheduleDates('handoverDesiredDate', $event)"
              label="引き渡し希望日"
              outlined
              dense
              type="date"
              prepend-inner-icon="mdi-hand-heart"
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
              row
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

          <!-- 貸主のインボイス登録状況 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-file-document-outline</v-icon>
              貸主のインボイス登録状況について教えてください
            </div>
            <v-radio-group
              :model-value="customerInput?.property?.invoiceRegistration?.status"
              @update:model-value="updateInvoiceRegistration('status', $event)"
              row
            >
              <v-radio label="登録済み" value="登録済み"></v-radio>
              <v-radio label="未登録" value="未登録"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput?.property?.invoiceRegistration?.status === '登録済み'"
              :model-value="customerInput?.property?.invoiceRegistration?.detail"
              @update:model-value="updateInvoiceRegistration('detail', $event)"
              label="インボイス番号"
              outlined
              dense
              class="mt-2"
              placeholder="T1234567890123"
              prepend-inner-icon="mdi-identifier"
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
              row
              density="compact"
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
              row
              density="compact"
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
              row
              density="compact"
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
              row
              density="compact"
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
              row
              density="compact"
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

          <v-col cols="12"><v-divider class="my-2" /></v-col>

          <!-- 請求書写真 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-receipt-text</v-icon>
              請求書写真
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <v-file-input
              :model-value="detailCheck.electricity_bill_photos"
              @update:model-value="updateDetailCheck('electricity_bill_photos', $event)"
              label="電気請求書"
              outlined
              dense
              multiple
              accept="image/*"
              prepend-icon="mdi-camera"
              show-size
              counter
              chips
              small-chips
            >
              <template v-slot:selection="{ fileNames }">
                <v-chip
                  v-for="fileName in fileNames"
                  :key="fileName"
                  size="small"
                  color="primary"
                  class="me-2"
                >
                  {{ fileName }}
                </v-chip>
              </template>
            </v-file-input>
            <div v-if="detailCheck.electricity_bill_photos?.length" class="d-flex flex-wrap gap-2 mt-2">
              <v-img
                v-for="(photo, index) in getPhotoUrls(detailCheck.electricity_bill_photos)"
                :key="index"
                :src="photo"
                width="80"
                height="80"
                cover
                class="rounded border"
              />
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <v-file-input
              :model-value="detailCheck.gas_bill_photos"
              @update:model-value="updateDetailCheck('gas_bill_photos', $event)"
              label="ガス請求書"
              outlined
              dense
              multiple
              accept="image/*"
              prepend-icon="mdi-camera"
              show-size
              counter
              chips
              small-chips
            >
              <template v-slot:selection="{ fileNames }">
                <v-chip
                  v-for="fileName in fileNames"
                  :key="fileName"
                  size="small"
                  color="primary"
                  class="me-2"
                >
                  {{ fileName }}
                </v-chip>
              </template>
            </v-file-input>
            <div v-if="detailCheck.gas_bill_photos?.length" class="d-flex flex-wrap gap-2 mt-2">
              <v-img
                v-for="(photo, index) in getPhotoUrls(detailCheck.gas_bill_photos)"
                :key="index"
                :src="photo"
                width="80"
                height="80"
                cover
                class="rounded border"
              />
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <v-file-input
              :model-value="detailCheck.water_bill_photos"
              @update:model-value="updateDetailCheck('water_bill_photos', $event)"
              label="水道請求書"
              outlined
              dense
              multiple
              accept="image/*"
              prepend-icon="mdi-camera"
              show-size
              counter
              chips
              small-chips
            >
              <template v-slot:selection="{ fileNames }">
                <v-chip
                  v-for="fileName in fileNames"
                  :key="fileName"
                  size="small"
                  color="primary"
                  class="me-2"
                >
                  {{ fileName }}
                </v-chip>
              </template>
            </v-file-input>
            <div v-if="detailCheck.water_bill_photos?.length" class="d-flex flex-wrap gap-2 mt-2">
              <v-img
                v-for="(photo, index) in getPhotoUrls(detailCheck.water_bill_photos)"
                :key="index"
                :src="photo"
                width="80"
                height="80"
                cover
                class="rounded border"
              />
            </div>
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

          <!-- ゴミ回収費用 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.garbage_disposal_cost"
              @update:model-value="updateDetailCheck('garbage_disposal_cost', $event)"
              label="ゴミ回収費用（月額）"
              outlined
              dense
              type="number"
              suffix="円"
            />
          </v-col>

          <!-- その他月額費用 -->
          <v-col cols="12" md="6">
            <v-radio-group
              :model-value="detailCheck.other_monthly_costs"
              @update:model-value="updateDetailCheck('other_monthly_costs', $event)"
              label="その他月額費用"
              row
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

  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props
const props = defineProps<{
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
    gas_company: string
    gas_customer_number: string
    water_company: string
    water_customer_number: string
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
</style>
