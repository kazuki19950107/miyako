<template>
  <v-container class="mypage-wrapper pa-3 pa-md-6" fluid>

    <!-- ===== ヒーローカード ===== -->
    <v-card class="hero-card mb-5" rounded="xl" flat>
      <div class="hero-bg px-5 py-6 px-md-8 py-md-8">
        <v-row align="center" no-gutters>
          <v-col cols="auto">
            <v-avatar size="60" class="hero-avatar elevation-4">
              <v-icon size="32" color="primary">mdi-account</v-icon>
            </v-avatar>
          </v-col>
          <v-col class="pl-4">
            <h2 class="text-h5 font-weight-bold text-white mb-1">{{ userName || profile.name }}さん</h2>
            <div class="d-flex align-center ga-2 flex-wrap">
              <v-chip size="small" color="white" variant="flat" class="font-weight-medium text-primary">
                <v-icon start size="14">mdi-store-plus</v-icon>
                出店希望者
              </v-chip>
              <span v-if="clientProfile" class="text-white text-body-2" style="opacity: 0.8">
                登録日: {{ clientProfile.created_at?.split('T')[0] }}
              </span>
            </div>
          </v-col>
          <v-col cols="auto">
            <v-btn
              variant="outlined"
              color="white"
              size="small"
              rounded="lg"
              class="text-none"
              @click="handleLogout"
            >
              <v-icon start size="16">mdi-logout</v-icon>
              ログアウト
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <!-- ===== クイック統計 ===== -->
    <v-row class="mb-5" dense>
      <v-col v-for="stat in stats" :key="stat.label" cols="4" sm>
        <v-card
          class="stat-card text-center py-4 px-2"
          rounded="xl"
          flat
          :style="{ background: stat.bg, cursor: 'pointer' }"
          @click="activeTab = stat.tab"
        >
          <v-icon :color="stat.color" size="28" class="mb-1">{{ stat.icon }}</v-icon>
          <div v-if="stat.value !== ''" class="text-h5 font-weight-bold" :style="{ color: stat.color }">{{ stat.value }}</div>
          <div class="text-caption text-medium-emphasis">{{ stat.label }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ===== メインコンテンツ ===== -->
    <v-card rounded="xl" flat class="main-card">

      <!-- タブナビゲーション -->
      <v-tabs
        v-model="activeTab"
        color="primary"
        show-arrows
        class="px-2"
      >
        <v-tab v-for="tab in tabs" :key="tab.key" :value="tab.key" class="text-none">
          <v-icon start size="18">{{ tab.icon }}</v-icon>
          <span class="d-none d-sm-inline">{{ tab.title }}</span>
          <v-badge
            v-if="tab.badge"
            :content="tab.badge"
            color="error"
            inline
            class="ml-1"
          />
        </v-tab>
      </v-tabs>

      <v-divider />

      <!-- タブコンテンツ -->
      <v-window v-model="activeTab">

        <!-- ========== 物件を探す ========== -->
        <v-window-item value="search">
          <div class="pa-4 pa-md-6">

            <!-- 希望条件チップ -->
            <div v-if="userPreferencePatterns.length > 0" class="mb-4">
              <div class="text-caption text-medium-emphasis font-weight-medium mb-2">
                <v-icon size="14" class="mr-1">mdi-filter-variant</v-icon>
                出店希望条件で絞り込み
              </div>
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  :variant="activePreferenceFilter === null ? 'flat' : 'outlined'"
                  :color="activePreferenceFilter === null ? 'primary' : undefined"
                  size="small"
                  rounded="lg"
                  @click="clearPreferenceFilter"
                >
                  <v-icon start size="14">mdi-view-grid</v-icon>
                  すべて表示
                </v-chip>
                <v-chip
                  v-for="(pattern, idx) in userPreferencePatterns"
                  :key="pattern.id"
                  :variant="activePreferenceFilter === pattern.id ? 'flat' : 'outlined'"
                  :color="activePreferenceFilter === pattern.id ? preferenceChipColors[idx % preferenceChipColors.length] : undefined"
                  size="small"
                  rounded="lg"
                  @click="applyPreferenceFilter(pattern.id)"
                >
                  <v-icon start size="14">mdi-target</v-icon>
                  条件{{ idx + 1 }}: {{ pattern.patternName }}
                </v-chip>
              </div>
            </div>

            <!-- 検索バー + フィルタトグル -->
            <div class="d-flex align-center ga-3 mb-4 flex-wrap">
              <v-text-field
                v-model="searchText"
                placeholder="物件名・エリアで検索"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                hide-details
                clearable
                class="search-field"
              />
              <v-btn
                variant="tonal"
                color="primary"
                rounded="lg"
                @click="showDetailFilter = !showDetailFilter"
              >
                <v-icon start>mdi-tune</v-icon>
                絞り込み
                <v-badge v-if="activeFilterCount > 0" :content="activeFilterCount" color="error" inline class="ml-1" />
                <v-icon v-else end size="18">{{ showDetailFilter ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                hide-details
                class="sort-select"
              />
            </div>

            <!-- 詳細フィルタ -->
            <v-expand-transition>
              <v-card v-show="showDetailFilter" color="grey-lighten-5" rounded="lg" flat class="pa-4 mb-4">
                <!-- エリア・物件条件 -->
                <div class="text-caption text-medium-emphasis font-weight-bold mb-2">
                  <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                  エリア・物件条件
                </div>
                <v-row dense class="mb-3">
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterPrefecture" :items="prefectureOptions" label="都道府県" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterArea" :items="filteredAreaOptions" label="市区" variant="outlined" density="comfortable" rounded="lg" hide-details clearable :disabled="!filterPrefecture" />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterBusiness" :items="businessOptions" label="業態" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterInterior" :items="interiorConditionFilterOptions" label="室内状態" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                </v-row>

                <!-- 賃料・面積 -->
                <div class="text-caption text-medium-emphasis font-weight-bold mb-2">
                  <v-icon size="14" class="mr-1">mdi-currency-jpy</v-icon>
                  賃料・面積
                </div>
                <v-row dense class="mb-3">
                  <v-col cols="6" sm="3">
                    <v-text-field v-model.number="filterRentMin" label="賃料（万円以上）" type="number" variant="outlined" density="comfortable" rounded="lg" hide-details clearable suffix="万円" />
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-text-field v-model.number="filterRentMax" label="賃料（万円以下）" type="number" variant="outlined" density="comfortable" rounded="lg" hide-details clearable suffix="万円" />
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-text-field v-model.number="filterSizeMin" label="坪数（以上）" type="number" variant="outlined" density="comfortable" rounded="lg" hide-details clearable suffix="坪" />
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-text-field v-model.number="filterSizeMax" label="坪数（以下）" type="number" variant="outlined" density="comfortable" rounded="lg" hide-details clearable suffix="坪" />
                  </v-col>
                </v-row>

                <!-- アクセス -->
                <div class="text-caption text-medium-emphasis font-weight-bold mb-2">
                  <v-icon size="14" class="mr-1">mdi-train</v-icon>
                  アクセス
                </div>
                <v-row dense class="mb-3">
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterRailway" :items="railwayFilterOptions" label="沿線" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="filterStation" label="駅名" placeholder="例: 心斎橋" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-text-field v-model.number="filterWalkMinutes" label="徒歩（分以内）" type="number" variant="outlined" density="comfortable" rounded="lg" hide-details clearable suffix="分" />
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-select v-model="filterFloor" :items="floorFilterOptions" label="フロア" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                </v-row>

                <!-- 特殊条件 -->
                <div class="text-caption text-medium-emphasis font-weight-bold mb-2">
                  <v-icon size="14" class="mr-1">mdi-tag-multiple</v-icon>
                  特殊条件
                </div>
                <v-row dense>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterFloor" :items="floorFilterOptions" label="フロア" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterLocation" :items="locationFilterOptions" label="ロケーション" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterSpecial" :items="specialFilterOptions" label="許可条件" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterEquipment" :items="equipmentFilterOptions" label="店舗設備" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                </v-row>

                <!-- アクティブフィルタ表示 + リセット -->
                <div class="d-flex align-center mt-3">
                  <div v-if="activeFilterCount > 0" class="text-caption text-primary font-weight-medium">
                    <v-icon size="14" class="mr-1">mdi-filter</v-icon>
                    {{ activeFilterCount }}件の条件で絞り込み中
                  </div>
                  <v-spacer />
                  <v-btn variant="text" color="primary" size="small" @click="resetFilters">
                    <v-icon start size="14">mdi-refresh</v-icon>
                    条件をリセット
                  </v-btn>
                </div>
              </v-card>
            </v-expand-transition>

            <!-- ローディング -->
            <div v-if="propertiesLoading" class="text-center py-8">
              <v-progress-circular indeterminate color="primary" size="40" />
              <div class="text-body-2 text-medium-emphasis mt-3">物件データを読み込み中...</div>
            </div>

            <!-- エラー -->
            <v-alert v-else-if="propertiesError" type="error" variant="tonal" rounded="lg" class="mb-4">
              {{ propertiesError }}
            </v-alert>

            <template v-else>
            <!-- 件数表示 -->
            <div class="text-body-2 text-medium-emphasis mb-4">
              {{ filteredProperties.length }}件の水面下物件
              <span v-if="activePreferenceFilter" class="text-primary font-weight-medium">
                — 「{{ userPreferencePatterns.find(p => p.id === activePreferenceFilter)?.patternName }}」で絞り込み中
              </span>
            </div>

            <!-- 承認状態フィルタ (チップ) -->
            <v-chip-group v-model="approvalFilter" mandatory selected-class="text-primary" class="mb-3">
              <v-chip value="all" filter variant="outlined" size="small">すべて</v-chip>
              <v-chip value="approved" filter variant="outlined" size="small" color="success">
                <v-icon start size="14">mdi-lock-open</v-icon>閲覧可能
              </v-chip>
              <v-chip value="pending" filter variant="outlined" size="small" color="warning">
                <v-icon start size="14">mdi-clock-outline</v-icon>申請中
              </v-chip>
            </v-chip-group>

            <!-- 物件グリッド -->
            <v-row v-if="filteredProperties.length > 0" dense class="mx-n1">
              <v-col
                v-for="property in filteredProperties"
                :key="property.id"
                cols="12"
                sm="6"
                lg="4"
                class="pa-2"
              >
                <v-card class="property-card h-100 d-flex flex-column" rounded="xl" elevation="2" @click="openDetail(property)">
                  <!-- 画像プレースホルダ -->
                  <div class="property-image d-flex align-center justify-center" :style="{ background: property.gradient }">
                    <v-icon size="44" color="white" style="opacity: 0.2">mdi-silverware-fork-knife</v-icon>
                    <!-- お気に入りボタン -->
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      class="fav-btn"
                      @click.stop="toggleFavorite(property.id)"
                    >
                      <v-icon :color="property.isFavorite ? '#b85450' : 'rgba(255,255,255,0.85)'" size="22">
                        {{ property.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
                      </v-icon>
                    </v-btn>
                    <!-- ステータスバッジ -->
                    <v-chip
                      v-if="property.status === 'closed'"
                      color="error"
                      size="x-small"
                      variant="flat"
                      class="status-badge"
                    >
                      募集終了
                    </v-chip>
                    <v-chip
                      v-else-if="property.availableDate && property.availableDate !== '-'"
                      color="info"
                      size="x-small"
                      variant="flat"
                      class="status-badge"
                    >
                      {{ property.availableDate }}
                    </v-chip>
                    <!-- 承認状態バッジ -->
                    <v-chip
                      v-if="getApprovalStatus(property.id) === 'approved'"
                      color="success"
                      size="x-small"
                      variant="flat"
                      class="approval-badge"
                    >
                      <v-icon start size="11">mdi-lock-open</v-icon>
                      閲覧可能
                    </v-chip>
                    <v-chip
                      v-else-if="getApprovalStatus(property.id) === 'pending'"
                      color="warning"
                      size="x-small"
                      variant="flat"
                      class="approval-badge"
                    >
                      <v-icon start size="11">mdi-clock-outline</v-icon>
                      申請中
                    </v-chip>
                  </div>

                  <v-card-text class="pa-4 flex-grow-1">
                    <h3 class="text-subtitle-1 font-weight-bold mb-1 card-title-truncate">{{ property.name }}</h3>
                    <div v-if="getLocation(property)" class="text-body-2 text-medium-emphasis mb-1">
                      <v-icon size="14" class="mr-1">{{ property.isLimited ? 'mdi-map-marker-outline' : 'mdi-map-marker' }}</v-icon>
                      {{ getLocation(property) }}
                    </div>
                    <div class="text-caption text-medium-emphasis mb-2 d-flex align-center">
                      <v-icon size="12" class="mr-1">mdi-train</v-icon>
                      {{ property.nearestStations[0].station }}駅
                      <template v-if="!property.isLimited && property.nearestStations[0].transportMinutes">
                        {{ property.nearestStations[0].transportMethod }}{{ property.nearestStations[0].transportMinutes }}分
                      </template>
                      <v-chip v-if="property.nearestStations.length > 1" size="x-small" variant="tonal" color="primary" class="ml-1">+{{ property.nearestStations.length - 1 }}駅</v-chip>
                    </div>
                    <div class="text-h6 font-weight-bold text-primary mb-2">
                      {{ formatRent(property.rent) }}<span class="text-body-2 font-weight-regular text-medium-emphasis">/月</span>
                    </div>
                    <div v-if="property.transferListPrice" class="text-caption text-medium-emphasis">
                      造作: {{ property.transferListPrice }}万円
                    </div>
                    <div class="d-flex align-center ga-3 mb-3">
                      <span class="text-body-2 text-medium-emphasis">
                        <v-icon size="14" class="mr-1">mdi-texture-box</v-icon>
                        {{ property.tsubo }}坪
                      </span>
                    </div>
                    <div class="d-flex flex-wrap ga-1">
                      <v-chip v-if="property.allowedBusinessTypes && property.allowedBusinessTypes[0]" size="x-small" variant="tonal" color="primary">{{ property.allowedBusinessTypes[0] }}</v-chip>
                      <v-chip v-if="property.floorDisplay" size="x-small" variant="tonal">{{ property.floorDisplay }}</v-chip>
                    </div>
                    <!-- 希望条件マッチバッジ -->
                    <div v-if="getMatchingPatterns(property).length > 0" class="mt-2 d-flex flex-wrap ga-1">
                      <v-chip
                        v-for="match in getMatchingPatterns(property)"
                        :key="match.id"
                        size="x-small"
                        variant="flat"
                        :color="preferenceChipColors[match.index % preferenceChipColors.length]"
                        class="font-weight-medium"
                      >
                        <v-icon start size="10">mdi-check-circle</v-icon>
                        条件{{ match.index + 1 }}に適合
                      </v-chip>
                    </div>
                  </v-card-text>

                  <v-divider />
                  <v-card-actions class="px-4 py-3">
                    <span class="text-caption text-medium-emphasis">
                      <v-icon size="12" class="mr-1">mdi-account-group</v-icon>
                      問い合わせ {{ property.inquiryCount }}件
                    </span>
                    <v-spacer />
                    <v-btn variant="tonal" color="primary" size="small" rounded="lg" @click.stop="openDetail(property)">
                      詳細
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <!-- 空ステート -->
            <v-card v-else variant="outlined" rounded="xl" class="pa-8 text-center">
              <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-store-search</v-icon>
              <div class="text-body-1 text-medium-emphasis mb-2">条件に合う物件が見つかりませんでした</div>
              <v-btn variant="text" color="primary" @click="resetFilters">条件をリセット</v-btn>
            </v-card>
            </template>
          </div>
        </v-window-item>

        <!-- ========== お気に入り ========== -->
        <v-window-item value="favorites">
          <div class="pa-4 pa-md-6">
            <div class="d-flex align-center mb-5">
              <h3 class="text-h6 font-weight-bold">
                <v-icon start color="error" size="22">mdi-heart</v-icon>
                お気に入り物件
              </h3>
              <v-spacer />
              <v-chip size="small" variant="tonal" color="primary">{{ favoriteProperties.length }}件</v-chip>
            </div>

            <v-row v-if="favoriteProperties.length > 0" dense>
              <v-col
                v-for="property in favoriteProperties"
                :key="property.id"
                cols="12"
              >
                <v-card class="property-card-horizontal mb-3" rounded="xl" flat @click="openDetail(property)">
                  <div class="d-flex flex-column flex-sm-row">
                    <!-- 画像 -->
                    <div class="property-image-sm d-flex align-center justify-center flex-shrink-0" :style="{ background: property.gradient }">
                      <v-icon size="32" color="white" style="opacity: 0.2">mdi-silverware-fork-knife</v-icon>
                      <v-chip
                        v-if="property.status === 'closed'"
                        color="error"
                        size="x-small"
                        variant="flat"
                        class="status-badge-sm"
                      >
                        募集終了
                      </v-chip>
                    </div>
                    <!-- 情報 -->
                    <div class="flex-grow-1 pa-4">
                      <div class="d-flex align-center mb-1 ga-2 flex-wrap">
                        <h3 class="text-subtitle-1 font-weight-bold">{{ property.name }}</h3>
                        <v-chip v-if="getApprovalStatus(property.id) === 'approved'" color="success" size="x-small" variant="flat">
                          <v-icon start size="11">mdi-lock-open</v-icon>閲覧可能
                        </v-chip>
                        <v-chip v-else-if="getApprovalStatus(property.id) === 'pending'" color="warning" size="x-small" variant="flat">
                          <v-icon start size="11">mdi-clock-outline</v-icon>申請中
                        </v-chip>
                        <v-spacer />
                        <v-btn icon variant="text" size="small" @click.stop="toggleFavorite(property.id)">
                          <v-icon color="#b85450" size="20">mdi-heart</v-icon>
                        </v-btn>
                      </div>
                      <div v-if="getLocation(property)" class="text-body-2 text-medium-emphasis mb-2">
                        <v-icon size="14" class="mr-1">{{ property.isLimited ? 'mdi-map-marker-outline' : 'mdi-map-marker' }}</v-icon>
                        {{ getLocation(property) }}
                      </div>
                      <div class="d-flex align-center ga-3 mb-3 flex-wrap">
                        <span class="text-body-2">{{ property.tsubo }}坪</span>
                        <span class="text-subtitle-2 font-weight-bold text-primary">{{ formatRent(property.rent) }}/月</span>
                        <v-chip v-if="property.allowedBusinessTypes && property.allowedBusinessTypes[0]" size="x-small" variant="tonal" color="primary">{{ property.allowedBusinessTypes[0] }}</v-chip>
                      </div>
                      <!-- お気に入り専用情報 -->
                      <div class="d-flex ga-3 flex-wrap">
                        <v-chip
                          size="small"
                          :color="property.inquiryCount >= 5 ? 'warning' : 'info'"
                          variant="tonal"
                        >
                          <v-icon start size="14">mdi-account-group</v-icon>
                          {{ property.inquiryCount }}人が問い合わせ中
                        </v-chip>
                        <v-chip
                          v-if="property.status === 'closed'"
                          size="small"
                          color="error"
                          variant="tonal"
                        >
                          <v-icon start size="14">mdi-calendar-remove</v-icon>
                          {{ property.closedDate }} 終了
                        </v-chip>
                        <v-chip
                          v-if="property.isInquired"
                          size="small"
                          color="success"
                          variant="tonal"
                        >
                          <v-icon start size="14">mdi-check-circle</v-icon>
                          問い合わせ済み
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-card v-else variant="outlined" rounded="xl" class="pa-8 text-center">
              <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-heart-outline</v-icon>
              <div class="text-body-1 text-medium-emphasis mb-2">お気に入り物件がありません</div>
              <v-btn variant="text" color="primary" @click="activeTab = 'search'">物件を探す</v-btn>
            </v-card>
          </div>
        </v-window-item>

        <!-- ========== 問い合わせ済み ========== -->
        <v-window-item value="inquired">
          <div class="pa-4 pa-md-6">
            <div class="d-flex align-center mb-5">
              <h3 class="text-h6 font-weight-bold">
                <v-icon start color="warning" size="22">mdi-email-check</v-icon>
                問い合わせ済み物件
              </h3>
              <v-spacer />
              <v-chip size="small" variant="tonal" color="primary">{{ inquiredProperties.length }}件</v-chip>
            </div>

            <v-row v-if="inquiredProperties.length > 0" dense>
              <v-col
                v-for="property in inquiredProperties"
                :key="property.id"
                cols="12"
              >
                <v-card class="property-card-horizontal mb-3" rounded="xl" flat @click="openDetail(property)">
                  <div class="d-flex flex-column flex-sm-row">
                    <div class="property-image-sm d-flex align-center justify-center flex-shrink-0" :style="{ background: property.gradient }">
                      <v-icon size="32" color="white" style="opacity: 0.2">mdi-silverware-fork-knife</v-icon>
                    </div>
                    <div class="flex-grow-1 pa-4">
                      <div class="d-flex align-center mb-1 flex-wrap ga-2">
                        <h3 class="text-subtitle-1 font-weight-bold">{{ property.name }}</h3>
                        <v-chip v-if="getApprovalStatus(property.id) === 'approved'" color="success" size="x-small" variant="flat">
                          <v-icon start size="11">mdi-lock-open</v-icon>閲覧可能
                        </v-chip>
                        <v-chip v-else-if="getApprovalStatus(property.id) === 'pending'" color="warning" size="x-small" variant="flat">
                          <v-icon start size="11">mdi-clock-outline</v-icon>申請中
                        </v-chip>
                        <v-chip v-else-if="getApprovalStatus(property.id) === 'rejected'" color="error" size="x-small" variant="flat">
                          <v-icon start size="11">mdi-close-circle-outline</v-icon>却下
                        </v-chip>
                        <v-chip
                          v-if="property.documentStatus"
                          size="x-small"
                          :color="getDocumentStatusColor(property.documentStatus)"
                          variant="flat"
                          class="ml-1"
                        >
                          <v-icon start size="12">{{ getDocumentStatusIcon(property.documentStatus) }}</v-icon>
                          資料: {{ property.documentStatus }}
                        </v-chip>
                      </div>
                      <div class="text-body-2 text-medium-emphasis mb-2">
                        <template v-if="getLocation(property)">
                          <v-icon size="14" class="mr-1">{{ property.isLimited ? 'mdi-map-marker-outline' : 'mdi-map-marker' }}</v-icon>
                          {{ getLocation(property) }}
                          <span class="mx-2">|</span>
                        </template>
                        {{ property.tsubo }}坪
                        <span class="mx-2">|</span>
                        {{ formatRent(property.rent) }}/月
                      </div>
                      <div class="d-flex align-center ga-3 text-caption text-medium-emphasis">
                        <span>
                          <v-icon size="12" class="mr-1">mdi-calendar</v-icon>
                          問い合わせ日: {{ property.inquiryDate }}
                        </span>
                        <span v-if="property.status === 'closed'" class="text-error">
                          <v-icon size="12" class="mr-1" color="error">mdi-alert-circle</v-icon>
                          募集終了
                        </span>
                      </div>
                      <div v-if="property.documentStatus === '許可済'" class="mt-2">
                        <v-btn size="small" variant="tonal" color="success" rounded="lg" @click.stop="showSnackbar('資料を表示します（実装予定）', 'info')">
                          <v-icon start size="16">mdi-file-document</v-icon>
                          資料を見る
                        </v-btn>
                      </div>
                      <div v-else-if="property.documentStatus === '申請中'" class="mt-2">
                        <v-chip size="small" color="warning" variant="tonal">
                          <v-icon start size="14">mdi-clock-outline</v-icon>
                          本部確認中 - 許可が下りると資料を閲覧できます
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-card v-else variant="outlined" rounded="xl" class="pa-8 text-center">
              <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-email-outline</v-icon>
              <div class="text-body-1 text-medium-emphasis mb-2">問い合わせ済み物件はありません</div>
              <v-btn variant="text" color="primary" @click="activeTab = 'search'">物件を探す</v-btn>
            </v-card>
          </div>
        </v-window-item>

        <!-- ========== お知らせ ========== -->
        <v-window-item value="notices">
          <div class="pa-4 pa-md-6">
            <div class="d-flex align-center mb-5">
              <h3 class="text-h6 font-weight-bold">
                <v-icon start color="primary" size="22">mdi-bell</v-icon>
                お知らせ
              </h3>
              <v-spacer />
              <v-btn
                v-if="unreadCount > 0"
                variant="text"
                color="primary"
                size="small"
                @click="markAllAsRead"
              >
                すべて既読にする
              </v-btn>
            </div>

            <v-card rounded="xl" flat class="notice-list">
              <template v-for="(notice, i) in notifications" :key="notice.id">
                <v-list-item
                  :class="{ 'notice-unread': !notice.isRead, 'notice-hover-row': true }"
                  class="py-4 px-4"
                >
                  <template #prepend>
                    <v-avatar :color="notice.color" size="40" class="mr-3">
                      <v-icon color="white" size="20">{{ notice.icon }}</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium text-body-1 mb-1 d-flex align-center ga-2 flex-wrap">
                    {{ notice.title }}
                    <v-chip v-if="!notice.isRead" size="x-small" color="error" variant="flat">NEW</v-chip>
                    <v-btn
                      class="notice-toggle-btn"
                      variant="text"
                      size="x-small"
                      density="comfortable"
                      :prepend-icon="notice.isRead ? 'mdi-email-mark-as-unread' : 'mdi-check'"
                      @click="toggleNoticeRead(notice)"
                    >
                      {{ notice.isRead ? '未読に戻す' : '既読にする' }}
                    </v-btn>
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2 text-wrap notice-message-body" v-html="notice.messageHtml" />
                  <template #append>
                    <div class="d-flex align-center ga-3">
                      <v-btn
                        v-if="isNoticePropertyViewable(notice)"
                        variant="tonal"
                        color="primary"
                        size="small"
                        prepend-icon="mdi-home-search"
                        @click="onNoticeClick(notice)"
                      >
                        この物件を見る
                      </v-btn>
                      <span class="text-caption text-medium-emphasis text-no-wrap">{{ notice.date }}</span>
                    </div>
                  </template>
                </v-list-item>
                <v-divider v-if="i < notifications.length - 1" />
              </template>
            </v-card>
          </div>
        </v-window-item>

        <!-- ========== マイ情報 ========== -->
        <v-window-item value="profile">
          <div class="pa-4 pa-md-6">
            <MypageMyProfileTab
              :initial-patterns="userPreferencePatterns"
              @show-snackbar="(msg) => showSnackbar(msg)"
              @save-preferences="onSavePreferences"
            />
          </div>
        </v-window-item>
      </v-window>
    </v-card>

    <!-- ===== 物件詳細ダイアログ ===== -->
    <v-dialog v-model="showDetail" :max-width="780" :fullscreen="isMobile" scrollable>
      <v-card v-if="selectedProperty" rounded="xl" class="detail-card">
        <!-- ヘッダー画像 (装飾のみ・閉じるボタン操作のためぼかしなし) -->
        <div class="detail-image d-flex align-center justify-center" :style="{ background: selectedProperty.gradient }">
          <v-icon size="56" color="white" style="opacity: 0.15">mdi-silverware-fork-knife</v-icon>
          <v-btn
            icon
            variant="text"
            class="detail-close-btn"
            @click="showDetail = false"
          >
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
          <v-chip
            v-if="selectedProperty.status === 'closed'"
            color="error"
            size="small"
            variant="flat"
            class="detail-status-badge"
          >
            <v-icon start size="14">mdi-lock</v-icon>
            募集終了{{ selectedProperty.closedDate ? `（${selectedProperty.closedDate}）` : '' }}
          </v-chip>
        </div>

        <v-card-text class="pa-5 pa-md-6">
          <!-- 物件名 + お気に入りボタン (物件名は未承認時ぼかし) -->
          <div class="d-flex align-start justify-space-between mb-2">
            <h2 class="text-h5 font-weight-bold" :class="{ 'locked-blur': !canViewFullDetails(selectedProperty.id) }" style="flex: 1; min-width: 0;">{{ selectedProperty.name }}</h2>
            <v-btn
              icon
              variant="text"
              size="small"
              class="ml-2 flex-shrink-0"
              @click="toggleFavorite(selectedProperty.id)"
            >
              <v-icon :color="selectedProperty.isFavorite ? '#b85450' : 'grey'" size="26">
                {{ selectedProperty.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
              </v-icon>
            </v-btn>
          </div>
          <div class="text-body-1 text-medium-emphasis mb-4" :class="{ 'locked-blur': !canViewFullDetails(selectedProperty.id) }">
            <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
            {{ getLocation(selectedProperty) }}
          </div>

          <!-- 申請ステータスバナー (申請中 / 却下) -->
          <v-alert
            v-if="!canViewFullDetails(selectedProperty.id) && getApprovalStatus(selectedProperty.id) === 'pending'"
            type="info"
            variant="tonal"
            density="comfortable"
            class="mb-3"
            rounded="lg"
          >
            <template #prepend><v-icon>mdi-clock-outline</v-icon></template>
            詳細閲覧の申請を受け付けました。承認まで今しばらくお待ちください。
          </v-alert>
          <v-alert
            v-else-if="!canViewFullDetails(selectedProperty.id) && getApprovalStatus(selectedProperty.id) === 'rejected'"
            type="error"
            variant="tonal"
            density="comfortable"
            class="mb-3"
            rounded="lg"
          >
            <template #prepend><v-icon>mdi-close-circle</v-icon></template>
            前回の申請は承認されませんでした。再申請いただけます。
          </v-alert>

          <!-- Section: 物件PR (ぼかさず常時表示) -->
          <div v-if="selectedProperty.prText" class="detail-section">
            <div class="detail-section-header">
              <div class="section-accent mr-2"></div>
              <v-icon size="18" class="mr-2" color="primary">mdi-bullhorn</v-icon>
              物件PR
            </div>
            <v-card color="blue-lighten-5" rounded="lg" flat class="pa-4 mb-2">
              <div class="property-pr-body" v-html="renderMarkdown(selectedProperty.prText)" />
            </v-card>
          </div>

          <v-divider v-if="selectedProperty.prText" class="my-1" />

          <!-- Section: 物件概要 -->
          <div class="detail-section">
            <div class="detail-section-header">
              <div class="section-accent mr-2"></div>
              <v-icon size="18" class="mr-2" color="primary">mdi-home-city</v-icon>
              物件概要
            </div>
            <v-row dense>
              <v-col cols="4" class="d-none d-sm-block">
                <v-card color="grey-lighten-4" rounded="lg" flat class="pa-3 text-center">
                  <div class="text-caption text-medium-emphasis">坪数</div>
                  <div class="text-h5 font-weight-bold text-primary">{{ selectedProperty.tsubo }}<span class="text-body-2">坪</span></div>
                </v-card>
              </v-col>
              <v-col cols="4" class="d-none d-sm-block">
                <v-card color="grey-lighten-4" rounded="lg" flat class="pa-3 text-center">
                  <div class="text-caption text-medium-emphasis">月額賃料</div>
                  <div class="text-h5 font-weight-bold text-primary">{{ formatRent(selectedProperty.rent) }}</div>
                </v-card>
              </v-col>
              <v-col cols="4" class="d-none d-sm-block">
                <v-card color="grey-lighten-4" rounded="lg" flat class="pa-3 text-center">
                  <div class="text-caption text-medium-emphasis">入居時期</div>
                  <div class="text-h5 font-weight-bold text-primary">{{ selectedProperty.availableDate }}</div>
                </v-card>
              </v-col>
              <v-col cols="12" class="d-sm-none">
                <v-card color="grey-lighten-4" rounded="lg" flat class="pa-3">
                  <div class="d-flex justify-space-around text-center">
                    <div>
                      <div class="text-caption text-medium-emphasis">坪数</div>
                      <div class="text-subtitle-1 font-weight-bold text-primary">{{ selectedProperty.tsubo }}坪</div>
                    </div>
                    <v-divider vertical class="mx-2" />
                    <div>
                      <div class="text-caption text-medium-emphasis">賃料</div>
                      <div class="text-subtitle-1 font-weight-bold text-primary">{{ formatRent(selectedProperty.rent) }}</div>
                    </div>
                    <v-divider vertical class="mx-2" />
                    <div>
                      <div class="text-caption text-medium-emphasis">入居時期</div>
                      <div class="text-subtitle-2 font-weight-bold text-primary">{{ selectedProperty.availableDate }}</div>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-1" />

          <!-- Section: アクセス -->
          <div class="detail-section">
            <div class="detail-section-header">
              <div class="section-accent mr-2"></div>
              <v-icon size="18" class="mr-2" color="primary">mdi-train</v-icon>
              アクセス
            </div>
            <div v-for="(st, idx) in selectedProperty.nearestStations" :key="idx" class="mb-2">
              <v-card color="grey-lighten-5" rounded="lg" flat class="pa-3">
                <div class="d-flex align-center justify-space-between flex-wrap ga-2">
                  <div>
                    <div class="text-caption text-medium-emphasis">{{ st.railway }}</div>
                    <div class="text-body-1 font-weight-bold">{{ st.station }}駅</div>
                  </div>
                  <v-chip size="default" variant="flat" color="primary" :class="{ 'locked-blur': !canViewFullDetails(selectedProperty.id) }">
                    <v-icon start size="16">mdi-walk</v-icon>
                    {{ st.transportMethod }}{{ st.transportMinutes }}分
                  </v-chip>
                </div>
              </v-card>
            </div>
          </div>

          <v-divider class="my-1" />

          <!-- Section: 物件詳細 -->
          <div class="detail-section">
            <div class="detail-section-header">
              <div class="section-accent mr-2"></div>
              <v-icon size="18" class="mr-2" color="primary">mdi-text-box-outline</v-icon>
              物件詳細
            </div>
            <v-card color="grey-lighten-5" rounded="lg" flat class="pa-3 mb-3">
              <v-row dense>
                <v-col cols="4">
                  <div class="text-caption text-medium-emphasis">階数</div>
                  <div class="text-body-1 font-weight-bold">{{ selectedProperty.floorDisplay }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="text-caption text-medium-emphasis">室内状態</div>
                  <div class="text-body-1 font-weight-bold">{{ selectedProperty.interiorCondition }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="text-caption text-medium-emphasis">種別</div>
                  <div class="text-body-1 font-weight-bold" :class="{ 'locked-blur': !canViewFullDetails(selectedProperty.id) }">{{ selectedProperty.propertyType }}</div>
                </v-col>
              </v-row>
            </v-card>
            <v-card color="grey-lighten-5" rounded="lg" flat class="pa-3 mb-3" :class="{ 'locked-blur': !canViewFullDetails(selectedProperty.id) }">
              <v-row dense>
                <v-col cols="4">
                  <div class="text-caption text-medium-emphasis">構造</div>
                  <div class="text-body-1 font-weight-bold">{{ selectedProperty.structure }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="text-caption text-medium-emphasis">築年</div>
                  <div class="text-body-1 font-weight-bold">{{ selectedProperty.builtYear }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="text-caption text-medium-emphasis">契約期間</div>
                  <div class="text-body-1 font-weight-bold">{{ selectedProperty.contractPeriod }}</div>
                </v-col>
              </v-row>
            </v-card>
            <v-row dense>
              <v-col cols="6">
                <div class="detail-info-item">
                  <v-icon size="14" class="mr-1" color="grey">mdi-account-group</v-icon>
                  <span class="text-caption text-medium-emphasis">問い合わせ</span>
                  <span class="text-body-2 font-weight-bold ml-1">
                    {{ selectedProperty.inquiryCount }}件
                    <v-icon v-if="selectedProperty.inquiryCount >= 5" size="14" color="warning">mdi-fire</v-icon>
                  </span>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="detail-info-item">
                  <v-icon size="14" class="mr-1" color="grey">mdi-calendar</v-icon>
                  <span class="text-caption text-medium-emphasis">登録日</span>
                  <span class="text-body-2 font-weight-bold ml-1">{{ selectedProperty.createdAt }}</span>
                </div>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-1" />

          <!-- Section: 可能業態 -->
          <div class="detail-section">
            <div class="detail-section-header">
              <div class="section-accent mr-2"></div>
              <v-icon size="18" class="mr-2" color="primary">mdi-store</v-icon>
              可能業態
            </div>
            <div class="d-flex flex-wrap ga-2" :class="{ 'locked-blur': !canViewFullDetails(selectedProperty.id) }">
              <v-chip
                v-for="biz in selectedProperty.allowedBusinessTypes"
                :key="biz"
                size="small"
                variant="tonal"
                color="primary"
              >
                {{ biz }}
              </v-chip>
            </div>
          </div>

          <v-divider class="my-1" />

          <!-- Section: 設備・特殊条件 -->
          <div class="detail-section">
            <div class="detail-section-header">
              <div class="section-accent mr-2"></div>
              <v-icon size="18" class="mr-2" color="primary">mdi-toolbox-outline</v-icon>
              設備・特殊条件
            </div>
            <div class="d-flex flex-wrap ga-2" :class="{ 'locked-blur': !canViewFullDetails(selectedProperty.id) }">
              <v-chip
                v-for="cond in selectedProperty.specialConditions"
                :key="cond"
                size="small"
                variant="tonal"
                color="primary"
              >
                <v-icon start size="14">mdi-check-circle</v-icon>
                {{ cond }}
              </v-chip>
            </div>
          </div>

          <v-divider class="my-1" />

          <!-- Section: 費用詳細 -->
          <div class="detail-section">
            <div class="detail-section-header">
              <div class="section-accent mr-2"></div>
              <v-icon size="18" class="mr-2" color="primary">mdi-currency-jpy</v-icon>
              費用詳細
            </div>
            <v-card color="grey-lighten-5" rounded="lg" flat class="pa-3">
              <v-row dense>
                <v-col cols="6" sm="4" class="mb-2">
                  <div class="text-caption text-medium-emphasis">管理費/共益費</div>
                  <div class="text-body-2 font-weight-bold">{{ selectedProperty.managementFee ? formatRent(selectedProperty.managementFee) : 'なし' }}</div>
                </v-col>
                <v-col cols="6" sm="4" class="mb-2">
                  <div class="text-caption text-medium-emphasis">保証金/敷金</div>
                  <div class="text-body-2 font-weight-bold">{{ selectedProperty.deposit ? formatRent(selectedProperty.deposit) : 'なし' }}</div>
                  <div v-if="selectedProperty.depositDetail" class="text-caption text-medium-emphasis">{{ selectedProperty.depositDetail }}</div>
                </v-col>
                <v-col cols="6" sm="4" class="mb-2" :class="{ 'locked-blur': !canViewFullDetails(selectedProperty.id) }">
                  <div class="text-caption text-medium-emphasis">解約引/敷引</div>
                  <div class="text-body-2 font-weight-bold">{{ selectedProperty.penalty ? formatRent(selectedProperty.penalty) : 'なし' }}</div>
                  <div v-if="selectedProperty.penaltyDetail" class="text-caption text-medium-emphasis">{{ selectedProperty.penaltyDetail }}</div>
                </v-col>
                <v-col cols="6" sm="4" class="mb-2">
                  <div class="text-caption text-medium-emphasis">礼金</div>
                  <div class="text-body-2 font-weight-bold">{{ selectedProperty.keyMoney ? formatRent(selectedProperty.keyMoney) : 'なし' }}</div>
                  <div v-if="selectedProperty.keyMoneyDetail" class="text-caption text-medium-emphasis">{{ selectedProperty.keyMoneyDetail }}</div>
                </v-col>
                <v-col cols="6" sm="4" class="mb-2" :class="{ 'locked-blur': !canViewFullDetails(selectedProperty.id) }">
                  <div class="text-caption text-medium-emphasis">仲介手数料</div>
                  <div class="text-body-2 font-weight-bold">{{ selectedProperty.brokerageFee ? formatRent(selectedProperty.brokerageFee) : 'なし' }}</div>
                  <div v-if="selectedProperty.brokerageDetail" class="text-caption text-medium-emphasis">{{ selectedProperty.brokerageDetail }}</div>
                </v-col>
              </v-row>
            </v-card>
          </div>

          <!-- Section: 造作譲渡 -->
          <div v-if="selectedProperty.transferDisplay" class="detail-section">
            <v-divider class="my-1" />
            <div class="detail-section-header mt-4">
              <div class="section-accent mr-2"></div>
              <v-icon size="18" class="mr-2" color="primary">mdi-hand-coin</v-icon>
              造作譲渡
            </div>
            <v-card color="grey-lighten-5" rounded="lg" flat class="pa-3">
              <v-row dense>
                <v-col cols="4">
                  <div class="text-caption text-medium-emphasis">造作譲渡</div>
                  <div class="text-body-2 font-weight-bold">{{ selectedProperty.transferDisplay }}</div>
                </v-col>
                <v-col v-if="selectedProperty.transferAskedPrice" cols="4" :class="{ 'locked-blur': !canViewFullDetails(selectedProperty.id) }">
                  <div class="text-caption text-medium-emphasis">依頼額</div>
                  <div class="text-body-2 font-weight-bold">{{ selectedProperty.transferAskedPrice }}万円</div>
                </v-col>
                <v-col v-if="selectedProperty.transferListPrice" cols="4" :class="{ 'locked-blur': !canViewFullDetails(selectedProperty.id) }">
                  <div class="text-caption text-medium-emphasis">募集額</div>
                  <div class="text-body-2 font-weight-bold">{{ selectedProperty.transferListPrice }}万円</div>
                </v-col>
              </v-row>
            </v-card>
          </div>

          <!-- 未承認時の有料記事風 CTA (v-card-text内に配置してスクロール可能に) -->
          <div v-if="!canViewFullDetails(selectedProperty.id) && selectedProperty.status !== 'closed'" class="paywall-cta">
            <div class="paywall-overlay"></div>
            <div class="paywall-content">
              <v-icon size="32" color="primary" class="mb-2">mdi-lock-open-outline</v-icon>
              <div class="text-h6 font-weight-bold mb-1">物件詳細を知りたい方はこちら</div>
              <div class="text-body-2 text-medium-emphasis">
                物件名・住所・徒歩時間など詳細情報は申請後にご覧いただけます
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4">
          <v-btn
            v-if="selectedProperty.status === 'closed'"
            variant="outlined"
            color="grey"
            rounded="lg"
            block
            size="large"
            disabled
          >
            募集終了
          </v-btn>
          <v-btn
            v-else-if="canViewFullDetails(selectedProperty.id)"
            variant="outlined"
            color="success"
            rounded="lg"
            block
            size="large"
            disabled
          >
            <v-icon start>mdi-check-circle</v-icon>
            閲覧承認済み
          </v-btn>
          <v-btn
            v-else-if="getApprovalStatus(selectedProperty.id) === 'pending'"
            variant="outlined"
            color="info"
            rounded="lg"
            block
            size="large"
            disabled
          >
            <v-icon start>mdi-clock-outline</v-icon>
            申請中
          </v-btn>
          <v-btn
            v-else
            color="primary"
            rounded="lg"
            block
            size="large"
            @click="openInquiryDialog(selectedProperty)"
          >
            <v-icon start>mdi-email-fast</v-icon>
            {{ getApprovalStatus(selectedProperty.id) === 'rejected' ? '再申請する' : '詳細を申請する' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ===== 問い合わせダイアログ（詳細閲覧申請） ===== -->
    <v-dialog v-model="showInquiry" max-width="520" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-4">
          <div class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-email-fast</v-icon>
            物件詳細閲覧の申請
          </div>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <div class="text-body-2 text-medium-emphasis mb-3">
            ご希望内容を選んで送信してください。承認後、すべての項目をご覧いただけます。
          </div>

          <div class="text-subtitle-2 mb-2 font-weight-bold">ご希望（複数選択可）</div>
          <v-checkbox
            v-for="opt in requestTypeOptions"
            :key="opt.value"
            v-model="requestTypes"
            :value="opt.value"
            :label="opt.label"
            density="compact"
            hide-details
            class="mb-1"
          />

          <v-textarea
            v-model="inquiryMessage"
            label="お問い合わせ内容（任意）"
            variant="outlined"
            rounded="lg"
            rows="3"
            placeholder="ご質問やご要望があればご記入ください"
            class="mt-4"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-btn variant="text" rounded="lg" @click="showInquiry = false">キャンセル</v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            rounded="lg"
            :loading="inquirySubmitting"
            @click="handleSubmitInquiry"
          >
            <v-icon start>mdi-send</v-icon>
            送信
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ===== スナックバー ===== -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" rounded="lg" location="bottom" timeout="2000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { useMiyakoProperties } from '~/composables/useMiyakoProperties'
import { useClientAuth } from '~/composables/useClientAuth'

// SSR無効化: Supabase認証ベースで完全クライアント駆動のため。
// Vuetify自動採番IDのhydration mismatch警告も解消される。
definePageMeta({
  ssr: false,
})

useHead({
  title: 'マイページ - みやこ不動産企画',
  meta: [
    { name: 'description', content: '出店希望者マイページ - 物件検索・お気に入り・問い合わせ管理' }
  ]
})

const { smAndDown: isMobile } = useDisplay()
const route = useRoute()
const router = useRouter()
const { fetchPropertiesForMypage, loading: propertiesLoading, error: propertiesError } = useMiyakoProperties()
const { clientProfile, userName, signOut, saveStorePreferences } = useClientAuth()

// お気に入り・問い合わせ・お知らせ
import { useClientFavorites } from '~/composables/useClientFavorites'
import { useClientInquiries } from '~/composables/useClientInquiries'
import { useClientNotices } from '~/composables/useClientNotices'
const {
  isFavorite: isFavoriteProperty,
  fetchFavorites,
  toggleFavorite: toggleFavoriteDb,
  favoritePropertyIds,
} = useClientFavorites()
const {
  isInquired: isInquiredProperty,
  getInquiry,
  getApprovalStatus,
  canViewFullDetails,
  fetchInquiries,
  submitInquiry,
  inquiries,
} = useClientInquiries()
const {
  notices: dbNotices,
  unreadCount: dbUnreadCount,
  isRead: isNoticeRead,
  getNoticeColor,
  fetchNotices,
  markAsRead: markNoticeAsRead,
  markAsUnread: markNoticeAsUnread,
  markAllAsRead: markAllNoticesAsRead,
} = useClientNotices()

// ─── ログアウト処理 ───
const handleLogout = async () => {
  await signOut()
  router.push('/login')
}

// ─── タブ設定 ───
const VALID_TABS = ['search', 'favorites', 'inquired', 'notices', 'profile']
const initialTab = VALID_TABS.includes(route.query.tab) ? route.query.tab : 'search'
const activeTab = ref(initialTab)
// タブ切替時にURLクエリに反映 → リロード・共有時も同じタブで復元される
watch(activeTab, (newTab) => {
  if (route.query.tab === newTab) return
  router.replace({ query: { ...route.query, tab: newTab } })
})
const tabs = computed(() => [
  { key: 'search', title: '物件を探す', icon: 'mdi-store-search', badge: null },
  { key: 'favorites', title: 'お気に入り', icon: 'mdi-heart', badge: null },
  { key: 'inquired', title: '問い合わせ済', icon: 'mdi-email-check', badge: null },
  { key: 'notices', title: 'お知らせ', icon: 'mdi-bell', badge: unreadCount.value || null },
  { key: 'profile', title: 'マイ情報', icon: 'mdi-account-cog', badge: null },
])

// ─── ロケーション表示ヘルパー ───
// 未承認時は publicAddress (DB生成済み公開レベル適用済みの文字列)を使う
// 承認済みは prefecture+city+town+chome (フル) を使う
const getLocation = (p) => {
  if (p.isLimited) return p.publicAddress || ''
  return `${p.prefecture || ''}${p.city || ''}${p.town || ''}${p.chome || ''}`
}

// ─── 物件データ ───
const allProperties = ref([])

// ─── グラデーションパレット（物件カードの背景色） ───
const gradientPalette = [
  'linear-gradient(135deg, #5a6e7f 0%, #8fa3b3 100%)',
  'linear-gradient(135deg, #8d7b68 0%, #b8a99a 100%)',
  'linear-gradient(135deg, #6b705c 0%, #a5a58d 100%)',
  'linear-gradient(135deg, #7f8c8d 0%, #b2bec3 100%)',
  'linear-gradient(135deg, #3d405b 0%, #6c6f8a 100%)',
  'linear-gradient(135deg, #6d4c41 0%, #8d6e63 100%)',
  'linear-gradient(135deg, #4a6741 0%, #7d9f71 100%)',
  'linear-gradient(135deg, #9e8c7a 0%, #c4b7a6 100%)',
]

// ─── DB → フロント形式マッピング ───
const parseFloorDisplay = (floor) => {
  if (!floor) return { display: '', search: '' }
  const f = floor.trim()
  // B1, B2 など地下表記
  if (/^B?\d/i.test(f) || f.includes('地下')) {
    const num = f.replace(/[^0-9]/g, '') || '1'
    return { display: `B${num}F`, search: `地下${num}階` }
  }
  // 通常階
  const num = f.replace(/[^0-9]/g, '') || '1'
  return { display: `${num}F`, search: `${num}階` }
}

const parseNearestStations = (stationStr, minutes, accessInfo) => {
  // nearest_station が文字列1つなので、簡易的に配列に変換
  if (!stationStr) {
    return [{ railway: '', station: '未設定', transportMethod: '徒歩', transportMinutes: 0 }]
  }
  // access_info に複数駅の情報がJSON等で入っている場合を考慮
  if (accessInfo) {
    try {
      const parsed = JSON.parse(accessInfo)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(s => ({
          railway: s.railway || '',
          station: s.station || stationStr,
          transportMethod: s.transportMethod || '徒歩',
          transportMinutes: s.transportMinutes ?? minutes ?? 0,
        }))
      }
    } catch {
      // JSON でなければそのまま
    }
  }
  return [{ railway: '', station: stationStr, transportMethod: '徒歩', transportMinutes: minutes || 0 }]
}

const mapDbPropertyToDisplay = (dbProp, index) => {
  const limited = !!dbProp._isLimited
  const floorInfo = parseFloorDisplay(dbProp.floor)
  // 未承認時は徒歩時間を0扱い(UIで非表示)、承認済みは実際の分数
  const stations = parseNearestStations(
    dbProp.nearest_station,
    limited ? 0 : dbProp.station_distance_minutes,
    limited ? null : dbProp.access_info,
  )
  const rent = dbProp.rent || 0
  const depositAmt = dbProp.deposit_amount || 0
  const keyMoneyAmt = dbProp.key_money_amount || 0
  const handoverAmt = dbProp.handover_amount || 0

  // 一覧タイトル: 承認前後とも「最寄り駅エリア + 階」で統一表示
  const stationName = dbProp.nearest_station || ''
  const areaTitle = stationName
    ? `${stationName}エリア ${floorInfo.display || ''}`.trim()
    : `物件 #${(dbProp.id || '').slice(0, 4)}`

  return {
    id: dbProp.id,
    isLimited: limited,
    name: areaTitle,
    floorDisplay: floorInfo.display,
    floorSearch: floorInfo.search,
    roomNumber: dbProp.room_number || '',
    // publicAddress: 未承認時に表示する住所(DB生成済み)
    publicAddress: dbProp.public_address || '',
    addressPublicLevel: dbProp.address_public_level || 'city',
    // prefecture/city/town/chomeは承認済み物件でのみ存在(未承認時はundefined)
    prefecture: dbProp.prefecture || '',
    city: dbProp.city || '',
    town: dbProp.address_town || dbProp.address || '',
    chome: dbProp.address_chome ? `${dbProp.address_chome}丁目` : '',
    banchi: dbProp.address_banchi || '',
    go: '',
    tsubo: dbProp.floor_space_tsubo || 0,
    sqm: dbProp.floor_space_sqm || 0,
    builtYear: dbProp.built_year ? `${dbProp.built_year}年` : '',
    floorsAbove: parseInt(dbProp.total_floors) || 0,
    floorsBelow: 0,
    structure: dbProp.structure || '',
    propertyType: dbProp.property_type || '',
    contractPeriod: dbProp.contract_period || '',
    nearestStations: stations,
    currentStatus: dbProp.master_status || '',
    interiorCondition: dbProp.skeleton_or_furnished || dbProp.handover_condition || '',
    shopName: dbProp.previous_usage || dbProp.shop_name || '',
    availableDate: dbProp.move_in_timing || '-',
    photos: [],
    floorPlan: null,
    prText: dbProp.pr_text || '',
    allowedBusinessTypes: dbProp.allowed_business_types || (dbProp.business_type ? [dbProp.business_type] : []),
    specialConditions: [
      ...(dbProp.new_conditions ? [dbProp.new_conditions] : []),
      ...(Array.isArray(dbProp.property_strengths) ? dbProp.property_strengths : []),
    ].filter(Boolean),
    transferDisplay: (dbProp.handover_condition === 'あり（要協議）' || handoverAmt > 0)
      ? 'あり' : (dbProp.handover_condition || 'なし'),
    transferAskedPrice: handoverAmt > 0 ? Math.round(handoverAmt / 10000) : null,
    transferListPrice: dbProp.valuation_amount ? Math.round(dbProp.valuation_amount / 10000) : null,
    rent: rent,
    managementFee: dbProp.management_fee || 0,
    deposit: depositAmt,
    depositDetail: dbProp.deposit || '',
    penalty: 0,
    penaltyDetail: '',
    keyMoney: keyMoneyAmt,
    keyMoneyDetail: dbProp.key_money || '',
    brokerageFee: 0,
    brokerageDetail: '',
    remarks: '',
    searchMemo: '',
    status: dbProp.master_status === '成約' ? 'closed' : 'active',
    isFavorite: false,
    isInquired: false,
    inquiryCount: 0,
    inquiryDate: null,
    inquiryStatus: null,
    closedDate: null,
    documentStatus: null,
    createdAt: dbProp.created_at ? dbProp.created_at.split('T')[0] : '',
    gradient: gradientPalette[index % gradientPalette.length],
  }
}

// ─── DB から物件データ + お気に入り + 問い合わせ取得 ───
onMounted(async () => {
  // 並行取得 (物件取得時に承認済みID突合するため user.id を渡す)
  const [data] = await Promise.all([
    fetchPropertiesForMypage({ userId: clientProfile.value?.id }),
    fetchFavorites(),
    fetchInquiries(),
    fetchNotices(),
  ])
  if (data && data.length > 0) {
    allProperties.value = data.map((p, i) => {
      const mapped = mapDbPropertyToDisplay(p, i)
      // DB のお気に入り・問い合わせ状態を反映
      mapped.isFavorite = isFavoriteProperty(p.id)
      mapped.isInquired = isInquiredProperty(p.id)
      const inquiry = getInquiry(p.id)
      if (inquiry) {
        mapped.inquiryDate = inquiry.created_at.split('T')[0]
        mapped.inquiryStatus = inquiry.status
      }
      return mapped
    })
  }
})

// ─── Markdown レンダラ（marked + 最小サニタイズ） ───
import { marked } from 'marked'
marked.setOptions({ breaks: true, gfm: true })
const renderMarkdown = (src) => {
  const raw = marked.parse(src || '')
  // <script>除去のみの最小サニタイズ（Vuetify環境想定）
  return String(raw).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
}

// ─── お知らせ（DBから取得したデータをnotifications形式に変換） ───
const notifications = computed(() =>
  dbNotices.value.map(n => ({
    id: n.id,
    title: n.title,
    message: n.message,
    messageHtml: renderMarkdown(n.message),
    date: (n.published_at || n.created_at || '').split('T')[0],
    isRead: isNoticeRead(n.id),
    color: getNoticeColor(n.notice_type),
    icon: n.icon || 'mdi-bell',
    targetPropertyId: n.target_property_id || null,
  }))
)

// ─── プロフィール（DBから取得したclientProfileを使用） ───
const profile = computed(() => ({
  name: clientProfile.value?.name || '',
  email: clientProfile.value?.email || '',
  phone: clientProfile.value?.phone || '',
}))


// ─── 出店希望条件（DBから読み込み） ───
const userPreferencePatterns = ref([])

// clientProfileが読み込まれたらstore_preferencesを反映
watchEffect(() => {
  if (clientProfile.value?.store_preferences?.length) {
    userPreferencePatterns.value = JSON.parse(JSON.stringify(clientProfile.value.store_preferences))
  }
})

const activePreferenceFilter = ref(null)
const preferenceChipColors = ['teal', 'deep-purple', 'amber-darken-2', 'pink']

const getMatchingPatterns = (property) => {
  const matches = []
  userPreferencePatterns.value.forEach((pattern, idx) => {
    if (isPropertyMatchingPattern(property, pattern)) {
      matches.push({ id: pattern.id, index: idx, name: pattern.patternName })
    }
  })
  return matches
}

const isPropertyMatchingPattern = (property, pattern) => {
  // 都道府県チェック
  if (pattern.prefectures?.length > 0) {
    if (!pattern.prefectures.includes(property.prefecture)) return false
  }

  // 市区チェック（部分一致: パターン側「中央区・北区」→ 物件の city に含まれるか）
  if (pattern.cities) {
    const targetCities = pattern.cities.split(/[・、,]/).map(c => c.trim()).filter(Boolean)
    const cityMatch = targetCities.some(c => property.city.includes(c))
    if (!cityMatch) return false
  }

  // 賃料範囲チェック
  if (pattern.rentMin && property.rent < pattern.rentMin) return false
  if (pattern.rentMax && property.rent > pattern.rentMax) return false

  // 坪数範囲チェック
  if (pattern.tsuboMin && property.tsubo < pattern.tsuboMin) return false
  if (pattern.tsuboMax && property.tsubo > pattern.tsuboMax) return false

  // 上記の主要条件（エリア・賃料・面積）が全て通ればマッチとする
  return true
}

const applyPreferenceFilter = (patternId) => {
  const pattern = userPreferencePatterns.value.find(p => p.id === patternId)
  if (!pattern) return

  resetFilters()
  activePreferenceFilter.value = patternId

  // 主要条件のみフィルタにセット（緩めに絞り込み）
  if (pattern.prefectures?.length > 0) {
    filterPrefecture.value = pattern.prefectures[0]
  }
  if (pattern.rentMin) filterRentMin.value = pattern.rentMin / 10000
  if (pattern.rentMax) filterRentMax.value = pattern.rentMax / 10000
  if (pattern.tsuboMin) filterSizeMin.value = pattern.tsuboMin
  if (pattern.tsuboMax) filterSizeMax.value = pattern.tsuboMax
}

const clearPreferenceFilter = () => {
  activePreferenceFilter.value = null
  resetFilters()
}

const onSavePreferences = async (patterns) => {
  const success = await saveStorePreferences(patterns)
  if (success) {
    userPreferencePatterns.value = patterns
    activePreferenceFilter.value = null
  } else {
    showSnackbar('保存に失敗しました', 'error')
  }
}

// ─── 検索・フィルタ ───
const searchText = ref('')
const showDetailFilter = ref(false)
const filterPrefecture = ref(null)
const filterArea = ref(null)
const filterRentMin = ref(null)
const filterRentMax = ref(null)
const filterSizeMin = ref(null)
const filterSizeMax = ref(null)
const filterBusiness = ref(null)
const filterRailway = ref(null)
const filterStation = ref('')
const filterWalkMinutes = ref(null)
const filterInterior = ref(null)
const approvalFilter = ref('all') // all / approved / pending
const filterFloor = ref(null)
const filterLocation = ref(null)
const filterSpecial = ref(null)
const filterEquipment = ref(null)
const sortBy = ref('newest')


const sortOptions = [
  { title: '新着順', value: 'newest' },
  { title: '賃料が安い順', value: 'rent_asc' },
  { title: '賃料が高い順', value: 'rent_desc' },
  { title: '面積が広い順', value: 'area_desc' },
]

const prefectureOptions = ['大阪府', '京都府', '兵庫県', '奈良県', '滋賀県', '和歌山県', '三重県']

const areaOptionsMap = {
  '大阪府': ['大阪市中央区', '大阪市北区', '大阪市浪速区', '大阪市都島区', '大阪市天王寺区', '大阪市西区', '大阪市生野区', '大阪市福島区', '大阪市城東区', '大阪市東成区', '大阪市阿倍野区', '大阪市住吉区', '大阪市東住吉区', '大阪市平野区', '大阪市此花区', '大阪市港区', '大阪市大正区', '大阪市西成区', '大阪市住之江区', '大阪市鶴見区', '大阪市旭区', '大阪市淀川区', '大阪市東淀川区', '大阪市西淀川区'],
  '京都府': ['京都市中京区', '京都市下京区', '京都市東山区', '京都市左京区', '京都市右京区', '京都市上京区'],
  '兵庫県': ['神戸市中央区', '神戸市兵庫区', '神戸市長田区', '西宮市', '尼崎市', '芦屋市'],
  '奈良県': ['奈良市', '橿原市', '生駒市'],
  '滋賀県': ['大津市', '草津市'],
  '和歌山県': ['和歌山市'],
  '三重県': ['津市', '四日市市'],
}

const filteredAreaOptions = computed(() => {
  if (!filterPrefecture.value) return []
  return areaOptionsMap[filterPrefecture.value] || []
})

const businessOptions = ['カフェ', 'イタリアン', '居酒屋', 'ラーメン', 'バー', '焼肉', '和食', 'テイクアウト', 'フレンチ', '焼鳥', 'うどん', 'そば']

const railwayFilterOptions = [
  'OsakaMetro御堂筋線', 'OsakaMetro谷町線', 'OsakaMetro四つ橋線', 'OsakaMetro中央線',
  'OsakaMetro堺筋線', 'OsakaMetro千日前線', 'OsakaMetro長堀鶴見緑地線',
  'ＪＲ大阪環状線', 'ＪＲ東海道本線', '近鉄大阪線', '近鉄奈良線',
  '阪急京都本線', '阪急神戸本線', '阪神本線', '南海本線', '京阪本線',
]

const interiorConditionFilterOptions = ['居抜き（無償）', '居抜き（有償）', 'スケルトン']

const floorFilterOptions = ['1階', '2階', '地下1階', '地下']

const locationFilterOptions = ['路面店', 'ビルイン', '角地', '駅前', '駅ビル', '商業施設', '繁華街', 'ビジネス街', '住宅街', '学生街', '商店街', 'ロードサイド']

const specialFilterOptions = [
  '重飲食可（炭火）', '重飲食可（炭火以外）', '軽飲食まで可',
  '深夜営業可', 'カラオケ可', '演奏可', 'ペット可',
]

const equipmentFilterOptions = ['換気扇有', 'ダクト有', '内階段有', 'ダムウェーター有', 'グリストラップ有', '高天井', '重機付き', '高級店']


// ─── 詳細ダイアログ ───
const showDetail = ref(false)
const selectedProperty = ref(null)

// ─── 問い合わせダイアログ ───
const showInquiry = ref(false)
const inquiryTarget = ref(null)
const inquiryMessage = ref('')
const requestTypes = ref([])
const inquirySubmitting = ref(false)

const requestTypeOptions = [
  { value: 'document',     label: '資料だけ欲しい' },
  { value: 'consultation', label: '担当者に話を聞きたい' },
  { value: 'viewing',      label: '内見・現地確認がしたい' },
  { value: 'contract',     label: '契約に向けて進めたい' },
]

const openInquiryDialog = (property) => {
  inquiryTarget.value = property
  inquiryMessage.value = ''
  // 既存の申請があれば、その選択肢を初期値に
  const existing = getInquiry(property.id)
  requestTypes.value = existing?.request_types ? [...existing.request_types] : []
  if (existing?.message) inquiryMessage.value = existing.message
  showInquiry.value = true
}

const handleSubmitInquiry = async () => {
  if (!inquiryTarget.value) return
  if (requestTypes.value.length === 0) {
    showSnackbar('ご希望を1つ以上選択してください', 'warning')
    return
  }
  inquirySubmitting.value = true

  const success = await submitInquiry({
    propertyId: inquiryTarget.value.id,
    message: inquiryMessage.value || undefined,
    requestTypes: requestTypes.value,
  })

  inquirySubmitting.value = false

  if (success) {
    showInquiry.value = false
    showSnackbar('閲覧申請を送信しました。承認をお待ちください')
  } else {
    showSnackbar('申請の送信に失敗しました', 'error')
  }
}

// ─── スナックバー ───
const snackbar = ref({ show: false, message: '', color: 'success' })

// ─── Computed ───
const unreadCount = dbUnreadCount

const activeFilterCount = computed(() => {
  let count = 0
  if (filterPrefecture.value) count++
  if (filterArea.value) count++
  if (filterRentMin.value) count++
  if (filterRentMax.value) count++
  if (filterSizeMin.value) count++
  if (filterSizeMax.value) count++
  if (filterBusiness.value) count++
  if (filterRailway.value) count++
  if (filterStation.value) count++
  if (filterWalkMinutes.value) count++
  if (filterInterior.value) count++
  if (filterFloor.value) count++
  if (filterLocation.value) count++
  if (filterSpecial.value) count++
  if (filterEquipment.value) count++
  return count
})

const filteredProperties = computed(() => {
  let result = [...allProperties.value]

  if (searchText.value) {
    const q = searchText.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      getLocation(p).toLowerCase().includes(q) ||
      p.nearestStations.some(s => s.station.toLowerCase().includes(q)) ||
      p.shopName?.toLowerCase().includes(q)
    )
  }

  if (filterPrefecture.value) {
    result = result.filter(p => p.prefecture === filterPrefecture.value)
  }
  if (filterArea.value) {
    result = result.filter(p => p.city === filterArea.value)
  }

  if (filterRentMin.value) {
    result = result.filter(p => p.rent >= filterRentMin.value * 10000)
  }
  if (filterRentMax.value) {
    result = result.filter(p => p.rent <= filterRentMax.value * 10000)
  }

  if (filterSizeMin.value) {
    result = result.filter(p => p.tsubo >= filterSizeMin.value)
  }
  if (filterSizeMax.value) {
    result = result.filter(p => p.tsubo <= filterSizeMax.value)
  }

  if (filterBusiness.value) {
    result = result.filter(p => p.allowedBusinessTypes && p.allowedBusinessTypes.includes(filterBusiness.value))
  }

  if (filterRailway.value) {
    result = result.filter(p => p.nearestStations.some(s => s.railway === filterRailway.value))
  }
  if (filterStation.value) {
    const q = filterStation.value.toLowerCase()
    result = result.filter(p => p.nearestStations.some(s => s.station.toLowerCase().includes(q)))
  }
  if (filterWalkMinutes.value) {
    result = result.filter(p => p.nearestStations.some(s => s.transportMinutes <= filterWalkMinutes.value))
  }
  if (filterInterior.value) {
    result = result.filter(p => p.interiorCondition === filterInterior.value)
  }
  if (filterFloor.value) {
    result = result.filter(p => p.floorSearch && p.floorSearch.includes(filterFloor.value))
  }
  if (filterLocation.value) {
    result = result.filter(p => p.specialConditions && p.specialConditions.includes(filterLocation.value))
  }
  if (filterSpecial.value) {
    result = result.filter(p => p.specialConditions && p.specialConditions.includes(filterSpecial.value))
  }
  if (filterEquipment.value) {
    result = result.filter(p => p.specialConditions && p.specialConditions.includes(filterEquipment.value))
  }

  // 承認状態フィルタ
  if (approvalFilter.value === 'approved') {
    result = result.filter(p => getApprovalStatus(p.id) === 'approved')
  } else if (approvalFilter.value === 'pending') {
    result = result.filter(p => getApprovalStatus(p.id) === 'pending')
  }

  switch (sortBy.value) {
    case 'rent_asc': result.sort((a, b) => a.rent - b.rent); break
    case 'rent_desc': result.sort((a, b) => b.rent - a.rent); break
    case 'area_desc': result.sort((a, b) => b.tsubo - a.tsubo); break
    default: result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  }

  return result
})

const favoriteProperties = computed(() => allProperties.value.filter(p => p.isFavorite))
const inquiredProperties = computed(() => allProperties.value.filter(p => p.isInquired))

const stats = computed(() => [
  {
    label: '水面下物件',
    value: allProperties.value.filter(p => p.status === 'active').length,
    icon: 'mdi-store',
    color: '#1e50a2',
    bg: '#e8f0fe',
    tab: 'search',
  },
  {
    label: 'お気に入り',
    value: favoriteProperties.value.length,
    icon: 'mdi-heart',
    color: '#8b6f5e',
    bg: '#f5f1ee',
    tab: 'favorites',
  },
  {
    label: '問い合わせ済',
    value: inquiredProperties.value.length,
    icon: 'mdi-email-check',
    color: '#6b7b8d',
    bg: '#eef1f4',
    tab: 'inquired',
  },
  {
    label: '未読お知らせ',
    value: unreadCount.value,
    icon: 'mdi-bell-ring',
    color: '#9b6b5e',
    bg: '#f5efec',
    tab: 'notices',
  },
  {
    label: 'マイ情報',
    value: '',
    icon: 'mdi-account-cog',
    color: '#5c6b7a',
    bg: '#edf0f3',
    tab: 'profile',
  },
])

// ─── Methods ───
const formatRent = (rent) => {
  if (rent == null || isNaN(rent)) return '-'
  if (rent >= 10000) {
    const man = rent / 10000
    return `${man % 1 === 0 ? man : man.toFixed(1)}万円`
  }
  return `${rent.toLocaleString()}円`
}

const toggleFavorite = async (id) => {
  const property = allProperties.value.find(p => p.id === id)
  if (!property) return

  const success = await toggleFavoriteDb(id)
  if (success) {
    property.isFavorite = !property.isFavorite
    if (selectedProperty.value?.id === id) {
      selectedProperty.value = { ...property }
    }
    showSnackbar(property.isFavorite ? 'お気に入りに追加しました' : 'お気に入りを解除しました')
  } else {
    showSnackbar('操作に失敗しました', 'error')
  }
}


const openDetail = (property) => {
  selectedProperty.value = { ...property }
  showDetail.value = true
}

const resetFilters = () => {
  searchText.value = ''
  filterPrefecture.value = null
  filterArea.value = null
  filterRentMin.value = null
  filterRentMax.value = null
  filterSizeMin.value = null
  filterSizeMax.value = null
  filterBusiness.value = null
  filterRailway.value = null
  filterStation.value = ''
  filterWalkMinutes.value = null
  filterInterior.value = null
  filterFloor.value = null
  filterLocation.value = null
  filterSpecial.value = null
  filterEquipment.value = null
  sortBy.value = 'newest'
  activePreferenceFilter.value = null
}

const markAsRead = async (id) => {
  await markNoticeAsRead(id)
}

// お知らせのリンク先物件が現在閲覧可能か（成約・削除・未公開は不可）
const isNoticePropertyViewable = (notice) => {
  if (!notice?.targetPropertyId) return false
  return allProperties.value.some(p => p.id === notice.targetPropertyId)
}

// お知らせの既読/未読切替（ホバーで現れるボタン用）
const toggleNoticeRead = async (notice) => {
  if (notice.isRead) {
    await markNoticeAsUnread(notice.id)
  } else {
    await markNoticeAsRead(notice.id)
  }
}

// お知らせ内の「この物件を見る」CTA: 既読化 + 物件タブ + 詳細モーダルへ遷移
const onNoticeClick = async (notice) => {
  await markNoticeAsRead(notice.id)
  if (!notice.targetPropertyId) return
  const property = allProperties.value.find(p => p.id === notice.targetPropertyId)
  if (property) {
    activeTab.value = 'search'
    openDetail(property)
  } else {
    showSnackbar('対象の物件は現在公開されていません', 'warning')
  }
}

const markAllAsRead = async () => {
  await markAllNoticesAsRead()
  showSnackbar('すべて既読にしました')
}

const getInquiryStatusColor = (status) => {
  const map = { '確認中': 'warning', '内見調整中': 'info', '内見完了': 'success', '返答待ち': 'grey' }
  return map[status] || 'primary'
}

const getDocumentStatusColor = (status) => {
  const map = { '申請中': 'warning', '許可済': 'success', '非許可': 'error' }
  return map[status] || 'grey'
}

const getDocumentStatusIcon = (status) => {
  const map = { '申請中': 'mdi-clock-outline', '許可済': 'mdi-check-circle', '非許可': 'mdi-close-circle' }
  return map[status] || 'mdi-help-circle'
}

const showSnackbar = (message, color = 'success') => {
  snackbar.value = { show: true, message, color }
}
</script>

<style scoped>
.mypage-wrapper {
  max-width: 1100px;
  margin: 0 auto;
}

/* -- ヒーロー -- */
.hero-bg {
  background: linear-gradient(135deg, #1e50a2 0%, #3d7bc5 50%, #5a9bd5 100%);
  border-radius: inherit;
}
.hero-avatar {
  background: white;
}

/* -- 統計カード -- */
.stat-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid rgba(0, 0, 0, 0.04);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

/* -- メインカード -- */
.main-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* -- 検索 -- */
.search-field {
  flex: 1 1 200px;
  max-width: 400px;
}
.sort-select {
  flex: 0 0 auto;
  max-width: 170px;
}
@media (max-width: 599px) {
  .search-field {
    flex: 1 1 100%;
    max-width: 100%;
  }
  .sort-select {
    flex: 1 1 100%;
    max-width: 100%;
  }
}

/* -- 物件カード（グリッド） -- */
.property-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}
.property-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
}
.property-image {
  height: 156px;
  position: relative;
  overflow: hidden;
}
.card-title-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fav-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}
.status-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.approval-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* -- 物件カード（横並び） -- */
.property-card-horizontal {
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  overflow: hidden;
}
.property-card-horizontal:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}
.property-image-sm {
  width: 100%;
  height: 120px;
  position: relative;
}
@media (min-width: 600px) {
  .property-image-sm {
    width: 180px;
    height: auto;
    min-height: 140px;
  }
}
.status-badge-sm {
  position: absolute;
  top: 8px;
  left: 8px;
  font-weight: 600;
}

/* -- お知らせ -- */
.notice-list {
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.notice-unread {
  background: #f0f6ff;
}
/* ホバー時のみ表示される既読/未読トグルボタン */
.notice-hover-row .notice-toggle-btn {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}
.notice-hover-row:hover .notice-toggle-btn,
.notice-hover-row:focus-within .notice-toggle-btn {
  opacity: 1;
  pointer-events: auto;
}
/* タッチデバイスでは常時表示（ホバーが使えないため） */
@media (hover: none) {
  .notice-hover-row .notice-toggle-btn {
    opacity: 1;
    pointer-events: auto;
  }
}
.notice-message-body :deep(p) { margin: 0 0 6px 0; }
.notice-message-body :deep(p:last-child) { margin-bottom: 0; }
.notice-message-body :deep(a) { color: #1976d2; text-decoration: underline; }
.notice-message-body :deep(code) {
  background: rgba(0,0,0,0.05);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.86em;
}
.notice-message-body :deep(ul),
.notice-message-body :deep(ol) {
  margin: 4px 0 6px 18px;
}
.notice-message-body :deep(strong) { font-weight: 700; }
.notice-message-body :deep(blockquote) {
  border-left: 3px solid rgba(0,0,0,0.15);
  padding-left: 10px;
  margin: 4px 0;
  color: #555;
}

/* -- プロフィール -- */
.profile-section {
  border: 1px solid rgba(0, 0, 0, 0.06);
}

/* -- 物件PR本文 (Markdownレンダリング) -- */
.property-pr-body {
  font-size: 0.92rem;
  line-height: 1.7;
  color: #1e293b;
  white-space: normal;
}
.property-pr-body :deep(p) { margin: 0 0 8px 0; }
.property-pr-body :deep(p:last-child) { margin-bottom: 0; }
.property-pr-body :deep(strong) { font-weight: 700; color: #1e40af; }
.property-pr-body :deep(em) { font-style: normal; background: rgba(255, 235, 59, 0.4); padding: 1px 4px; border-radius: 3px; }
.property-pr-body :deep(ul),
.property-pr-body :deep(ol) { margin: 6px 0 8px 18px; }
.property-pr-body :deep(li) { margin-bottom: 3px; }
.property-pr-body :deep(a) { color: #1976d2; text-decoration: underline; }
.property-pr-body :deep(blockquote) {
  border-left: 3px solid #93c5fd;
  padding-left: 10px;
  margin: 8px 0;
  color: #475569;
}
.property-pr-body :deep(code) {
  background: rgba(0,0,0,0.05);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.86em;
}

/* -- ぼかし: 未承認時の項目マスク -- */
.locked-blur {
  filter: blur(5px);
  user-select: none;
  -webkit-user-select: none;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .locked-blur { filter: blur(4px); }
}

/* -- 有料記事風 申請CTA -- */
.paywall-cta {
  position: relative;
  margin-top: 16px;
  padding: 28px 20px 24px;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #eef2ff 40%, #eef2ff 100%);
  border-radius: 12px;
  text-align: center;
}
.paywall-overlay {
  position: absolute;
  top: -32px;
  left: 0; right: 0;
  height: 40px;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #eef2ff 100%);
  pointer-events: none;
}
.paywall-content { position: relative; }

/* -- 詳細ダイアログ -- */
.detail-image {
  height: 200px;
  position: relative;
}
.detail-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
}
.detail-status-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
}

/* -- モーダルセクション -- */
.detail-section {
  padding: 16px 0;
}
.detail-section-header {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 12px;
}
.detail-info-item {
  display: flex;
  align-items: center;
}

/* -- セクションアクセント -- */
.section-accent {
  width: 4px;
  height: 20px;
  background: #1e50a2;
  border-radius: 2px;
}

/* -- ボトムナビ余白（レイアウトのbottom-navigation分） -- */
@media (max-width: 959px) {
  .mypage-wrapper {
    padding-bottom: 72px !important;
  }
}
</style>
