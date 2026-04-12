import { H3Event } from 'h3'
import crypto from 'crypto'

// MIYAKOのcompany_id
const MIYAKO_COMPANY_ID = '6a0f0dd0-5075-48c3-b843-3d580bf98f14'

/**
 * werkzeug互換のPBKDF2パスワード検証
 */
function verifyPbkdf2(storedHash: string, password: string): boolean {
  try {
    const dollarParts = storedHash.split('$')
    if (dollarParts.length !== 3) return false

    const methodStr = dollarParts[0]
    const salt = dollarParts[1]
    const expectedHash = dollarParts[2]

    const methodParts = methodStr.split(':')
    const hashAlgo = methodParts[1] || 'sha256'
    const iterations = parseInt(methodParts[2] || '600000')

    const dklen = expectedHash.length / 2
    const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, dklen, hashAlgo)
    const derivedHex = derivedKey.toString('hex')

    if (derivedHex.length !== expectedHash.length) return false
    return crypto.timingSafeEqual(Buffer.from(derivedHex), Buffer.from(expectedHash))
  } catch (e) {
    console.error('PBKDF2 verify error:', e)
    return false
  }
}

/**
 * パスワード検証（bizfloと同じ3方式対応）
 */
function verifyPassword(storedHash: string, password: string): boolean {
  if (!storedHash || !password) return false

  if (storedHash.startsWith('pbkdf2:')) {
    return verifyPbkdf2(storedHash, password)
  }

  if (storedHash.length === 128 && /^[0-9a-f]+$/i.test(storedHash)) {
    const hash = crypto.createHash('sha512').update(password, 'utf8').digest('hex')
    return storedHash.toLowerCase() === hash.toLowerCase()
  }

  return storedHash === password
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const { accountName, password } = body

    if (!accountName || !password) {
      return { success: false, error: 'アカウント名とパスワードを入力してください' }
    }

    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl as string
    const anonKey = config.public.supabaseKey as string

    // USERSテーブルからMIYAKOユーザーを取得
    const url = `${supabaseUrl}/rest/v1/USERS?account_name=eq.${encodeURIComponent(accountName)}&company_id=eq.${MIYAKO_COMPANY_ID}&select=id,account_name,name,password,role,company_id,enable_flag`

    const res = await fetch(url, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
      },
    })

    const data = await res.json()

    if (!res.ok || !Array.isArray(data) || data.length === 0) {
      return { success: false, error: 'アカウント名またはパスワードが間違っています' }
    }

    const user = data[0]

    if (!user.enable_flag) {
      return { success: false, error: 'このアカウントは無効です' }
    }

    // パスワード検証
    if (!verifyPassword(user.password, password)) {
      return { success: false, error: 'アカウント名またはパスワードが間違っています' }
    }

    // 認証情報をhttpOnly cookieに保存
    const authData = JSON.stringify({
      id: user.id,
      name: user.name,
      role: user.role,
      company_id: user.company_id,
    })

    setCookie(event, 'admin-auth', authData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8,
      path: '/',
    })

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'ログイン処理に失敗しました' }
  }
})
