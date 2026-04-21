import { ref, computed } from 'vue'
import { useSupabase } from './useSupabase'
import type { User } from '@supabase/supabase-js'

// クライアント（出店希望者）のプロフィール型
export interface ClientProfile {
  id: string
  email: string
  name: string
  phone: string | null
  company_name: string | null
  store_preferences: any[] | null
  is_active: boolean
  deleted_at: string | null
  deletion_reason: string | null
  created_at: string
  updated_at: string
}

// お問合せ先（削除済みアカウント案内に使用）
export const SUPPORT_EMAIL = 'info@miyako-inuki.jp'

// 認証エラーの種類（UI 側でモーダル/スナックバーを切り替えるために使用）
export type AuthErrorType = 'deleted_account' | null

// 状態をモジュールレベルで保持（シングルトン）
const currentUser = ref<User | null>(null)
const clientProfile = ref<ClientProfile | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const errorType = ref<AuthErrorType>(null)
const initialized = ref(false)

export const useClientAuth = () => {
  const getSupabase = () => useSupabase()

  // ─── Computed ───
  const isLoggedIn = computed(() => !!currentUser.value)
  const userName = computed(() => clientProfile.value?.name || '')
  const userEmail = computed(() => clientProfile.value?.email || currentUser.value?.email || '')

  // ─── プロフィール取得 ───
  const fetchProfile = async (userId: string): Promise<ClientProfile | null> => {
    try {
      const supabase = getSupabase()
      const { data, error: fetchError } = await supabase
        .from('MIYAKO_CLIENT_USERS')
        .select('*')
        .eq('id', userId)
        .single()

      if (fetchError) throw fetchError
      clientProfile.value = data as ClientProfile
      return data as ClientProfile
    } catch (e: any) {
      console.error('fetchProfile error:', e)
      return null
    }
  }

  // ─── 初期化（セッション復元） ───
  const initialize = async () => {
    if (initialized.value) return
    initialized.value = true

    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        currentUser.value = session.user
        await fetchProfile(session.user.id)
      }

      // セッション変化を監視
      supabase.auth.onAuthStateChange(async (event, session) => {
        currentUser.value = session?.user || null
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          clientProfile.value = null
        }
      })
    } catch (e: any) {
      console.error('auth initialize error:', e)
    }
  }

  // ─── サインアップ ───
  const signUp = async (params: {
    email: string
    password: string
    name: string
    phone?: string
  }): Promise<boolean> => {
    loading.value = true
    error.value = null
    errorType.value = null

    try {
      // 事前チェック: 既登録 / 削除済みアカウントの判定
      // (Supabase Auth は同一 email を再利用できないため、削除済みかどうかで案内を出し分ける)
      try {
        const check = await $fetch<{
          email_exists: boolean
          email_deleted: boolean
          phone_exists: boolean
          phone_deleted: boolean
        }>('/api/check-existing-account', {
          method: 'POST',
          body: { email: params.email, phone: params.phone || '' },
        })

        if (check.email_deleted || check.phone_deleted) {
          error.value = `過去に登録があります。アカウントの再開をご希望の場合は ${SUPPORT_EMAIL} までお問い合わせください。`
          errorType.value = 'deleted_account'
          return false
        }
        if (check.email_exists) {
          error.value = 'このメールアドレスは既に登録されています'
          return false
        }
        if (check.phone_exists) {
          error.value = 'この電話番号は既に登録されています'
          return false
        }
      } catch (checkErr) {
        // チェック失敗は致命的にしない（Supabase Auth 側でも email 重複は弾ける）
        console.warn('check-existing-account skipped:', checkErr)
      }

      const supabase = getSupabase()

      // Supabase Auth でユーザー作成（メタデータにname/phoneを含める）
      // MIYAKO_CLIENT_USERS へのINSERTはDBトリガーで自動実行される
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            name: params.name,
            phone: params.phone || null,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('ユーザー作成に失敗しました')

      currentUser.value = authData.user
      await fetchProfile(authData.user.id)

      return true
    } catch (e: any) {
      const msg = e.message || 'アカウント作成に失敗しました'
      // よくあるエラーを日本語化
      if (msg.includes('already registered')) {
        error.value = 'このメールアドレスは既に登録されています'
      } else if (msg.includes('password')) {
        error.value = 'パスワードは6文字以上で設定してください'
      } else {
        error.value = msg
      }
      console.error('signUp error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  // ─── ログイン ───
  const signIn = async (email: string, password: string): Promise<boolean> => {
    loading.value = true
    error.value = null
    errorType.value = null

    try {
      const supabase = getSupabase()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError
      if (!data.user) throw new Error('ログインに失敗しました')

      currentUser.value = data.user
      await fetchProfile(data.user.id)

      // プロフィールが見つからない場合（auth.usersにはいるがプロフィール未作成）
      if (!clientProfile.value) {
        error.value = 'アカウント情報が見つかりません。新規登録してください。'
        await supabase.auth.signOut()
        currentUser.value = null
        return false
      }

      // ユーザー自身による削除（ソフトデリート）
      if (clientProfile.value.deleted_at) {
        error.value = `このアカウントは削除されています。再開をご希望の場合は ${SUPPORT_EMAIL} までお問い合わせください。`
        errorType.value = 'deleted_account'
        await supabase.auth.signOut()
        currentUser.value = null
        clientProfile.value = null
        return false
      }

      // 管理者による無効化
      if (!clientProfile.value.is_active) {
        error.value = 'このアカウントは無効になっています。お問い合わせください。'
        await supabase.auth.signOut()
        currentUser.value = null
        clientProfile.value = null
        return false
      }

      return true
    } catch (e: any) {
      const msg = e.message || 'ログインに失敗しました'
      if (msg.includes('Invalid login credentials')) {
        error.value = 'メールアドレスまたはパスワードが間違っています'
      } else {
        error.value = msg
      }
      console.error('signIn error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  // ─── ログアウト ───
  const signOut = async () => {
    try {
      const supabase = getSupabase()
      await supabase.auth.signOut()
      currentUser.value = null
      clientProfile.value = null
    } catch (e: any) {
      console.error('signOut error:', e)
    }
  }

  // ─── 出店希望条件の保存 ───
  const saveStorePreferences = async (patterns: any[]): Promise<boolean> => {
    if (!currentUser.value) return false
    loading.value = true
    error.value = null

    try {
      const supabase = getSupabase()
      const { error: updateError } = await supabase
        .from('MIYAKO_CLIENT_USERS')
        .update({ store_preferences: patterns })
        .eq('id', currentUser.value.id)

      if (updateError) throw updateError

      if (clientProfile.value) {
        clientProfile.value = { ...clientProfile.value, store_preferences: patterns }
      }
      return true
    } catch (e: any) {
      error.value = e.message || '出店希望条件の保存に失敗しました'
      console.error('saveStorePreferences error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  // ─── プロフィール更新 ───
  const updateProfile = async (updates: {
    name?: string
    phone?: string
    company_name?: string
  }): Promise<boolean> => {
    if (!currentUser.value) return false
    loading.value = true
    error.value = null

    try {
      const supabase = getSupabase()
      const { error: updateError } = await supabase
        .from('MIYAKO_CLIENT_USERS')
        .update(updates)
        .eq('id', currentUser.value.id)

      if (updateError) throw updateError

      // ローカル更新
      if (clientProfile.value) {
        clientProfile.value = { ...clientProfile.value, ...updates }
      }
      return true
    } catch (e: any) {
      error.value = e.message || 'プロフィール更新に失敗しました'
      console.error('updateProfile error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  // ─── アカウント削除（ソフトデリート） ───
  // データは残したまま is_active=false + deleted_at をセットしてログアウト。
  // 同 email/phone での再登録は signUp 時にブロックされる。
  const deleteAccount = async (reason?: string): Promise<boolean> => {
    if (!currentUser.value) return false
    loading.value = true
    error.value = null

    try {
      const supabase = getSupabase()
      const { error: updateError } = await supabase
        .from('MIYAKO_CLIENT_USERS')
        .update({
          is_active: false,
          deleted_at: new Date().toISOString(),
          deletion_reason: reason || null,
        })
        .eq('id', currentUser.value.id)

      if (updateError) throw updateError

      await supabase.auth.signOut()
      currentUser.value = null
      clientProfile.value = null
      return true
    } catch (e: any) {
      error.value = e.message || 'アカウント削除に失敗しました'
      console.error('deleteAccount error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // 状態
    currentUser: computed(() => currentUser.value),
    clientProfile: computed(() => clientProfile.value),
    loading: computed(() => loading.value),
    error,
    errorType,
    isLoggedIn,
    userName,
    userEmail,
    // メソッド
    initialize,
    signUp,
    signIn,
    signOut,
    updateProfile,
    saveStorePreferences,
    fetchProfile,
    deleteAccount,
  }
}
