import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { authState } from "./authState"

export function useProtectedNavigation() {
    const router = useRouter()

    async function navigate(path: string) {
        // First, check if user was ever authenticated
        if (!authState.wasAuthenticated()) {
            // Never authenticated - proceed with navigation
            router.push(path)
            return
        }

        // User was previously authenticated - verify session
        try {
            const response = await fetch('/api/auth/check-session')
            
            if (!response.ok) {
                // Clear client session and auth state
                await signOut({ redirect: false })
                authState.clearAuthenticated()
                router.push('/login?reason=expired')
                return
            }

            // Session is valid - proceed with navigation
            router.push(path)
        } catch (error) {
            console.error('Navigation session check failed:', error)
            // Clear client session and auth state on error
            await signOut({ redirect: false })
            authState.clearAuthenticated()
            router.push('/login?reason=expired')
        }
    }

    return { navigate }
} 