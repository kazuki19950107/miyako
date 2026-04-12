import { ref, computed } from 'vue'
import { useSupabase } from './useSupabase'
import { useClientAuth } from './useClientAuth'

export interface ClientInquiry {
  id: string
  user_id: string
  property_id: string
  message: string | null
  inquiry_type: string
  status: string
  created_at: string
  updated_at: string
}

export const useClientInquiries = () => {
  const inquiries = ref<ClientInquiry[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getSupabase = () => useSupabase()
  const { currentUser } = useClientAuth()

  // 問い合わせ済み物件IDの一覧
  const inquiredPropertyIds = computed(() =>
    new Set(inquiries.value.map(i => i.property_id))
  )

  // 指定の物件が問い合わせ済みか
  const isInquired = (propertyId: string) => inquiredPropertyIds.value.has(propertyId)

  // 指定の物件の問い合わせを取得
  const getInquiry = (propertyId: string) =>
    inquiries.value.find(i => i.property_id === propertyId) || null

  // ─── 一覧取得 ───
  const fetchInquiries = async () => {
    if (!currentUser.value) return
    loading.value = true
    error.value = null

    try {
      const supabase = getSupabase()
      const { data, error: fetchError } = await supabase
        .from('MIYAKO_CLIENT_INQUIRIES')
        .select('*')
        .eq('user_id', currentUser.value.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      inquiries.value = data as ClientInquiry[]
    } catch (e: any) {
      error.value = e.message || '問い合わせの取得に失敗しました'
      console.error('fetchInquiries error:', e)
    } finally {
      loading.value = false
    }
  }

  // ─── 問い合わせ送信 ───
  const submitInquiry = async (params: {
    propertyId: string
    message?: string
    inquiryType?: string
  }): Promise<boolean> => {
    if (!currentUser.value) return false
    loading.value = true
    error.value = null

    try {
      const supabase = getSupabase()
      const { data, error: insertError } = await supabase
        .from('MIYAKO_CLIENT_INQUIRIES')
        .insert({
          user_id: currentUser.value.id,
          property_id: params.propertyId,
          message: params.message || null,
          inquiry_type: params.inquiryType || '一般',
        })
        .select()
        .single()

      if (insertError) throw insertError
      inquiries.value.unshift(data as ClientInquiry)
      return true
    } catch (e: any) {
      if (e.message?.includes('duplicate') || e.code === '23505') {
        error.value = 'この物件には既に問い合わせ済みです'
      } else {
        error.value = e.message || '問い合わせの送信に失敗しました'
      }
      console.error('submitInquiry error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    inquiries,
    loading,
    error,
    inquiredPropertyIds,
    isInquired,
    getInquiry,
    fetchInquiries,
    submitInquiry,
  }
}
