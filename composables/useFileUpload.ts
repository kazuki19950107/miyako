import { useSupabase } from './useSupabase'

const BUCKET_NAME = 'miyako-property-files'

/**
 * ファイルをSupabase Storageにアップロードしてpublic URLを返す
 * @param file アップロードするファイル
 * @param propertyId 物件ID（フォルダ分け用）
 * @param category カテゴリ（例: 'gas_meter', 'electric_meter'）
 * @returns アップロードされたファイルのpublic URL
 */
export const uploadFile = async (
  file: File,
  propertyId: string,
  category: string
): Promise<string | null> => {
  const supabase = useSupabase()

  // ファイル名をユニークにする（タイムスタンプ + 元のファイル名）
  const timestamp = Date.now()
  const fileName = `${timestamp}_${file.name}`
  const filePath = `${propertyId}/${category}/${fileName}`

  try {
    // アップロード
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('ファイルアップロードエラー:', error)
      return null
    }

    // Public URLを取得
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (e) {
    console.error('ファイルアップロード例外:', e)
    return null
  }
}

/**
 * 複数ファイルをアップロード
 */
export const uploadFiles = async (
  files: File[],
  propertyId: string,
  category: string
): Promise<string[]> => {
  const urls: string[] = []

  for (const file of files) {
    const url = await uploadFile(file, propertyId, category)
    if (url) {
      urls.push(url)
    }
  }

  return urls
}

/**
 * ファイルを削除
 */
export const deleteFile = async (fileUrl: string): Promise<boolean> => {
  const supabase = useSupabase()

  try {
    // URLからファイルパスを抽出
    const url = new URL(fileUrl)
    const pathParts = url.pathname.split(`/${BUCKET_NAME}/`)
    if (pathParts.length < 2) return false

    const filePath = pathParts[1]

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      console.error('ファイル削除エラー:', error)
      return false
    }

    return true
  } catch (e) {
    console.error('ファイル削除例外:', e)
    return false
  }
}

/**
 * useFileUpload composable
 */
export const useFileUpload = () => {
  return {
    uploadFile,
    uploadFiles,
    deleteFile,
    BUCKET_NAME
  }
}
