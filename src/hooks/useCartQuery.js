import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cartService";
import { wishlistService } from "../services/wishlistService";
import { QUERY_KEYS } from "../constants/queryKeys";

// Cart 

// Lấy giỏ hàng (chuyển giữa user và guest)
export const useCart = (userEmail, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.CART(userEmail),
        queryFn: () => (userEmail ? cartService.fetchCart(userEmail) : cartService.fetchGuestCart()),
        ...options, // để nhận enable từ bên ngoài
    })
}
// Thêm sản phẩm vào giỏ hàng 
export const useAddCart = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ newItem, userEmail }) => {
            if (userEmail) {
                return cartService.addToCart(newItem, userEmail)
            }
            return cartService.saveGuestCart([newItem])
        },
        onSuccess: (data, variables) => {
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CART(variables.userEmail) })
        }
    })
}

// Cập nhật số lượng trong giỏ hàng
export const useUpdateCart = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ itemId, size, color, newQty, userEmail }) => {
            cartService.updateCartItem(itemId, size, color, newQty, userEmail)
        },
        onSuccess: (data, variables) => {
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CART(variables.userEmail) })
        }
    })
}

// Xóa sản phẩm trong giỏ hàng
export const useRemoveFromCart = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ itemId, size, color, userEmail }) => {
            cartService.removeFromCart(itemId, size, color, userEmail)
        },
        onSuccess: (data, variables) => {
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CART(variables.userEmail) })
        }
    })
}

// Xóa toàn bộ giỏ hàng
export const useRemoveAllCart = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (userEmail) => (userEmail ? cartService.clearCart(userEmail) : cartService.clearGuestCart()),
        onSuccess: (data, userEmail) => {
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CART(userEmail) })
        }
    })
}

// Wishlist

// Lấy danh sách WishList
export const useWishList = (userEmail, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.WISHLIST(userEmail),
        queryFn: () => wishlistService.fetchWishlist(userEmail),
        staleTime: 1000 * 60 * 5,
        ...options, // để nhận enable từ ngoài
    })
}

// Thêm vào WishList
export const useAddToWishList = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ product, userEmail }) => wishlistService.addToWishlist(product, userEmail),
        onSuccess: (data, variables) => {
            qc.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST(variables.userEmail) })
        }
    })
}
// Xóa sản phẩm trong WishList
export const useRemoveFromWishList = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, userEmail }) => wishlistService.removeFromWishlist(productId, userEmail),
        onSuccess: (data, variables) => {
            qc.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST(variables.userEmail) })
        }
    })
}
