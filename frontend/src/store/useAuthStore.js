import {create} from 'zustand'

export const useAuthStore = create((set) => ({
    accessToken : null,
    user : null,
    isAuthenticated : false,
    isLoading : true,

    setAuth : (accessToken, user) => set({
        accessToken,
        user,
        isAuthenticated : !! accessToken,
        isLoading : false,
    }),
    
    setAccessToken : (accessToken) => set((state) => ({
        accessToken,
        isAuthenticated : !!accessToken
    })),

    clearAuth : () => set(() => ({
        accessToken : null,
        user : null,
        isAuthenticated : false,
        isLoading : false
    })),

    setLoading : (isLoading) => set({
        isLoading
    })

}))