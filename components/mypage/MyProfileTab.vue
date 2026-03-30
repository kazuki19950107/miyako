<template>
  <div>
    <!-- ================================ -->
    <!-- Section 1: プロフィール           -->
    <!-- ================================ -->
    <v-card rounded="xl" flat class="mb-5 profile-section">
      <v-card-title class="d-flex align-center pa-4 pb-2">
        <v-icon start color="primary" size="22">mdi-account-circle</v-icon>
        <span class="text-h6 font-weight-bold">プロフィール</span>
        <v-spacer />
        <v-btn
          variant="text"
          color="primary"
          size="small"
          @click="toggleProfileEdit"
        >
          <v-icon start size="16">{{ isEditingProfile ? 'mdi-close' : 'mdi-pencil' }}</v-icon>
          {{ isEditingProfile ? 'キャンセル' : '編集' }}
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-4 pt-2">
        <v-row dense>
          <!-- 会社名 -->
          <v-col cols="12" sm="6" md="4">
            <div class="text-caption text-medium-emphasis mb-1">会社名</div>
            <v-text-field
              v-if="isEditingProfile"
              v-model="profile.companyName"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              hide-details
              placeholder="会社名を入力"
            />
            <div v-else class="text-body-1 font-weight-medium">{{ profile.companyName || '-' }}</div>
          </v-col>

          <!-- 氏名 -->
          <v-col cols="12" sm="6" md="4">
            <div class="text-caption text-medium-emphasis mb-1">氏名</div>
            <v-text-field
              v-if="isEditingProfile"
              v-model="profile.name"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              hide-details
              placeholder="氏名を入力"
            />
            <div v-else class="text-body-1 font-weight-medium">{{ profile.name || '-' }}</div>
          </v-col>

          <!-- ふりがな -->
          <v-col cols="12" sm="6" md="4">
            <div class="text-caption text-medium-emphasis mb-1">ふりがな</div>
            <v-text-field
              v-if="isEditingProfile"
              v-model="profile.nameKana"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              hide-details
              placeholder="ふりがなを入力"
            />
            <div v-else class="text-body-1">{{ profile.nameKana || '-' }}</div>
          </v-col>

          <!-- 国籍 -->
          <v-col cols="12" sm="6" md="4">
            <div class="text-caption text-medium-emphasis mb-1">国籍</div>
            <v-select
              v-if="isEditingProfile"
              v-model="profile.nationality"
              :items="nationalityOptions"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              hide-details
            />
            <div v-else class="text-body-1">{{ profile.nationality || '-' }}</div>
          </v-col>

          <!-- 携帯番号 -->
          <v-col cols="12" sm="6" md="4">
            <div class="text-caption text-medium-emphasis mb-1">携帯番号</div>
            <v-text-field
              v-if="isEditingProfile"
              v-model="profile.mobilePhone"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              hide-details
              placeholder="090-1234-5678"
            />
            <div v-else class="text-body-1">{{ profile.mobilePhone || '-' }}</div>
          </v-col>

          <!-- その他電話番号 -->
          <v-col cols="12" sm="6" md="4">
            <div class="text-caption text-medium-emphasis mb-1">その他電話番号</div>
            <v-text-field
              v-if="isEditingProfile"
              v-model="profile.otherPhone"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              hide-details
              placeholder="06-1234-5678"
            />
            <div v-else class="text-body-1">{{ profile.otherPhone || '-' }}</div>
          </v-col>

          <!-- FAX番号 -->
          <v-col cols="12" sm="6" md="4">
            <div class="text-caption text-medium-emphasis mb-1">FAX番号</div>
            <v-text-field
              v-if="isEditingProfile"
              v-model="profile.fax"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              hide-details
              placeholder="06-1234-5679"
            />
            <div v-else class="text-body-1">{{ profile.fax || '-' }}</div>
          </v-col>

          <!-- ログインメールアドレス (readonly) -->
          <v-col cols="12" sm="6" md="4">
            <div class="text-caption text-medium-emphasis mb-1">ログインメールアドレス</div>
            <v-text-field
              v-if="isEditingProfile"
              v-model="profile.loginEmail"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              hide-details
              readonly
              bg-color="grey-lighten-3"
            />
            <div v-else class="text-body-1">{{ profile.loginEmail }}</div>
          </v-col>

          <!-- 店舗数 -->
          <v-col cols="12" sm="6" md="4">
            <div class="text-caption text-medium-emphasis mb-1">店舗数</div>
            <v-text-field
              v-if="isEditingProfile"
              v-model.number="profile.storeCount"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              hide-details
              type="number"
              min="0"
              suffix="店舗"
            />
            <div v-else class="text-body-1">{{ profile.storeCount != null ? profile.storeCount + ' 店舗' : '-' }}</div>
          </v-col>

          <!-- 連絡先メールアドレス (array) -->
          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-1">連絡先メールアドレス</div>
            <template v-if="isEditingProfile">
              <div
                v-for="(email, idx) in profile.contactEmails"
                :key="'email-' + idx"
                class="d-flex align-center ga-2 mb-2"
              >
                <v-text-field
                  :model-value="email"
                  @update:model-value="updateContactEmail(idx, $event)"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  hide-details
                  placeholder="example@email.com"
                  class="flex-grow-1"
                />
                <v-btn
                  icon
                  variant="text"
                  color="error"
                  size="small"
                  :disabled="profile.contactEmails.length <= 1"
                  @click="removeContactEmail(idx)"
                  aria-label="メールアドレスを削除"
                >
                  <v-icon size="20">mdi-close-circle</v-icon>
                </v-btn>
              </div>
              <v-btn
                variant="tonal"
                color="primary"
                size="small"
                rounded="lg"
                @click="addContactEmail"
              >
                <v-icon start size="16">mdi-plus</v-icon>
                メールアドレスを追加
              </v-btn>
            </template>
            <div v-else>
              <div v-for="(email, idx) in profile.contactEmails" :key="'view-email-' + idx" class="text-body-1">
                {{ email }}
              </div>
            </div>
          </v-col>

          <!-- 屋号 (array) -->
          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-1">屋号</div>
            <template v-if="isEditingProfile">
              <div
                v-for="(brand, idx) in profile.brandNames"
                :key="'brand-' + idx"
                class="d-flex align-center ga-2 mb-2"
              >
                <v-text-field
                  :model-value="brand"
                  @update:model-value="updateBrandName(idx, $event)"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  hide-details
                  placeholder="屋号を入力"
                  class="flex-grow-1"
                />
                <v-btn
                  icon
                  variant="text"
                  color="error"
                  size="small"
                  :disabled="profile.brandNames.length <= 1"
                  @click="removeBrandName(idx)"
                  aria-label="屋号を削除"
                >
                  <v-icon size="20">mdi-close-circle</v-icon>
                </v-btn>
              </div>
              <v-btn
                variant="tonal"
                color="primary"
                size="small"
                rounded="lg"
                @click="addBrandName"
              >
                <v-icon start size="16">mdi-plus</v-icon>
                屋号を追加
              </v-btn>
            </template>
            <div v-else>
              <v-chip
                v-for="(brand, idx) in profile.brandNames"
                :key="'view-brand-' + idx"
                size="small"
                variant="tonal"
                color="primary"
                class="mr-1 mb-1"
              >
                {{ brand }}
              </v-chip>
            </div>
          </v-col>

          <!-- 検索用メモ -->
          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-1">検索用メモ</div>
            <v-textarea
              v-if="isEditingProfile"
              v-model="profile.searchMemo"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              hide-details
              rows="3"
              auto-grow
              placeholder="検索に使用するメモを入力"
            />
            <div v-else class="text-body-1" style="white-space: pre-wrap;">{{ profile.searchMemo || '-' }}</div>
          </v-col>
        </v-row>

        <!-- 保存ボタン -->
        <div v-if="isEditingProfile" class="d-flex justify-end mt-4">
          <v-btn color="primary" rounded="lg" @click="saveProfile">
            <v-icon start>mdi-content-save</v-icon>
            保存する
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- ================================ -->
    <!-- Section 2: 出店希望条件            -->
    <!-- ================================ -->
    <v-card rounded="xl" flat class="profile-section">
      <v-card-title class="d-flex align-center pa-4 pb-2">
        <v-icon start color="secondary" size="22">mdi-tune-vertical</v-icon>
        <span class="text-h6 font-weight-bold">出店希望条件</span>
        <v-spacer />
        <v-chip size="small" variant="tonal" color="primary">
          {{ preferencePatterns.length }}パターン
        </v-chip>
      </v-card-title>

      <v-card-text class="pa-4 pt-2">
        <v-expansion-panels v-model="openPanels" multiple variant="accordion">
          <v-expansion-panel
            v-for="(pattern, pIdx) in preferencePatterns"
            :key="pattern.id"
            rounded="lg"
            class="mb-3"
            elevation="0"
          >
            <!-- パネルヘッダー -->
            <v-expansion-panel-title class="py-3">
              <div class="d-flex align-center ga-2 flex-wrap flex-grow-1 mr-2">
                <v-icon size="20" color="primary">mdi-store-outline</v-icon>
                <span class="font-weight-bold text-body-1">{{ pattern.patternName || '未設定' }}</span>
                <v-chip v-if="pattern.businessCategory" size="x-small" variant="tonal" color="secondary">
                  {{ pattern.businessCategory }}
                </v-chip>
                <v-chip v-if="pattern.businessType" size="x-small" variant="tonal">
                  {{ pattern.businessType }}
                </v-chip>
              </div>
            </v-expansion-panel-title>

            <!-- パネル内容 -->
            <v-expansion-panel-text>
              <div class="pt-2">
                <!-- 編集/キャンセル/削除ボタン行 -->
                <div class="d-flex align-center ga-2 mb-4">
                  <v-btn
                    variant="text"
                    color="primary"
                    size="small"
                    @click="togglePatternEdit(pIdx)"
                  >
                    <v-icon start size="16">{{ editingPatterns[pIdx] ? 'mdi-close' : 'mdi-pencil' }}</v-icon>
                    {{ editingPatterns[pIdx] ? 'キャンセル' : '編集' }}
                  </v-btn>
                  <v-spacer />
                  <v-btn
                    variant="text"
                    color="error"
                    size="small"
                    @click="confirmDeletePattern(pIdx)"
                  >
                    <v-icon start size="16">mdi-delete</v-icon>
                    削除
                  </v-btn>
                </div>

                <v-row dense>
                  <!-- パターン名 -->
                  <v-col cols="12" sm="6" md="4">
                    <div class="text-caption text-medium-emphasis mb-1">パターン名</div>
                    <v-text-field
                      v-if="editingPatterns[pIdx]"
                      v-model="pattern.patternName"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      placeholder="例: ブランドA - カフェ出店"
                    />
                    <div v-else class="text-body-1 font-weight-medium">{{ pattern.patternName || '-' }}</div>
                  </v-col>

                  <!-- 業態 -->
                  <v-col cols="12" sm="6" md="4">
                    <div class="text-caption text-medium-emphasis mb-1">業態</div>
                    <v-select
                      v-if="editingPatterns[pIdx]"
                      v-model="pattern.businessCategory"
                      :items="businessCategoryOptions"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      placeholder="業態を選択"
                      @update:model-value="onBusinessCategoryChange(pIdx)"
                    />
                    <div v-else class="text-body-1">{{ pattern.businessCategory || '-' }}</div>
                  </v-col>

                  <!-- 業種 -->
                  <v-col cols="12" sm="6" md="4">
                    <div class="text-caption text-medium-emphasis mb-1">業種</div>
                    <v-select
                      v-if="editingPatterns[pIdx]"
                      v-model="pattern.businessType"
                      :items="getBusinessTypeOptions(pattern.businessCategory)"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      placeholder="業種を選択"
                      :disabled="!pattern.businessCategory"
                    />
                    <div v-else class="text-body-1">{{ pattern.businessType || '-' }}</div>
                  </v-col>

                  <!-- 物件取得予算上限 -->
                  <v-col cols="12" sm="6" md="4">
                    <div class="text-caption text-medium-emphasis mb-1">物件取得予算上限</div>
                    <v-text-field
                      v-if="editingPatterns[pIdx]"
                      v-model.number="pattern.maxBudget"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      type="number"
                      min="0"
                      suffix="万円"
                      placeholder="500"
                    />
                    <div v-else class="text-body-1">{{ pattern.maxBudget != null ? pattern.maxBudget + ' 万円' : '-' }}</div>
                  </v-col>

                  <!-- 賃料下限 -->
                  <v-col cols="12" sm="6" md="4">
                    <div class="text-caption text-medium-emphasis mb-1">賃料下限</div>
                    <v-text-field
                      v-if="editingPatterns[pIdx]"
                      v-model.number="pattern.rentMin"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      type="number"
                      min="0"
                      suffix="円"
                      placeholder="100000"
                    />
                    <div v-else class="text-body-1">{{ pattern.rentMin != null ? formatNumber(pattern.rentMin) + ' 円' : '-' }}</div>
                  </v-col>

                  <!-- 賃料上限 -->
                  <v-col cols="12" sm="6" md="4">
                    <div class="text-caption text-medium-emphasis mb-1">賃料上限</div>
                    <v-text-field
                      v-if="editingPatterns[pIdx]"
                      v-model.number="pattern.rentMax"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      type="number"
                      min="0"
                      suffix="円"
                      placeholder="250000"
                    />
                    <div v-else class="text-body-1">{{ pattern.rentMax != null ? formatNumber(pattern.rentMax) + ' 円' : '-' }}</div>
                  </v-col>

                  <!-- 坪数下限 -->
                  <v-col cols="12" sm="6" md="3">
                    <div class="text-caption text-medium-emphasis mb-1">坪数下限</div>
                    <v-text-field
                      v-if="editingPatterns[pIdx]"
                      v-model.number="pattern.tsuboMin"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      type="number"
                      min="0"
                      step="0.1"
                      suffix="坪"
                      placeholder="10"
                      @update:model-value="onTsuboMinChange(pIdx)"
                    />
                    <div v-else class="text-body-1">{{ pattern.tsuboMin != null ? pattern.tsuboMin + ' 坪' : '-' }}</div>
                  </v-col>

                  <!-- ㎡下限 -->
                  <v-col cols="12" sm="6" md="3">
                    <div class="text-caption text-medium-emphasis mb-1">㎡下限</div>
                    <v-text-field
                      v-if="editingPatterns[pIdx]"
                      v-model.number="pattern.sqmMin"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      type="number"
                      min="0"
                      step="0.01"
                      suffix="㎡"
                      placeholder="33.06"
                      @update:model-value="onSqmMinChange(pIdx)"
                    />
                    <div v-else class="text-body-1">{{ pattern.sqmMin != null ? pattern.sqmMin + ' ㎡' : '-' }}</div>
                  </v-col>

                  <!-- 坪数上限 -->
                  <v-col cols="12" sm="6" md="3">
                    <div class="text-caption text-medium-emphasis mb-1">坪数上限</div>
                    <v-text-field
                      v-if="editingPatterns[pIdx]"
                      v-model.number="pattern.tsuboMax"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      type="number"
                      min="0"
                      step="0.1"
                      suffix="坪"
                      placeholder="20"
                      @update:model-value="onTsuboMaxChange(pIdx)"
                    />
                    <div v-else class="text-body-1">{{ pattern.tsuboMax != null ? pattern.tsuboMax + ' 坪' : '-' }}</div>
                  </v-col>

                  <!-- ㎡上限 -->
                  <v-col cols="12" sm="6" md="3">
                    <div class="text-caption text-medium-emphasis mb-1">㎡上限</div>
                    <v-text-field
                      v-if="editingPatterns[pIdx]"
                      v-model.number="pattern.sqmMax"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      type="number"
                      min="0"
                      step="0.01"
                      suffix="㎡"
                      placeholder="66.12"
                      @update:model-value="onSqmMaxChange(pIdx)"
                    />
                    <div v-else class="text-body-1">{{ pattern.sqmMax != null ? pattern.sqmMax + ' ㎡' : '-' }}</div>
                  </v-col>

                  <!-- 希望引渡し状態 -->
                  <v-col cols="12" sm="6" md="4">
                    <div class="text-caption text-medium-emphasis mb-1">希望引渡し状態</div>
                    <v-select
                      v-if="editingPatterns[pIdx]"
                      v-model="pattern.deliveryCondition"
                      :items="deliveryConditionOptions"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                    />
                    <div v-else class="text-body-1">{{ pattern.deliveryCondition || '-' }}</div>
                  </v-col>

                  <!-- 可能フロア -->
                  <v-col cols="12" sm="6" md="4">
                    <div class="text-caption text-medium-emphasis mb-1">可能フロア</div>
                    <v-select
                      v-if="editingPatterns[pIdx]"
                      v-model="pattern.floors"
                      :items="floorOptions"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      multiple
                      chips
                      closable-chips
                    />
                    <div v-else>
                      <v-chip
                        v-for="floor in pattern.floors"
                        :key="floor"
                        size="x-small"
                        variant="tonal"
                        class="mr-1 mb-1"
                      >
                        {{ floor }}
                      </v-chip>
                      <span v-if="!pattern.floors || pattern.floors.length === 0">-</span>
                    </div>
                  </v-col>

                  <!-- 希望都道府県 -->
                  <v-col cols="12">
                    <div class="text-caption text-medium-emphasis mb-1">希望都道府県（近畿地方）</div>
                    <template v-if="editingPatterns[pIdx]">
                      <div class="d-flex flex-wrap ga-2">
                        <v-checkbox
                          v-for="pref in kinkiPrefectures"
                          :key="pref"
                          v-model="pattern.prefectures"
                          :label="pref"
                          :value="pref"
                          density="comfortable"
                          hide-details
                          class="prefecture-checkbox"
                        />
                      </div>
                    </template>
                    <div v-else>
                      <v-chip
                        v-for="pref in pattern.prefectures"
                        :key="pref"
                        size="small"
                        variant="tonal"
                        color="primary"
                        class="mr-1 mb-1"
                      >
                        {{ pref }}
                      </v-chip>
                      <span v-if="!pattern.prefectures || pattern.prefectures.length === 0">-</span>
                    </div>
                  </v-col>

                  <!-- 希望市区名 -->
                  <v-col cols="12" sm="6">
                    <div class="text-caption text-medium-emphasis mb-1">希望市区名</div>
                    <v-text-field
                      v-if="editingPatterns[pIdx]"
                      v-model="pattern.cities"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      placeholder="例: 中央区・北区・浪速区"
                    />
                    <div v-else class="text-body-1">{{ pattern.cities || '-' }}</div>
                  </v-col>

                  <!-- 希望町村丁目 -->
                  <v-col cols="12" sm="6">
                    <div class="text-caption text-medium-emphasis mb-1">希望町村丁目</div>
                    <v-text-field
                      v-if="editingPatterns[pIdx]"
                      v-model="pattern.towns"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      placeholder="例: 心斎橋筋1丁目"
                    />
                    <div v-else class="text-body-1">{{ pattern.towns || '-' }}</div>
                  </v-col>

                  <!-- 特殊条件 -->
                  <v-col cols="12">
                    <div class="text-caption text-medium-emphasis mb-1">特殊条件</div>
                    <v-textarea
                      v-if="editingPatterns[pIdx]"
                      v-model="pattern.specialConditions"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      rows="2"
                      auto-grow
                      placeholder="特殊な条件があれば入力"
                    />
                    <div v-else class="text-body-1" style="white-space: pre-wrap;">{{ pattern.specialConditions || '-' }}</div>
                  </v-col>

                  <!-- 検索用メモ -->
                  <v-col cols="12">
                    <div class="text-caption text-medium-emphasis mb-1">検索用メモ</div>
                    <v-textarea
                      v-if="editingPatterns[pIdx]"
                      v-model="pattern.patternMemo"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      rows="2"
                      auto-grow
                      placeholder="検索に使用するメモを入力"
                    />
                    <div v-else class="text-body-1" style="white-space: pre-wrap;">{{ pattern.patternMemo || '-' }}</div>
                  </v-col>
                </v-row>

                <!-- パターン保存ボタン -->
                <div v-if="editingPatterns[pIdx]" class="d-flex justify-end mt-4">
                  <v-btn color="primary" rounded="lg" @click="savePattern(pIdx)">
                    <v-icon start>mdi-content-save</v-icon>
                    このパターンを保存
                  </v-btn>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- 新しいパターンを追加 -->
        <v-btn
          variant="tonal"
          color="primary"
          rounded="lg"
          block
          class="mt-3"
          @click="addPattern"
        >
          <v-icon start>mdi-plus</v-icon>
          新しいパターンを追加
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- 削除確認ダイアログ -->
    <v-dialog v-model="showDeleteDialog" max-width="400" persistent>
      <v-card rounded="xl">
        <v-card-title class="text-h6 pa-4">
          <v-icon start color="error" size="22">mdi-alert-circle</v-icon>
          パターンの削除
        </v-card-title>
        <v-card-text class="pa-4 pt-0">
          「{{ deleteTargetName }}」を削除してもよろしいですか？この操作は取り消せません。
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="showDeleteDialog = false">キャンセル</v-btn>
          <v-btn color="error" variant="flat" rounded="lg" @click="executeDeletePattern">削除する</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['save-profile', 'save-preferences', 'show-snackbar'])

// ========================================
// Constants
// ========================================

const nationalityOptions = [
  '日本', '中国', '韓国', 'ベトナム', 'ネパール', 'インド', 'フィリピン', 'タイ', 'アメリカ', 'その他',
]

const businessCategoryOptions = ['飲食', '物販', 'サービス', '美容', '医療', '福祉', '娯楽']

const businessTypeMap = {
  '飲食': [
    '中華料理','韓国料理','フレンチ','イタリアン','スペイン料理','アメリカ料理','エスニック料理',
    'ネパール料理','インド料理','カレーライス','スパイスカレー','スープカレー','焼肉','焼鳥',
    'ステーキ・鉄板焼き','とんかつ','お好み焼き','串かつ','串焼き','鍋','しゃぶしゃぶ',
    '居酒屋','ダイニングバー','食堂','定食','レストラン','和食','寿司','丼','おでん','唐揚げ',
    '創作料理','ろばた焼き','たこ焼き','天ぷら','うなぎ','海鮮','ラーメン','うどん','そば',
    'パスタ','立ち飲み','バー','バル','シーシャ','ビアガーデン','クラブ','カフェ','喫茶店',
    'スイーツ','パン','ハンバーガー','ピザ','弁当','おにぎり','サンドイッチ',
  ],
  '物販': [
    '食品物販（調理なし）','ファッション','雑貨','コンビニ','ドラッグストア','スーパーマーケット',
  ],
  'サービス': ['事務所','スクール','民泊','スポーツジム','保育','風営店'],
  '美容': ['ヘアサロン','ネイルサロン','マツエクサロン','リラクサロン','エステサロン'],
  '医療': ['病院','歯科','クリニック','整体'],
  '福祉': ['保育施設','老人施設','障碍者施設'],
  '娯楽': [
    'カラオケ','ゴルフ','ネットカフェ','漫画喫茶','ゲームセンター','ボードゲーム',
    '写真スタジオ','音楽スタジオ','ホール','パチンコ',
  ],
}

const deliveryConditionOptions = ['スケルトン', '居抜き', 'どちらでも可']

const floorOptions = ['1階路面', '2階以上', '地下', '空中階']

const kinkiPrefectures = ['大阪府', '京都府', '兵庫県', '奈良県', '滋賀県', '和歌山県', '三重県']

const TSUBO_TO_SQM = 3.30579

// ========================================
// Profile state
// ========================================

const isEditingProfile = ref(false)
const profileBackup = ref(null)

const profile = ref({
  companyName: '株式会社サンプル',
  name: '山本大輔',
  nameKana: 'やまもとだいすけ',
  nationality: '日本',
  mobilePhone: '090-1234-5678',
  otherPhone: '',
  fax: '',
  loginEmail: 'yamamoto@example.com',
  contactEmails: ['yamamoto@example.com'],
  brandNames: ['ブランドA'],
  storeCount: 2,
  searchMemo: '',
})

// ========================================
// Preference patterns state
// ========================================

const preferencePatterns = ref([
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
    patternMemo: '',
  },
])

const editingPatterns = reactive({})
const patternBackups = reactive({})
const openPanels = ref([])

// Delete dialog
const showDeleteDialog = ref(false)
const deleteTargetIndex = ref(-1)
const deleteTargetName = ref('')

// Conversion lock to prevent infinite loops
let conversionLock = false

// ========================================
// Profile methods
// ========================================

function toggleProfileEdit() {
  if (!isEditingProfile.value) {
    profileBackup.value = JSON.parse(JSON.stringify(profile.value))
    isEditingProfile.value = true
  } else {
    profile.value = JSON.parse(JSON.stringify(profileBackup.value))
    profileBackup.value = null
    isEditingProfile.value = false
  }
}

function updateContactEmail(idx, value) {
  profile.value.contactEmails[idx] = value
}

function addContactEmail() {
  profile.value.contactEmails.push('')
}

function removeContactEmail(idx) {
  if (profile.value.contactEmails.length > 1) {
    profile.value.contactEmails.splice(idx, 1)
  }
}

function updateBrandName(idx, value) {
  profile.value.brandNames[idx] = value
}

function addBrandName() {
  profile.value.brandNames.push('')
}

function removeBrandName(idx) {
  if (profile.value.brandNames.length > 1) {
    profile.value.brandNames.splice(idx, 1)
  }
}

function saveProfile() {
  isEditingProfile.value = false
  profileBackup.value = null
  emit('save-profile', JSON.parse(JSON.stringify(profile.value)))
  emit('show-snackbar', 'プロフィールを保存しました')
}

// ========================================
// Pattern methods
// ========================================

function getBusinessTypeOptions(category) {
  return businessTypeMap[category] || []
}

function onBusinessCategoryChange(pIdx) {
  const pattern = preferencePatterns.value[pIdx]
  const validTypes = getBusinessTypeOptions(pattern.businessCategory)
  if (!validTypes.includes(pattern.businessType)) {
    pattern.businessType = ''
  }
}

function togglePatternEdit(pIdx) {
  if (!editingPatterns[pIdx]) {
    patternBackups[pIdx] = JSON.parse(JSON.stringify(preferencePatterns.value[pIdx]))
    editingPatterns[pIdx] = true
  } else {
    preferencePatterns.value[pIdx] = JSON.parse(JSON.stringify(patternBackups[pIdx]))
    delete patternBackups[pIdx]
    editingPatterns[pIdx] = false
  }
}

function savePattern(pIdx) {
  editingPatterns[pIdx] = false
  delete patternBackups[pIdx]
  emit('save-preferences', JSON.parse(JSON.stringify(preferencePatterns.value)))
  emit('show-snackbar', '出店希望条件を保存しました')
}

function addPattern() {
  const newId = preferencePatterns.value.length > 0
    ? Math.max(...preferencePatterns.value.map(p => p.id)) + 1
    : 1
  const newPattern = {
    id: newId,
    patternName: '',
    businessCategory: '',
    businessType: '',
    maxBudget: null,
    rentMin: null,
    rentMax: null,
    tsuboMin: null,
    tsuboMax: null,
    sqmMin: null,
    sqmMax: null,
    deliveryCondition: '',
    prefectures: [],
    cities: '',
    towns: '',
    floors: [],
    specialConditions: '',
    patternMemo: '',
  }
  preferencePatterns.value.push(newPattern)
  const newIdx = preferencePatterns.value.length - 1
  editingPatterns[newIdx] = true
  openPanels.value.push(newIdx)
}

function confirmDeletePattern(pIdx) {
  deleteTargetIndex.value = pIdx
  deleteTargetName.value = preferencePatterns.value[pIdx].patternName || '未設定のパターン'
  showDeleteDialog.value = true
}

function executeDeletePattern() {
  const pIdx = deleteTargetIndex.value
  if (pIdx >= 0 && pIdx < preferencePatterns.value.length) {
    preferencePatterns.value.splice(pIdx, 1)
    // Clean up editing state for removed and shifted indices
    const newEditing = {}
    const newBackups = {}
    Object.keys(editingPatterns).forEach(key => {
      const k = Number(key)
      if (k < pIdx) {
        newEditing[k] = editingPatterns[k]
        if (patternBackups[k]) newBackups[k] = patternBackups[k]
      } else if (k > pIdx) {
        newEditing[k - 1] = editingPatterns[k]
        if (patternBackups[k]) newBackups[k - 1] = patternBackups[k]
      }
    })
    Object.keys(editingPatterns).forEach(k => delete editingPatterns[k])
    Object.assign(editingPatterns, newEditing)
    Object.keys(patternBackups).forEach(k => delete patternBackups[k])
    Object.assign(patternBackups, newBackups)

    emit('save-preferences', JSON.parse(JSON.stringify(preferencePatterns.value)))
    emit('show-snackbar', 'パターンを削除しました')
  }
  showDeleteDialog.value = false
  deleteTargetIndex.value = -1
}

// ========================================
// Tsubo <-> SQM conversion
// ========================================

function roundTo(value, decimals) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

function onTsuboMinChange(pIdx) {
  if (conversionLock) return
  conversionLock = true
  const pattern = preferencePatterns.value[pIdx]
  if (pattern.tsuboMin != null && pattern.tsuboMin !== '') {
    pattern.sqmMin = roundTo(Number(pattern.tsuboMin) * TSUBO_TO_SQM, 2)
  } else {
    pattern.sqmMin = null
  }
  conversionLock = false
}

function onTsuboMaxChange(pIdx) {
  if (conversionLock) return
  conversionLock = true
  const pattern = preferencePatterns.value[pIdx]
  if (pattern.tsuboMax != null && pattern.tsuboMax !== '') {
    pattern.sqmMax = roundTo(Number(pattern.tsuboMax) * TSUBO_TO_SQM, 2)
  } else {
    pattern.sqmMax = null
  }
  conversionLock = false
}

function onSqmMinChange(pIdx) {
  if (conversionLock) return
  conversionLock = true
  const pattern = preferencePatterns.value[pIdx]
  if (pattern.sqmMin != null && pattern.sqmMin !== '') {
    pattern.tsuboMin = roundTo(Number(pattern.sqmMin) / TSUBO_TO_SQM, 2)
  } else {
    pattern.tsuboMin = null
  }
  conversionLock = false
}

function onSqmMaxChange(pIdx) {
  if (conversionLock) return
  conversionLock = true
  const pattern = preferencePatterns.value[pIdx]
  if (pattern.sqmMax != null && pattern.sqmMax !== '') {
    pattern.tsuboMax = roundTo(Number(pattern.sqmMax) / TSUBO_TO_SQM, 2)
  } else {
    pattern.tsuboMax = null
  }
  conversionLock = false
}

// ========================================
// Utility
// ========================================

function formatNumber(num) {
  if (num == null) return ''
  return num.toLocaleString()
}
</script>

<style scoped>
.profile-section {
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.prefecture-checkbox {
  flex: 0 0 auto;
}

.prefecture-checkbox :deep(.v-label) {
  font-size: 0.875rem;
}

.v-expansion-panel {
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.v-expansion-panel::before {
  box-shadow: none;
}
</style>
