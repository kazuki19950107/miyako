<template>
  <v-form ref="equipmentForm" v-model="formValid">

    <!-- 店舗設備詳細 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-cog-outline</v-icon>
        店舗設備詳細
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row>
          <!-- 排気設備の種類 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-air-filter</v-icon>
              排気設備の種類について
            </div>
            <div class="text-caption mb-2 grey--text">※複数ある場合は両方にチェックしてください</div>
            <v-row>
              <v-col cols="6">
                <v-checkbox
                  :model-value="detailCheck.ventilation_has_fan"
                  @update:model-value="updateDetailCheck('ventilation_has_fan', $event)"
                  label="換気扇"
                  hide-details
                  color="primary"
                />
                <v-select
                  v-if="detailCheck.ventilation_has_fan"
                  :model-value="detailCheck.ventilation_fan_route"
                  @update:model-value="updateDetailCheck('ventilation_fan_route', $event)"
                  :items="['店舗側面', '店舗前面', '店舗背面', '屋上']"
                  label="換気扇の排気ルート"
                  outlined
                  dense
                  multiple
                  chips
                  small-chips
                  class="mt-2"
                />
              </v-col>
              <v-col cols="6">
                <v-checkbox
                  :model-value="detailCheck.ventilation_has_duct"
                  @update:model-value="updateDetailCheck('ventilation_has_duct', $event)"
                  label="ダクト"
                  hide-details
                  color="primary"
                />
                <v-select
                  v-if="detailCheck.ventilation_has_duct"
                  :model-value="detailCheck.ventilation_duct_route"
                  @update:model-value="updateDetailCheck('ventilation_duct_route', $event)"
                  :items="['店舗側面', '店舗前面', '店舗背面', '屋上']"
                  label="ダクトの排気ルート"
                  outlined
                  dense
                  multiple
                  chips
                  small-chips
                  class="mt-2"
                />
              </v-col>
            </v-row>
          </v-col>

          <!-- 排水設備の種類 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-water-pump</v-icon>
              排水設備の種類について
            </div>
            <v-radio-group
              :model-value="detailCheck.drainage_type"
              @update:model-value="updateDetailCheck('drainage_type', $event)"
              inline
              hide-details
            >
              <v-radio label="グリストラップ（床下埋め込み・露出型）" value="グリストラップ" />
              <v-radio label="ドライキッチン" value="ドライキッチン" />
            </v-radio-group>
          </v-col>

          <!-- 店舗設備メモ -->
          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.facility_memo"
              @update:model-value="updateDetailCheck('facility_memo', $event)"
              label="店舗設備メモ"
              outlined
              dense
              rows="2"
              placeholder="設備に関する特記事項があれば記載"
            />
          </v-col>

          <!-- 調理器具やお皿グラスなど -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-silverware-fork-knife</v-icon>
              調理器具やお皿グラスなどについて
            </div>
            <v-radio-group
              :model-value="customerInput?.equipment?.kitchenware?.status"
              @update:model-value="updateKitchenware('status', $event)"
              inline
              hide-details
            >
              <v-radio label="全て残置" value="全て残置"></v-radio>
              <v-radio label="全て持ち去る" value="全て持ち去る"></v-radio>
              <v-radio label="一部撤去" value="一部撤去"></v-radio>
            </v-radio-group>
            <v-row v-if="customerInput?.equipment?.kitchenware?.status === '一部撤去'" class="mt-2">
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="customerInput?.equipment?.kitchenware?.detail"
                  @update:model-value="updateKitchenware('detail', $event)"
                  label="詳細"
                  outlined
                  dense
                  placeholder="撤去する内容を記入してください"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  :model-value="null"
                  @update:model-value="addKitchenwarePhoto($event)"
                  label="写真を追加"
                  outlined
                  dense
                  multiple
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  hide-details
                />
                <div v-if="customerInput?.equipment?.kitchenware?.photos?.length" class="d-flex flex-wrap gap-2 mt-2">
                  <v-chip
                    v-for="(photo, index) in customerInput.equipment.kitchenware.photos"
                    :key="index"
                    size="small"
                    color="primary"
                    closable
                    @click:close="removeKitchenwarePhoto(index)"
                    @click="openPreview(photo)"
                    class="cursor-pointer"
                  >
                    <v-icon start size="16">mdi-eye</v-icon>
                    写真{{ index + 1 }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 厨房設備 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-stove</v-icon>
        厨房設備
      </v-card-title>
      <v-card-text class="pt-6">
        <!-- 厨房設備がない場合 -->
        <div v-if="!detailCheck.kitchen_equipment_units || detailCheck.kitchen_equipment_units.length === 0" class="text-center py-4">
          <v-icon size="48" color="grey-lighten-1">mdi-stove</v-icon>
          <div class="text-body-2 grey--text mt-2">厨房設備を追加してください</div>
        </div>

        <!-- 厨房設備リスト -->
        <div
          v-for="(unit, index) in detailCheck.kitchen_equipment_units"
          :key="'kitchen-' + index"
          class="unit-item mb-4"
        >
          <div class="d-flex align-center mb-3">
            <v-chip color="primary" size="small" class="mr-2">{{ index + 1 }}台目</v-chip>
            <v-spacer />
            <v-btn
              icon
              size="small"
              variant="text"
              color="error"
              @click="removeKitchenEquipmentUnit(index)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <v-row align="start">
            <!-- 型番写真 -->
            <v-col cols="12" md="4">
              <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
                型番
              </div>
              <v-file-input
                :model-value="unit.model_photo"
                @update:model-value="updateKitchenEquipmentUnit(index, 'model_photo', $event)"
                label="型番写真"
                outlined
                dense
                accept="image/*"
                prepend-icon="mdi-camera"
                hide-details
              >
                <template v-slot:prepend-inner v-if="unit.model_photo">
                  <v-icon
                    color="primary"
                    class="cursor-pointer"
                    @click.stop="openPreview(unit.model_photo)"
                  >mdi-eye</v-icon>
                </template>
              </v-file-input>
            </v-col>

            <!-- 本体写真 -->
            <v-col cols="12" md="4">
              <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
                本体
              </div>
              <v-file-input
                :model-value="unit.body_photo"
                @update:model-value="updateKitchenEquipmentUnit(index, 'body_photo', $event)"
                label="本体写真"
                outlined
                dense
                accept="image/*"
                prepend-icon="mdi-camera"
                hide-details
              >
                <template v-slot:prepend-inner v-if="unit.body_photo">
                  <v-icon
                    color="primary"
                    class="cursor-pointer"
                    @click.stop="openPreview(unit.body_photo)"
                  >mdi-eye</v-icon>
                </template>
              </v-file-input>
            </v-col>

            <!-- 例外チェック -->
            <v-col cols="12" md="4">
              <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
                例外チェック
              </div>
              <div class="d-flex flex-wrap justify-space-around check-column">
                <v-checkbox
                  :model-value="unit.broken"
                  @update:model-value="updateKitchenEquipmentUnit(index, 'broken', $event)"
                  label="故障あり"
                  density="compact"
                  hide-details
                  color="error"
                />
                <v-checkbox
                  :model-value="unit.lease"
                  @update:model-value="updateKitchenEquipmentUnit(index, 'lease', $event)"
                  label="リース"
                  density="compact"
                  hide-details
                  color="warning"
                />
                <v-checkbox
                  :model-value="unit.landlord_owned"
                  @update:model-value="updateKitchenEquipmentUnit(index, 'landlord_owned', $event)"
                  label="家主所有"
                  density="compact"
                  hide-details
                  color="info"
                />
              </div>
            </v-col>

            <!-- リース詳細（リースチェック時のみ表示） -->
            <v-col cols="6" md="3" v-if="unit.lease">
              <v-text-field
                :model-value="unit.lease_remaining_years"
                @update:model-value="updateKitchenEquipmentUnit(index, 'lease_remaining_years', $event)"
                label="残債年数"
                outlined
                dense
                type="number"
                suffix="年"
              />
            </v-col>
            <v-col cols="6" md="3" v-if="unit.lease">
              <v-text-field
                :model-value="unit.lease_total_amount"
                @update:model-value="updateKitchenEquipmentUnit(index, 'lease_total_amount', $event)"
                label="総額"
                outlined
                dense
                type="number"
                suffix="円"
              />
            </v-col>
            <v-col cols="6" md="3" v-if="unit.lease">
              <v-text-field
                :model-value="unit.lease_company"
                @update:model-value="updateKitchenEquipmentUnit(index, 'lease_company', $event)"
                label="信販会社"
                outlined
                dense
                placeholder="例: オリコ"
              />
            </v-col>
            <v-col cols="6" md="3" v-if="unit.lease">
              <v-text-field
                :model-value="unit.lease_monthly_amount"
                @update:model-value="updateKitchenEquipmentUnit(index, 'lease_monthly_amount', $event)"
                label="月額"
                outlined
                dense
                type="number"
                suffix="円"
              />
            </v-col>

            <!-- 設備名 -->
            <v-col cols="12" md="6">
              <v-text-field
                :model-value="unit.name"
                @update:model-value="updateKitchenEquipmentUnit(index, 'name', $event)"
                label="設備名"
                outlined
                dense
                placeholder="例: ガスコンロ、業務用冷蔵庫、製氷機"
              />
            </v-col>

            <!-- 詳細メモ -->
            <v-col cols="12" md="6">
              <v-text-field
                :model-value="unit.detail"
                @update:model-value="updateKitchenEquipmentUnit(index, 'detail', $event)"
                label="詳細"
                outlined
                dense
                placeholder="例: 3口、2019年製、動作確認済み"
              />
            </v-col>
          </v-row>
        </div>

        <!-- 追加ボタン -->
        <div class="text-center mt-4">
          <v-btn
            color="primary"
            variant="outlined"
            @click="addKitchenEquipmentUnit"
          >
            <v-icon left size="18">mdi-plus</v-icon>
            厨房設備を追加
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- ダクト・グリストラップ -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-air-filter</v-icon>
        ダクト・グリストラップ
      </v-card-title>
      <v-card-text class="pt-6">
        <!-- ダクト -->
        <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
          <v-icon small class="mr-1" color="primary">mdi-air-filter</v-icon>
          ダクト
        </div>
        <v-row align="start" class="mb-4">
          <v-col cols="12" md="6">
            <v-file-input
              :model-value="detailCheck.duct_body_photo"
              @update:model-value="updateDetailCheck('duct_body_photo', $event)"
              label="写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            >
              <template v-slot:prepend-inner v-if="detailCheck.duct_body_photo">
                <v-icon
                  color="primary"
                  class="cursor-pointer"
                  @click.stop="openPreview(detailCheck.duct_body_photo)"
                >mdi-eye</v-icon>
              </template>
            </v-file-input>
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea
              :model-value="detailCheck.duct_detail"
              @update:model-value="updateDetailCheck('duct_detail', $event)"
              label="詳細（排気設備種類、排気ルートなど）"
              outlined
              dense
              rows="1"
              auto-grow
              placeholder="例: ダクト式、屋上まで直通"
            />
          </v-col>
        </v-row>

        <v-divider class="mb-4" />

        <!-- グリストラップ -->
        <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
          <v-icon small class="mr-1" color="primary">mdi-water-pump</v-icon>
          グリストラップ
        </div>
        <v-row align="start">
          <v-col cols="12" md="6">
            <v-file-input
              :model-value="detailCheck.grease_trap_body_photo"
              @update:model-value="updateDetailCheck('grease_trap_body_photo', $event)"
              label="写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            >
              <template v-slot:prepend-inner v-if="detailCheck.grease_trap_body_photo">
                <v-icon
                  color="primary"
                  class="cursor-pointer"
                  @click.stop="openPreview(detailCheck.grease_trap_body_photo)"
                >mdi-eye</v-icon>
              </template>
            </v-file-input>
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea
              :model-value="detailCheck.grease_trap_detail"
              @update:model-value="updateDetailCheck('grease_trap_detail', $event)"
              label="詳細（排水設備種類など）"
              outlined
              dense
              rows="1"
              auto-grow
              placeholder="例: 厨房専用排水、グリストラップ"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- エアコン -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-air-conditioner</v-icon>
        エアコン
      </v-card-title>
      <v-card-text class="pt-6">
        <!-- 室内機がない場合 -->
        <div v-if="!detailCheck.aircon_indoor_units || detailCheck.aircon_indoor_units.length === 0" class="text-center py-4">
          <v-icon size="48" color="grey-lighten-1">mdi-air-conditioner</v-icon>
          <div class="text-body-2 grey--text mt-2">室内機を追加してください</div>
        </div>

        <!-- 室内機リスト -->
        <div
          v-for="(unit, index) in detailCheck.aircon_indoor_units"
          :key="'indoor-' + index"
          class="unit-item mb-4"
        >
          <div class="d-flex align-center mb-3">
            <v-chip color="primary" size="small" class="mr-2">{{ index + 1 }}台目</v-chip>
            <v-spacer />
            <v-btn
              icon
              size="small"
              variant="text"
              color="error"
              @click="removeIndoorUnit(index)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <v-row align="start">
            <!-- 型番写真 -->
            <v-col cols="12" md="4">
              <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
                型番
              </div>
              <v-file-input
                :model-value="unit.model_photo"
                @update:model-value="updateIndoorUnit(index, 'model_photo', $event)"
                label="型番写真"
                outlined
                dense
                accept="image/*"
                prepend-icon="mdi-camera"
                hide-details
              >
                <template v-slot:prepend-inner v-if="unit.model_photo">
                  <v-icon
                    color="primary"
                    class="cursor-pointer"
                    @click.stop="openPreview(unit.model_photo)"
                  >mdi-eye</v-icon>
                </template>
              </v-file-input>
            </v-col>

            <!-- 本体写真 -->
            <v-col cols="12" md="4">
              <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
                本体
              </div>
              <v-file-input
                :model-value="unit.body_photo"
                @update:model-value="updateIndoorUnit(index, 'body_photo', $event)"
                label="本体写真"
                outlined
                dense
                accept="image/*"
                prepend-icon="mdi-camera"
                hide-details
              >
                <template v-slot:prepend-inner v-if="unit.body_photo">
                  <v-icon
                    color="primary"
                    class="cursor-pointer"
                    @click.stop="openPreview(unit.body_photo)"
                  >mdi-eye</v-icon>
                </template>
              </v-file-input>
            </v-col>

            <!-- 例外チェック -->
            <v-col cols="12" md="4">
              <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
                例外チェック
              </div>
              <div class="d-flex flex-wrap justify-space-around check-column">
                <v-checkbox
                  :model-value="unit.broken"
                  @update:model-value="updateIndoorUnit(index, 'broken', $event)"
                  label="故障あり"
                  density="compact"
                  hide-details
                  color="error"
                />
                <v-checkbox
                  :model-value="unit.lease"
                  @update:model-value="updateIndoorUnit(index, 'lease', $event)"
                  label="リース"
                  density="compact"
                  hide-details
                  color="warning"
                />
                <v-checkbox
                  :model-value="unit.landlord_owned"
                  @update:model-value="updateIndoorUnit(index, 'landlord_owned', $event)"
                  label="家主所有"
                  density="compact"
                  hide-details
                  color="info"
                />
              </div>
            </v-col>

            <!-- リース詳細（リースチェック時のみ表示） -->
            <v-col cols="6" md="3" v-if="unit.lease">
              <v-text-field
                :model-value="unit.lease_remaining_years"
                @update:model-value="updateIndoorUnit(index, 'lease_remaining_years', $event)"
                label="残債年数"
                outlined
                dense
                type="number"
                suffix="年"
              />
            </v-col>
            <v-col cols="6" md="3" v-if="unit.lease">
              <v-text-field
                :model-value="unit.lease_total_amount"
                @update:model-value="updateIndoorUnit(index, 'lease_total_amount', $event)"
                label="総額"
                outlined
                dense
                type="number"
                suffix="円"
              />
            </v-col>
            <v-col cols="6" md="3" v-if="unit.lease">
              <v-text-field
                :model-value="unit.lease_company"
                @update:model-value="updateIndoorUnit(index, 'lease_company', $event)"
                label="信販会社"
                outlined
                dense
                placeholder="例: オリコ"
              />
            </v-col>
            <v-col cols="6" md="3" v-if="unit.lease">
              <v-text-field
                :model-value="unit.lease_monthly_amount"
                @update:model-value="updateIndoorUnit(index, 'lease_monthly_amount', $event)"
                label="月額"
                outlined
                dense
                type="number"
                suffix="円"
              />
            </v-col>

            <!-- 室外機の場所 -->
            <v-col cols="12" md="4">
              <v-text-field
                :model-value="unit.outdoor_location"
                @update:model-value="updateIndoorUnit(index, 'outdoor_location', $event)"
                label="室外機の場所"
                outlined
                dense
                placeholder="例: 屋上、ベランダ"
              />
            </v-col>

            <!-- 使用年数 -->
            <v-col cols="12" md="4">
              <v-text-field
                :model-value="unit.years_used"
                @update:model-value="updateIndoorUnit(index, 'years_used', $event)"
                label="使用年数"
                outlined
                dense
                type="number"
                suffix="年"
                placeholder="例: 5"
              />
            </v-col>

            <!-- 詳細メモ -->
            <v-col cols="12" md="4">
              <v-text-field
                :model-value="unit.detail"
                @update:model-value="updateIndoorUnit(index, 'detail', $event)"
                label="詳細"
                outlined
                dense
                placeholder="例: 天井埋込式"
              />
            </v-col>
          </v-row>
        </div>

        <!-- 追加ボタン -->
        <div class="text-center mt-4">
          <v-btn
            color="primary"
            variant="outlined"
            @click="addIndoorUnit"
          >
            <v-icon left size="18">mdi-plus</v-icon>
            室内機を追加
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- 席 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-seat</v-icon>
        席
      </v-card-title>
      <v-card-text class="pt-6">
        <!-- フロアがない場合 -->
        <div v-if="!detailCheck.floor_seats || detailCheck.floor_seats.length === 0" class="text-center py-4">
          <v-icon size="48" color="grey-lighten-1">mdi-seat</v-icon>
          <div class="text-body-2 grey--text mt-2">フロアを追加してください</div>
        </div>

        <!-- フロアリスト -->
        <div
          v-for="(floor, index) in detailCheck.floor_seats"
          :key="'floor-' + index"
          class="unit-item mb-4"
        >
          <div class="d-flex justify-end mb-2">
            <v-btn
              icon
              size="small"
              variant="text"
              color="error"
              @click="removeFloorSeat(index)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <v-row align="start">
            <!-- フロア名 -->
            <v-col cols="6" md="3">
              <v-text-field
                :model-value="floor.floor_name"
                @update:model-value="updateFloorSeat(index, 'floor_name', $event)"
                label="フロア名"
                outlined
                dense
                placeholder="例: 1階、2階、B1"
              />
            </v-col>

            <!-- 総席数 -->
            <v-col cols="6" md="3">
              <v-text-field
                :model-value="floor.total_seats"
                @update:model-value="updateFloorSeat(index, 'total_seats', $event)"
                label="総席数"
                outlined
                dense
                type="number"
                suffix="席"
              />
            </v-col>

            <!-- カウンター -->
            <v-col cols="6" md="3">
              <v-text-field
                :model-value="floor.counter_seats"
                @update:model-value="updateFloorSeat(index, 'counter_seats', $event)"
                label="カウンター"
                outlined
                dense
                type="number"
                suffix="席"
              />
            </v-col>

            <!-- テーブル -->
            <v-col cols="6" md="3">
              <v-text-field
                :model-value="floor.table_seats"
                @update:model-value="updateFloorSeat(index, 'table_seats', $event)"
                label="テーブル"
                outlined
                dense
                type="number"
                suffix="席"
              />
            </v-col>

            <!-- 席の写真 -->
            <v-col cols="12">
              <v-file-input
                :model-value="null"
                @update:model-value="addFloorPhoto(index, $event)"
                label="席の写真を追加"
                outlined
                dense
                multiple
                accept="image/*"
                prepend-icon="mdi-camera"
                hide-details
              />
              <!-- 写真プレビュー -->
              <div v-if="floor.photos?.length" class="d-flex flex-wrap gap-2 mt-2">
                <v-chip
                  v-for="(photo, photoIndex) in floor.photos"
                  :key="photoIndex"
                  size="small"
                  color="primary"
                  closable
                  @click:close="removeFloorPhoto(index, photoIndex)"
                  @click="openPreview(photo)"
                  class="cursor-pointer"
                >
                  <v-icon start size="16">mdi-eye</v-icon>
                  写真{{ photoIndex + 1 }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- 追加ボタン -->
        <div class="text-center mt-4">
          <v-btn
            color="primary"
            variant="outlined"
            @click="addFloorSeat"
          >
            <v-icon left size="18">mdi-plus</v-icon>
            フロアを追加
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- 電気メーター -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-flash</v-icon>
        電気メーター
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row align="start">
          <!-- 電気と動力の容量 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-3">
              <v-icon small class="mr-1">mdi-flash-outline</v-icon>
              電気と動力の容量について
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="detailCheck.facility_electricity_capacity"
                  @update:model-value="updateDetailCheck('facility_electricity_capacity', $event)"
                  label="電気容量"
                  outlined
                  dense
                  prepend-inner-icon="mdi-flash"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="detailCheck.facility_power_capacity"
                  @update:model-value="updateDetailCheck('facility_power_capacity', $event)"
                  label="動力容量"
                  outlined
                  dense
                  prepend-inner-icon="mdi-flash-circle"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- ガスメーター -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-fire</v-icon>
        ガスメーター
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row align="start">
          <!-- ガスメーターの場所と容量 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-3">
              <v-icon small class="mr-1">mdi-fire-circle</v-icon>
              ガスメーターの場所とガスの容量について
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="detailCheck.facility_gas_location"
                  @update:model-value="updateDetailCheck('facility_gas_location', $event)"
                  label="場所"
                  outlined
                  dense
                  prepend-inner-icon="mdi-map-marker"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="detailCheck.facility_gas_capacity"
                  @update:model-value="updateDetailCheck('facility_gas_capacity', $event)"
                  label="ガス容量"
                  outlined
                  dense
                  prepend-inner-icon="mdi-fire"
                />
              </v-col>
            </v-row>
          </v-col>

          <!-- 型番写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              型番
            </div>
            <v-file-input
              :model-value="detailCheck.gas_meter_model_photo"
              @update:model-value="updateDetailCheck('gas_meter_model_photo', $event)"
              label="型番写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            >
              <template v-slot:prepend-inner v-if="detailCheck.gas_meter_model_photo">
                <v-icon
                  color="primary"
                  class="cursor-pointer"
                  @click.stop="openPreview(detailCheck.gas_meter_model_photo)"
                >mdi-eye</v-icon>
              </template>
            </v-file-input>
          </v-col>

          <!-- 本体写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              本体
            </div>
            <v-file-input
              :model-value="detailCheck.gas_meter_body_photo"
              @update:model-value="updateDetailCheck('gas_meter_body_photo', $event)"
              label="本体写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            >
              <template v-slot:prepend-inner v-if="detailCheck.gas_meter_body_photo">
                <v-icon
                  color="primary"
                  class="cursor-pointer"
                  @click.stop="openPreview(detailCheck.gas_meter_body_photo)"
                >mdi-eye</v-icon>
              </template>
            </v-file-input>
          </v-col>

          <!-- メーター位置詳細 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              メーター位置詳細
            </div>
            <v-text-field
              :model-value="detailCheck.gas_meter_location"
              @update:model-value="updateDetailCheck('gas_meter_location', $event)"
              label="メーター位置"
              outlined
              dense
              placeholder="例: 1階入口、地下"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 水道メーター -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-water</v-icon>
        水道メーター
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row align="start">
          <!-- 水道メーターの場所と排水管の容量 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-3">
              <v-icon small class="mr-1">mdi-water-outline</v-icon>
              水道メーターの場所と排水管の容量について
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="detailCheck.facility_water_location"
                  @update:model-value="updateDetailCheck('facility_water_location', $event)"
                  label="場所"
                  outlined
                  dense
                  prepend-inner-icon="mdi-map-marker"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="detailCheck.facility_water_drainage_capacity"
                  @update:model-value="updateDetailCheck('facility_water_drainage_capacity', $event)"
                  label="排水容量"
                  outlined
                  dense
                  prepend-inner-icon="mdi-water-pump"
                />
              </v-col>
            </v-row>
          </v-col>

          <!-- 型番写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              型番
            </div>
            <v-file-input
              :model-value="detailCheck.water_meter_model_photo"
              @update:model-value="updateDetailCheck('water_meter_model_photo', $event)"
              label="型番写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            >
              <template v-slot:prepend-inner v-if="detailCheck.water_meter_model_photo">
                <v-icon
                  color="primary"
                  class="cursor-pointer"
                  @click.stop="openPreview(detailCheck.water_meter_model_photo)"
                >mdi-eye</v-icon>
              </template>
            </v-file-input>
          </v-col>

          <!-- 本体写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              本体
            </div>
            <v-file-input
              :model-value="detailCheck.water_meter_body_photo"
              @update:model-value="updateDetailCheck('water_meter_body_photo', $event)"
              label="本体写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            >
              <template v-slot:prepend-inner v-if="detailCheck.water_meter_body_photo">
                <v-icon
                  color="primary"
                  class="cursor-pointer"
                  @click.stop="openPreview(detailCheck.water_meter_body_photo)"
                >mdi-eye</v-icon>
              </template>
            </v-file-input>
          </v-col>

          <!-- メーター位置詳細 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              メーター位置詳細
            </div>
            <v-text-field
              :model-value="detailCheck.water_meter_location"
              @update:model-value="updateDetailCheck('water_meter_location', $event)"
              label="メーター位置"
              outlined
              dense
              placeholder="例: 1階入口、地下"
            />
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
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-alert-circle-outline</v-icon>
              店舗の瑕疵について
            </div>
            <div class="text-caption mb-2 grey--text">※複数選択可能です</div>

            <v-row dense>
              <v-col cols="4">
                <v-checkbox
                  :model-value="detailCheck.defect_none"
                  @update:model-value="handleDefectNone($event)"
                  label="なし"
                  hide-details
                  color="primary"
                />
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  :model-value="detailCheck.defect_rain_leak"
                  @update:model-value="updateDetailCheck('defect_rain_leak', $event)"
                  label="雨漏り"
                  hide-details
                  color="warning"
                  :disabled="detailCheck.defect_none"
                />
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  :model-value="detailCheck.defect_water_leak"
                  @update:model-value="updateDetailCheck('defect_water_leak', $event)"
                  label="水漏れ"
                  hide-details
                  color="warning"
                  :disabled="detailCheck.defect_none"
                />
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  :model-value="detailCheck.defect_noise"
                  @update:model-value="updateDetailCheck('defect_noise', $event)"
                  label="騒音問題"
                  hide-details
                  color="warning"
                  :disabled="detailCheck.defect_none"
                />
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  :model-value="detailCheck.defect_odor"
                  @update:model-value="updateDetailCheck('defect_odor', $event)"
                  label="臭気問題"
                  hide-details
                  color="warning"
                  :disabled="detailCheck.defect_none"
                />
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  :model-value="detailCheck.defect_other"
                  @update:model-value="updateDetailCheck('defect_other', $event)"
                  label="その他"
                  hide-details
                  color="warning"
                  :disabled="detailCheck.defect_none"
                />
              </v-col>
            </v-row>

            <!-- 詳細入力欄 -->
            <v-text-field
              v-if="detailCheck.defect_rain_leak"
              :model-value="detailCheck.defect_rain_leak_detail"
              @update:model-value="updateDetailCheck('defect_rain_leak_detail', $event)"
              label="雨漏りの場所・状況"
              outlined
              dense
              class="mt-2"
              placeholder="例）厨房天井から雨天時に発生"
            />
            <v-text-field
              v-if="detailCheck.defect_water_leak"
              :model-value="detailCheck.defect_water_leak_detail"
              @update:model-value="updateDetailCheck('defect_water_leak_detail', $event)"
              label="水漏れの場所・状況"
              outlined
              dense
              class="mt-2"
              placeholder="例）シンク下の配管から"
            />
            <v-text-field
              v-if="detailCheck.defect_noise"
              :model-value="detailCheck.defect_noise_detail"
              @update:model-value="updateDetailCheck('defect_noise_detail', $event)"
              label="騒音問題の詳細"
              outlined
              dense
              class="mt-2"
              placeholder="例）近隣からの苦情あり"
            />
            <v-text-field
              v-if="detailCheck.defect_odor"
              :model-value="detailCheck.defect_odor_detail"
              @update:model-value="updateDetailCheck('defect_odor_detail', $event)"
              label="臭気問題の詳細"
              outlined
              dense
              class="mt-2"
              placeholder="例）排水溝からの臭い、換気不良"
            />
            <v-text-field
              v-if="detailCheck.defect_other"
              :model-value="detailCheck.defect_other_detail"
              @update:model-value="updateDetailCheck('defect_other_detail', $event)"
              label="その他の瑕疵詳細"
              outlined
              dense
              class="mt-2"
              placeholder="瑕疵の内容を記入してください"
            />
          </v-col>

          <!-- 届出済の許認可 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-file-certificate-outline</v-icon>
              届出済の許認可について
            </div>

            <v-row dense>
              <v-col cols="4">
                <v-checkbox
                  :model-value="detailCheck.permit_health_center"
                  @update:model-value="updateDetailCheck('permit_health_center', $event)"
                  label="保健所"
                  hide-details
                  color="primary"
                />
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  :model-value="detailCheck.permit_fire_department"
                  @update:model-value="updateDetailCheck('permit_fire_department', $event)"
                  label="消防署"
                  hide-details
                  color="primary"
                />
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  :model-value="detailCheck.permit_police"
                  @update:model-value="updateDetailCheck('permit_police', $event)"
                  label="警察署"
                  hide-details
                  color="primary"
                />
              </v-col>
            </v-row>

            <!-- 保健所詳細 -->
            <div v-if="detailCheck.permit_health_center" class="mt-2 mb-3">
              <div class="text-caption mb-1 font-weight-bold">保健所</div>
              <v-file-input
                :model-value="detailCheck.permit_health_center_photo"
                @update:model-value="updateDetailCheck('permit_health_center_photo', $event)"
                label="許可証写真"
                outlined
                dense
                accept="image/*"
                prepend-icon="mdi-camera"
                hide-details
              />
            </div>

            <!-- 消防署詳細 -->
            <div v-if="detailCheck.permit_fire_department" class="mt-2 mb-3">
              <div class="text-caption mb-1 font-weight-bold">消防署</div>
              <v-file-input
                :model-value="detailCheck.permit_fire_department_photo"
                @update:model-value="updateDetailCheck('permit_fire_department_photo', $event)"
                label="許可証写真"
                outlined
                dense
                accept="image/*"
                prepend-icon="mdi-camera"
                hide-details
                class="mb-2"
              />
              <div class="text-caption mb-1">設備の設置有無</div>
              <v-row dense>
                <v-col cols="4">
                  <v-checkbox
                    :model-value="detailCheck.fire_alarm"
                    @update:model-value="updateDetailCheck('fire_alarm', $event)"
                    label="火災報知器"
                    hide-details
                    density="compact"
                  />
                </v-col>
                <v-col cols="4">
                  <v-checkbox
                    :model-value="detailCheck.fire_extinguisher"
                    @update:model-value="updateDetailCheck('fire_extinguisher', $event)"
                    label="消火器"
                    hide-details
                    density="compact"
                  />
                </v-col>
                <v-col cols="4">
                  <v-checkbox
                    :model-value="detailCheck.sprinkler"
                    @update:model-value="updateDetailCheck('sprinkler', $event)"
                    label="スプリンクラー"
                    hide-details
                    density="compact"
                  />
                </v-col>
                <v-col cols="4">
                  <v-checkbox
                    :model-value="detailCheck.escape_ladder"
                    @update:model-value="updateDetailCheck('escape_ladder', $event)"
                    label="避難はしご"
                    hide-details
                    density="compact"
                  />
                </v-col>
                <v-col cols="4">
                  <v-checkbox
                    :model-value="detailCheck.emergency_light"
                    @update:model-value="updateDetailCheck('emergency_light', $event)"
                    label="誘導灯"
                    hide-details
                    density="compact"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- 警察署詳細 -->
            <div v-if="detailCheck.permit_police" class="mt-2 mb-3">
              <div class="text-caption mb-1 font-weight-bold">警察署</div>
              <v-file-input
                :model-value="detailCheck.permit_police_photo"
                @update:model-value="updateDetailCheck('permit_police_photo', $event)"
                label="許可証写真"
                outlined
                dense
                accept="image/*"
                prepend-icon="mdi-camera"
                hide-details
                class="mb-2"
              />
              <v-text-field
                :model-value="detailCheck.permit_police_detail"
                @update:model-value="updateDetailCheck('permit_police_detail', $event)"
                label="許可内容"
                outlined
                dense
                placeholder="例）深夜酒類提供、風営法"
              />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 写真プレビューモーダル -->
    <v-dialog v-model="previewDialog" max-width="600">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center py-2">
          <span>写真プレビュー</span>
          <v-btn icon variant="text" size="small" @click="closePreview">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-2">
          <v-img :src="previewImageUrl" max-height="500" contain />
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
const props = withDefaults(defineProps<{
  customerInput?: {
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
        photos: File[] | null
      }
      seats: string
      seatingList: Array<{
        floor: string
        capacity: string
        type: string
        count: number
      }>
    }
  }
  detailCheck?: {
    // 店舗設備詳細
    ventilation_has_fan: boolean
    ventilation_fan_route: string[]
    ventilation_has_duct: boolean
    ventilation_duct_route: string[]
    drainage_type: string
    facility_electricity_location: string
    facility_electricity_capacity: string
    facility_power_capacity: string
    facility_gas_location: string
    facility_gas_capacity: string
    facility_water_location: string
    facility_water_drainage_capacity: string
    facility_outdoor_unit_location: string
    facility_memo: string

    // 厨房設備（複数対応）
    kitchen_equipment_units: Array<{
      model_photo: File | null
      body_photo: File | null
      broken: boolean
      lease: boolean
      landlord_owned: boolean
      name: string
      detail: string
      lease_remaining_years: string
      lease_total_amount: string
      lease_company: string
      lease_monthly_amount: string
    }>

    // ダクト
    duct_model_photo: File | null
    duct_body_photo: File | null
    duct_broken: boolean
    duct_lease: boolean
    duct_landlord_owned: boolean
    duct_detail: string

    // グリストラップ
    grease_trap_model_photo: File | null
    grease_trap_body_photo: File | null
    grease_trap_broken: boolean
    grease_trap_lease: boolean
    grease_trap_landlord_owned: boolean
    grease_trap_detail: string

    // エアコン室内機（複数対応）
    aircon_indoor_units: Array<{
      model_photo: File | null
      body_photo: File | null
      broken: boolean
      lease: boolean
      landlord_owned: boolean
      outdoor_location: string
      years_used: string
      detail: string
      lease_remaining_years: string
      lease_total_amount: string
      lease_company: string
      lease_monthly_amount: string
    }>

    // エアコン室外機（複数対応）
    aircon_outdoor_units: Array<{
      model_photo: File | null
      body_photo: File | null
      location: string
      detail: string
    }>

    // 席（フロアごと）
    floor_seats: Array<{
      floor_name: string
      total_seats: string
      counter_seats: string
      table_seats: string
      photos: File[] | null
    }>

    // 電気メーター
    electric_meter_model_photo: File | null
    electric_meter_body_photo: File | null
    electric_meter_location: string
    electric_capacity: string
    power_capacity: string

    // ガスメーター
    gas_meter_model_photo: File | null
    gas_meter_body_photo: File | null
    gas_meter_location: string
    gas_capacity: string

    // 水道メーター
    water_meter_model_photo: File | null
    water_meter_body_photo: File | null
    water_meter_location: string
    water_pipe_capacity: string

    // 環境情報 - 瑕疵
    defect_none: boolean
    defect_rain_leak: boolean
    defect_rain_leak_detail: string
    defect_water_leak: boolean
    defect_water_leak_detail: string
    defect_noise: boolean
    defect_noise_detail: string
    defect_odor: boolean
    defect_odor_detail: string
    defect_other: boolean
    defect_other_detail: string

    // 環境情報 - 許認可
    permit_health_center: boolean
    permit_health_center_photo: File | null
    permit_fire_department: boolean
    permit_fire_department_photo: File | null
    fire_alarm: boolean
    fire_extinguisher: boolean
    sprinkler: boolean
    escape_ladder: boolean
    emergency_light: boolean
    permit_police: boolean
    permit_police_photo: File | null
    permit_police_detail: string
  }
}>(), {
  customerInput: () => ({
    equipment: {
      notTransfer: {
        status: 'なし',
        detail: ''
      },
      broken: {
        status: 'なし',
        detail: ''
      },
      lease: {
        status: 'なし',
        detail: ''
      },
      landlordEquipment: {
        status: 'なし',
        detail: ''
      },
      kitchenware: {
        status: '全て残置',
        detail: '',
        photos: null
      },
      seats: '',
      seatingList: []
    }
  }),
  detailCheck: () => ({
    // 店舗設備詳細
    ventilation_has_fan: false,
    ventilation_fan_route: [],
    ventilation_has_duct: false,
    ventilation_duct_route: [],
    drainage_type: '',
    facility_electricity_location: '',
    facility_electricity_capacity: '',
    facility_power_capacity: '',
    facility_gas_location: '',
    facility_gas_capacity: '',
    facility_water_location: '',
    facility_water_drainage_capacity: '',
    facility_outdoor_unit_location: '',
    facility_memo: '',

    // 厨房設備（複数対応）
    kitchen_equipment_units: [{
      model_photo: null,
      body_photo: null,
      broken: false,
      lease: false,
      landlord_owned: false,
      name: '',
      detail: '',
      lease_remaining_years: '',
      lease_total_amount: '',
      lease_company: '',
      lease_monthly_amount: ''
    }],

    // ダクト
    duct_model_photo: null,
    duct_body_photo: null,
    duct_broken: false,
    duct_lease: false,
    duct_landlord_owned: false,
    duct_detail: '',

    // グリストラップ
    grease_trap_model_photo: null,
    grease_trap_body_photo: null,
    grease_trap_broken: false,
    grease_trap_lease: false,
    grease_trap_landlord_owned: false,
    grease_trap_detail: '',

    // エアコン室内機（複数対応）
    aircon_indoor_units: [],

    // エアコン室外機（複数対応）
    aircon_outdoor_units: [],

    // 席（フロアごと）
    floor_seats: [{
      floor_name: '1階',
      total_seats: '',
      counter_seats: '',
      table_seats: '',
      photos: null
    }],

    // 電気メーター
    electric_meter_model_photo: null,
    electric_meter_body_photo: null,
    electric_meter_location: '',
    electric_capacity: '',
    power_capacity: '',

    // ガスメーター
    gas_meter_model_photo: null,
    gas_meter_body_photo: null,
    gas_meter_location: '',
    gas_capacity: '',

    // 水道メーター
    water_meter_model_photo: null,
    water_meter_body_photo: null,
    water_meter_location: '',
    water_pipe_capacity: '',

    // 環境情報 - 瑕疵
    defect_none: false,
    defect_rain_leak: false,
    defect_rain_leak_detail: '',
    defect_water_leak: false,
    defect_water_leak_detail: '',
    defect_noise: false,
    defect_noise_detail: '',
    defect_odor: false,
    defect_odor_detail: '',
    defect_other: false,
    defect_other_detail: '',

    // 環境情報 - 許認可
    permit_health_center: false,
    permit_health_center_photo: null,
    permit_fire_department: false,
    permit_fire_department_photo: null,
    fire_alarm: false,
    fire_extinguisher: false,
    sprinkler: false,
    escape_ladder: false,
    emergency_light: false,
    permit_police: false,
    permit_police_photo: null,
    permit_police_detail: ''
  })
})

// Emits
const emit = defineEmits<{
  'update:detailCheck': [value: typeof props.detailCheck]
  'update:customerInput': [value: typeof props.customerInput]
}>()

// Internal state
const formValid = ref(false)
const equipmentForm = ref(null)

// 写真プレビュー用
const previewDialog = ref(false)
const previewImageUrl = ref('')

const openPreview = (file: File | null) => {
  if (file && file instanceof File) {
    previewImageUrl.value = URL.createObjectURL(file)
    previewDialog.value = true
  }
}

const closePreview = () => {
  previewDialog.value = false
  previewImageUrl.value = ''
}

// 写真のプレビューURL生成
const getPhotoUrl = (file: File | null): string => {
  if (!file || !(file instanceof File)) return ''
  return URL.createObjectURL(file)
}

// 複数写真のプレビューURL生成
const getPhotoUrls = (files: File[] | null): string[] => {
  if (!files || !Array.isArray(files)) return []
  return files.filter(f => f instanceof File).map(f => URL.createObjectURL(f))
}

// Methods
const updateDetailCheck = (key: string, value: any) => {
  emit('update:detailCheck', { ...props.detailCheck, [key]: value })
}

// 瑕疵「なし」チェック時に他をクリア
const handleDefectNone = (value: boolean) => {
  if (value) {
    emit('update:detailCheck', {
      ...props.detailCheck,
      defect_none: true,
      defect_rain_leak: false,
      defect_rain_leak_detail: '',
      defect_water_leak: false,
      defect_water_leak_detail: '',
      defect_noise: false,
      defect_noise_detail: '',
      defect_odor: false,
      defect_odor_detail: '',
      defect_other: false,
      defect_other_detail: ''
    })
  } else {
    updateDetailCheck('defect_none', false)
  }
}

// 厨房設備の追加
const addKitchenEquipmentUnit = () => {
  const newUnit = {
    model_photo: null,
    body_photo: null,
    broken: false,
    lease: false,
    landlord_owned: false,
    name: '',
    detail: '',
    lease_remaining_years: '',
    lease_total_amount: '',
    lease_company: '',
    lease_monthly_amount: ''
  }
  const units = [...(props.detailCheck.kitchen_equipment_units || []), newUnit]
  updateDetailCheck('kitchen_equipment_units', units)
}

// 厨房設備の削除
const removeKitchenEquipmentUnit = (index: number) => {
  const units = [...(props.detailCheck.kitchen_equipment_units || [])]
  units.splice(index, 1)
  updateDetailCheck('kitchen_equipment_units', units)
}

// 厨房設備の更新
const updateKitchenEquipmentUnit = (index: number, key: string, value: any) => {
  const units = [...(props.detailCheck.kitchen_equipment_units || [])]
  units[index] = { ...units[index], [key]: value }
  updateDetailCheck('kitchen_equipment_units', units)
}

// エアコン室内機の追加
const addIndoorUnit = () => {
  const newUnit = {
    model_photo: null,
    body_photo: null,
    broken: false,
    lease: false,
    landlord_owned: false,
    outdoor_location: '',
    years_used: '',
    detail: '',
    lease_remaining_years: '',
    lease_total_amount: '',
    lease_company: '',
    lease_monthly_amount: ''
  }
  const units = [...(props.detailCheck.aircon_indoor_units || []), newUnit]
  updateDetailCheck('aircon_indoor_units', units)
}

// エアコン室内機の削除
const removeIndoorUnit = (index: number) => {
  const units = [...(props.detailCheck.aircon_indoor_units || [])]
  units.splice(index, 1)
  updateDetailCheck('aircon_indoor_units', units)
}

// エアコン室内機の更新
const updateIndoorUnit = (index: number, key: string, value: any) => {
  const units = [...(props.detailCheck.aircon_indoor_units || [])]
  units[index] = { ...units[index], [key]: value }
  updateDetailCheck('aircon_indoor_units', units)
}

// エアコン室外機の追加
const addOutdoorUnit = () => {
  const newUnit = {
    model_photo: null,
    body_photo: null,
    location: '',
    detail: ''
  }
  const units = [...(props.detailCheck.aircon_outdoor_units || []), newUnit]
  updateDetailCheck('aircon_outdoor_units', units)
}

// エアコン室外機の削除
const removeOutdoorUnit = (index: number) => {
  const units = [...(props.detailCheck.aircon_outdoor_units || [])]
  units.splice(index, 1)
  updateDetailCheck('aircon_outdoor_units', units)
}

// エアコン室外機の更新
const updateOutdoorUnit = (index: number, key: string, value: any) => {
  const units = [...(props.detailCheck.aircon_outdoor_units || [])]
  units[index] = { ...units[index], [key]: value }
  updateDetailCheck('aircon_outdoor_units', units)
}

// フロア席の追加
const addFloorSeat = () => {
  const newFloor = {
    floor_name: '',
    total_seats: '',
    counter_seats: '',
    table_seats: '',
    photos: null
  }
  const floors = [...(props.detailCheck.floor_seats || []), newFloor]
  updateDetailCheck('floor_seats', floors)
}

// フロア席の削除
const removeFloorSeat = (index: number) => {
  const floors = [...(props.detailCheck.floor_seats || [])]
  floors.splice(index, 1)
  updateDetailCheck('floor_seats', floors)
}

// フロア席の更新
const updateFloorSeat = (index: number, key: string, value: any) => {
  const floors = [...(props.detailCheck.floor_seats || [])]
  floors[index] = { ...floors[index], [key]: value }
  updateDetailCheck('floor_seats', floors)
}

// フロア写真の追加
const addFloorPhoto = (floorIndex: number, files: File[] | File | null) => {
  if (!files) return
  const newFiles = Array.isArray(files) ? files : [files]
  const floors = [...(props.detailCheck.floor_seats || [])]
  const currentPhotos = floors[floorIndex].photos || []
  floors[floorIndex] = { ...floors[floorIndex], photos: [...currentPhotos, ...newFiles] }
  updateDetailCheck('floor_seats', floors)
}

// フロア写真の削除
const removeFloorPhoto = (floorIndex: number, photoIndex: number) => {
  const floors = [...(props.detailCheck.floor_seats || [])]
  const currentPhotos = [...(floors[floorIndex].photos || [])]
  currentPhotos.splice(photoIndex, 1)
  floors[floorIndex] = { ...floors[floorIndex], photos: currentPhotos }
  updateDetailCheck('floor_seats', floors)
}

// CustomerInput update methods
const updateEquipment = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: { ...props.customerInput.equipment, [key]: value }
  })
}

const updateNotTransfer = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      notTransfer: { ...props.customerInput.equipment.notTransfer, [key]: value }
    }
  })
}

const updateBroken = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      broken: { ...props.customerInput.equipment.broken, [key]: value }
    }
  })
}

const updateLease = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      lease: { ...props.customerInput.equipment.lease, [key]: value }
    }
  })
}

const updateLandlordEquipment = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      landlordEquipment: { ...props.customerInput.equipment.landlordEquipment, [key]: value }
    }
  })
}

const updateKitchenware = (key: string, value: any) => {
  if (!props.customerInput) return
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      kitchenware: { ...props.customerInput.equipment.kitchenware, [key]: value }
    }
  })
}

// 調理器具写真の追加
const addKitchenwarePhoto = (files: File[] | File | null) => {
  if (!files || !props.customerInput) return
  const newFiles = Array.isArray(files) ? files : [files]
  const currentPhotos = props.customerInput.equipment.kitchenware.photos || []
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      kitchenware: {
        ...props.customerInput.equipment.kitchenware,
        photos: [...currentPhotos, ...newFiles]
      }
    }
  })
}

// 調理器具写真の削除
const removeKitchenwarePhoto = (index: number) => {
  if (!props.customerInput) return
  const currentPhotos = [...(props.customerInput.equipment.kitchenware.photos || [])]
  currentPhotos.splice(index, 1)
  emit('update:customerInput', {
    ...props.customerInput,
    equipment: {
      ...props.customerInput.equipment,
      kitchenware: {
        ...props.customerInput.equipment.kitchenware,
        photos: currentPhotos
      }
    }
  })
}

// 座席関連
const calculateTotalSeats = computed(() => {
  const seatingList = props.customerInput?.equipment?.seatingList || []
  return seatingList.reduce((total, seat) => {
    const capacity = parseInt(seat.capacity) || 0
    const count = parseInt(String(seat.count)) || 0
    return total + (capacity * count)
  }, 0)
})

const addSeatingItem = () => {
  if (!props.customerInput) return
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
  if (!props.customerInput) return
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
  if (!props.customerInput) return
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

// Expose form validity for parent
defineExpose({
  formValid,
  equipmentForm
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

/* 写真プレースホルダー */
.photo-placeholder {
  width: 120px;
  height: 120px;
  border: 2px dashed #c5d5eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fbfd;
}

/* チェックボックス列 */
.check-column {
  background: #f9fbfd;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e8f0f8;
}

/* エアコンユニットアイテム */
.unit-item {
  background: #f9fbfd;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e8f0f8;
}

.unit-item:not(:last-child) {
  margin-bottom: 16px;
}

/* カーソルポインター */
.cursor-pointer {
  cursor: pointer;
}
</style>
