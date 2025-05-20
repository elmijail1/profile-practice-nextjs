"use client";
import { useState, useEffect } from "react"
import { useParams } from "next/navigation";
import { usersData } from "@/data/usersData"
// components
import TopSection from "./TopSection/TopSection"
import ImageSection from "./ImageSection/ImageSection"
import DataSection from "./DataSection/DataSection"
import type { User } from "@/app/types/user";
import PasswordWindow from "./PasswordWindow";
import { useSession } from "next-auth/react";
import { ProfileContextProvider } from "@/lib/ProfileContext";

export default function Profile() {
    const { data: session, status } = useSession()
    const currentId = useParams().id!.toString()
    const isOwnProfile = status === "authenticated" && session?.user?.id.toString() === currentId


    const [profileData, setProfileData] = useState<User | undefined>()

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch(`/api/users/${currentId}`)
            const user = await res.json()
            setProfileData(user)
        }
        fetchUser()
    }, [])

    const [passwordWindowOpen, setPasswordWindowOpen] = useState(false)

    if (!profileData) {
        return (
            <main>
                Loading...
            </main>
        )
    }

    return (
        <ProfileContextProvider value={{ session, status, currentId, isOwnProfile }}>
            <main className="App__Main">
                <div className="screen__Main">

                    {/* 1. Top Section: Header + Text Editor */}
                    <TopSection
                        profileData={profileData}
                        setProfileData={setProfileData}
                    />

                    {/* 2. Image Section: Image + Image Editor */}
                    <ImageSection
                        profileData={profileData}
                        setProfileData={setProfileData}
                    />

                    {/* 3. Data Section: Name, Joined In, Friends – all's dynamic */}
                    <DataSection
                        profileData={profileData}
                        setProfileData={setProfileData}
                    />

                    {
                        isOwnProfile &&
                        <button
                            className="text-yellow-300 font-bold text-xl mt-2"
                            onClick={() => setPasswordWindowOpen(true)}
                        >
                            Change password
                        </button>
                    }

                    {
                        passwordWindowOpen &&
                        <PasswordWindow
                            setPasswordWindowOpen={setPasswordWindowOpen}
                        />
                    }

                </div>
            </main >
        </ProfileContextProvider>
    )
}