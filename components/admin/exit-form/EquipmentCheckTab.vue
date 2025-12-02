<template>
  <v-form ref="detailForm" v-model="formValid">

    <!-- A. 交渉・制限・図面 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-handshake</v-icon>
        交渉・制限・図面
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 賃貸借契約書写真 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-file-document</v-icon>
              賃貸借契約書
            </div>
            <v-file-input
              :model-value="detailCheck.lease_contract_photos"
              @update:model-value="updateDetailCheck('lease_contract_photos', $event)"
              label="賃貸借契約書の写真をアップロード"
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
            <!-- プレビュー -->
            <div v-if="detailCheck.lease_contract_photos?.length" class="d-flex flex-wrap gap-2 mt-2">
              <v-img
                v-for="(photo, index) in getPhotoUrls(detailCheck.lease_contract_photos)"
                :key="index"
                :src="photo"
                width="100"
                height="100"
                cover
                class="rounded border"
              />
            </div>
          </v-col>

          <!-- 大家との交渉 -->
          <v-col cols="12" sm="6" md="6">
            <v-radio-group
              :model-value="detailCheck.landlord_negotiation"
              @update:model-value="updateDetailCheck('landlord_negotiation', $event)"
              label="大家との交渉"
              row
            >
              <v-radio label="あり" value="あり"></v-radio>
              <v-radio label="なし" value="なし"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="detailCheck.landlord_negotiation === 'あり'"
              :model-value="detailCheck.landlord_negotiation_detail"
              @update:model-value="updateDetailCheck('landlord_negotiation_detail', $event)"
              label="交渉内容"
              outlined
              dense
              placeholder="交渉内容を入力"
              class="mt-2"
            />
          </v-col>

          <!-- 利用制限 -->
          <v-col cols="12" sm="6" md="6">
            <v-radio-group
              :model-value="detailCheck.usage_restriction"
              @update:model-value="updateDetailCheck('usage_restriction', $event)"
              label="利用制限"
              row
            >
              <v-radio label="あり" value="あり"></v-radio>
              <v-radio label="なし" value="なし"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="detailCheck.usage_restriction === 'あり'"
              :model-value="detailCheck.usage_restriction_detail"
              @update:model-value="updateDetailCheck('usage_restriction_detail', $event)"
              label="制限内容"
              outlined
              dense
              placeholder="制限内容を入力"
              class="mt-2"
            />
          </v-col>

          <!-- 図面 -->
          <v-col cols="12" sm="6" md="6">
            <v-radio-group
              :model-value="detailCheck.floor_plan"
              @update:model-value="updateDetailCheck('floor_plan', $event)"
              label="図面"
              row
            >
              <v-radio label="あり" value="あり"></v-radio>
              <v-radio label="なし" value="なし"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="detailCheck.floor_plan === 'あり'"
              :model-value="detailCheck.floor_plan_type"
              @update:model-value="updateDetailCheck('floor_plan_type', $event)"
              label="図面の種類"
              outlined
              dense
              placeholder="例: 竣工図、レイアウト図"
              class="mt-2"
            />
          </v-col>

          <!-- 平面図写真 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-floor-plan</v-icon>
              平面図
            </div>
            <v-file-input
              :model-value="detailCheck.floor_plan_photos"
              @update:model-value="updateDetailCheck('floor_plan_photos', $event)"
              label="平面図の写真をアップロード"
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
            <!-- プレビュー -->
            <div v-if="detailCheck.floor_plan_photos?.length" class="d-flex flex-wrap gap-2 mt-2">
              <v-img
                v-for="(photo, index) in getPhotoUrls(detailCheck.floor_plan_photos)"
                :key="index"
                :src="photo"
                width="100"
                height="100"
                cover
                class="rounded border"
              />
            </div>
          </v-col>

          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.section_a_memo"
              @update:model-value="updateDetailCheck('section_a_memo', $event)"
              label="交渉・制限・図面 メモ"
              outlined
              dense
              rows="2"
              placeholder="特記事項があれば記載"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- B. ライフライン契約・支払い -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-flash</v-icon>
        ライフライン契約・支払い
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 電気契約 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.electricity_company"
              @update:model-value="updateDetailCheck('electricity_company', $event)"
              label="電気契約会社"
              outlined
              dense
              placeholder="例: 東京電力、関西電力"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.electricity_customer_number"
              @update:model-value="updateDetailCheck('electricity_customer_number', $event)"
              label="電気お客様番号"
              outlined
              dense
            />
          </v-col>

          <!-- ガス契約 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.gas_company"
              @update:model-value="updateDetailCheck('gas_company', $event)"
              label="ガス契約会社"
              outlined
              dense
              placeholder="例: 東京ガス、大阪ガス"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.gas_customer_number"
              @update:model-value="updateDetailCheck('gas_customer_number', $event)"
              label="ガスお客様番号"
              outlined
              dense
            />
          </v-col>

          <!-- 水道契約 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.water_company"
              @update:model-value="updateDetailCheck('water_company', $event)"
              label="水道契約会社"
              outlined
              dense
              placeholder="例: 東京都水道局"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.water_customer_number"
              @update:model-value="updateDetailCheck('water_customer_number', $event)"
              label="水道お客様番号"
              outlined
              dense
            />
          </v-col>

          <!-- 家主支払い項目 -->
          <v-col cols="12" md="6">
            <v-radio-group
              :model-value="detailCheck.landlord_payment"
              @update:model-value="updateDetailCheck('landlord_payment', $event)"
              label="家主支払い項目"
              row
            >
              <v-radio label="あり" value="あり"></v-radio>
              <v-radio label="なし" value="なし"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="detailCheck.landlord_payment === 'あり'"
              :model-value="detailCheck.landlord_payment_detail"
              @update:model-value="updateDetailCheck('landlord_payment_detail', $event)"
              label="支払い項目"
              outlined
              dense
              placeholder="例: 共益費、管理費"
              class="mt-2"
            />
          </v-col>

          <v-col cols="12"><v-divider class="my-4" /></v-col>

          <!-- 電気・ガス・水道の請求書写真 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-receipt-text</v-icon>
              電気・ガス・水道の請求書
            </div>
            <v-alert type="info" variant="tonal" class="mb-4" density="compact">
              各ライフラインの請求書の写真をアップロードしてください
            </v-alert>
          </v-col>

          <!-- 電気請求書 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2" style="color: #1e50a2;">
              <v-icon small class="mr-1">mdi-flash</v-icon>
              電気請求書
            </div>
            <v-file-input
              :model-value="detailCheck.electricity_bill_photos"
              @update:model-value="updateDetailCheck('electricity_bill_photos', $event)"
              label="電気請求書の写真"
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

          <!-- ガス請求書 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2" style="color: #1e50a2;">
              <v-icon small class="mr-1">mdi-fire</v-icon>
              ガス請求書
            </div>
            <v-file-input
              :model-value="detailCheck.gas_bill_photos"
              @update:model-value="updateDetailCheck('gas_bill_photos', $event)"
              label="ガス請求書の写真"
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

          <!-- 水道請求書 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2" style="color: #1e50a2;">
              <v-icon small class="mr-1">mdi-water</v-icon>
              水道請求書
            </div>
            <v-file-input
              :model-value="detailCheck.water_bill_photos"
              @update:model-value="updateDetailCheck('water_bill_photos', $event)"
              label="水道請求書の写真"
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

    <!-- C. その他申告・費用 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-receipt</v-icon>
        その他申告・費用
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
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
              label="その他申告・費用 メモ"
              outlined
              dense
              rows="2"
              placeholder="特記事項があれば記載"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- D. 設備・内装・譲渡 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-tools</v-icon>
        設備・内装・譲渡
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>

          <!-- 譲渡しない設備 -->
          <v-col cols="12" sm="6" md="6">
            <v-radio-group
              :model-value="detailCheck.non_transferable_equipment"
              @update:model-value="updateDetailCheck('non_transferable_equipment', $event)"
              label="譲渡しない設備"
              row
            >
              <v-radio label="あり" value="あり"></v-radio>
              <v-radio label="なし" value="なし"></v-radio>
            </v-radio-group>
            <v-textarea
              v-if="detailCheck.non_transferable_equipment === 'あり'"
              :model-value="detailCheck.non_transferable_equipment_detail"
              @update:model-value="updateDetailCheck('non_transferable_equipment_detail', $event)"
              label="譲渡しない設備詳細"
              outlined
              dense
              rows="3"
              placeholder="持ち出し予定の設備を記載"
              class="mt-2"
            />
          </v-col>

          <!-- 故障設備 -->
          <v-col cols="12" sm="6" md="6">
            <v-radio-group
              :model-value="detailCheck.broken_equipment"
              @update:model-value="updateDetailCheck('broken_equipment', $event)"
              label="故障設備"
              row
            >
              <v-radio label="あり" value="あり"></v-radio>
              <v-radio label="なし" value="なし"></v-radio>
            </v-radio-group>
            <v-textarea
              v-if="detailCheck.broken_equipment === 'あり'"
              :model-value="detailCheck.broken_equipment_detail"
              @update:model-value="updateDetailCheck('broken_equipment_detail', $event)"
              label="故障設備詳細"
              outlined
              dense
              rows="3"
              placeholder="故障している設備と状況"
              class="mt-2"
            />
          </v-col>

          <!-- リース残債 -->
          <v-col cols="12" sm="6" md="6">
            <v-radio-group
              :model-value="detailCheck.lease_debt"
              @update:model-value="updateDetailCheck('lease_debt', $event)"
              label="リース残債"
              row
            >
              <v-radio label="あり" value="あり"></v-radio>
              <v-radio label="なし" value="なし"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="detailCheck.lease_debt === 'あり'"
              :model-value="detailCheck.lease_debt_amount"
              @update:model-value="updateDetailCheck('lease_debt_amount', $event)"
              label="リース残債額"
              outlined
              dense
              type="number"
              suffix="万円"
              class="mt-2"
            />
          </v-col>

          <!-- 家主所有設備 -->
          <v-col cols="12" sm="6" md="6">
            <v-radio-group
              :model-value="detailCheck.landlord_equipment"
              @update:model-value="updateDetailCheck('landlord_equipment', $event)"
              label="家主所有設備"
              row
            >
              <v-radio label="あり" value="あり"></v-radio>
              <v-radio label="なし" value="なし"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="detailCheck.landlord_equipment === 'あり'"
              :model-value="detailCheck.landlord_equipment_detail"
              @update:model-value="updateDetailCheck('landlord_equipment_detail', $event)"
              label="家主所有設備詳細"
              outlined
              dense
              placeholder="例: エアコン、給湯器"
              class="mt-2"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.section_d_memo"
              @update:model-value="updateDetailCheck('section_d_memo', $event)"
              label="設備・内装・譲渡 メモ"
              outlined
              dense
              rows="2"
              placeholder="特記事項があれば記載"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- E. メーター・容量・機器位置 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-gauge</v-icon>
        メーター・容量・機器位置
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 設備リスト写真セクション -->
          <v-col cols="12">
            <v-alert type="info" variant="tonal" class="mb-4">
              <v-icon class="mr-2">mdi-camera</v-icon>
              設備リストの写真をアップロードしてください（厨房、ダクト、グリストラップ、各メーター）
            </v-alert>
          </v-col>

          <!-- 厨房設備写真 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-stove</v-icon>
              厨房設備
            </div>
            <v-file-input
              :model-value="detailCheck.kitchen_equipment_photos"
              @update:model-value="updateDetailCheck('kitchen_equipment_photos', $event)"
              label="厨房設備の写真"
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
            <div v-if="detailCheck.kitchen_equipment_photos?.length" class="d-flex flex-wrap gap-2 mt-2">
              <v-img
                v-for="(photo, index) in getPhotoUrls(detailCheck.kitchen_equipment_photos)"
                :key="index"
                :src="photo"
                width="80"
                height="80"
                cover
                class="rounded border"
              />
            </div>
          </v-col>

          <!-- ダクト写真 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-air-filter</v-icon>
              ダクト
            </div>
            <v-file-input
              :model-value="detailCheck.duct_photos"
              @update:model-value="updateDetailCheck('duct_photos', $event)"
              label="ダクトの写真"
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
            <div v-if="detailCheck.duct_photos?.length" class="d-flex flex-wrap gap-2 mt-2">
              <v-img
                v-for="(photo, index) in getPhotoUrls(detailCheck.duct_photos)"
                :key="index"
                :src="photo"
                width="80"
                height="80"
                cover
                class="rounded border"
              />
            </div>
          </v-col>

          <!-- グリストラップ写真 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-water-pump</v-icon>
              グリストラップ
            </div>
            <v-file-input
              :model-value="detailCheck.grease_trap_photos"
              @update:model-value="updateDetailCheck('grease_trap_photos', $event)"
              label="グリストラップの写真"
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
            <div v-if="detailCheck.grease_trap_photos?.length" class="d-flex flex-wrap gap-2 mt-2">
              <v-img
                v-for="(photo, index) in getPhotoUrls(detailCheck.grease_trap_photos)"
                :key="index"
                :src="photo"
                width="80"
                height="80"
                cover
                class="rounded border"
              />
            </div>
          </v-col>

          <!-- 電気メーター写真 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-flash</v-icon>
              電気メーター
            </div>
            <v-file-input
              :model-value="detailCheck.electric_meter_photos"
              @update:model-value="updateDetailCheck('electric_meter_photos', $event)"
              label="電気メーターの写真"
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
            <div v-if="detailCheck.electric_meter_photos?.length" class="d-flex flex-wrap gap-2 mt-2">
              <v-img
                v-for="(photo, index) in getPhotoUrls(detailCheck.electric_meter_photos)"
                :key="index"
                :src="photo"
                width="80"
                height="80"
                cover
                class="rounded border"
              />
            </div>
          </v-col>

          <!-- ガスメーター写真 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-fire</v-icon>
              ガスメーター
            </div>
            <v-file-input
              :model-value="detailCheck.gas_meter_photos"
              @update:model-value="updateDetailCheck('gas_meter_photos', $event)"
              label="ガスメーターの写真"
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
            <div v-if="detailCheck.gas_meter_photos?.length" class="d-flex flex-wrap gap-2 mt-2">
              <v-img
                v-for="(photo, index) in getPhotoUrls(detailCheck.gas_meter_photos)"
                :key="index"
                :src="photo"
                width="80"
                height="80"
                cover
                class="rounded border"
              />
            </div>
          </v-col>

          <!-- 水道メーター写真 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-3 font-weight-bold" style="color: #1e50a2;">
              <v-icon small class="mr-1" color="primary">mdi-water</v-icon>
              水道メーター
            </div>
            <v-file-input
              :model-value="detailCheck.water_meter_photos"
              @update:model-value="updateDetailCheck('water_meter_photos', $event)"
              label="水道メーターの写真"
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
            <div v-if="detailCheck.water_meter_photos?.length" class="d-flex flex-wrap gap-2 mt-2">
              <v-img
                v-for="(photo, index) in getPhotoUrls(detailCheck.water_meter_photos)"
                :key="index"
                :src="photo"
                width="80"
                height="80"
                cover
                class="rounded border"
              />
            </div>
          </v-col>

          <v-col cols="12"><v-divider class="my-4" /></v-col>

          <!-- 排気設備 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.exhaust_equipment"
              @update:model-value="updateDetailCheck('exhaust_equipment', $event)"
              label="排気設備種類"
              outlined
              dense
              placeholder="例: ダクト式、フード付き"
            />
          </v-col>

          <!-- 排気ルート -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.exhaust_route"
              @update:model-value="updateDetailCheck('exhaust_route', $event)"
              label="排気ルート"
              outlined
              dense
              placeholder="例: 屋上、壁面"
            />
          </v-col>

          <!-- 排水設備 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.drainage_equipment"
              @update:model-value="updateDetailCheck('drainage_equipment', $event)"
              label="排水設備種類"
              outlined
              dense
              placeholder="例: 厨房専用排水、グリストラップ"
            />
          </v-col>

          <!-- 電気メーター位置 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.electric_meter_location"
              @update:model-value="updateDetailCheck('electric_meter_location', $event)"
              label="電気メーター位置"
              outlined
              dense
              placeholder="例: 1階入口、地下"
            />
          </v-col>

          <!-- 電気容量 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.electric_capacity"
              @update:model-value="updateDetailCheck('electric_capacity', $event)"
              label="電気容量"
              outlined
              dense
              placeholder="例: 30A、動力15kW"
            />
          </v-col>

          <!-- 動力容量 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.power_capacity"
              @update:model-value="updateDetailCheck('power_capacity', $event)"
              label="動力容量"
              outlined
              dense
              placeholder="例: 15kW"
            />
          </v-col>

          <!-- ガスメーター位置 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.gas_meter_location"
              @update:model-value="updateDetailCheck('gas_meter_location', $event)"
              label="ガスメーター位置"
              outlined
              dense
              placeholder="例: 1階入口、地下"
            />
          </v-col>

          <!-- ガス容量 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.gas_capacity"
              @update:model-value="updateDetailCheck('gas_capacity', $event)"
              label="ガス容量"
              outlined
              dense
              placeholder="例: 都市ガス13A"
            />
          </v-col>

          <!-- 水道メーター位置 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.water_meter_location"
              @update:model-value="updateDetailCheck('water_meter_location', $event)"
              label="水道メーター位置"
              outlined
              dense
              placeholder="例: 1階入口、地下"
            />
          </v-col>

          <!-- 給排水管径 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.water_pipe_capacity"
              @update:model-value="updateDetailCheck('water_pipe_capacity', $event)"
              label="給排水管径"
              outlined
              dense
              placeholder="例: 20mm"
            />
          </v-col>

          <!-- 室外機設置場所 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.outdoor_unit_location"
              @update:model-value="updateDetailCheck('outdoor_unit_location', $event)"
              label="室外機設置場所"
              outlined
              dense
              placeholder="例: 屋上、ベランダ"
            />
          </v-col>

          <!-- MDF設置場所 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.mdf_location"
              @update:model-value="updateDetailCheck('mdf_location', $event)"
              label="MDF設置場所"
              outlined
              dense
              placeholder="例: 1階電気室、事務所"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.section_e_memo"
              @update:model-value="updateDetailCheck('section_e_memo', $event)"
              label="メーター・容量・機器位置 メモ"
              outlined
              dense
              rows="2"
              placeholder="特記事項があれば記載"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- F. 売上・営業時間 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-chart-line</v-icon>
        売上・営業時間
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 最高売上月 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.highest_sales_month"
              @update:model-value="updateDetailCheck('highest_sales_month', $event)"
              label="最高売上月"
              outlined
              dense
              type="number"
              suffix="万円"
            />
          </v-col>

          <!-- 最低売上月 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.lowest_sales_month"
              @update:model-value="updateDetailCheck('lowest_sales_month', $event)"
              label="最低売上月"
              outlined
              dense
              type="number"
              suffix="万円"
            />
          </v-col>

          <!-- ランチ営業時間 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.lunch_hours"
              @update:model-value="updateDetailCheck('lunch_hours', $event)"
              label="ランチ営業時間"
              outlined
              dense
              placeholder="例: 11:00-14:00"
            />
          </v-col>

          <!-- ディナー営業時間 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.dinner_hours"
              @update:model-value="updateDetailCheck('dinner_hours', $event)"
              label="ディナー営業時間"
              outlined
              dense
              placeholder="例: 17:00-22:00"
            />
          </v-col>

          <!-- ランチ客単価 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.lunch_avg_price"
              @update:model-value="updateDetailCheck('lunch_avg_price', $event)"
              label="ランチ客単価"
              outlined
              dense
              type="number"
              suffix="円"
            />
          </v-col>

          <!-- ディナー客単価 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.dinner_avg_price"
              @update:model-value="updateDetailCheck('dinner_avg_price', $event)"
              label="ディナー客単価"
              outlined
              dense
              type="number"
              suffix="円"
            />
          </v-col>

          <!-- 定休日 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.closed_days"
              @update:model-value="updateDetailCheck('closed_days', $event)"
              label="定休日"
              outlined
              dense
              placeholder="例: 月曜日、年中無休"
            />
          </v-col>

          <!-- 席数 -->
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="detailCheck.seat_count"
              @update:model-value="updateDetailCheck('seat_count', $event)"
              label="席数"
              outlined
              dense
              type="number"
              suffix="席"
              :rules="[v => v >= 0 && v <= 500 || '席数は0-500の範囲で入力してください']"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.section_f_memo"
              @update:model-value="updateDetailCheck('section_f_memo', $event)"
              label="売上・営業時間 メモ"
              outlined
              dense
              rows="2"
              placeholder="特記事項があれば記載"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- G. エリア・客層 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-map-marker</v-icon>
        エリア・客層
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- エリアタイプ -->
          <v-col cols="12" md="6">
            <v-select
              :model-value="detailCheck.area_types"
              @update:model-value="updateDetailCheck('area_types', $event)"
              :items="['住宅街', '繁華街', 'ビジネス街', '学生街', '観光地', '駅前', '郊外']"
              label="エリアタイプ"
              multiple
              chips
              small-chips
              deletable-chips
              outlined
              dense
            />
          </v-col>

          <!-- 主要客層 -->
          <v-col cols="12" md="6">
            <v-select
              :model-value="detailCheck.customer_segments"
              @update:model-value="updateDetailCheck('customer_segments', $event)"
              :items="['若者', '中高年', '高齢者', '外国人', '学生', 'ビジネスマン', 'ファミリー', '女性客', '男性客']"
              label="主要客層"
              multiple
              chips
              small-chips
              deletable-chips
              outlined
              dense
            />
          </v-col>

          <!-- メイン客層年代 -->
          <v-col cols="12" md="4">
            <v-select
              :model-value="detailCheck.main_customer_age"
              @update:model-value="updateDetailCheck('main_customer_age', $event)"
              :items="['10代', '20代', '30代', '40代', '50代', '60代以上', '幅広い年齢層']"
              label="メイン客層（年代）"
              outlined
              dense
            />
          </v-col>

          <!-- メイン客層性別 -->
          <v-col cols="12" md="4">
            <v-select
              :model-value="detailCheck.main_customer_gender"
              @update:model-value="updateDetailCheck('main_customer_gender', $event)"
              :items="['男性中心', '女性中心', '男女半々', 'ファミリー中心']"
              label="メイン客層（性別）"
              outlined
              dense
            />
          </v-col>

          <!-- 客層タイプ -->
          <v-col cols="12" md="4">
            <v-select
              :model-value="detailCheck.customer_type"
              @update:model-value="updateDetailCheck('customer_type', $event)"
              :items="['サラリーマン', '地元住民', '観光客', '学生', 'ファミリー', '会社員', 'その他']"
              label="客層タイプ"
              outlined
              dense
            />
          </v-col>

          <!-- アクセス -->
          <v-col cols="12">
            <v-text-field
              :model-value="detailCheck.access_info"
              @update:model-value="updateDetailCheck('access_info', $event)"
              label="アクセス情報"
              outlined
              dense
              placeholder="例: 駅徒歩5分、バス停前"
            />
          </v-col>

          <!-- 周辺環境 -->
          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.surrounding_environment"
              @update:model-value="updateDetailCheck('surrounding_environment', $event)"
              label="周辺環境"
              outlined
              dense
              rows="3"
              placeholder="周辺の建物、競合店、人通りなどの特徴"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.section_g_memo"
              @update:model-value="updateDetailCheck('section_g_memo', $event)"
              label="エリア・客層 メモ"
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
</style>
