import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const authCookie = getCookie(event, 'admin-auth')

    if (!authCookie) {
      return { success: false }
    }

    // cookieからユーザー情報を復元
    const user = JSON.parse(authCookie)

    return {
      success: true,
      user: {
        id: user.id,
        role: user.role,
        agency_id: user.agency_id,
      },
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return { success: false }
  }
})
