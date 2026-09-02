import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { viewsService } from "../services/viewsService";
import { QUERY_KEYS } from "../constants/queryKeys";
import { getMostViewProducts, top5BestSellers, getStoreAnalyticsData } from "../storeManager/components/Analytics/analytics.utils";
import { useStoreRevenue } from "../hooks/useStoreQuery";


export const useProducts = (filters = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCTS(filters),
        queryFn: () => productService.fetchProducts(filters),
        staleTime: 5 * 60 * 1000,
    })
}

export const useDetailProducts = (productId) => {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCT_DETAIL(productId),
        queryFn: () => productService.fetchProductById(productId),
        enabled: Boolean(productId), // Chỉ fetch khi có productId
        staleTime: 5 * 60 * 1000,
    })
}

export const useCurrentProducts = (filters = {}) => {
    return useQuery({
        queryKey: ['currentProducts', filters],
        queryFn: () => productService.fetchCurrentProducts(filters),
        staleTime: 5 * 60 * 1000,
    })
}

export const useCreateProduct = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (product) => productService.createProduct(product),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['products'] })
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_PRODUCTS })
        },
        onError: (err) => {
            console.log('Error while creating product', err)
        }
    })
}

export const useUpdateProduct = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, productData }) => productService.updateProduct(id, productData),
        onSuccess: (data, variables) => {
            qc.invalidateQueries({ queryKey: ["products"] })
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_PRODUCTS })
            qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT_DETAIL(variables.id) })
        }
    })
}

export const useDeleteProduct = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => productService.deleteProduct(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] })
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_PRODUCTS })
        },
        onError: (err) => {
            console.log('Error while deleting product', err)
        }
    })
}

export const useToggleProductVisibility = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => {
            productService.toggleProductVisibility(id)
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] })
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_PRODUCTS })
        },
        onError: (err) => {
            console.log('Error while toggling product visibility', err)
        }
    })
}

export const useViewsData = () => {
    return useQuery({
        queryKey: ['viewsData'],
        queryFn: () => viewsService.fetchViewsData(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}

export const useSaveViewsData = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, viewEntry, allViews }) => viewsService.saveViewsData(productId, viewEntry, allViews),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['viewsData'] })
        },
        onError: (err) => {
            console.log('Error while saving views data', err)
        }
    })
}

export const useMostViewProduct = (storeId, allViews, revenueData) => {
    return useQuery({
        queryKey: ['mostViewProduct', storeId],
        queryFn: () => getMostViewProducts(storeId, allViews, revenueData),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}

export const useTop5Product = (storeId, revenueData) => {
    return useQuery({
        queryKey: ['top5Product', storeId],
        queryFn: () => top5BestSellers(storeId, revenueData),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}

export const useStoreAnalytics = (storeId, range = 'Last 6 Months', revenueData) => {
    return useQuery({
        queryKey: QUERY_KEYS.STORE_ANALYTICS(storeId, range, revenueData),
        queryFn: () => getStoreAnalyticsData(storeId, range, revenueData),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}