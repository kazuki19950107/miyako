import { ref, computed } from 'vue'
import { useSupabase } from './useSupabase'
import { useClientAuth } from './useClientAuth'

export interface ClientFavorite {
  id: string
  user_id: string
  property_id: string
  created_at: string
}

export const useClientFavorites = () => {
  const favorites = ref<ClientFavorite[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getSupabase = () => useSupabase()
  const { currentUser } = useClientAuth()

  // お気に入り物件IDの一覧（高速チェック用）
  const favoritePropertyIds = computed(() =>
    new Set(favorites.value.map(f => f.property_id))
  )

  // 指定の物件がお気に入りか
  const isFavorite = (propertyId: string) => favoritePropertyIds.value.has(propertyId)

  // ─── 一覧取得 ───
  const fetchFavorites = async () => {
    if (!currentUser.value) return
    loading.value = true
    error.value = null

    try {
      const supabase = getSupabase()
      const { data, error: fetchError } = await supabase
        .from('MIYAKO_CLIENT_FAVORITES')
        .select('*')
        .eq('user_id', currentUser.value.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      favorites.value = data as ClientFavorite[]
    } catch (e: any) {
      error.value = e.message || 'お気に入りの取得に失敗しました'
      console.error('fetchFavorites error:', e)
    } finally {
      loading.value = false
    }
  }

  // ─── 追加 ───
  const addFavorite = async (propertyId: string): Promise<boolean> => {
    if (!currentUser.value) return false
    error.value = null

    try {
      const supabase = getSupabase()
      const { data, error: insertError } = await supabase
        .from('MIYAKO_CLIENT_FAVORITES')
        .insert({
          user_id: currentUser.value.id,
          property_id: propertyId,
        })
        .select()
        .single()

      if (insertError) throw insertError
      favorites.value.unshift(data as ClientFavorite)
      return true
    } catch (e: any) {
      if (e.message?.includes('duplicate') || e.code === '23505') {
        // 既にお気に入り済み（重複制約）
        return true
      }
      error.value = e.message || 'お気に入り追加に失敗しました'
      console.error('addFavorite error:', e)
      return false
    }
  }

  // ─── 削除 ───
  const removeFavorite = async (propertyId: string): Promise<boolean> => {
    if (!currentUser.value) return false
    error.value = null

    try {
      const supabase = getSupabase()
      const { error: deleteError } = await supabase
        .from('MIYAKO_CLIENT_FAVORITES')
        .delete()
        .eq('user_id', currentUser.value.id)
        .eq('property_id', propertyId)

      if (deleteError) throw deleteError
      favorites.value = favorites.value.filter(f => f.property_id !== propertyId)
      return true
    } catch (e: any) {
      error.value = e.message || 'お気に入り解除に失敗しました'
      console.error('removeFavorite error:', e)
      return false
    }
  }

  // ─── トグル ───
  const toggleFavorite = async (propertyId: string): Promise<boolean> => {
    if (isFavorite(propertyId)) {
      return await removeFavorite(propertyId)
    } else {
      return await addFavorite(propertyId)
    }
  }

  return {
    favorites,
    loading,
    error,
    favoritePropertyIds,
    isFavorite,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
}
