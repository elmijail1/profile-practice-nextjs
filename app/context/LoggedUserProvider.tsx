"use client";
import { createContext, useContext, useState } from "react";

export const LoggedUserContext = createContext<any | null>(null)

export default function LoggedUserProvider({ children }: any) {
    const [loggedUser, setLoggedUser] = useState(false)

    return (
        <LoggedUserContext.Provider value={{ loggedUser, setLoggedUser }}>
            {children}
        </LoggedUserContext.Provider>
    )
}

export const useLoggedUser = () => useContext(LoggedUserContext)