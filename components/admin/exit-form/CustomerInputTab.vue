<template>
  <div>
    <!-- お客様入力画面ボタン -->
    <div class="mt-0 mb-4 d-flex justify-end">
      <v-btn
        color="primary"
        elevation="2"
        @click="$emit('open-customer-input')"
      >
        <v-icon left small style="color: white !important;">mdi-open-in-new</v-icon>
        お客様入力画面
      </v-btn>
    </div>

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
              v-if="customerInput.property.invoiceRegistration.status === '未登録'"
              :model-value="customerInput.property.invoiceRegistration.detail"
              @update:model-value="updateInvoiceRegistration('detail', $event)"
              label="詳細"
              outlined
              dense
              class="mt-2"
              placeholder="未登録の理由などを記入してください"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- ライフライン・契約情報 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-lightning-bolt-outline</v-icon>
        ライフライン・契約情報
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 電気の契約状況 -->
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

          <!-- ガスの契約状況 -->
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

          <!-- 水道の契約状況 -->
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

          <!-- ゴミ出し方法 -->
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

          <!-- その他費用 -->
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

    <!-- 申告・条件情報 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-alert-decagram-outline</v-icon>
        申告・条件情報
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 事前申告 -->
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

          <!-- 新条件 -->
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
            <v-text-field
              :model-value="customerInput.equipment.seats"
              @update:model-value="updateEquipment('seats', $event)"
              label="席数について教えてください"
              outlined
              dense
              prepend-inner-icon="mdi-chair-rolling"
              placeholder="メモ"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 店舗設備詳細 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-cog-outline</v-icon>
        店舗設備詳細
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 排気設備の種類 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-air-filter</v-icon>
              排気設備の種類について教えてください
            </div>
            <v-radio-group
              :model-value="customerInput.facilityDetails.ventilation.type"
              @update:model-value="updateVentilation('type', $event)"
              row
            >
              <v-radio label="換気扇" value="換気扇"></v-radio>
              <v-radio label="ダクト" value="ダクト"></v-radio>
            </v-radio-group>
          </v-col>

          <!-- 排気ルート -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-directions-fork</v-icon>
              排気ルートについて教えてください
            </div>
            <v-select
              :model-value="customerInput.facilityDetails.ventilation.route"
              @update:model-value="updateVentilation('route', $event)"
              :items="['店舗側面', '店舗前面', '店舗背面', '屋上']"
              outlined
              dense
              multiple
              chips
              small-chips
            ></v-select>
          </v-col>

          <!-- 排水設備の種類 -->
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

          <!-- 電気メーターの場所と容量 -->
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

          <!-- ガスメーターの場所と容量 -->
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

          <!-- 水道メーターの場所と排水管の容量 -->
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

          <!-- 室外機の場所 -->
          <v-col cols="12">
            <v-textarea
              :model-value="customerInput.facilityDetails.outsideWall"
              @update:model-value="updateFacilityDetails('outsideWall', $event)"
              label="室外機の場所について教えてください"
              outlined
              dense
              rows="2"
              prepend-inner-icon="mdi-air-conditioner"
            ></v-textarea>
          </v-col>

          <!-- MDF盤の場所 -->
          <v-col cols="12">
            <v-text-field
              :model-value="customerInput.facilityDetails.mdfLocation"
              @update:model-value="updateFacilityDetails('mdfLocation', $event)"
              label="MDF盤の場所について教えてください"
              outlined
              dense
              prepend-inner-icon="mdi-network-outline"
              placeholder="場所"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 環境情報 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-nature-people-outline</v-icon>
        環境情報
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 店舗の瑕疵 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-alert-circle-outline</v-icon>
              店舗の瑕疵について教えてください
            </div>
            <v-radio-group
              :model-value="customerInput.environment.defect.status"
              @update:model-value="updateDefect('status', $event)"
              column
            >
              <v-radio label="なし" value="なし"></v-radio>
              <v-radio label="雨漏り" value="雨漏り"></v-radio>
              <v-radio label="水漏れ" value="水漏れ"></v-radio>
              <v-radio label="騒音問題" value="騒音問題"></v-radio>
              <v-radio label="その他" value="その他"></v-radio>
            </v-radio-group>
            <v-text-field
              v-if="customerInput.environment.defect.status === 'その他'"
              :model-value="customerInput.environment.defect.detail"
              @update:model-value="updateDefect('detail', $event)"
              label="詳細"
              outlined
              dense
              class="mt-2"
              placeholder="瑕疵の詳細を記入してください"
            ></v-text-field>
          </v-col>

          <!-- 届出済の許認可 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-file-certificate-outline</v-icon>
              届出済の許認可について教えてください
            </div>
            <v-select
              :model-value="customerInput.environment.permits"
              @update:model-value="updateEnvironment('permits', $event)"
              :items="['保健所', '消防署', '警察署']"
              outlined
              dense
              multiple
              chips
              small-chips
              placeholder="該当する許認可を選択してください"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
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
    }
    facilityDetails: {
      ventilation: {
        type: string
        route: string[]
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
