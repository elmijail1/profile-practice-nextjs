"use client";
import { useState, useEffect } from "react"
import { useParams } from "next/navigation";
import TopSection from "./TopSection/TopSection"
import ImageSection from "./ImageSection/ImageSection"
import DataSection from "./DataSection/DataSection"
import type { User } from "@/app/types/user";
import PasswordWindow from "./PasswordChange/PasswordWindow";
import { useSession } from "next-auth/react";
import { ProfileContextProvider } from "@/lib/ProfileContext";
import Loader from "@/app/components/Loader";

export default function Profile() {

    const { data: session, status } = useSession()
    const currentId = useParams().id!.toString()
    const isOwnProfile = status === "authenticated" && session?.user?.id.toString() === currentId

    const [profileData, setProfileData] = useState<User | undefined>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch(`/api/users/${currentId}`)
            const user = await res.json()
            setProfileData(user)
            setIsLoading(false)
        }
        fetchUser()
    }, [])

    const [passwordWindowOpen, setPasswordWindowOpen] = useState(false)

    if (isLoading) {
        return (
            <main className="w-full flex flex-col items-center justify-center pb-20 sm:h-[50rem]">
                <div className="w-full min-h-[45rem] flex flex-col items-center relative pb-[5rem] bg-[hsl(130,70%,50%)] text-white sm:w-[360px] sm:h-[600px]">
                    <Loader />
                </div>
            </main>
        )
    }

    return (
        <ProfileContextProvider value={{ session, status, currentId, isOwnProfile }}>
            <main className="w-full flex flex-col items-center justify-center pb-20 sm:h-[50rem]">
                <div className="w-full min-h-[45rem] flex flex-col items-center relative pb-[5rem] bg-[hsl(130,70%,50%)] text-white sm:w-[360px] sm:h-[600px]">

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