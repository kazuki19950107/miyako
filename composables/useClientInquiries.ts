import { ref, computed } from 'vue'
import { useSupabase } from './useSupabase'
import { useClientAuth } from './useClientAuth'

export type InquiryStatus = 'pending' | 'approved' | 'rejected'
export type RequestType = 'document' | 'consultation' | 'viewing' | 'contract'

export interface ClientInquiry {
  id: string
  user_id: string
  property_id: string
  message: string | null
  inquiry_type: string
  request_types: RequestType[]
  status: InquiryStatus
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

  // 物件IDの承認状態（none / pending / approved / rejected）
  const getApprovalStatus = (propertyId: string): InquiryStatus | 'none' => {
    const inq = getInquiry(propertyId)
    return (inq?.status as InquiryStatus) || 'none'
  }

  // 詳細閲覧可能か（承認済みのみ）
  const canViewFullDetails = (propertyId: string) =>
    getApprovalStatus(propertyId) === 'approved'

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
      inquiries.value = (data || []) as ClientInquiry[]
    } catch (e: any) {
      error.value = e.message || '問い合わせの取得に失敗しました'
      console.error('fetchInquiries error:', e)
    } finally {
      loading.value = false
    }
  }

  // ─── 問い合わせ送信／更新（user_id × property_id でユニークなので upsert） ───
  const submitInquiry = async (params: {
    propertyId: string
    message?: string
    inquiryType?: string
    requestTypes?: RequestType[]
  }): Promise<boolean> => {
    if (!currentUser.value) return false
    loading.value = true
    error.value = null

    try {
      const supabase = getSupabase()
      const payload = {
        user_id: currentUser.value.id,
        property_id: params.propertyId,
        message: params.message || null,
        inquiry_type: params.inquiryType || '詳細閲覧申請',
        request_types: params.requestTypes || [],
        // 既存レコードがある場合はpending(再申請)として上書き、status初期値を明示
        status: 'pending' as InquiryStatus,
      }

      const { data, error: upsertError } = await supabase
        .from('MIYAKO_CLIENT_INQUIRIES')
        .upsert(payload, { onConflict: 'user_id,property_id' })
        .select()
        .single()

      if (upsertError) throw upsertError

      // ローカルキャッシュを更新（既存レコードを置換 or 追加）
      const idx = inquiries.value.findIndex(i => i.property_id === params.propertyId)
      if (idx >= 0) {
        inquiries.value.splice(idx, 1, data as ClientInquiry)
      } else {
        inquiries.value.unshift(data as ClientInquiry)
      }
      return true
    } catch (e: any) {
      error.value = e.message || '問い合わせの送信に失敗しました'
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
    getApprovalStatus,
    canViewFullDetails,
    fetchInquiries,
    submitInquiry,
  }
}
