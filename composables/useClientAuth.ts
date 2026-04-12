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
  is_active: boolean
  created_at: string
  updated_at: string
}

// 状態をモジュールレベルで保持（シングルトン）
const currentUser = ref<User | null>(null)
const clientProfile = ref<ClientProfile | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
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

    try {
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

      // アカウント無効チェック
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

  return {
    // 状態
    currentUser: computed(() => currentUser.value),
    clientProfile: computed(() => clientProfile.value),
    loading: computed(() => loading.value),
    error,
    isLoggedIn,
    userName,
    userEmail,
    // メソッド
    initialize,
    signUp,
    signIn,
    signOut,
    updateProfile,
    fetchProfile,
  }
}
