import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "../constants/queryKeys"
import { reviewService } from "../services/reviewService"

// Lấy danh sách review theo danh sách productId
export const useReviews = (productId) => {
    return useQuery({
        queryKey: ['reviews', productId],
        queryFn: () => reviewService.fetchReviewsByProductId(productId),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: Boolean(productId),
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