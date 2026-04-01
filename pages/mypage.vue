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
            <h2 class="text-h5 font-weight-bold text-white mb-1">{{ profile.name }}さん</h2>
            <div class="d-flex align-center ga-2 flex-wrap">
              <v-chip size="small" color="white" variant="flat" class="font-weight-medium text-primary">
                <v-icon start size="14">mdi-store-plus</v-icon>
                出店希望者
              </v-chip>
              <span class="text-white text-body-2" style="opacity: 0.8">登録日: 2025年6月1日</span>
            </div>
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

            <!-- 件数表示 -->
            <div class="text-body-2 text-medium-emphasis mb-4">
              {{ filteredProperties.length }}件の水面下物件
              <span v-if="activePreferenceFilter" class="text-primary font-weight-medium">
                — 「{{ userPreferencePatterns.find(p => p.id === activePreferenceFilter)?.patternName }}」で絞り込み中
              </span>
            </div>

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
                  </div>

                  <v-card-text class="pa-4 flex-grow-1">
                    <h3 class="text-subtitle-1 font-weight-bold mb-1 card-title-truncate">{{ property.name }}</h3>
                    <div class="text-body-2 text-medium-emphasis mb-1">
                      <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                      {{ getLocation(property) }}
                    </div>
                    <div class="text-caption text-medium-emphasis mb-2 d-flex align-center">
                      <v-icon size="12" class="mr-1">mdi-train</v-icon>
                      {{ property.nearestStations[0].station }}駅 {{ property.nearestStations[0].transportMethod }}{{ property.nearestStations[0].transportMinutes }}分
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
                      <v-chip size="x-small" variant="tonal" color="primary">{{ property.allowedBusinessTypes[0] }}</v-chip>
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
                      <div class="d-flex align-center mb-1">
                        <h3 class="text-subtitle-1 font-weight-bold">{{ property.name }}</h3>
                        <v-spacer />
                        <v-btn icon variant="text" size="small" @click.stop="toggleFavorite(property.id)">
                          <v-icon color="#b85450" size="20">mdi-heart</v-icon>
                        </v-btn>
                      </div>
                      <div class="text-body-2 text-medium-emphasis mb-2">
                        <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                        {{ getLocation(property) }}
                      </div>
                      <div class="d-flex align-center ga-3 mb-3 flex-wrap">
                        <span class="text-body-2">{{ property.tsubo }}坪</span>
                        <span class="text-subtitle-2 font-weight-bold text-primary">{{ formatRent(property.rent) }}/月</span>
                        <v-chip size="x-small" variant="tonal" color="primary">{{ property.allowedBusinessTypes[0] }}</v-chip>
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
                        <v-chip
                          size="x-small"
                          :color="getInquiryStatusColor(property.inquiryStatus)"
                          variant="flat"
                        >
                          {{ property.inquiryStatus }}
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
                        <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                        {{ getLocation(property) }}
                        <span class="mx-2">|</span>
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
                  :class="{ 'notice-unread': !notice.isRead }"
                  class="py-4 px-4"
                  @click="markAsRead(notice.id)"
                >
                  <template #prepend>
                    <v-avatar :color="notice.color" size="40" class="mr-3">
                      <v-icon color="white" size="20">{{ notice.icon }}</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium text-body-1 mb-1 d-flex align-center ga-2 flex-wrap">
                    {{ notice.title }}
                    <v-chip v-if="!notice.isRead" size="x-small" color="error" variant="flat">NEW</v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2 text-wrap">
                    {{ notice.message }}
                  </v-list-item-subtitle>
                  <template #append>
                    <span class="text-caption text-medium-emphasis text-no-wrap ml-3">{{ notice.date }}</span>
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
        <!-- ヘッダー画像 -->
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
          <!-- 物件名 + お気に入りボタン -->
          <div class="d-flex align-start justify-space-between mb-2">
            <h2 class="text-h5 font-weight-bold" style="flex: 1; min-width: 0;">{{ selectedProperty.name }}</h2>
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
          <div class="text-body-1 text-medium-emphasis mb-4">
            <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
            {{ getLocation(selectedProperty) }}
          </div>

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
                  <v-chip size="default" variant="flat" color="primary">
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
                  <div class="text-body-1 font-weight-bold">{{ selectedProperty.propertyType }}</div>
                </v-col>
              </v-row>
            </v-card>
            <v-card color="grey-lighten-5" rounded="lg" flat class="pa-3 mb-3">
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
            <div class="d-flex flex-wrap ga-2">
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
            <div class="d-flex flex-wrap ga-2">
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
                <v-col cols="6" sm="4" class="mb-2">
                  <div class="text-caption text-medium-emphasis">解約引/敷引</div>
                  <div class="text-body-2 font-weight-bold">{{ selectedProperty.penalty ? formatRent(selectedProperty.penalty) : 'なし' }}</div>
                  <div v-if="selectedProperty.penaltyDetail" class="text-caption text-medium-emphasis">{{ selectedProperty.penaltyDetail }}</div>
                </v-col>
                <v-col cols="6" sm="4" class="mb-2">
                  <div class="text-caption text-medium-emphasis">礼金</div>
                  <div class="text-body-2 font-weight-bold">{{ selectedProperty.keyMoney ? formatRent(selectedProperty.keyMoney) : 'なし' }}</div>
                  <div v-if="selectedProperty.keyMoneyDetail" class="text-caption text-medium-emphasis">{{ selectedProperty.keyMoneyDetail }}</div>
                </v-col>
                <v-col cols="6" sm="4" class="mb-2">
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
                <v-col v-if="selectedProperty.transferAskedPrice" cols="4">
                  <div class="text-caption text-medium-emphasis">依頼額</div>
                  <div class="text-body-2 font-weight-bold">{{ selectedProperty.transferAskedPrice }}万円</div>
                </v-col>
                <v-col v-if="selectedProperty.transferListPrice" cols="4">
                  <div class="text-caption text-medium-emphasis">募集額</div>
                  <div class="text-body-2 font-weight-bold">{{ selectedProperty.transferListPrice }}万円</div>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4">
          <v-btn
            v-if="selectedProperty.status !== 'closed'"
            color="primary"
            rounded="lg"
            block
            size="large"
            @click="showDetail = false"
          >
            <v-icon start>mdi-email-fast</v-icon>
            問い合わせる
          </v-btn>
          <v-btn
            v-else
            variant="outlined"
            color="grey"
            rounded="lg"
            block
            size="large"
            disabled
          >
            募集終了
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

useHead({
  title: 'マイページ - みやこ不動産企画',
  meta: [
    { name: 'description', content: '出店希望者マイページ - 物件検索・お気に入り・問い合わせ管理' }
  ]
})

const { smAndDown: isMobile } = useDisplay()
const route = useRoute()

// ─── タブ設定 ───
const initialTab = route.query.tab === 'profile' ? 'profile' : 'search'
const activeTab = ref(initialTab)
const tabs = computed(() => [
  { key: 'search', title: '物件を探す', icon: 'mdi-store-search', badge: null },
  { key: 'favorites', title: 'お気に入り', icon: 'mdi-heart', badge: null },
  { key: 'inquired', title: '問い合わせ済', icon: 'mdi-email-check', badge: null },
  { key: 'notices', title: 'お知らせ', icon: 'mdi-bell', badge: unreadCount.value || null },
  { key: 'profile', title: 'マイ情報', icon: 'mdi-account-cog', badge: null },
])

// ─── ロケーション表示ヘルパー ───
const getLocation = (p) => `${p.prefecture}${p.city}${p.town}${p.chome}`

// ─── 物件データ ───
const allProperties = ref([
  {
    id: 1,
    name: 'イタリアンレストラン跡地',
    floorDisplay: '1F',
    floorSearch: '1階',
    roomNumber: '',
    prefecture: '大阪府',
    city: '大阪市中央区',
    town: '心斎橋筋',
    chome: '1丁目',
    banchi: '1-1',
    go: '',
    tsubo: 18,
    sqm: 59.5,
    builtYear: '1998年',
    floorsAbove: 8,
    floorsBelow: 1,
    structure: '鉄骨鉄筋コンクリート造',
    propertyType: '店舗',
    contractPeriod: '普通建物賃貸借 2年',
    nearestStations: [
      { railway: 'OsakaMetro御堂筋線', station: '心斎橋', transportMethod: '徒歩', transportMinutes: 3 },
      { railway: 'OsakaMetro長堀鶴見緑地線', station: '長堀橋', transportMethod: '徒歩', transportMinutes: 5 },
      { railway: 'OsakaMetro御堂筋線', station: 'なんば', transportMethod: '徒歩', transportMinutes: 8 },
    ],
    currentStatus: '空室',
    interiorCondition: '居抜き（有償）',
    shopName: '旧イタリアーノ',
    availableDate: '2025年9月〜',
    photos: [],
    floorPlan: null,
    allowedBusinessTypes: ['イタリアン', 'フレンチ', 'カフェ'],
    specialConditions: ['重飲食可（炭火以外）', '路面店', 'ダクト有'],
    transferDisplay: 'あり',
    transferAskedPrice: 200,
    transferListPrice: 150,
    rent: 250000,
    managementFee: 10000,
    deposit: 500000,
    depositDetail: '賃料2ヶ月分',
    penalty: 250000,
    penaltyDetail: '賃料1ヶ月分',
    keyMoney: 0,
    keyMoneyDetail: 'なし',
    brokerageFee: 250000,
    brokerageDetail: '賃料1ヶ月分',
    remarks: '',
    searchMemo: '',
    status: 'active',
    isFavorite: true,
    isInquired: true,
    inquiryCount: 5,
    inquiryDate: '2025-07-08',
    inquiryStatus: '内見調整中',
    closedDate: null,
    documentStatus: '許可済',
    createdAt: '2025-07-10',
    gradient: 'linear-gradient(135deg, #5a6e7f 0%, #8fa3b3 100%)',
  },
  {
    id: 2,
    name: 'カフェ＆ダイニング跡地',
    floorDisplay: '1F',
    floorSearch: '1階',
    roomNumber: '',
    prefecture: '大阪府',
    city: '大阪市北区',
    town: '梅田',
    chome: '1丁目',
    banchi: '3-10',
    go: '',
    tsubo: 14,
    sqm: 46.3,
    builtYear: '2005年',
    floorsAbove: 10,
    floorsBelow: 2,
    structure: '鉄骨鉄筋コンクリート造',
    propertyType: '店舗',
    contractPeriod: '普通建物賃貸借 3年',
    nearestStations: [
      { railway: 'OsakaMetro御堂筋線', station: '梅田', transportMethod: '徒歩', transportMinutes: 5 },
      { railway: 'ＪＲ大阪環状線', station: '大阪', transportMethod: '徒歩', transportMinutes: 7 },
      { railway: '阪急京都本線', station: '大阪梅田', transportMethod: '徒歩', transportMinutes: 6 },
    ],
    currentStatus: '空室',
    interiorCondition: '居抜き（無償）',
    shopName: '旧カフェ・ド・ウメダ',
    availableDate: '即入居可',
    photos: [],
    floorPlan: null,
    allowedBusinessTypes: ['カフェ', 'ダイニングバー', 'スイーツ'],
    specialConditions: ['軽飲食まで可', '路面店', '視認性有'],
    transferDisplay: 'なし',
    transferAskedPrice: null,
    transferListPrice: null,
    rent: 200000,
    managementFee: 15000,
    deposit: 600000,
    depositDetail: '賃料3ヶ月分',
    penalty: 200000,
    penaltyDetail: '賃料1ヶ月分',
    keyMoney: 200000,
    keyMoneyDetail: '賃料1ヶ月分',
    brokerageFee: 200000,
    brokerageDetail: '賃料1ヶ月分',
    remarks: '',
    searchMemo: '',
    status: 'active',
    isFavorite: true,
    isInquired: false,
    inquiryCount: 3,
    inquiryDate: null,
    inquiryStatus: null,
    closedDate: null,
    documentStatus: null,
    createdAt: '2025-07-12',
    gradient: 'linear-gradient(135deg, #8d7b68 0%, #b8a99a 100%)',
  },
  {
    id: 3,
    name: '居酒屋「なにわ亭」跡地',
    floorDisplay: 'B1F',
    floorSearch: '地下1階',
    roomNumber: '',
    prefecture: '大阪府',
    city: '大阪市浪速区',
    town: '難波中',
    chome: '1丁目',
    banchi: '6-8',
    go: '',
    tsubo: 15,
    sqm: 49.6,
    builtYear: '1992年',
    floorsAbove: 6,
    floorsBelow: 1,
    structure: '鉄筋コンクリート造',
    propertyType: '店舗',
    contractPeriod: '定期建物賃貸借 5年',
    nearestStations: [
      { railway: 'OsakaMetro御堂筋線', station: 'なんば', transportMethod: '徒歩', transportMinutes: 2 },
      { railway: '南海本線', station: '難波', transportMethod: '徒歩', transportMinutes: 4 },
      { railway: 'OsakaMetro千日前線', station: 'なんば', transportMethod: '徒歩', transportMinutes: 3 },
    ],
    currentStatus: '空室',
    interiorCondition: '居抜き（有償）',
    shopName: 'なにわ亭',
    availableDate: '即入居可',
    photos: [],
    floorPlan: null,
    allowedBusinessTypes: ['居酒屋', '和食', '焼鳥'],
    specialConditions: ['重飲食可（炭火以外）', '深夜営業可', '繁華街', 'ダクト有', 'グリストラップ有'],
    transferDisplay: 'あり',
    transferAskedPrice: 300,
    transferListPrice: 250,
    rent: 180000,
    managementFee: 8000,
    deposit: 900000,
    depositDetail: '賃料5ヶ月分',
    penalty: 360000,
    penaltyDetail: '賃料2ヶ月分',
    keyMoney: 0,
    keyMoneyDetail: 'なし',
    brokerageFee: 180000,
    brokerageDetail: '賃料1ヶ月分',
    remarks: '',
    searchMemo: '',
    status: 'active',
    isFavorite: false,
    isInquired: false,
    inquiryCount: 8,
    inquiryDate: null,
    inquiryStatus: null,
    closedDate: null,
    documentStatus: null,
    createdAt: '2025-07-14',
    gradient: 'linear-gradient(135deg, #6b705c 0%, #a5a58d 100%)',
  },
  {
    id: 4,
    name: 'ラーメン店跡地',
    floorDisplay: '1F',
    floorSearch: '1階',
    roomNumber: '',
    prefecture: '大阪府',
    city: '大阪市都島区',
    town: '都島本通',
    chome: '3丁目',
    banchi: '15-2',
    go: '',
    tsubo: 10,
    sqm: 33.1,
    builtYear: '1985年',
    floorsAbove: 4,
    floorsBelow: 0,
    structure: '鉄筋コンクリート造',
    propertyType: '店舗',
    contractPeriod: '普通建物賃貸借 2年',
    nearestStations: [
      { railway: 'OsakaMetro谷町線', station: '都島', transportMethod: '徒歩', transportMinutes: 7 },
      { railway: 'ＪＲ大阪環状線', station: '桜ノ宮', transportMethod: '徒歩', transportMinutes: 10 },
    ],
    currentStatus: '空室',
    interiorCondition: 'スケルトン',
    shopName: '',
    availableDate: '-',
    photos: [],
    floorPlan: null,
    allowedBusinessTypes: ['ラーメン', 'うどん', 'テイクアウト'],
    specialConditions: ['軽飲食まで可', '住宅街', '換気扇有'],
    transferDisplay: 'なし',
    transferAskedPrice: null,
    transferListPrice: null,
    rent: 120000,
    managementFee: 5000,
    deposit: 360000,
    depositDetail: '賃料3ヶ月分',
    penalty: 120000,
    penaltyDetail: '賃料1ヶ月分',
    keyMoney: 120000,
    keyMoneyDetail: '賃料1ヶ月分',
    brokerageFee: 120000,
    brokerageDetail: '賃料1ヶ月分',
    remarks: '',
    searchMemo: '',
    status: 'closed',
    isFavorite: false,
    isInquired: false,
    inquiryCount: 0,
    inquiryDate: null,
    inquiryStatus: null,
    closedDate: '2025-07-01',
    documentStatus: null,
    createdAt: '2025-06-20',
    gradient: 'linear-gradient(135deg, #7f8c8d 0%, #b2bec3 100%)',
  },
  {
    id: 5,
    name: 'ダイニングバー跡地',
    floorDisplay: '2F',
    floorSearch: '2階',
    roomNumber: '',
    prefecture: '大阪府',
    city: '大阪市北区',
    town: '堂山町',
    chome: '',
    banchi: '5-12',
    go: '',
    tsubo: 22,
    sqm: 72.7,
    builtYear: '2001年',
    floorsAbove: 7,
    floorsBelow: 1,
    structure: '重量鉄骨造',
    propertyType: '店舗',
    contractPeriod: '定期建物賃貸借 3年',
    nearestStations: [
      { railway: 'OsakaMetro谷町線', station: '東梅田', transportMethod: '徒歩', transportMinutes: 4 },
      { railway: 'OsakaMetro御堂筋線', station: '梅田', transportMethod: '徒歩', transportMinutes: 6 },
      { railway: '阪急京都本線', station: '大阪梅田', transportMethod: '徒歩', transportMinutes: 7 },
    ],
    currentStatus: '空室',
    interiorCondition: '居抜き（有償）',
    shopName: '旧バー・ノクターン',
    availableDate: '2025年10月〜',
    photos: [],
    floorPlan: null,
    allowedBusinessTypes: ['バー', 'ダイニングバー', 'ラウンジ'],
    specialConditions: ['深夜営業可', 'カラオケ可', '繁華街', 'ビルイン', '専用階段有'],
    transferDisplay: 'あり',
    transferAskedPrice: 180,
    transferListPrice: 120,
    rent: 350000,
    managementFee: 20000,
    deposit: 1750000,
    depositDetail: '賃料5ヶ月分',
    penalty: 700000,
    penaltyDetail: '賃料2ヶ月分',
    keyMoney: 350000,
    keyMoneyDetail: '賃料1ヶ月分',
    brokerageFee: 350000,
    brokerageDetail: '賃料1ヶ月分',
    remarks: '',
    searchMemo: '',
    status: 'active',
    isFavorite: false,
    isInquired: false,
    inquiryCount: 2,
    inquiryDate: null,
    inquiryStatus: null,
    closedDate: null,
    documentStatus: null,
    createdAt: '2025-07-11',
    gradient: 'linear-gradient(135deg, #3d405b 0%, #6c6f8a 100%)',
  },
  {
    id: 6,
    name: '焼肉店跡地',
    floorDisplay: '1F',
    floorSearch: '1階',
    roomNumber: '',
    prefecture: '大阪府',
    city: '大阪市生野区',
    town: '鶴橋',
    chome: '2丁目',
    banchi: '3-18',
    go: '',
    tsubo: 25,
    sqm: 82.6,
    builtYear: '1990年',
    floorsAbove: 3,
    floorsBelow: 0,
    structure: '鉄筋コンクリート造',
    propertyType: '店舗',
    contractPeriod: '普通建物賃貸借 3年',
    nearestStations: [
      { railway: '近鉄大阪線', station: '鶴橋', transportMethod: '徒歩', transportMinutes: 3 },
      { railway: 'ＪＲ大阪環状線', station: '鶴橋', transportMethod: '徒歩', transportMinutes: 3 },
      { railway: 'OsakaMetro千日前線', station: '鶴橋', transportMethod: '徒歩', transportMinutes: 4 },
    ],
    currentStatus: '空室',
    interiorCondition: '居抜き（無償）',
    shopName: '旧焼肉一番',
    availableDate: '2025年8月〜',
    photos: [],
    floorPlan: null,
    allowedBusinessTypes: ['焼肉', 'ホルモン', '韓国料理'],
    specialConditions: ['重飲食可（炭火）', '路面店', 'ダクト有', 'グリストラップ有', '商店街'],
    transferDisplay: 'なし',
    transferAskedPrice: null,
    transferListPrice: null,
    rent: 220000,
    managementFee: 10000,
    deposit: 1320000,
    depositDetail: '賃料6ヶ月分',
    penalty: 440000,
    penaltyDetail: '賃料2ヶ月分',
    keyMoney: 0,
    keyMoneyDetail: 'なし',
    brokerageFee: 220000,
    brokerageDetail: '賃料1ヶ月分',
    remarks: '',
    searchMemo: '',
    status: 'active',
    isFavorite: false,
    isInquired: true,
    inquiryCount: 6,
    inquiryDate: '2025-07-05',
    inquiryStatus: '確認中',
    closedDate: null,
    documentStatus: '申請中',
    createdAt: '2025-07-08',
    gradient: 'linear-gradient(135deg, #6d4c41 0%, #8d6e63 100%)',
  },
  {
    id: 7,
    name: '和食料理店跡地',
    floorDisplay: '1F',
    floorSearch: '1階',
    roomNumber: '',
    prefecture: '大阪府',
    city: '大阪市天王寺区',
    town: '上本町',
    chome: '6丁目',
    banchi: '2-5',
    go: '',
    tsubo: 20,
    sqm: 66.1,
    builtYear: '1995年',
    floorsAbove: 5,
    floorsBelow: 0,
    structure: '鉄筋コンクリート造',
    propertyType: '店舗',
    contractPeriod: '普通建物賃貸借 2年',
    nearestStations: [
      { railway: 'OsakaMetro谷町線', station: '四天王寺前夕陽ヶ丘', transportMethod: '徒歩', transportMinutes: 6 },
      { railway: '近鉄大阪線', station: '大阪上本町', transportMethod: '徒歩', transportMinutes: 8 },
    ],
    currentStatus: '空室',
    interiorCondition: '居抜き（有償）',
    shopName: '旧割烹さくら',
    availableDate: '-',
    photos: [],
    floorPlan: null,
    allowedBusinessTypes: ['和食', '割烹', '寿司'],
    specialConditions: ['重飲食可（炭火以外）', '高級店', '換気扇有'],
    transferDisplay: 'あり',
    transferAskedPrice: 350,
    transferListPrice: 280,
    rent: 200000,
    managementFee: 10000,
    deposit: 1200000,
    depositDetail: '賃料6ヶ月分',
    penalty: 400000,
    penaltyDetail: '賃料2ヶ月分',
    keyMoney: 200000,
    keyMoneyDetail: '賃料1ヶ月分',
    brokerageFee: 200000,
    brokerageDetail: '賃料1ヶ月分',
    remarks: '',
    searchMemo: '',
    status: 'closed',
    isFavorite: true,
    isInquired: false,
    inquiryCount: 0,
    inquiryDate: null,
    inquiryStatus: null,
    closedDate: '2025-06-15',
    documentStatus: null,
    createdAt: '2025-06-01',
    gradient: 'linear-gradient(135deg, #4a6741 0%, #7d9f71 100%)',
  },
  {
    id: 8,
    name: 'たこ焼き・テイクアウト跡地',
    floorDisplay: '1F',
    floorSearch: '1階',
    roomNumber: '',
    prefecture: '大阪府',
    city: '大阪市西区',
    town: '南堀江',
    chome: '1丁目',
    banchi: '12-7',
    go: '',
    tsubo: 8,
    sqm: 26.4,
    builtYear: '2010年',
    floorsAbove: 6,
    floorsBelow: 0,
    structure: '鉄筋コンクリート造',
    propertyType: '店舗',
    contractPeriod: '普通建物賃貸借 2年',
    nearestStations: [
      { railway: 'OsakaMetro四つ橋線', station: '四ツ橋', transportMethod: '徒歩', transportMinutes: 5 },
      { railway: 'OsakaMetro長堀鶴見緑地線', station: '西大橋', transportMethod: '徒歩', transportMinutes: 3 },
      { railway: 'OsakaMetro御堂筋線', station: '心斎橋', transportMethod: '徒歩', transportMinutes: 10 },
    ],
    currentStatus: '空室',
    interiorCondition: 'スケルトン',
    shopName: '',
    availableDate: '即入居可',
    photos: [],
    floorPlan: null,
    allowedBusinessTypes: ['テイクアウト', 'たこ焼き', 'クレープ'],
    specialConditions: ['軽飲食まで可', '路面店', '視認性有'],
    transferDisplay: 'なし',
    transferAskedPrice: null,
    transferListPrice: null,
    rent: 100000,
    managementFee: 5000,
    deposit: 300000,
    depositDetail: '賃料3ヶ月分',
    penalty: 100000,
    penaltyDetail: '賃料1ヶ月分',
    keyMoney: 0,
    keyMoneyDetail: 'なし',
    brokerageFee: 100000,
    brokerageDetail: '賃料1ヶ月分',
    remarks: '',
    searchMemo: '',
    status: 'active',
    isFavorite: false,
    isInquired: false,
    inquiryCount: 1,
    inquiryDate: null,
    inquiryStatus: null,
    closedDate: null,
    documentStatus: null,
    createdAt: '2025-07-13',
    gradient: 'linear-gradient(135deg, #9e8c7a 0%, #c4b7a6 100%)',
  },
])

// ─── お知らせ ───
const notifications = ref([
  {
    id: 1,
    title: '新着マッチング物件のお知らせ',
    message: 'ご希望条件にマッチする物件「カフェ＆ダイニング跡地（梅田）」が新着で掲載されました。',
    date: '2025-07-15',
    isRead: false,
    color: 'primary',
    icon: 'mdi-handshake',
  },
  {
    id: 2,
    title: '募集終了のお知らせ',
    message: 'お気に入り登録中の「和食料理店跡地（天王寺区）」は募集を終了しました。',
    date: '2025-07-10',
    isRead: false,
    color: 'error',
    icon: 'mdi-store-remove',
  },
  {
    id: 3,
    title: '内見日程のご案内',
    message: '「イタリアンレストラン跡地（心斎橋）」の内見日程候補をお送りしました。ご確認ください。',
    date: '2025-07-09',
    isRead: true,
    color: 'success',
    icon: 'mdi-calendar-check',
  },
  {
    id: 4,
    title: '新着物件5件のお知らせ',
    message: '今週、新しく5件の物件が掲載されました。条件に合う物件をチェックしましょう。',
    date: '2025-07-07',
    isRead: true,
    color: 'info',
    icon: 'mdi-new-box',
  },
  {
    id: 5,
    title: '会員登録完了のお知らせ',
    message: '会員登録が完了しました。マイページより物件の検索・お気に入り登録が可能です。',
    date: '2025-06-01',
    isRead: true,
    color: 'primary',
    icon: 'mdi-account-check',
  },
])

// ─── プロフィール ───
const profile = ref({
  name: '山本大輔',
  email: 'yamamoto@example.com',
  phone: '090-1234-5678',
})


// ─── 出店希望条件（マイ情報から連動） ───
const userPreferencePatterns = ref([
  {
    id: 1,
    patternName: 'ブランドA - カフェ出店',
    businessCategory: '飲食',
    businessType: 'カフェ',
    maxBudget: 500,
    rentMin: 100000,
    rentMax: 250000,
    tsuboMin: 10,
    tsuboMax: 20,
    sqmMin: 33.06,
    sqmMax: 66.12,
    deliveryCondition: '居抜き',
    prefectures: ['大阪府'],
    cities: '中央区・北区・浪速区',
    towns: '',
    floors: ['1階路面'],
    specialConditions: '厨房設備あり',
    railwayLines: ['OsakaMetro御堂筋線', 'OsakaMetro中央線'],
    stationName: '心斎橋',
    transportMethod: '徒歩',
    transportMinutes: 5,
    interiorCondition: ['居抜き（無償）', '居抜き（有償）'],
    specialRequirements: ['重飲食可（炭火以外）', '路面店'],
    patternMemo: '',
  },
  {
    id: 2,
    patternName: 'ブランドB - バー出店',
    businessCategory: '飲食',
    businessType: 'バー',
    maxBudget: 800,
    rentMin: 200000,
    rentMax: 400000,
    tsuboMin: 15,
    tsuboMax: 30,
    sqmMin: 49.59,
    sqmMax: 99.17,
    deliveryCondition: '居抜き',
    prefectures: ['大阪府'],
    cities: '北区',
    towns: '',
    floors: ['2階', 'B1F'],
    specialConditions: '防音設備',
    railwayLines: ['OsakaMetro谷町線', 'OsakaMetro御堂筋線'],
    stationName: '',
    transportMethod: '徒歩',
    transportMinutes: 10,
    interiorCondition: ['居抜き（有償）'],
    specialRequirements: ['深夜営業可'],
    patternMemo: '',
  },
])

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

const onSavePreferences = (patterns) => {
  userPreferencePatterns.value = patterns
  activePreferenceFilter.value = null
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

// ─── スナックバー ───
const snackbar = ref({ show: false, message: '', color: 'success' })

// ─── Computed ───
const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)

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

const toggleFavorite = (id) => {
  const property = allProperties.value.find(p => p.id === id)
  if (property) {
    property.isFavorite = !property.isFavorite
    if (selectedProperty.value?.id === id) {
      selectedProperty.value = { ...property }
    }
    showSnackbar(property.isFavorite ? 'お気に入りに追加しました' : 'お気に入りを解除しました')
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

const markAsRead = (id) => {
  const notice = notifications.value.find(n => n.id === id)
  if (notice) notice.isRead = true
}

const markAllAsRead = () => {
  notifications.value.forEach(n => { n.isRead = true })
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

/* -- プロフィール -- */
.profile-section {
  border: 1px solid rgba(0, 0, 0, 0.06);
}

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
