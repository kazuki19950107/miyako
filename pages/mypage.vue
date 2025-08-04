<template>
  <div>
    <VRow>
      <VCol cols="12">
        <VCard elevation="2" class="mb-6">
          <VCardTitle class="text-h4 text-center py-6">
            <VIcon size="large" class="mr-3">mdi-account-circle</VIcon>
            マイページ
          </VCardTitle>
        </VCard>
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12" md="3">
        <VCard elevation="2">
          <VList>
            <VListItem
              v-for="tab in tabs"
              :key="tab.key"
              :class="{ 'v-list-item--active': activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              <VListItemIcon>
                <VIcon>{{ tab.icon }}</VIcon>
              </VListItemIcon>
              <VListItemContent>
                <VListItemTitle>{{ tab.title }}</VListItemTitle>
              </VListItemContent>
            </VListItem>
          </VList>
        </VCard>
      </VCol>

      <VCol cols="12" md="9">
        <!-- 退店情報タブ -->
        <VCard v-if="activeTab === 'exit'" elevation="2">
          <VCardTitle>
            <VIcon class="mr-2">mdi-store-remove</VIcon>
            退店物件情報
          </VCardTitle>
          <VCardText>
            <VRow v-if="exitProperties.length > 0">
              <VCol
                v-for="property in exitProperties"
                :key="property.id"
                cols="12"
              >
                <VCard outlined class="mb-4">
                  <VCardTitle class="text-h6">
                    {{ property.storeName || '店舗名未設定' }}
                  </VCardTitle>
                  <VCardText>
                    <VRow>
                      <VCol cols="12" md="6">
                        <VList dense>
                          <VListItem>
                            <VListItemContent>
                              <VListItemTitle>所在地</VListItemTitle>
                              <VListItemSubtitle>{{ property.location }}</VListItemSubtitle>
                            </VListItemContent>
                          </VListItem>
                          <VListItem>
                            <VListItemContent>
                              <VListItemTitle>坪数</VListItemTitle>
                              <VListItemSubtitle>{{ property.area }}坪</VListItemSubtitle>
                            </VListItemContent>
                          </VListItem>
                          <VListItem>
                            <VListItemContent>
                              <VListItemTitle>月額家賃</VListItemTitle>
                              <VListItemSubtitle>{{ property.rent?.toLocaleString() }}円</VListItemSubtitle>
                            </VListItemContent>
                          </VListItem>
                          <VListItem>
                            <VListItemContent>
                              <VListItemTitle>業態</VListItemTitle>
                              <VListItemSubtitle>{{ property.businessType }}</VListItemSubtitle>
                            </VListItemContent>
                          </VListItem>
                        </VList>
                      </VCol>
                      <VCol cols="12" md="6">
                        <VCard color="primary" dark>
                          <VCardTitle class="text-h6">査定結果</VCardTitle>
                          <VCardText>
                            <div class="text-h4">{{ property.assessment?.toLocaleString() }}円</div>
                            <div class="text-body-2">推定譲渡価格</div>
                          </VCardText>
                        </VCard>
                      </VCol>
                    </VRow>
                  </VCardText>
                  <VCardActions>
                    <VBtn color="primary" outlined>
                      <VIcon class="mr-2">mdi-pencil</VIcon>
                      編集
                    </VBtn>
                    <VBtn color="info" outlined>
                      <VIcon class="mr-2">mdi-eye</VIcon>
                      詳細
                    </VBtn>
                  </VCardActions>
                </VCard>
              </VCol>
            </VRow>
            <VAlert v-else type="info" outlined>
              退店物件の登録がありません。
              <NuxtLink to="/assessment">査定を開始する</NuxtLink>
            </VAlert>
          </VCardText>
        </VCard>

        <!-- 出店希望タブ -->
        <VCard v-if="activeTab === 'enter'" elevation="2">
          <VCardTitle>
            <VIcon class="mr-2">mdi-store-plus</VIcon>
            出店希望条件
          </VCardTitle>
          <VCardText>
            <VRow v-if="enterPreferences.length > 0">
              <VCol
                v-for="preference in enterPreferences"
                :key="preference.id"
                cols="12"
              >
                <VCard outlined class="mb-4">
                  <VCardTitle class="text-h6">
                    希望条件 #{{ preference.id }}
                  </VCardTitle>
                  <VCardText>
                    <VList dense>
                      <VListItem>
                        <VListItemContent>
                          <VListItemTitle>希望エリア</VListItemTitle>
                          <VListItemSubtitle>{{ preference.area }}</VListItemSubtitle>
                        </VListItemContent>
                      </VListItem>
                      <VListItem>
                        <VListItemContent>
                          <VListItemTitle>希望業態</VListItemTitle>
                          <VListItemSubtitle>{{ preference.businessType }}</VListItemSubtitle>
                        </VListItemContent>
                      </VListItem>
                      <VListItem>
                        <VListItemContent>
                          <VListItemTitle>希望坪数</VListItemTitle>
                          <VListItemSubtitle>{{ preference.desiredArea }}坪</VListItemSubtitle>
                        </VListItemContent>
                      </VListItem>
                      <VListItem>
                        <VListItemContent>
                          <VListItemTitle>希望賃料</VListItemTitle>
                          <VListItemSubtitle>{{ preference.maxRent?.toLocaleString() }}円</VListItemSubtitle>
                        </VListItemContent>
                      </VListItem>
                      <VListItem>
                        <VListItemContent>
                          <VListItemTitle>出店時期</VListItemTitle>
                          <VListItemSubtitle>{{ preference.openingPeriod }}</VListItemSubtitle>
                        </VListItemContent>
                      </VListItem>
                    </VList>
                  </VCardText>
                  <VCardActions>
                    <VBtn color="primary" outlined>
                      <VIcon class="mr-2">mdi-pencil</VIcon>
                      編集
                    </VBtn>
                  </VCardActions>
                </VCard>
              </VCol>
            </VRow>
            <VAlert v-else type="info" outlined>
              出店希望条件の登録がありません。
              <NuxtLink to="/register">会員登録する</NuxtLink>
            </VAlert>
          </VCardText>
        </VCard>

        <!-- マッチング物件タブ -->
        <VCard v-if="activeTab === 'matching'" elevation="2">
          <VCardTitle>
            <VIcon class="mr-2">mdi-handshake</VIcon>
            マッチング物件
          </VCardTitle>
          <VCardText>
            <VRow v-if="matchingProperties.length > 0">
              <VCol
                v-for="property in matchingProperties"
                :key="property.id"
                cols="12" md="6"
              >
                <VCard outlined class="mb-4">
                  <VCardTitle class="text-h6">
                    {{ property.storeName }}
                  </VCardTitle>
                  <VCardText>
                    <VList dense>
                      <VListItem>
                        <VListItemContent>
                          <VListItemTitle>所在地</VListItemTitle>
                          <VListItemSubtitle>{{ property.location }}</VListItemSubtitle>
                        </VListItemContent>
                      </VListItem>
                      <VListItem>
                        <VListItemContent>
                          <VListItemTitle>坪数・家賃</VListItemTitle>
                          <VListItemSubtitle>{{ property.area }}坪 / {{ property.rent?.toLocaleString() }}円</VListItemSubtitle>
                        </VListItemContent>
                      </VListItem>
                      <VListItem>
                        <VListItemContent>
                          <VListItemTitle>マッチング度</VListItemTitle>
                          <VListItemSubtitle>
                            <VProgressLinear
                              :value="property.matchScore"
                              color="success"
                              height="6"
                            />
                            {{ property.matchScore }}%
                          </VListItemSubtitle>
                        </VListItemContent>
                      </VListItem>
                    </VList>
                  </VCardText>
                  <VCardActions>
                    <VBtn color="success" outlined>
                      <VIcon class="mr-2">mdi-heart</VIcon>
                      お気に入り
                    </VBtn>
                    <VBtn color="primary" outlined>
                      <VIcon class="mr-2">mdi-email</VIcon>
                      問い合わせ
                    </VBtn>
                  </VCardActions>
                </VCard>
              </VCol>
            </VRow>
            <VAlert v-else type="info" outlined>
              現在、マッチング物件はありません。
            </VAlert>
          </VCardText>
        </VCard>

        <!-- 営業連絡タブ -->
        <VCard v-if="activeTab === 'contact'" elevation="2">
          <VCardTitle>
            <VIcon class="mr-2">mdi-message</VIcon>
            営業連絡
          </VCardTitle>
          <VCardText>
            <VRow v-if="contacts.length > 0">
              <VCol
                v-for="contact in contacts"
                :key="contact.id"
                cols="12"
              >
                <VCard outlined class="mb-4">
                  <VCardTitle class="text-h6">
                    {{ contact.title }}
                    <VChip
                      :color="contact.isRead ? 'success' : 'warning'"
                      small
                      class="ml-2"
                    >
                      {{ contact.isRead ? '既読' : '未読' }}
                    </VChip>
                  </VCardTitle>
                  <VCardText>
                    <p>{{ contact.message }}</p>
                    <small class="text-muted">{{ contact.date }}</small>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
            <VAlert v-else type="info" outlined>
              営業連絡はありません。
            </VAlert>
          </VCardText>
        </VCard>

        <!-- プロフィール設定タブ -->
        <VCard v-if="activeTab === 'profile'" elevation="2">
          <VCardTitle>
            <VIcon class="mr-2">mdi-account-settings</VIcon>
            プロフィール設定
          </VCardTitle>
          <VCardText>
            <VForm>
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profile.name"
                    label="氏名"
                    outlined
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profile.email"
                    label="メールアドレス"
                    type="email"
                    outlined
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profile.phone"
                    label="電話番号"
                    outlined
                  />
                </VCol>
                <VCol cols="12">
                  <VBtn color="primary" size="large">
                    <VIcon class="mr-2">mdi-content-save</VIcon>
                    保存
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
// ページのメタデータ設定
useHead({
  title: 'マイページ - 居抜き物件システム',
  meta: [
    { name: 'description', content: 'マイページで物件情報やマッチング状況を確認' }
  ]
})

// タブの設定
const tabs = [
  { key: 'exit', title: '退店情報', icon: 'mdi-store-remove' },
  { key: 'enter', title: '出店希望', icon: 'mdi-store-plus' },
  { key: 'matching', title: 'マッチング', icon: 'mdi-handshake' },
  { key: 'contact', title: '営業連絡', icon: 'mdi-message' },
  { key: 'profile', title: 'プロフィール', icon: 'mdi-account-settings' }
]

// アクティブなタブ
const activeTab = ref('exit')

// サンプルデータ
const exitProperties = ref([
  {
    id: 1,
    storeName: '居酒屋○○',
    location: '東京都渋谷区',
    area: 15,
    rent: 200000,
    businessType: '居酒屋',
    assessment: 500000
  }
])

const enterPreferences = ref([
  {
    id: 1,
    area: '渋谷区・新宿区',
    businessType: 'カフェ',
    desiredArea: '10-20',
    maxRent: 150000,
    openingPeriod: '3ヶ月以内'
  }
])

const matchingProperties = ref([
  {
    id: 1,
    storeName: 'カフェ△△',
    location: '東京都新宿区',
    area: 12,
    rent: 180000,
    matchScore: 85
  },
  {
    id: 2,
    storeName: 'レストラン□□',
    location: '東京都渋谷区',
    area: 18,
    rent: 220000,
    matchScore: 72
  }
])

const contacts = ref([
  {
    id: 1,
    title: '新規マッチング物件のご案内',
    message: 'ご希望条件にマッチする物件が見つかりました。詳細をご確認ください。',
    date: '2025-07-15',
    isRead: false
  },
  {
    id: 2,
    title: '査定結果のご連絡',
    message: '査定が完了いたしました。結果をご確認ください。',
    date: '2025-07-14',
    isRead: true
  }
])

const profile = ref({
  name: '田中太郎',
  email: 'tanaka@example.com',
  phone: '090-1234-5678'
})
</script>