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
                <v-icon end size="18">{{ showDetailFilter ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
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
                <!-- 基本条件 -->
                <div class="text-caption text-medium-emphasis font-weight-bold mb-2">
                  <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                  エリア・物件条件
                </div>
                <v-row dense class="mb-3">
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterArea" :items="areaOptions" label="エリア" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterRent" :items="rentOptions" label="賃料" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterSize" :items="sizeOptions" label="坪数" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterBusiness" :items="businessOptions" label="業態" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                </v-row>

                <!-- アクセス・設備条件 -->
                <div class="text-caption text-medium-emphasis font-weight-bold mb-2">
                  <v-icon size="14" class="mr-1">mdi-train</v-icon>
                  アクセス・設備条件
                </div>
                <v-row dense class="mb-3">
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterRailway" :items="railwayFilterOptions" label="沿線" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="filterStation" label="駅名" placeholder="例: 心斎橋" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterWalkMinutes" :items="walkMinutesOptions" label="徒歩分数" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select v-model="filterInterior" :items="interiorConditionFilterOptions" label="室内状態" variant="outlined" density="comfortable" rounded="lg" hide-details clearable />
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

            <!-- クイックフィルタチップ -->
            <div class="d-flex flex-wrap ga-2 mb-5">
              <v-chip
                v-for="chip in quickFilters"
                :key="chip.key"
                :variant="chip.active ? 'flat' : 'outlined'"
                :color="chip.active ? 'primary' : undefined"
                size="small"
                rounded="lg"
                @click="toggleQuickFilter(chip.key)"
              >
                <v-icon start size="14">{{ chip.icon }}</v-icon>
                {{ chip.label }}
              </v-chip>
            </div>

            <!-- 件数表示 -->
            <div class="text-body-2 text-medium-emphasis mb-4">
              {{ filteredProperties.length }}件の物件
            </div>

            <!-- 物件グリッド -->
            <v-row v-if="filteredProperties.length > 0" dense>
              <v-col
                v-for="property in filteredProperties"
                :key="property.id"
                cols="12"
                sm="6"
                lg="4"
              >
                <v-card class="property-card h-100 d-flex flex-column" rounded="xl" flat @click="openDetail(property)">
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
                      v-else-if="property.availableDate === '即入居可'"
                      color="success"
                      size="x-small"
                      variant="flat"
                      class="status-badge"
                    >
                      即入居可
                    </v-chip>
                  </div>

                  <v-card-text class="pa-4 flex-grow-1">
                    <h3 class="text-subtitle-1 font-weight-bold mb-1 card-title-truncate">{{ property.name }}</h3>
                    <div class="text-body-2 text-medium-emphasis mb-1">
                      <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                      {{ property.location }}
                    </div>
                    <div class="text-caption text-medium-emphasis mb-2">
                      <v-icon size="12" class="mr-1">mdi-train</v-icon>
                      {{ property.station }}駅 {{ property.transportMethod }}{{ property.transportMinutes }}分
                    </div>
                    <div class="d-flex align-center ga-3 mb-3">
                      <span class="text-body-2">
                        <v-icon size="14" class="mr-1">mdi-texture-box</v-icon>
                        {{ property.area }}坪
                      </span>
                      <span class="text-subtitle-2 font-weight-bold text-primary">
                        {{ formatRent(property.rent) }}<span class="text-caption font-weight-regular">/月</span>
                      </span>
                    </div>
                    <div class="d-flex flex-wrap ga-1">
                      <v-chip size="x-small" variant="tonal" color="primary">{{ property.businessType }}</v-chip>
                      <v-chip v-if="property.floor" size="x-small" variant="tonal">{{ property.floor }}</v-chip>
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
                        {{ property.location }}
                      </div>
                      <div class="d-flex align-center ga-3 mb-3 flex-wrap">
                        <span class="text-body-2">{{ property.area }}坪</span>
                        <span class="text-subtitle-2 font-weight-bold text-primary">{{ formatRent(property.rent) }}/月</span>
                        <v-chip size="x-small" variant="tonal" color="primary">{{ property.businessType }}</v-chip>
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
                        {{ property.location }}
                        <span class="mx-2">|</span>
                        {{ property.area }}坪
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
            />
          </div>
        </v-window-item>
      </v-window>
    </v-card>

    <!-- ===== 物件詳細ダイアログ ===== -->
    <v-dialog v-model="showDetail" :max-width="640" :fullscreen="isMobile" scrollable>
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
          <h2 class="text-h5 font-weight-bold mb-2">{{ selectedProperty.name }}</h2>
          <div class="text-body-1 text-medium-emphasis mb-4">
            <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
            {{ selectedProperty.location }}
          </div>

          <!-- スペックカード -->
          <v-row dense class="mb-5">
            <v-col cols="4" class="d-none d-sm-block">
              <v-card color="grey-lighten-5" rounded="lg" flat class="pa-3 text-center">
                <div class="text-caption text-medium-emphasis">坪数</div>
                <div class="text-h6 font-weight-bold text-primary">{{ selectedProperty.area }}<span class="text-body-2">坪</span></div>
              </v-card>
            </v-col>
            <v-col cols="4" class="d-none d-sm-block">
              <v-card color="grey-lighten-5" rounded="lg" flat class="pa-3 text-center">
                <div class="text-caption text-medium-emphasis">月額賃料</div>
                <div class="text-h6 font-weight-bold text-primary">{{ formatRent(selectedProperty.rent) }}</div>
              </v-card>
            </v-col>
            <v-col cols="4" class="d-none d-sm-block">
              <v-card color="grey-lighten-5" rounded="lg" flat class="pa-3 text-center">
                <div class="text-caption text-medium-emphasis">入居時期</div>
                <div class="text-subtitle-2 font-weight-bold text-primary mt-1">{{ selectedProperty.availableDate }}</div>
              </v-card>
            </v-col>
            <!-- モバイル用：横並びリスト -->
            <v-col cols="12" class="d-sm-none">
              <v-card color="grey-lighten-5" rounded="lg" flat class="pa-3">
                <div class="d-flex justify-space-around text-center">
                  <div>
                    <div class="text-caption text-medium-emphasis">坪数</div>
                    <div class="text-subtitle-1 font-weight-bold text-primary">{{ selectedProperty.area }}坪</div>
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

          <!-- 詳細情報 -->
          <v-row dense class="mb-4">
            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">業態</div>
              <div class="text-body-1 font-weight-medium">{{ selectedProperty.businessType }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">階数・立地</div>
              <div class="text-body-1 font-weight-medium">{{ selectedProperty.floor }}</div>
            </v-col>
            <v-col cols="6" class="mt-2">
              <div class="text-caption text-medium-emphasis">最寄り駅</div>
              <div class="text-body-1 font-weight-medium">{{ selectedProperty.railway }} {{ selectedProperty.station }}駅 {{ selectedProperty.transportMethod }}{{ selectedProperty.transportMinutes }}分</div>
            </v-col>
            <v-col cols="6" class="mt-2">
              <div class="text-caption text-medium-emphasis">室内状態</div>
              <div class="text-body-1 font-weight-medium">{{ selectedProperty.interiorCondition }}</div>
            </v-col>
            <v-col cols="6" class="mt-2">
              <div class="text-caption text-medium-emphasis">問い合わせ件数</div>
              <div class="text-body-1 font-weight-medium">
                {{ selectedProperty.inquiryCount }}件
                <v-icon v-if="selectedProperty.inquiryCount >= 5" size="16" color="warning" class="ml-1">mdi-fire</v-icon>
              </div>
            </v-col>
            <v-col cols="6" class="mt-2">
              <div class="text-caption text-medium-emphasis">登録日</div>
              <div class="text-body-1 font-weight-medium">{{ selectedProperty.createdAt }}</div>
            </v-col>
          </v-row>

          <!-- 設備 -->
          <div class="mb-2">
            <div class="text-caption text-medium-emphasis mb-2">設備・内装</div>
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="eq in selectedProperty.equipment"
                :key="eq"
                size="small"
                variant="tonal"
                color="primary"
              >
                <v-icon start size="14">mdi-check-circle</v-icon>
                {{ eq }}
              </v-chip>
            </div>
          </div>

          <div v-if="selectedProperty.specialConditions?.length" class="mb-2 mt-4">
            <div class="text-caption text-medium-emphasis mb-2">特殊条件</div>
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="cond in selectedProperty.specialConditions"
                :key="cond"
                size="small"
                variant="tonal"
                color="secondary"
              >
                {{ cond }}
              </v-chip>
            </div>
          </div>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4 ga-3">
          <v-btn
            :variant="selectedProperty.isFavorite ? 'flat' : 'outlined'"
            :color="selectedProperty.isFavorite ? 'error' : 'grey'"
            rounded="lg"
            class="flex-grow-1"
            @click="toggleFavorite(selectedProperty.id)"
          >
            <v-icon start>{{ selectedProperty.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
            {{ selectedProperty.isFavorite ? 'お気に入り済み' : 'お気に入り' }}
          </v-btn>
          <v-btn
            v-if="selectedProperty.status !== 'closed'"
            color="primary"
            rounded="lg"
            class="flex-grow-1"
            @click="showDetail = false"
          >
            <v-icon start>mdi-email-fast</v-icon>
            問い合わせる
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

// ─── 物件データ ───
const allProperties = ref([
  {
    id: 1,
    name: 'イタリアンレストラン跡地',
    location: '大阪府大阪市中央区心斎橋筋1丁目',
    area: 18,
    rent: 250000,
    businessType: 'イタリアン',
    floor: '1階路面',
    status: 'active',
    isFavorite: true,
    isInquired: true,
    inquiryCount: 5,
    inquiryDate: '2025-07-08',
    inquiryStatus: '内見調整中',
    closedDate: null,
    documentStatus: '許可済',
    equipment: ['厨房設備一式', '業務用空調', 'カウンター8席', 'テーブル4卓'],
    availableDate: '2025年9月〜',
    createdAt: '2025-07-10',
    gradient: 'linear-gradient(135deg, #5a6e7f 0%, #8fa3b3 100%)',
    railway: 'OsakaMetro御堂筋線',
    station: '心斎橋',
    transportMethod: '徒歩',
    transportMinutes: 3,
    interiorCondition: '居抜き（有償）',
    specialConditions: ['重飲食可（炭火以外）', '路面店', 'ダクト有'],
    propertyCategory: '店舗',
    floors: '1F',
  },
  {
    id: 2,
    name: 'カフェ＆ダイニング跡地',
    location: '大阪府大阪市北区梅田1丁目',
    area: 14,
    rent: 200000,
    businessType: 'カフェ',
    floor: '1階路面',
    status: 'active',
    isFavorite: true,
    isInquired: false,
    inquiryCount: 3,
    inquiryDate: null,
    inquiryStatus: null,
    closedDate: null,
    documentStatus: null,
    equipment: ['エスプレッソマシン', '業務用空調', 'カウンター6席', 'テラス席あり'],
    availableDate: '即入居可',
    createdAt: '2025-07-12',
    gradient: 'linear-gradient(135deg, #8d7b68 0%, #b8a99a 100%)',
    railway: 'OsakaMetro御堂筋線',
    station: '梅田',
    transportMethod: '徒歩',
    transportMinutes: 5,
    interiorCondition: '居抜き（無償）',
    specialConditions: ['軽飲食まで可', '路面店', '視認性有'],
    propertyCategory: '店舗',
    floors: '1F',
  },
  {
    id: 3,
    name: '居酒屋「なにわ亭」跡地',
    location: '大阪府大阪市浪速区難波中1丁目',
    area: 15,
    rent: 180000,
    businessType: '居酒屋',
    floor: '地下1階',
    status: 'active',
    isFavorite: false,
    isInquired: false,
    inquiryCount: 8,
    inquiryDate: null,
    inquiryStatus: null,
    closedDate: null,
    documentStatus: null,
    equipment: ['厨房設備一式', '業務用空調', 'カウンター10席', '座敷20席'],
    availableDate: '即入居可',
    createdAt: '2025-07-14',
    gradient: 'linear-gradient(135deg, #6b705c 0%, #a5a58d 100%)',
    railway: 'OsakaMetro御堂筋線',
    station: 'なんば',
    transportMethod: '徒歩',
    transportMinutes: 2,
    interiorCondition: '居抜き（有償）',
    specialConditions: ['重飲食可（炭火以外）', '深夜営業可', '繁華街'],
    propertyCategory: '店舗',
    floors: 'B1F',
  },
  {
    id: 4,
    name: 'ラーメン店跡地',
    location: '大阪府大阪市都島区都島本通3丁目',
    area: 10,
    rent: 120000,
    businessType: 'ラーメン',
    floor: '1階路面',
    status: 'closed',
    isFavorite: false,
    isInquired: false,
    inquiryCount: 0,
    inquiryDate: null,
    inquiryStatus: null,
    closedDate: '2025-07-01',
    documentStatus: null,
    equipment: ['厨房設備一式', '換気設備', 'カウンター12席'],
    availableDate: '-',
    createdAt: '2025-06-20',
    gradient: 'linear-gradient(135deg, #7f8c8d 0%, #b2bec3 100%)',
    railway: 'OsakaMetro谷町線',
    station: '都島',
    transportMethod: '徒歩',
    transportMinutes: 7,
    interiorCondition: 'スケルトン',
    specialConditions: ['軽飲食まで可', '住宅街'],
    propertyCategory: '店舗',
    floors: '1F',
  },
  {
    id: 5,
    name: 'ダイニングバー跡地',
    location: '大阪府大阪市北区堂山町',
    area: 22,
    rent: 350000,
    businessType: 'バー',
    floor: '2階',
    status: 'active',
    isFavorite: false,
    isInquired: false,
    inquiryCount: 2,
    inquiryDate: null,
    inquiryStatus: null,
    closedDate: null,
    documentStatus: null,
    equipment: ['バーカウンター', '業務用空調', '照明設備', 'DJ ブース'],
    availableDate: '2025年10月〜',
    createdAt: '2025-07-11',
    gradient: 'linear-gradient(135deg, #3d405b 0%, #6c6f8a 100%)',
    railway: 'OsakaMetro谷町線',
    station: '東梅田',
    transportMethod: '徒歩',
    transportMinutes: 4,
    interiorCondition: '居抜き（有償）',
    specialConditions: ['深夜営業可', 'カラオケ可', '繁華街'],
    propertyCategory: '店舗',
    floors: '2F',
  },
  {
    id: 6,
    name: '焼肉店跡地',
    location: '大阪府大阪市生野区鶴橋2丁目',
    area: 25,
    rent: 220000,
    businessType: '焼肉',
    floor: '1階路面',
    status: 'active',
    isFavorite: false,
    isInquired: true,
    inquiryCount: 6,
    inquiryDate: '2025-07-05',
    inquiryStatus: '確認中',
    closedDate: null,
    documentStatus: '申請中',
    equipment: ['無煙ロースター8台', '厨房設備一式', '業務用空調', 'テーブル8卓'],
    availableDate: '2025年8月〜',
    createdAt: '2025-07-08',
    gradient: 'linear-gradient(135deg, #6d4c41 0%, #8d6e63 100%)',
    railway: '近鉄大阪線',
    station: '鶴橋',
    transportMethod: '徒歩',
    transportMinutes: 3,
    interiorCondition: '居抜き（無償）',
    specialConditions: ['重飲食可（炭火）', '路面店', 'ダクト有', 'グリストラップ有'],
    propertyCategory: '店舗',
    floors: '1F',
  },
  {
    id: 7,
    name: '和食料理店跡地',
    location: '大阪府大阪市天王寺区上本町6丁目',
    area: 20,
    rent: 200000,
    businessType: '和食',
    floor: '1階路面',
    status: 'closed',
    isFavorite: true,
    isInquired: false,
    inquiryCount: 0,
    inquiryDate: null,
    inquiryStatus: null,
    closedDate: '2025-06-15',
    documentStatus: null,
    equipment: ['厨房設備一式', '業務用空調', 'カウンター6席', '個室3室'],
    availableDate: '-',
    createdAt: '2025-06-01',
    gradient: 'linear-gradient(135deg, #4a6741 0%, #7d9f71 100%)',
    railway: 'OsakaMetro谷町線',
    station: '四天王寺前夕陽ヶ丘',
    transportMethod: '徒歩',
    transportMinutes: 6,
    interiorCondition: '居抜き（有償）',
    specialConditions: ['重飲食可（炭火以外）', '高級店'],
    propertyCategory: '店舗',
    floors: '1F',
  },
  {
    id: 8,
    name: 'たこ焼き・テイクアウト跡地',
    location: '大阪府大阪市西区南堀江1丁目',
    area: 8,
    rent: 100000,
    businessType: 'テイクアウト',
    floor: '1階路面',
    status: 'active',
    isFavorite: false,
    isInquired: false,
    inquiryCount: 1,
    inquiryDate: null,
    inquiryStatus: null,
    closedDate: null,
    documentStatus: null,
    equipment: ['業務用オーブン', '冷蔵ショーケース', 'テイクアウトカウンター'],
    availableDate: '即入居可',
    createdAt: '2025-07-13',
    gradient: 'linear-gradient(135deg, #9e8c7a 0%, #c4b7a6 100%)',
    railway: 'OsakaMetro四つ橋線',
    station: '四ツ橋',
    transportMethod: '徒歩',
    transportMinutes: 5,
    interiorCondition: 'スケルトン',
    specialConditions: ['軽飲食まで可', '路面店', '視認性有'],
    propertyCategory: '店舗',
    floors: '1F',
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


// ─── 検索・フィルタ ───
const searchText = ref('')
const showDetailFilter = ref(false)
const filterArea = ref(null)
const filterRent = ref(null)
const filterSize = ref(null)
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

const activeQuickFilters = ref([])

const sortOptions = [
  { title: '新着順', value: 'newest' },
  { title: '賃料が安い順', value: 'rent_asc' },
  { title: '賃料が高い順', value: 'rent_desc' },
  { title: '面積が広い順', value: 'area_desc' },
]

const areaOptions = ['中央区', '北区', '浪速区', '都島区', '天王寺区', '西区', '生野区', '福島区']
const rentOptions = [
  { title: '〜15万円', value: 'under15' },
  { title: '15〜25万円', value: '15to25' },
  { title: '25〜35万円', value: '25to35' },
  { title: '35万円〜', value: 'over35' },
]
const sizeOptions = [
  { title: '〜10坪', value: 'under10' },
  { title: '10〜15坪', value: '10to15' },
  { title: '15〜20坪', value: '15to20' },
  { title: '20坪〜', value: 'over20' },
]
const businessOptions = ['カフェ', 'イタリアン', '居酒屋', 'ラーメン', 'バー', '焼肉', '和食', 'テイクアウト']

const railwayFilterOptions = [
  'OsakaMetro御堂筋線', 'OsakaMetro谷町線', 'OsakaMetro四つ橋線', 'OsakaMetro中央線',
  'OsakaMetro堺筋線', 'OsakaMetro千日前線', 'OsakaMetro長堀鶴見緑地線',
  'ＪＲ大阪環状線', 'ＪＲ東海道本線', '近鉄大阪線', '近鉄奈良線',
  '阪急京都本線', '阪急神戸本線', '阪神本線', '南海本線', '京阪本線',
]

const interiorConditionFilterOptions = ['居抜き（無償）', '居抜き（有償）', 'スケルトン']

const walkMinutesOptions = [
  { title: '3分以内', value: 3 },
  { title: '5分以内', value: 5 },
  { title: '10分以内', value: 10 },
  { title: '15分以内', value: 15 },
]

const floorFilterOptions = ['1階路面', '2階以上', '地下1階', '地下']

const locationFilterOptions = ['路面店', 'ビルイン', '角地', '駅前', '駅ビル', '商業施設', '繁華街', 'ビジネス街', '住宅街', '学生街', '商店街', 'ロードサイド']

const specialFilterOptions = [
  '重飲食可（炭火）', '重飲食可（炭火以外）', '軽飲食まで可',
  '深夜営業可', 'カラオケ可', '演奏可', 'ペット可',
]

const equipmentFilterOptions = ['ダクト有', 'グリストラップ有', '換気扇有', 'エレベーター有', '高天井', '視認性有']

const quickFilters = computed(() => [
  { key: 'immediate', label: '即入居可', icon: 'mdi-flash', active: activeQuickFilters.value.includes('immediate') },
  { key: 'ground', label: '1階路面', icon: 'mdi-door', active: activeQuickFilters.value.includes('ground') },
  { key: 'kitchen', label: '厨房付き', icon: 'mdi-stove', active: activeQuickFilters.value.includes('kitchen') },
  { key: 'walk5', label: '駅近(5分以内)', icon: 'mdi-walk', active: activeQuickFilters.value.includes('walk5') },
  { key: 'inuki', label: '居抜き', icon: 'mdi-home-city', active: activeQuickFilters.value.includes('inuki') },
  { key: 'skeleton', label: 'スケルトン', icon: 'mdi-cube-outline', active: activeQuickFilters.value.includes('skeleton') },
  { key: 'active_only', label: '募集中のみ', icon: 'mdi-check-circle', active: activeQuickFilters.value.includes('active_only') },
])

// ─── 詳細ダイアログ ───
const showDetail = ref(false)
const selectedProperty = ref(null)

// ─── スナックバー ───
const snackbar = ref({ show: false, message: '', color: 'success' })

// ─── Computed ───
const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)

const activeFilterCount = computed(() => {
  let count = 0
  if (filterArea.value) count++
  if (filterRent.value) count++
  if (filterSize.value) count++
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
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
  }

  if (filterArea.value) {
    result = result.filter(p => p.location.includes(filterArea.value))
  }

  if (filterRent.value) {
    result = result.filter(p => {
      switch (filterRent.value) {
        case 'under15': return p.rent <= 150000
        case '15to25': return p.rent > 150000 && p.rent <= 250000
        case '25to35': return p.rent > 250000 && p.rent <= 350000
        case 'over35': return p.rent > 350000
        default: return true
      }
    })
  }

  if (filterSize.value) {
    result = result.filter(p => {
      switch (filterSize.value) {
        case 'under10': return p.area <= 10
        case '10to15': return p.area > 10 && p.area <= 15
        case '15to20': return p.area > 15 && p.area <= 20
        case 'over20': return p.area > 20
        default: return true
      }
    })
  }

  if (filterBusiness.value) {
    result = result.filter(p => p.businessType === filterBusiness.value)
  }

  if (filterRailway.value) {
    result = result.filter(p => p.railway === filterRailway.value)
  }
  if (filterStation.value) {
    const q = filterStation.value.toLowerCase()
    result = result.filter(p => p.station && p.station.toLowerCase().includes(q))
  }
  if (filterWalkMinutes.value) {
    result = result.filter(p => p.transportMinutes <= filterWalkMinutes.value)
  }
  if (filterInterior.value) {
    result = result.filter(p => p.interiorCondition === filterInterior.value)
  }
  if (filterFloor.value) {
    result = result.filter(p => p.floor && p.floor.includes(filterFloor.value))
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

  if (activeQuickFilters.value.includes('immediate')) {
    result = result.filter(p => p.availableDate === '即入居可')
  }
  if (activeQuickFilters.value.includes('ground')) {
    result = result.filter(p => p.floor === '1階路面')
  }
  if (activeQuickFilters.value.includes('kitchen')) {
    result = result.filter(p => p.equipment.some(e => e.includes('厨房')))
  }
  if (activeQuickFilters.value.includes('walk5')) {
    result = result.filter(p => p.transportMinutes <= 5)
  }
  if (activeQuickFilters.value.includes('inuki')) {
    result = result.filter(p => p.interiorCondition && p.interiorCondition.includes('居抜き'))
  }
  if (activeQuickFilters.value.includes('skeleton')) {
    result = result.filter(p => p.interiorCondition === 'スケルトン')
  }
  if (activeQuickFilters.value.includes('active_only')) {
    result = result.filter(p => p.status === 'active')
  }

  switch (sortBy.value) {
    case 'rent_asc': result.sort((a, b) => a.rent - b.rent); break
    case 'rent_desc': result.sort((a, b) => b.rent - a.rent); break
    case 'area_desc': result.sort((a, b) => b.area - a.area); break
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

const toggleQuickFilter = (key) => {
  const idx = activeQuickFilters.value.indexOf(key)
  if (idx >= 0) {
    activeQuickFilters.value.splice(idx, 1)
  } else {
    activeQuickFilters.value.push(key)
  }
}

const openDetail = (property) => {
  selectedProperty.value = { ...property }
  showDetail.value = true
}

const resetFilters = () => {
  searchText.value = ''
  filterArea.value = null
  filterRent.value = null
  filterSize.value = null
  filterBusiness.value = null
  filterRailway.value = null
  filterStation.value = ''
  filterWalkMinutes.value = null
  filterInterior.value = null
  filterFloor.value = null
  filterLocation.value = null
  filterSpecial.value = null
  filterEquipment.value = null
  activeQuickFilters.value = []
  sortBy.value = 'newest'
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

/* ── ヒーロー ── */
.hero-bg {
  background: linear-gradient(135deg, #1e50a2 0%, #3d7bc5 50%, #5a9bd5 100%);
  border-radius: inherit;
}
.hero-avatar {
  background: white;
}

/* ── 統計カード ── */
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

/* ── メインカード ── */
.main-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* ── 検索 ── */
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

/* ── 物件カード（グリッド） ── */
.property-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}
.property-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
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

/* ── 物件カード（横並び） ── */
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

/* ── お知らせ ── */
.notice-list {
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.notice-unread {
  background: #f0f6ff;
}

/* ── プロフィール ── */
.profile-section {
  border: 1px solid rgba(0, 0, 0, 0.06);
}

/* ── 詳細ダイアログ ── */
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

/* ── ボトムナビ余白（レイアウトのbottom-navigation分） ── */
@media (max-width: 959px) {
  .mypage-wrapper {
    padding-bottom: 72px !important;
  }
}
</style>
