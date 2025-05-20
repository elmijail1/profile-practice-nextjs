"use client"

import React from "react"
import { createContext, useContext } from "react"
import type { Session } from "next-auth"

type ProfileContextType = {
    session: Session | null,
    status: string,
    currentId: string,
    isOwnProfile: boolean
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

type ProfileContextProviderProps = {
    children: React.ReactNode,
    value: ProfileContextType
}

function ProfileContextProvider({ children, value }: ProfileContextProviderProps) {
    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    )
}

function useProfileContext() {
    const context = useContext(ProfileContext)
    if (context === undefined) {
        throw new Error("useProfileContext must be used within a ProfileContextProvider")
    }
    return context
}


export { ProfileContext, useProfileContext, ProfileContextProvider }

