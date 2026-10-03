import { cartService } from '../../services/cartService'
import { authService } from '../../services/authService'

/**
 * Lấy email của user đang đăng nhập từ Mock Server
 */
export const getActiveUserEmail = async () => {
  try {
    const user = await authService.getCurrentUser()
    return user?.email?.trim().toLowerCase() || null
  } catch {
    return null
  }
}

/**
 * Lấy giỏ hàng hiện tại:
 * - Nếu đã đăng nhập => lấy từ /cart theo email
 * - Nếu chưa đăng nhập => lấy từ /cart_guest
 */
export const getUserCart = async () => {
  const email = await getActiveUserEmail()
  if (email) {
    return cartService.fetchCart(email)
  }
  return cartService.fetchGuestCart()
}

/**
 * Lưu giỏ hàng:
 * - Nếu đã đăng nhập => lưu vào /cart theo email
 * - Nếu chưa đăng nhập => lưu vào /cart_guest
 */
export const saveUserCart = async (cartItems) => {
  const email = await getActiveUserEmail()
  if (email) {
    await cartService.saveCart(cartItems, email)
  } else {
    await cartService.saveGuestCart(cartItems)
  }
  window.dispatchEvent(new Event('cartUpdated'))
}

/**
 * Sau khi đăng nhập: gộp giỏ hàng guest vào tài khoản
 */
export const migrateGuestCartOnLogin = async (userEmail) => {
  if (!userEmail) return
  await cartService.migrateGuestCart(userEmail)
  window.dispatchEvent(new Event('cartUpdated'))
}
