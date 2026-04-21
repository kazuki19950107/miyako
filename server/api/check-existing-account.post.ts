import { H3Event } from 'h3'
import { createClient } from '@supabase/supabase-js'

/**
 * 新規登録前に email / phone が既に MIYAKO_CLIENT_USERS に登録済みか、
 * かつ削除済み (deleted_at IS NOT NULL) かを判定する。
 *
 * Anon キーの SELECT は RLS で制限されるため、Service Role を使って
 * サーバー側で集約する。返却するのは boolean 4 つだけで個人情報は出さない。
 */
export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const email = String(body?.email || '').trim().toLowerCase()
    const phoneRaw = String(body?.phone || '').trim()
    const phoneNorm = normalizePhone(phoneRaw)

    const result = {
      email_exists: false,
      email_deleted: false,
      phone_exists: false,
      phone_deleted: false,
    }

    if (!email && !phoneNorm) {
      return result
    }

    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl as string
    const serviceKey = config.supabaseServiceKey as string

    if (!serviceKey) {
      console.error('[check-existing-account] SERVICE_KEY missing')
      return result
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    if (email) {
      const { data, error } = await supabase
        .from('MIYAKO_CLIENT_USERS')
        .select('id, deleted_at')
        .ilike('email', email)
        .limit(1)
      if (!error && data && data.length > 0) {
        result.email_exists = true
        result.email_deleted = !!data[0].deleted_at
      }
    }

    if (phoneNorm) {
      // DB側の phone 表記揺れを吸収するため、候補を取って Node 側で正規化比較
      const { data, error } = await supabase
        .from('MIYAKO_CLIENT_USERS')
        .select('phone, deleted_at')
        .not('phone', 'is', null)
      if (!error && data) {
        for (const row of data) {
          if (normalizePhone(row.phone || '') === phoneNorm) {
            result.phone_exists = true
            if (row.deleted_at) {
              result.phone_deleted = true
            } else {
              // active 一致が確定したら抜ける
              break
            }
          }
        }
      }
    }

    return result
  } catch (e) {
    console.error('[check-existing-account] error:', e)
    return {
      email_exists: false,
      email_deleted: false,
      phone_exists: false,
      phone_deleted: false,
    }
  }
})

function normalizePhone(p: string): string {
  return (p || '')
    .replace(/-/g, '')
    .replace(/\s/g, '')
    .replace(/[ーー]/g, '')
    .trim()
}
