import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { QUERY_KEYS } from "../constants/queryKeys";
import { storeService } from "../services/storeService";


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
        mutationFn: (productOrId) => productService.toggleProductVisibility(productOrId),
        onSuccess: (updatedProduct) => {
            // Cập nhật trực tiếp cache query mà KHÔNG cần fetch lại toàn bộ danh sách sản phẩm
            qc.setQueriesData({ queryKey: ['currentProducts'] }, (old) => {
                if (!Array.isArray(old)) return old;
                return old.map((p) =>
                    (p.id === updatedProduct.id || p._id === updatedProduct._id)
                        ? { ...p, isVisible: updatedProduct.isVisible }
                        : p
                );
            });
            qc.setQueriesData({ queryKey: ['products'] }, (old) => {
                if (!Array.isArray(old)) return old;
                return old.map((p) =>
                    (p.id === updatedProduct.id || p._id === updatedProduct._id)
                        ? { ...p, isVisible: updatedProduct.isVisible }
                        : p
                );
            });
        },
        onError: (err) => {
            console.error('Error while toggling product visibility', err);
        }
    })
}

export const useSaveProduct = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ productData, isEdit }) => productService.saveProduct(productData, isEdit),
        onSuccess: (data, variables) => {
            qc.invalidateQueries({ queryKey: ["products"] });
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_PRODUCTS });
            if (variables?.productData?.id) {
                qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT_DETAIL(variables.productData.id) });
            }
        },
        onError: (err) => {
            console.error('Error while saving product', err);
        }
    });
};

export const useTop5Product = () => useQuery({
    queryKey: ['products', 'trending', 5, 'v2'],
    queryFn: () => productService.fetchTrendingProducts(5),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
});

// Hook lấy Top 10 Most Viewed - gọi GET /products/most-viewed
export const useMostViewedProducts = (limit = 10) => {
    return useQuery({
        queryKey: ['products', 'most-viewed', limit],
        queryFn: () => productService.fetchMostViewedProducts(limit),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}

export const useStoreAnalytics = (range = 'Last 6 Months') => {
    return useQuery({
        queryKey: QUERY_KEYS.STORE_ANALYTICS('my-store', range),
        queryFn: () => storeService.fetchStoreAnalytics(range),
        enabled: Boolean(range),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}
