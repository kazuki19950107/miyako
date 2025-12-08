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
              排気設備の種類について教えてください
            </div>
            <div class="text-caption mb-2 grey--text">※複数ある場合は両方にチェックしてください</div>
            <v-row>
              <v-col cols="12" md="6">
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
              <v-col cols="12" md="6">
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
              排水設備の種類について教えてください
            </div>
            <v-radio-group
              :model-value="detailCheck.drainage_type"
              @update:model-value="updateDetailCheck('drainage_type', $event)"
              row
            >
              <v-radio label="グリストラップ（床下埋め込み・露出型）" value="グリストラップ" />
              <v-radio label="ドライキッチン" value="ドライキッチン" />
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
                  :model-value="detailCheck.facility_electricity_location"
                  @update:model-value="updateDetailCheck('facility_electricity_location', $event)"
                  label="場所"
                  outlined
                  dense
                  prepend-inner-icon="mdi-map-marker"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="detailCheck.facility_electricity_capacity"
                  @update:model-value="updateDetailCheck('facility_electricity_capacity', $event)"
                  label="電気容量"
                  outlined
                  dense
                  prepend-inner-icon="mdi-flash"
                />
              </v-col>
              <v-col cols="12" md="4">
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

          <!-- ガスメーターの場所と容量 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-3">
              <v-icon small class="mr-1">mdi-fire-circle</v-icon>
              ガスメーターの場所とガスの容量について教えてください
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

          <!-- 水道メーターの場所と排水管の容量 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-3">
              <v-icon small class="mr-1">mdi-water-outline</v-icon>
              水道メーターの場所と排水管の容量について教えてください
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

          <!-- 室外機の場所 -->
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-air-conditioner</v-icon>
              室外機の場所について教えてください
            </div>
            <v-textarea
              :model-value="detailCheck.facility_outdoor_unit_location"
              @update:model-value="updateDetailCheck('facility_outdoor_unit_location', $event)"
              label="場所"
              outlined
              dense
              rows="2"
              placeholder="例）店舗背面、屋上、ベランダなど"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- ダクト -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-air-filter</v-icon>
        ダクト
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row align="start">
          <!-- 型番写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              型番
            </div>
            <v-file-input
              :model-value="detailCheck.duct_model_photo"
              @update:model-value="updateDetailCheck('duct_model_photo', $event)"
              label="型番写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            />
            <div v-if="detailCheck.duct_model_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.duct_model_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
          </v-col>

          <!-- 本体写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              本体
            </div>
            <v-file-input
              :model-value="detailCheck.duct_body_photo"
              @update:model-value="updateDetailCheck('duct_body_photo', $event)"
              label="本体写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            />
            <div v-if="detailCheck.duct_body_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.duct_body_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
          </v-col>

          <!-- 例外チェック -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              例外チェック
            </div>
            <div class="d-flex flex-column check-column">
              <v-checkbox
                :model-value="detailCheck.duct_broken"
                @update:model-value="updateDetailCheck('duct_broken', $event)"
                label="故障あり"
                density="compact"
                hide-details
                color="error"
              />
              <v-checkbox
                :model-value="detailCheck.duct_lease"
                @update:model-value="updateDetailCheck('duct_lease', $event)"
                label="リース"
                density="compact"
                hide-details
                color="warning"
              />
              <v-checkbox
                :model-value="detailCheck.duct_landlord_owned"
                @update:model-value="updateDetailCheck('duct_landlord_owned', $event)"
                label="家主所有"
                density="compact"
                hide-details
                color="info"
              />
            </div>
          </v-col>

          <!-- 詳細メモ -->
          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.duct_detail"
              @update:model-value="updateDetailCheck('duct_detail', $event)"
              label="詳細（排気設備種類、排気ルートなど）"
              outlined
              dense
              rows="2"
              placeholder="例: ダクト式、屋上まで直通"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- グリストラップ -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-water-pump</v-icon>
        グリストラップ
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row align="start">
          <!-- 型番写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              型番
            </div>
            <v-file-input
              :model-value="detailCheck.grease_trap_model_photo"
              @update:model-value="updateDetailCheck('grease_trap_model_photo', $event)"
              label="型番写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            />
            <div v-if="detailCheck.grease_trap_model_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.grease_trap_model_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
          </v-col>

          <!-- 本体写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              本体
            </div>
            <v-file-input
              :model-value="detailCheck.grease_trap_body_photo"
              @update:model-value="updateDetailCheck('grease_trap_body_photo', $event)"
              label="本体写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            />
            <div v-if="detailCheck.grease_trap_body_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.grease_trap_body_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
          </v-col>

          <!-- 例外チェック -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              例外チェック
            </div>
            <div class="d-flex flex-column check-column">
              <v-checkbox
                :model-value="detailCheck.grease_trap_broken"
                @update:model-value="updateDetailCheck('grease_trap_broken', $event)"
                label="故障あり"
                density="compact"
                hide-details
                color="error"
              />
              <v-checkbox
                :model-value="detailCheck.grease_trap_lease"
                @update:model-value="updateDetailCheck('grease_trap_lease', $event)"
                label="リース"
                density="compact"
                hide-details
                color="warning"
              />
              <v-checkbox
                :model-value="detailCheck.grease_trap_landlord_owned"
                @update:model-value="updateDetailCheck('grease_trap_landlord_owned', $event)"
                label="家主所有"
                density="compact"
                hide-details
                color="info"
              />
            </div>
          </v-col>

          <!-- 詳細メモ -->
          <v-col cols="12">
            <v-textarea
              :model-value="detailCheck.grease_trap_detail"
              @update:model-value="updateDetailCheck('grease_trap_detail', $event)"
              label="詳細（排水設備種類など）"
              outlined
              dense
              rows="2"
              placeholder="例: 厨房専用排水、グリストラップ"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- エアコン（室内機） -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-air-conditioner</v-icon>
        エアコン（室内機）
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row align="start">
          <!-- 型番写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              型番
            </div>
            <v-file-input
              :model-value="detailCheck.aircon_indoor_model_photo"
              @update:model-value="updateDetailCheck('aircon_indoor_model_photo', $event)"
              label="型番写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            />
            <div v-if="detailCheck.aircon_indoor_model_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.aircon_indoor_model_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
          </v-col>

          <!-- 本体写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              本体
            </div>
            <v-file-input
              :model-value="detailCheck.aircon_indoor_body_photo"
              @update:model-value="updateDetailCheck('aircon_indoor_body_photo', $event)"
              label="本体写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            />
            <div v-if="detailCheck.aircon_indoor_body_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.aircon_indoor_body_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
          </v-col>

          <!-- 例外チェック -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              例外チェック
            </div>
            <div class="d-flex flex-column check-column">
              <v-checkbox
                :model-value="detailCheck.aircon_broken"
                @update:model-value="updateDetailCheck('aircon_broken', $event)"
                label="故障あり"
                density="compact"
                hide-details
                color="error"
              />
              <v-checkbox
                :model-value="detailCheck.aircon_lease"
                @update:model-value="updateDetailCheck('aircon_lease', $event)"
                label="リース"
                density="compact"
                hide-details
                color="warning"
              />
              <v-checkbox
                :model-value="detailCheck.aircon_landlord_owned"
                @update:model-value="updateDetailCheck('aircon_landlord_owned', $event)"
                label="家主所有"
                density="compact"
                hide-details
                color="info"
              />
            </div>
          </v-col>

          <!-- 詳細メモ -->
          <v-col cols="12">
            <v-row dense>
              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="detailCheck.aircon_count"
                  @update:model-value="updateDetailCheck('aircon_count', $event)"
                  label="台数"
                  outlined
                  dense
                  type="number"
                  suffix="台"
                />
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  :model-value="detailCheck.aircon_indoor_detail"
                  @update:model-value="updateDetailCheck('aircon_indoor_detail', $event)"
                  label="詳細"
                  outlined
                  dense
                  placeholder="例: 天井埋込式、2019年製"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- エアコン（室外機） -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-fan</v-icon>
        エアコン（室外機）
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row align="start">
          <!-- 型番写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              型番
            </div>
            <v-file-input
              :model-value="detailCheck.aircon_outdoor_model_photo"
              @update:model-value="updateDetailCheck('aircon_outdoor_model_photo', $event)"
              label="型番写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            />
            <div v-if="detailCheck.aircon_outdoor_model_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.aircon_outdoor_model_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
          </v-col>

          <!-- 本体写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              本体
            </div>
            <v-file-input
              :model-value="detailCheck.aircon_outdoor_body_photo"
              @update:model-value="updateDetailCheck('aircon_outdoor_body_photo', $event)"
              label="本体写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            />
            <div v-if="detailCheck.aircon_outdoor_body_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.aircon_outdoor_body_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
          </v-col>

          <!-- 設置場所 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              設置場所
            </div>
            <v-text-field
              :model-value="detailCheck.outdoor_unit_location"
              @update:model-value="updateDetailCheck('outdoor_unit_location', $event)"
              label="室外機設置場所"
              outlined
              dense
              placeholder="例: 屋上、ベランダ"
            />
          </v-col>

          <!-- 詳細メモ -->
          <v-col cols="12">
            <v-text-field
              :model-value="detailCheck.aircon_outdoor_detail"
              @update:model-value="updateDetailCheck('aircon_outdoor_detail', $event)"
              label="詳細"
              outlined
              dense
              placeholder="例: 屋上設置、アクセス良好"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 席 -->
    <v-card outlined class="mb-4 section-card">
      <v-card-title class="section-title">
        <v-icon left size="24" class="mr-2">mdi-seat</v-icon>
        席
      </v-card-title>
      <v-card-text class="pt-6">
        <v-row align="start">
          <!-- 席の写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              席の写真
            </div>
            <v-file-input
              :model-value="detailCheck.seat_photo"
              @update:model-value="updateDetailCheck('seat_photo', $event)"
              label="席の写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            />
            <div v-if="detailCheck.seat_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.seat_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
          </v-col>

          <!-- 席数入力 -->
          <v-col cols="12" md="8">
            <div class="text-subtitle-2 mb-2 font-weight-bold" style="color: #1e50a2;">
              席数
            </div>
            <v-row dense>
              <v-col cols="4">
                <v-text-field
                  :model-value="detailCheck.seat_count"
                  @update:model-value="updateDetailCheck('seat_count', $event)"
                  label="総席数"
                  outlined
                  dense
                  type="number"
                  suffix="席"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  :model-value="detailCheck.counter_seats"
                  @update:model-value="updateDetailCheck('counter_seats', $event)"
                  label="カウンター"
                  outlined
                  dense
                  type="number"
                  suffix="席"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  :model-value="detailCheck.table_seats"
                  @update:model-value="updateDetailCheck('table_seats', $event)"
                  label="テーブル"
                  outlined
                  dense
                  type="number"
                  suffix="席"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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
          <!-- 型番写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              型番
            </div>
            <v-file-input
              :model-value="detailCheck.electric_meter_model_photo"
              @update:model-value="updateDetailCheck('electric_meter_model_photo', $event)"
              label="型番写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            />
            <div v-if="detailCheck.electric_meter_model_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.electric_meter_model_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
          </v-col>

          <!-- 本体写真 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              本体
            </div>
            <v-file-input
              :model-value="detailCheck.electric_meter_body_photo"
              @update:model-value="updateDetailCheck('electric_meter_body_photo', $event)"
              label="本体写真"
              outlined
              dense
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details
            />
            <div v-if="detailCheck.electric_meter_body_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.electric_meter_body_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
          </v-col>

          <!-- 容量入力 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              容量情報
            </div>
            <v-text-field
              :model-value="detailCheck.electric_capacity"
              @update:model-value="updateDetailCheck('electric_capacity', $event)"
              label="電気容量"
              outlined
              dense
              placeholder="例: 30A、50A"
              class="mb-2"
            />
            <v-text-field
              :model-value="detailCheck.power_capacity"
              @update:model-value="updateDetailCheck('power_capacity', $event)"
              label="動力容量"
              outlined
              dense
              placeholder="例: 15kW"
            />
          </v-col>

          <!-- 詳細 -->
          <v-col cols="12">
            <v-text-field
              :model-value="detailCheck.electric_meter_location"
              @update:model-value="updateDetailCheck('electric_meter_location', $event)"
              label="メーター位置"
              outlined
              dense
              placeholder="例: 1階入口、地下"
            />
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
            />
            <div v-if="detailCheck.gas_meter_model_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.gas_meter_model_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
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
            />
            <div v-if="detailCheck.gas_meter_body_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.gas_meter_body_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
          </v-col>

          <!-- 容量入力 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              容量情報
            </div>
            <v-text-field
              :model-value="detailCheck.gas_capacity"
              @update:model-value="updateDetailCheck('gas_capacity', $event)"
              label="ガス容量"
              outlined
              dense
              placeholder="例: 都市ガス13A"
            />
          </v-col>

          <!-- 詳細 -->
          <v-col cols="12">
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
            />
            <div v-if="detailCheck.water_meter_model_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.water_meter_model_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
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
            />
            <div v-if="detailCheck.water_meter_body_photo" class="d-flex justify-center mt-2">
              <v-img
                :src="getPhotoUrl(detailCheck.water_meter_body_photo)"
                width="120"
                height="120"
                cover
                class="rounded border"
              />
            </div>
            <div v-else class="photo-placeholder mx-auto mt-2">
              <v-icon size="40" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
          </v-col>

          <!-- 容量入力 -->
          <v-col cols="12" md="4">
            <div class="text-subtitle-2 mb-2 font-weight-bold text-center" style="color: #1e50a2;">
              容量情報
            </div>
            <v-text-field
              :model-value="detailCheck.water_pipe_capacity"
              @update:model-value="updateDetailCheck('water_pipe_capacity', $event)"
              label="給排水管径"
              outlined
              dense
              placeholder="例: 20mm、25mm"
            />
          </v-col>

          <!-- 詳細 -->
          <v-col cols="12">
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
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-alert-circle-outline</v-icon>
              店舗の瑕疵について教えてください
            </div>
            <div class="text-caption mb-2 grey--text">※複数選択可能です</div>

            <v-checkbox
              :model-value="detailCheck.defect_none"
              @update:model-value="handleDefectNone($event)"
              label="なし"
              hide-details
              color="primary"
            />
            <v-checkbox
              :model-value="detailCheck.defect_rain_leak"
              @update:model-value="updateDetailCheck('defect_rain_leak', $event)"
              label="雨漏り"
              hide-details
              color="warning"
              :disabled="detailCheck.defect_none"
            />
            <v-text-field
              v-if="detailCheck.defect_rain_leak"
              :model-value="detailCheck.defect_rain_leak_detail"
              @update:model-value="updateDetailCheck('defect_rain_leak_detail', $event)"
              label="雨漏りの場所・状況"
              outlined
              dense
              class="mt-1 ml-8"
              placeholder="例）厨房天井から雨天時に発生"
            />
            <v-checkbox
              :model-value="detailCheck.defect_water_leak"
              @update:model-value="updateDetailCheck('defect_water_leak', $event)"
              label="水漏れ"
              hide-details
              color="warning"
              :disabled="detailCheck.defect_none"
            />
            <v-text-field
              v-if="detailCheck.defect_water_leak"
              :model-value="detailCheck.defect_water_leak_detail"
              @update:model-value="updateDetailCheck('defect_water_leak_detail', $event)"
              label="水漏れの場所・状況"
              outlined
              dense
              class="mt-1 ml-8"
              placeholder="例）シンク下の配管から"
            />
            <v-checkbox
              :model-value="detailCheck.defect_noise"
              @update:model-value="updateDetailCheck('defect_noise', $event)"
              label="騒音問題"
              hide-details
              color="warning"
              :disabled="detailCheck.defect_none"
            />
            <v-text-field
              v-if="detailCheck.defect_noise"
              :model-value="detailCheck.defect_noise_detail"
              @update:model-value="updateDetailCheck('defect_noise_detail', $event)"
              label="騒音問題の詳細"
              outlined
              dense
              class="mt-1 ml-8"
              placeholder="例）近隣からの苦情あり"
            />
            <v-checkbox
              :model-value="detailCheck.defect_other"
              @update:model-value="updateDetailCheck('defect_other', $event)"
              label="その他"
              hide-details
              color="warning"
              :disabled="detailCheck.defect_none"
            />
            <v-text-field
              v-if="detailCheck.defect_other"
              :model-value="detailCheck.defect_other_detail"
              @update:model-value="updateDetailCheck('defect_other_detail', $event)"
              label="その他の瑕疵詳細"
              outlined
              dense
              class="mt-1 ml-8"
              placeholder="瑕疵の内容を記入してください"
            />
          </v-col>

          <!-- 届出済の許認可 -->
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <v-icon small class="mr-1">mdi-file-certificate-outline</v-icon>
              届出済の許認可について教えてください
            </div>

            <!-- 保健所 -->
            <v-checkbox
              :model-value="detailCheck.permit_health_center"
              @update:model-value="updateDetailCheck('permit_health_center', $event)"
              label="保健所"
              hide-details
              color="primary"
            />
            <div v-if="detailCheck.permit_health_center" class="ml-8 mb-3">
              <v-file-input
                :model-value="detailCheck.permit_health_center_photo"
                @update:model-value="updateDetailCheck('permit_health_center_photo', $event)"
                label="許可証写真"
                outlined
                dense
                accept="image/*"
                prepend-icon="mdi-camera"
                hide-details
                class="mb-2"
              />
            </div>

            <!-- 消防署 -->
            <v-checkbox
              :model-value="detailCheck.permit_fire_department"
              @update:model-value="updateDetailCheck('permit_fire_department', $event)"
              label="消防署"
              hide-details
              color="primary"
            />
            <div v-if="detailCheck.permit_fire_department" class="ml-8 mb-3">
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
              <v-checkbox
                :model-value="detailCheck.fire_alarm"
                @update:model-value="updateDetailCheck('fire_alarm', $event)"
                label="火災報知器"
                hide-details
                density="compact"
              />
              <v-checkbox
                :model-value="detailCheck.fire_extinguisher"
                @update:model-value="updateDetailCheck('fire_extinguisher', $event)"
                label="消火器"
                hide-details
                density="compact"
              />
              <v-checkbox
                :model-value="detailCheck.sprinkler"
                @update:model-value="updateDetailCheck('sprinkler', $event)"
                label="スプリンクラー"
                hide-details
                density="compact"
              />
              <v-checkbox
                :model-value="detailCheck.escape_ladder"
                @update:model-value="updateDetailCheck('escape_ladder', $event)"
                label="避難はしご"
                hide-details
                density="compact"
              />
              <v-checkbox
                :model-value="detailCheck.emergency_light"
                @update:model-value="updateDetailCheck('emergency_light', $event)"
                label="誘導灯"
                hide-details
                density="compact"
              />
            </div>

            <!-- 警察署 -->
            <v-checkbox
              :model-value="detailCheck.permit_police"
              @update:model-value="updateDetailCheck('permit_police', $event)"
              label="警察署"
              hide-details
              color="primary"
            />
            <div v-if="detailCheck.permit_police" class="ml-8 mb-3">
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

  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props
const props = withDefaults(defineProps<{
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

    // エアコン室内機
    aircon_indoor_model_photo: File | null
    aircon_indoor_body_photo: File | null
    aircon_broken: boolean
    aircon_lease: boolean
    aircon_landlord_owned: boolean
    aircon_count: string
    aircon_indoor_detail: string

    // エアコン室外機
    aircon_outdoor_model_photo: File | null
    aircon_outdoor_body_photo: File | null
    outdoor_unit_location: string
    aircon_outdoor_detail: string

    // 席
    seat_photo: File | null
    seat_count: string
    counter_seats: string
    table_seats: string

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

    // エアコン室内機
    aircon_indoor_model_photo: null,
    aircon_indoor_body_photo: null,
    aircon_broken: false,
    aircon_lease: false,
    aircon_landlord_owned: false,
    aircon_count: '',
    aircon_indoor_detail: '',

    // エアコン室外機
    aircon_outdoor_model_photo: null,
    aircon_outdoor_body_photo: null,
    outdoor_unit_location: '',
    aircon_outdoor_detail: '',

    // 席
    seat_photo: null,
    seat_count: '',
    counter_seats: '',
    table_seats: '',

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
}>()

// Internal state
const formValid = ref(false)
const equipmentForm = ref(null)

// 写真のプレビューURL生成
const getPhotoUrl = (file: File | null): string => {
  if (!file || !(file instanceof File)) return ''
  return URL.createObjectURL(file)
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
      defect_other: false,
      defect_other_detail: ''
    })
  } else {
    updateDetailCheck('defect_none', false)
  }
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
</style>
