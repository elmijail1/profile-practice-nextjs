// Key for storing authentication state
const WAS_AUTHENTICATED_KEY = "was_previously_authenticated"

export const authState = {
    setAuthenticated: () => {
        localStorage.setItem(WAS_AUTHENTICATED_KEY, "true")
    },
    
    clearAuthenticated: () => {
        localStorage.removeItem(WAS_AUTHENTICATED_KEY)
    },
    
    wasAuthenticated: () => {
        return localStorage.getItem(WAS_AUTHENTICATED_KEY) === "true"
    }
} 