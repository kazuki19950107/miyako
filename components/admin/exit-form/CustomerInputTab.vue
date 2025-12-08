<template>
  <div>
    <!-- QRコードとお客様入力画面ボタン（一時的に非表示）
    <v-row class="mt-0 mb-4">
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn
          color="primary"
          elevation="2"
          block
          large
          @click="$emit('open-customer-input')"
        >
          <v-icon left small style="color: white !important;">mdi-open-in-new</v-icon>
          お客様入力画面
        </v-btn>
      </v-col>

      <v-col cols="12" md="8">
        <v-card outlined class="qr-card">
          <v-card-text>
            <v-row class="mb-3">
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="localStoreId"
                  label="店舗ID"
                  outlined
                  dense
                  prepend-inner-icon="mdi-identifier"
                  placeholder="店舗IDを入力してください"
                  hint="このIDをもとにQRコードが生成されます"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="d-flex align-center">
                <v-btn
                  color="primary"
                  elevation="2"
                  block
                  @click="generateQRCode"
                >
                  <v-icon left small style="color: white !important;">mdi-qrcode-scan</v-icon>
                  QRコード生成
                </v-btn>
              </v-col>
            </v-row>

            <div class="d-flex align-center">
              <div class="flex-grow-1 mr-4">
                <div class="text-subtitle-2 mb-2">
                  <v-icon small class="mr-1">mdi-qrcode</v-icon>
                  お客様入力用QRコード
                </div>
                <div class="text-caption grey--text">
                  このQRコードをスキャンして入力画面にアクセスできます
                </div>
                <div class="text-caption mt-2">
                  <strong>URL:</strong> {{ customerInputUrl }}
                </div>
              </div>
              <div class="qr-code-container">
                <canvas ref="qrcodeCanvas"></canvas>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    -->

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
              :model-value="customerInput.property.previousTenantInfo"
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
              :model-value="customerInput.property.negotiation.status"
              @update:model-value="updateNegotiation('status', $event)"
              row
            >
              <v-radio label="なし" value="なし"></v-radio>
              <v-radio label="あり" value="あり"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput.property.negotiation.status === 'あり'"
              :model-value="customerInput.property.negotiation.detail"
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
              :model-value="customerInput.scheduleDates.terminationNoticeSubmitted"
              @update:model-value="updateScheduleDates('terminationNoticeSubmitted', $event)"
              row
            >
              <v-radio label="している" value="している"></v-radio>
              <v-radio label="していない" value="していない"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput.scheduleDates.terminationNoticeSubmitted === 'している'"
              :model-value="customerInput.scheduleDates.terminationNoticeDate"
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
              :model-value="customerInput.scheduleDates.vacancyDate"
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
              :model-value="customerInput.scheduleDates.contractEndDate"
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
              :model-value="customerInput.scheduleDates.businessEndDate"
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
              :model-value="customerInput.scheduleDates.handoverDesiredDate"
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
              :model-value="customerInput.property.usageRestrictions"
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
              :model-value="customerInput.property.floorPlan.status"
              @update:model-value="updateFloorPlan('status', $event)"
              row
            >
              <v-radio label="なし" value="なし"></v-radio>
              <v-radio label="あり" value="あり"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput.property.floorPlan.status === 'あり'"
              :model-value="customerInput.property.floorPlan.detail"
              @update:model-value="updateFloorPlan('detail', $event)"
              label="詳細"
              outlined
              dense
              class="mt-2"
              placeholder="面図の種類を記入してください"
            ></v-text-field>
          </v-col>

          <!-- 貸主のインボイス登録状況 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-file-document-outline</v-icon>
              貸主のインボイス登録状況について教えてください
            </div>
            <v-radio-group
              :model-value="customerInput.property.invoiceRegistration.status"
              @update:model-value="updateInvoiceRegistration('status', $event)"
              row
            >
              <v-radio label="登録済み" value="登録済み"></v-radio>
              <v-radio label="未登録" value="未登録"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput.property.invoiceRegistration.status === '登録済み'"
              :model-value="customerInput.property.invoiceRegistration.detail"
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

    <!-- ライフライン・契約情報（詳細確認タブへ移動済み）
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-lightning-bolt-outline</v-icon>
        ライフライン・契約情報
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-flash</v-icon>
              電気の契約状況と支払いについて教えてください
            </div>
            <v-radio-group
              :model-value="customerInput.utilities.electricity.contractType"
              @update:model-value="updateElectricity('contractType', $event)"
              column
            >
              <v-radio label="家主検針" value="家主検針"></v-radio>
              <v-radio label="直接契約（関電・新電力）" value="直接契約"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput.utilities.electricity.contractType === '直接契約'"
              :model-value="customerInput.utilities.electricity.customerNumber"
              @update:model-value="updateElectricity('customerNumber', $event)"
              label="お客様番号"
              outlined
              dense
              class="mt-2"
              prepend-inner-icon="mdi-identifier"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-fire</v-icon>
              ガスの契約状況と支払いについて教えてください
            </div>
            <v-radio-group
              :model-value="customerInput.utilities.gas.contractType"
              @update:model-value="updateGas('contractType', $event)"
              column
            >
              <v-radio label="家主検針" value="家主検針"></v-radio>
              <v-radio label="直接契約（都市ガス・プロパン）" value="直接契約"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput.utilities.gas.contractType === '直接契約'"
              :model-value="customerInput.utilities.gas.customerNumber"
              @update:model-value="updateGas('customerNumber', $event)"
              label="お客様番号"
              outlined
              dense
              class="mt-2"
              prepend-inner-icon="mdi-identifier"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-water</v-icon>
              水道の契約状況と支払いについて教えてください
            </div>
            <v-radio-group
              :model-value="customerInput.utilities.water.contractType"
              @update:model-value="updateWater('contractType', $event)"
              column
            >
              <v-radio label="家主検針" value="家主検針"></v-radio>
              <v-radio label="直接契約" value="直接契約"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput.utilities.water.contractType === '直接契約'"
              :model-value="customerInput.utilities.water.customerNumber"
              @update:model-value="updateWater('customerNumber', $event)"
              label="お客様番号"
              outlined
              dense
              class="mt-2"
              prepend-inner-icon="mdi-identifier"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-3">
              <v-icon small class="mr-1">mdi-delete-outline</v-icon>
              ゴミ出し方法について教えてください
            </div>
            <v-text-field
              :model-value="customerInput.utilities.garbage.rules"
              @update:model-value="updateGarbage('rules', $event)"
              label="規則"
              outlined
              dense
              class="mb-3"
              prepend-inner-icon="mdi-clipboard-text-outline"
            ></v-text-field>
            <v-text-field
              :model-value="customerInput.utilities.garbage.cost"
              @update:model-value="updateGarbage('cost', $event)"
              label="費用"
              outlined
              dense
              prepend-inner-icon="mdi-currency-jpy"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-cash-multiple</v-icon>
              その他費用について教えてください
            </div>
            <div class="text-caption mb-2 grey--text">例）商店街費・町内会費など</div>
            <v-radio-group
              :model-value="customerInput.utilities.otherCosts.status"
              @update:model-value="updateOtherCosts('status', $event)"
              row
            >
              <v-radio label="なし" value="なし"></v-radio>
              <v-radio label="あり" value="あり"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput.utilities.otherCosts.status === 'あり'"
              :model-value="customerInput.utilities.otherCosts.detail"
              @update:model-value="updateOtherCosts('detail', $event)"
              label="詳細"
              outlined
              dense
              class="mt-2"
              placeholder="費用の種類と金額を記入してください"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    -->

    <!-- 申告・条件情報（詳細確認タブへ移動済み）
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-alert-decagram-outline</v-icon>
        申告・条件情報
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <v-col cols="12">
            <v-textarea
              :model-value="customerInput.disclosure.priorNotice"
              @update:model-value="updateDisclosure('priorNotice', $event)"
              label="事前申告について教えてください"
              outlined
              dense
              rows="3"
              prepend-inner-icon="mdi-clipboard-alert-outline"
              placeholder="例）家賃滞納・近隣トラブル・家主変更など"
            ></v-textarea>
          </v-col>

          <v-col cols="12">
            <v-textarea
              :model-value="customerInput.disclosure.newConditions"
              @update:model-value="updateDisclosure('newConditions', $event)"
              label="新条件について教えてください"
              outlined
              dense
              rows="3"
              prepend-inner-icon="mdi-file-document-edit-outline"
              placeholder="例）既に貸主から後継テナントの新条件を聞いている場合"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    -->

    <!-- 設備情報 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-tools</v-icon>
        設備情報
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 譲渡しない設備 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-package-variant-closed-remove</v-icon>
              譲渡しない設備について教えてください
            </div>
            <v-radio-group
              :model-value="customerInput.equipment.notTransfer.status"
              @update:model-value="updateNotTransfer('status', $event)"
              row
            >
              <v-radio label="なし" value="なし"></v-radio>
              <v-radio label="あり" value="あり"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput.equipment.notTransfer.status === 'あり'"
              :model-value="customerInput.equipment.notTransfer.detail"
              @update:model-value="updateNotTransfer('detail', $event)"
              label="詳細"
              outlined
              dense
              class="mt-2"
              placeholder="譲渡しない設備を記入してください"
            ></v-text-field>
          </v-col>

          <!-- 故障している設備 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-wrench-clock</v-icon>
              故障している設備について教えてください
            </div>
            <v-radio-group
              :model-value="customerInput.equipment.broken.status"
              @update:model-value="updateBroken('status', $event)"
              row
            >
              <v-radio label="なし" value="なし"></v-radio>
              <v-radio label="あり" value="あり"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput.equipment.broken.status === 'あり'"
              :model-value="customerInput.equipment.broken.detail"
              @update:model-value="updateBroken('detail', $event)"
              label="詳細"
              outlined
              dense
              class="mt-2"
              placeholder="故障している設備を記入してください"
            ></v-text-field>
          </v-col>

          <!-- リースの残債がある設備 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-file-document-alert-outline</v-icon>
              リースの残債がある設備について教えてください
            </div>
            <v-radio-group
              :model-value="customerInput.equipment.lease.status"
              @update:model-value="updateLease('status', $event)"
              row
            >
              <v-radio label="なし" value="なし"></v-radio>
              <v-radio label="あり" value="あり"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput.equipment.lease.status === 'あり'"
              :model-value="customerInput.equipment.lease.detail"
              @update:model-value="updateLease('detail', $event)"
              label="詳細"
              outlined
              dense
              class="mt-2"
              placeholder="リースの残債がある設備を記入してください"
            ></v-text-field>
          </v-col>

          <!-- 貸主設備 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-account-tie-outline</v-icon>
              貸主設備について教えてください
            </div>
            <v-radio-group
              :model-value="customerInput.equipment.landlordEquipment.status"
              @update:model-value="updateLandlordEquipment('status', $event)"
              row
            >
              <v-radio label="なし" value="なし"></v-radio>
              <v-radio label="あり" value="あり"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput.equipment.landlordEquipment.status === 'あり'"
              :model-value="customerInput.equipment.landlordEquipment.detail"
              @update:model-value="updateLandlordEquipment('detail', $event)"
              label="詳細"
              outlined
              dense
              class="mt-2"
              placeholder="貸主設備を記入してください"
            ></v-text-field>
          </v-col>

          <!-- 調理器具やお皿グラスなど -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-silverware-fork-knife</v-icon>
              調理器具やお皿グラスなどについて教えてください
            </div>
            <v-radio-group
              :model-value="customerInput.equipment.kitchenware.status"
              @update:model-value="updateKitchenware('status', $event)"
              column
            >
              <v-radio label="全て残置する" value="全て残置する"></v-radio>
              <v-radio label="全て持ち去る" value="全て持ち去る"></v-radio>
              <v-radio label="一部撤去" value="一部撤去"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput.equipment.kitchenware.status === '一部撤去'"
              :model-value="customerInput.equipment.kitchenware.detail"
              @update:model-value="updateKitchenware('detail', $event)"
              label="詳細"
              outlined
              dense
              class="mt-2"
              placeholder="撤去する内容を記入してください"
            ></v-text-field>
          </v-col>

          <!-- 席数 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-3">
              <v-icon small class="mr-1">mdi-chair-rolling</v-icon>
              座席数について教えてください
            </div>

            <!-- 座席入力リスト -->
            <div class="seats-input-container">
              <div
                v-for="(seat, index) in customerInput.equipment.seatingList || []"
                :key="index"
                class="seat-row d-flex align-center ga-2 mb-2 flex-wrap"
              >
                <v-select
                  :model-value="seat.floor"
                  @update:model-value="updateSeatingItem(index, 'floor', $event)"
                  :items="['1', '2', '3', 'B1', 'B2']"
                  label="階"
                  outlined
                  dense
                  hide-details
                  style="min-width: 100px; flex: 1;"
                ></v-select>
                <span class="text-body-2">階</span>

                <v-select
                  :model-value="seat.capacity"
                  @update:model-value="updateSeatingItem(index, 'capacity', $event)"
                  :items="['1', '2', '3', '4', '5', '6', '7', '8', '10', '12']"
                  label="人数"
                  outlined
                  dense
                  hide-details
                  style="min-width: 100px; flex: 1;"
                ></v-select>
                <span class="text-body-2">人掛け</span>

                <v-select
                  :model-value="seat.type"
                  @update:model-value="updateSeatingItem(index, 'type', $event)"
                  :items="['カウンター', 'テーブル']"
                  label="種類"
                  outlined
                  dense
                  hide-details
                  style="min-width: 120px; flex: 1;"
                ></v-select>

                <v-text-field
                  :model-value="seat.count"
                  @update:model-value="updateSeatingItem(index, 'count', $event)"
                  label="卓数"
                  outlined
                  dense
                  hide-details
                  type="number"
                  min="1"
                  style="min-width: 100px; flex: 1;"
                ></v-text-field>
                <span class="text-body-2">卓</span>

                <v-btn
                  icon
                  size="small"
                  color="error"
                  variant="text"
                  @click="removeSeatingItem(index)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>

              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                @click="addSeatingItem"
                class="mt-2"
              >
                <v-icon left size="small">mdi-plus</v-icon>
                席を追加
              </v-btn>
            </div>

            <!-- 合計席数表示 -->
            <v-divider class="my-3"></v-divider>
            <div class="d-flex align-center">
              <span class="text-subtitle-2 mr-2">合計：</span>
              <span class="text-h6 font-weight-bold primary--text">{{ calculateTotalSeats }}</span>
              <span class="text-subtitle-2 ml-1">席</span>
            </div>

            <!-- メモ欄 -->
            <v-text-field
              :model-value="customerInput.equipment.seats"
              @update:model-value="updateEquipment('seats', $event)"
              label="座席に関するメモ"
              outlined
              dense
              class="mt-3"
              placeholder="その他の座席情報があれば記入"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 店舗設備詳細（設備詳細タブへ移動済み） -->
    <!--
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-cog-outline</v-icon>
        店舗設備詳細
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          排気設備の種類
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-air-filter</v-icon>
              排気設備の種類について教えてください
            </div>
            <div class="text-caption mb-2 grey- -text">※複数ある場合は両方にチェックしてください</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-checkbox
                  :model-value="customerInput.facilityDetails.ventilation.hasFan"
                  @update:model-value="updateVentilation('hasFan', $event)"
                  label="換気扇"
                  hide-details
                  color="primary"
                ></v-checkbox>
                <v-select
                  v-if="customerInput.facilityDetails.ventilation.hasFan"
                  :model-value="customerInput.facilityDetails.ventilation.fanRoute"
                  @update:model-value="updateVentilation('fanRoute', $event)"
                  :items="['店舗側面', '店舗前面', '店舗背面', '屋上']"
                  label="換気扇の排気ルート"
                  outlined
                  dense
                  multiple
                  chips
                  small-chips
                  class="mt-2"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox
                  :model-value="customerInput.facilityDetails.ventilation.hasDuct"
                  @update:model-value="updateVentilation('hasDuct', $event)"
                  label="ダクト"
                  hide-details
                  color="primary"
                ></v-checkbox>
                <v-select
                  v-if="customerInput.facilityDetails.ventilation.hasDuct"
                  :model-value="customerInput.facilityDetails.ventilation.ductRoute"
                  @update:model-value="updateVentilation('ductRoute', $event)"
                  :items="['店舗側面', '店舗前面', '店舗背面', '屋上']"
                  label="ダクトの排気ルート"
                  outlined
                  dense
                  multiple
                  chips
                  small-chips
                  class="mt-2"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          排水設備の種類
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-water-pump</v-icon>
              排水設備の種類について教えてください
            </div>
            <v-radio-group
              :model-value="customerInput.facilityDetails.drainage.type"
              @update:model-value="updateDrainage('type', $event)"
              row
            >
              <v-radio label="グリストラップ（床下埋め込み・露出型）" value="グリストラップ"></v-radio>
              <v-radio label="ドライキッチン" value="ドライキッチン"></v-radio>
            </v-radio-group>
          </v-col>

          電気メーターの場所と容量
          <v-col cols="12">
            <div class="text-subtitle-2 mb-3">
              <v-icon small class="mr-1">mdi-flash-outline</v-icon>
              電気メーターの場所と電気と動力の容量について教えてください
            </div>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="customerInput.facilityDetails.electricityMeter.location"
                  @update:model-value="updateElectricityMeter('location', $event)"
                  label="場所"
                  outlined
                  dense
                  prepend-inner-icon="mdi-map-marker"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="customerInput.facilityDetails.electricityMeter.capacity"
                  @update:model-value="updateElectricityMeter('capacity', $event)"
                  label="電気容量"
                  outlined
                  dense
                  prepend-inner-icon="mdi-flash"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="customerInput.facilityDetails.electricityMeter.powerCapacity"
                  @update:model-value="updateElectricityMeter('powerCapacity', $event)"
                  label="動力容量"
                  outlined
                  dense
                  prepend-inner-icon="mdi-flash-circle"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          ガスメーターの場所と容量
          <v-col cols="12">
            <div class="text-subtitle-2 mb-3">
              <v-icon small class="mr-1">mdi-fire-circle</v-icon>
              ガスメーターの場所とガスの容量について教えてください
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="customerInput.facilityDetails.gasMeter.location"
                  @update:model-value="updateGasMeter('location', $event)"
                  label="場所"
                  outlined
                  dense
                  prepend-inner-icon="mdi-map-marker"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="customerInput.facilityDetails.gasMeter.capacity"
                  @update:model-value="updateGasMeter('capacity', $event)"
                  label="ガス容量"
                  outlined
                  dense
                  prepend-inner-icon="mdi-fire"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          水道メーターの場所と排水管の容量
          <v-col cols="12">
            <div class="text-subtitle-2 mb-3">
              <v-icon small class="mr-1">mdi-water-outline</v-icon>
              水道メーターの場所と排水管の容量について教えてください
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="customerInput.facilityDetails.waterMeter.location"
                  @update:model-value="updateWaterMeter('location', $event)"
                  label="場所"
                  outlined
                  dense
                  prepend-inner-icon="mdi-map-marker"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="customerInput.facilityDetails.waterMeter.drainageCapacity"
                  @update:model-value="updateWaterMeter('drainageCapacity', $event)"
                  label="排水容量"
                  outlined
                  dense
                  prepend-inner-icon="mdi-water-pump"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          室外機の場所
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-air-conditioner</v-icon>
              室外機の場所について教えてください
            </div>
            <v-textarea
              :model-value="customerInput.facilityDetails.outsideWall"
              @update:model-value="updateFacilityDetails('outsideWall', $event)"
              label="場所"
              outlined
              dense
              rows="2"
              placeholder="例）店舗背面、屋上、ベランダなど"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    -->

    <!-- 環境情報（設備詳細タブへ移動済み） -->
    <!--
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-nature-people-outline</v-icon>
        環境情報
      </v-card-title>
      <v-card-text class="pt-6">
        ...
      </v-card-text>
    </v-card>
    -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import QRCode from 'qrcode'

// Props
const props = defineProps<{
  storeId?: string
  customerInput: {
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
    equipment: {
      notTransfer: {
        status: string
        detail: string
      }
      broken: {
        status: string
        detail: string
      }
      lease: {
        status: string
        detail: string
      }
      landlordEquipment: {
        status: string
        detail: string
      }
      kitchenware: {
        status: string
        detail: string
      }
      seats: string
      seatingList: Array<{
        floor: string
        capacity: string
        type: string
        count: number
      }>
    }
    facilityDetails: {
      ventilation: {
        type: string
        route: string[]
        hasFan: boolean
        fanRoute: string[]
        hasDuct: boolean
        ductRoute: string[]
      }
      drainage: {
        type: string
      }
      electricityMeter: {
        location: string
        capacity: string
        powerCapacity: string
      }
      gasMeter: {
        location: string
        capacity: string
      }
      waterMeter: {
        location: string
        drainageCapacity: string
      }
      outsideWall: string
      mdfLocation: string
    }
    environment: {
      defect: {
        status: string
        detail: string
        types: string[]
        rainLeakDetail: string
        waterLeakDetail: string
        noiseDetail: string
        otherDetail: string
      }
      permits: string[]
    }
  }
}>()

// Emits
const emit = defineEmits<{
  'update:customerInput': [value: typeof props.customerInput]
  'open-customer-input': []
}>()

// QRコード関連
const qrcodeCanvas = ref<HTMLCanvasElement | null>(null)
const localStoreId = ref(props.storeId || 'sample-store-id')

// お客様入力用URLを生成
const customerInputUrl = computed(() => {
  const baseUrl = window.location.origin
  const storeId = localStoreId.value || 'sample-store-id'
  return `${baseUrl}/customer-input/${storeId}`
})

// QRコードを生成
const generateQRCode = async () => {
  if (!localStoreId.value) {
    alert('店舗IDを入力してください')
    return
  }

  // canvasがまだ描画されていない場合、少し待ってから再試行
  if (!qrcodeCanvas.value) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  if (!qrcodeCanvas.value) {
    console.error('Canvas要素が見つかりません')
    return
  }

  try {
    await QRCode.toCanvas(qrcodeCanvas.value, customerInputUrl.value, {
      width: 200,
      margin: 2,
      color: {
        dark: '#154a8a',
        light: '#ffffff'
      }
    })
  } catch (error) {
    console.error('QRコード生成エラー:', error)
    alert('QRコードの生成に失敗しました')
  }
}

// マウント時にダミーQRコードを生成
onMounted(() => {
  generateQRCode()
})

// propsのstoreIdが変更されたらlocalStoreIdを更新
watch(() => props.storeId, (newId) => {
  if (newId) {
    localStoreId.value = newId
    generateQRCode()
  }
})

// Update methods for property
const updateProperty = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    property: { ...props.customerInput.property, [key]: value }
  })
}

const updateNegotiation = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    property: {
      ...props.customerInput.property,
      negotiation: { ...props.customerInput.property.negotiation, [key]: value }
    }
  })
}

const updateFloorPlan = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    property: {
      ...props.customerInput.property,
      floorPlan: { ...props.customerInput.property.floorPlan, [key]: value }
    }
  })
}

const updateInvoiceRegistration = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    property: {
      ...props.customerInput.property,
      invoiceRegistration: { ...props.customerInput.property.invoiceRegistration, [key]: value }
    }
  })
}

// Update methods for utilities
const updateElectricity = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      electricity: { ...props.customerInput.utilities.electricity, [key]: value }
    }
  })
}

const updateGas = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      gas: { ...props.customerInput.utilities.gas, [key]: value }
    }
  })
}

const updateWater = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      water: { ...props.customerInput.utilities.water, [key]: value }
    }
  })
}

const updateGarbage = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      garbage: { ...props.customerInput.utilities.garbage, [key]: value }
    }
  })
}

const updateOtherCosts = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    utilities: {
      ...props.customerInput.utilities,
      otherCosts: { ...props.customerInput.utilities.otherCosts, [key]: value }
    }
  })
}

// Update methods for disclosure
const updateDisclosure = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    disclosure: { ...props.customerInput.disclosure, [key]: value }
  })
}

// Update methods for equipment
const updateEquipment = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: { ...props.customerInput.equipment, [key]: value }
  })
}

const updateNotTransfer = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      notTransfer: { ...props.customerInput.equipment.notTransfer, [key]: value }
    }
  })
}

const updateBroken = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      broken: { ...props.customerInput.equipment.broken, [key]: value }
    }
  })
}

const updateLease = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      lease: { ...props.customerInput.equipment.lease, [key]: value }
    }
  })
}

const updateLandlordEquipment = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      landlordEquipment: { ...props.customerInput.equipment.landlordEquipment, [key]: value }
    }
  })
}

const updateKitchenware = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      kitchenware: { ...props.customerInput.equipment.kitchenware, [key]: value }
    }
  })
}

// 座席関連
const calculateTotalSeats = computed(() => {
  const seatingList = props.customerInput.equipment.seatingList || []
  return seatingList.reduce((total, seat) => {
    const capacity = parseInt(seat.capacity) || 0
    const count = parseInt(String(seat.count)) || 0
    return total + (capacity * count)
  }, 0)
})

const addSeatingItem = () => {
  const currentList = props.customerInput.equipment.seatingList || []
  const newList = [...currentList, { floor: '1', capacity: '4', type: 'テーブル', count: 1 }]
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      seatingList: newList
    }
  })
}

const removeSeatingItem = (index: number) => {
  const currentList = props.customerInput.equipment.seatingList || []
  const newList = currentList.filter((_, i) => i !== index)
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      seatingList: newList
    }
  })
}

const updateSeatingItem = (index: number, key: string, value: any) => {
  const currentList = props.customerInput.equipment.seatingList || []
  const newList = currentList.map((item, i) => {
    if (i === index) {
      return { ...item, [key]: value }
    }
    return item
  })
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      seatingList: newList
    }
  })
}

// Update methods for facilityDetails
const updateFacilityDetails = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    facilityDetails: { ...props.customerInput.facilityDetails, [key]: value }
  })
}

const updateVentilation = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    facilityDetails: {
      ...props.customerInput.facilityDetails,
      ventilation: { ...props.customerInput.facilityDetails.ventilation, [key]: value }
    }
  })
}

const updateDrainage = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    facilityDetails: {
      ...props.customerInput.facilityDetails,
      drainage: { ...props.customerInput.facilityDetails.drainage, [key]: value }
    }
  })
}

const updateElectricityMeter = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    facilityDetails: {
      ...props.customerInput.facilityDetails,
      electricityMeter: { ...props.customerInput.facilityDetails.electricityMeter, [key]: value }
    }
  })
}

const updateGasMeter = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    facilityDetails: {
      ...props.customerInput.facilityDetails,
      gasMeter: { ...props.customerInput.facilityDetails.gasMeter, [key]: value }
    }
  })
}

const updateWaterMeter = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    facilityDetails: {
      ...props.customerInput.facilityDetails,
      waterMeter: { ...props.customerInput.facilityDetails.waterMeter, [key]: value }
    }
  })
}

// Update methods for environment
const updateEnvironment = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    environment: { ...props.customerInput.environment, [key]: value }
  })
}

const updateDefect = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    environment: {
      ...props.customerInput.environment,
      defect: { ...props.customerInput.environment.defect, [key]: value }
    }
  })
}

const toggleDefectType = (type: string, checked: boolean) => {
  const currentTypes = props.customerInput.environment.defect.types || []
  let newTypes: string[]

  if (type === 'なし') {
    // 「なし」を選択した場合、他の選択を全てクリア
    newTypes = checked ? ['なし'] : []
  } else {
    // 他の項目を選択した場合、「なし」を除外
    if (checked) {
      newTypes = [...currentTypes.filter(t => t !== 'なし'), type]
    } else {
      newTypes = currentTypes.filter(t => t !== type)
    }
  }

  emit('update:customerInput', {
    ...props.customerInput,
    environment: {
      ...props.customerInput.environment,
      defect: { ...props.customerInput.environment.defect, types: newTypes }
    }
  })
}

// Update method for scheduleDates
const updateScheduleDates = (key: string, value: any) => {
  emit('update:customerInput', {
    ...props.customerInput,
    scheduleDates: { ...props.customerInput.scheduleDates, [key]: value }
  })
}
</script>

<style scoped>
/* QRコード関連 */
.qr-card {
  border-radius: 16px !important;
  border: 2px solid #c5d5eb !important;
  box-shadow: 0 4px 12px rgba(30, 80, 162, 0.08) !important;
  background: linear-gradient(135deg, #ffffff 0%, #f5f8fc 100%) !important;
}

.qr-code-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: white;
  border-radius: 12px;
  border: 2px solid #c5d5eb;
}

.qr-code-container canvas {
  display: block;
}

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
