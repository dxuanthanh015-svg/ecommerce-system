import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "../constants/queryKeys"
import { reviewService } from "../services/reviewService"
import { useAuthStore } from "../store/useAuthStore"

// Lấy danh sách review theo danh sách productId
export const useReviews = (productId) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    return useQuery({
        // Keep authenticated review data out of the anonymous query cache.
        queryKey: ['reviews', productId, isAuthenticated ? 'authenticated' : 'anonymous'],
        queryFn: () => reviewService.fetchReviewsByProductId(productId),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: Boolean(productId) && isAuthenticated,
        retry: 1
    })
}

// Lấy danh sách review theo userId 
export const useCreateReview = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (reviewData) => reviewService.createReview(reviewData),
        onSuccess: (data, variables) => {
            qc.invalidateQueries({ queryKey: ['reviews', variables.productId] })
        }
    })
}
