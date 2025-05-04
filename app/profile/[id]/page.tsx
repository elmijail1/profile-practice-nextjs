"use client";
import { useState, useEffect } from "react"
import { useParams } from "next/navigation";
import { usersData } from "@/data/usersData"
// components
import TopSection from "./TopSection/TopSection"
import ImageSection from "./ImageSection/ImageSection"
import DataSection from "./DataSection/DataSection"
import type { User } from "@/app/types/user";
import PopupWindow from "./PopupWindow";
import { signOut } from "next-auth/react";

export default function Profile() {
    const currentId = useParams().id
    const [profileData, setProfileData] = useState<User | undefined>()
    const [logoutPrompt, setLogoutPrompt] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch(`/api/users/${currentId}`)
            const user = await res.json()
            setProfileData(user)
        }
        fetchUser()
    }, [])


    async function signoutUser() {
        try {
            setLogoutPrompt(false)
            setIsLoggingOut(true)
            await signOut({ callbackUrl: "/login" })
        } catch (error) {
            console.error("Error signing out: ", error)
        }
    }

    if (!profileData) {
        return (
            <main>
                Loading...
            </main>
        )
    }

    return (
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

                {/* CONTINUE HERE */}
                {/* 3. Data Section: Name, Joined In, Friends – all's dynamic */}
                <DataSection
                    profileData={profileData}
                    setProfileData={setProfileData}
                    usersData={usersData}
                    currentId={Number(currentId)}
                />

                <button
                    className="bg-amber-600 w-1/2 flex justify-center py-1 rounded-full"
                    onClick={() => setLogoutPrompt(true)}
                >
                    Sign out
                </button>

                {logoutPrompt &&
                    <PopupWindow>
                        <div
                            className="flex flex-col gap-3 text-black"
                        >
                            <p>You sure you want to log out?</p>
                            <div className="flex gap-3 text-white font-bold">
                                <button
                                    onClick={signoutUser}
                                    className="bg-green-600 w-1/2 flex justify-center py-1 rounded-full"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setLogoutPrompt(false)}
                                    className="bg-red-600 w-1/2 flex justify-center py-1 rounded-full"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </PopupWindow>
                }

                {isLoggingOut &&
                    <PopupWindow>
                        <div
                            className="flex flex-col gap-3 text-black"
                        >
                            <p>Goodbye!</p>
                            <p>Logging out...</p>
                        </div>
                    </PopupWindow>
                }

            </div>
        </main >
    )
}