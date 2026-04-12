import { ref, computed } from 'vue'
import { useSupabase } from './useSupabase'
import { useClientAuth } from './useClientAuth'

export interface ClientNotice {
  id: string
  title: string
  message: string
  notice_type: string   // info / success / warning / error
  icon: string          // mdi-xxx
  target_type: string   // all / user / property
  target_property_id: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
}

export interface ClientNoticeRead {
  id: string
  user_id: string
  notice_id: string
  read_at: string
}

export const useClientNotices = () => {
  const notices = ref<ClientNotice[]>([])
  const readNoticeIds = ref<Set<string>>(new Set())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getSupabase = () => useSupabase()
  const { currentUser } = useClientAuth()

  // 未読件数
  const unreadCount = computed(() =>
    notices.value.filter(n => !readNoticeIds.value.has(n.id)).length
  )

  // 既読かどうか
  const isRead = (noticeId: string) => readNoticeIds.value.has(noticeId)

  // notice_type → Vuetify color マッピング
  const getNoticeColor = (type: string) => {
    const map: Record<string, string> = {
      info: 'info',
      success: 'success',
      warning: 'warning',
      error: 'error',
    }
    return map[type] || 'primary'
  }

  // ─── お知らせ一覧取得 ───
  const fetchNotices = async () => {
    if (!currentUser.value) return
    loading.value = true
    error.value = null

    try {
      const supabase = getSupabase()

      // お知らせ取得（RLSで自分に見えるものだけ返る）
      const { data: noticesData, error: noticesError } = await supabase
        .from('MIYAKO_CLIENT_NOTICES')
        .select('*')
        .order('published_at', { ascending: false, nullsFirst: false })

      if (noticesError) throw noticesError
      notices.value = (noticesData || []) as ClientNotice[]

      // 既読状態取得
      const { data: readsData, error: readsError } = await supabase
        .from('MIYAKO_CLIENT_NOTICE_READS')
        .select('notice_id')
        .eq('user_id', currentUser.value.id)

      if (readsError) throw readsError
      readNoticeIds.value = new Set((readsData || []).map(r => r.notice_id))
    } catch (e: any) {
      error.value = e.message || 'お知らせの取得に失敗しました'
      console.error('fetchNotices error:', e)
    } finally {
      loading.value = false
    }
  }

  // ─── 既読にする ───
  const markAsRead = async (noticeId: string): Promise<boolean> => {
    if (!currentUser.value) return false
    if (readNoticeIds.value.has(noticeId)) return true // 既に既読

    try {
      const supabase = getSupabase()
      const { error: insertError } = await supabase
        .from('MIYAKO_CLIENT_NOTICE_READS')
        .insert({
          user_id: currentUser.value.id,
          notice_id: noticeId,
        })

      if (insertError && !insertError.message?.includes('duplicate')) {
        throw insertError
      }

      readNoticeIds.value.add(noticeId)
      return true
    } catch (e: any) {
      console.error('markAsRead error:', e)
      return false
    }
  }

  // ─── 全て既読にする ───
  const markAllAsRead = async (): Promise<boolean> => {
    if (!currentUser.value) return false

    try {
      const supabase = getSupabase()
      const unreadIds = notices.value
        .filter(n => !readNoticeIds.value.has(n.id))
        .map(n => ({
          user_id: currentUser.value!.id,
          notice_id: n.id,
        }))

      if (unreadIds.length === 0) return true

      const { error: insertError } = await supabase
        .from('MIYAKO_CLIENT_NOTICE_READS')
        .upsert(unreadIds, { onConflict: 'user_id,notice_id' })

      if (insertError) throw insertError

      notices.value.forEach(n => readNoticeIds.value.add(n.id))
      return true
    } catch (e: any) {
      console.error('markAllAsRead error:', e)
      return false
    }
  }

  return {
    notices,
    loading,
    error,
    unreadCount,
    isRead,
    getNoticeColor,
    fetchNotices,
    markAsRead,
    markAllAsRead,
  }
}
