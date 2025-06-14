"use client";


import React, { SetStateAction, useEffect, useState } from "react"
import AboutSection from "./AboutSection"
import FriendListWindow from "./FriendListWindow"
import { useFriendList } from "../useFriendList";
import WideButton from "@/app/components/WideButton";
import { useProfileContext } from "@/lib/ProfileContext";
import type { User } from "@/app/types/user";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react"

type ProfileProps = {
    profileData: User,
    setProfileData: React.Dispatch<SetStateAction<User | undefined>>,
}

export default function DataSection({
    profileData, setProfileData
}: ProfileProps) {

    const { session, status, currentId, isOwnProfile } = useProfileContext()
    const currentIdNumber = Number(currentId)

    const [openFriendList, setOpenFriendList] = useState(false)
    const isAuthenticated = !!session && status === "authenticated"

    const months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ]

    useEffect(() => {
        if (profileData.friends.length === 0) {
            setOpenFriendList(false)
        }
    }, [profileData.friends])

    const joinedInMonth = months[new Date(profileData.joinedIn).getMonth()]
    const joinedInYear = new Date(profileData.joinedIn).getFullYear()

    const friendListButtonText = `${profileData.friends?.length} ${profileData.friends?.length !== 1 ? "Friends" : "Friend"}`

    const router = useRouter()

    const shouldFetch = !!session && !isOwnProfile
    const { friends, mutate } = useFriendList(shouldFetch)
    const isFriend = friends?.includes(currentIdNumber)

    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function handleFriendAction() {
        if (isLoading) return
        setIsLoading(true)

        try {
            const res = await fetch("/api/account/friend-toggle", {
                method: "POST",
                body: JSON.stringify({ targetId: currentIdNumber })
            })

            if (!res.ok) {
                const response = await res.json()
                if (response.error === "Session expired") {
                    await signOut({ redirect: false })
                    router.push("/login?reason=expired")
                    return
                }
                setError("Unavailable")
                setIsLoading(false)
                return
            }

            if (res.ok) {
                mutate(prev => {
                    const list = prev ?? []
                    return isFriend
                        ? list.filter(id => id !== currentIdNumber)
                        : [...list, currentIdNumber]
                }, { revalidate: false })
                setIsLoading(false)
            }
        } catch (error) {
            console.error("Error during friend toggle: ", error)
            setError("Unavailable")
            setIsLoading(false)
        }
    }

    const sectionClassMob = `w-3/5 flex flex-col items-center gap-[0.1rem] mt-[1.1rem] border-solid border-[white] border-[0_0_1px_0] pb-2 relative z-0 ${!isOwnProfile && isAuthenticated && "pb-[2rem]"}`
    const sectionClassDesk = "xl:max-w-[18rem]"


    if (!profileData.joinedIn) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <>
            {/* 1. Section */}
            <section className={`${sectionClassMob} ${sectionClassDesk}`}>

                {/* 1.1. Header */}
                <h2>{profileData.name}</h2>

                {/* 1.3. Joined in */}
                <p>
                    {`Joined in ${joinedInMonth} ${joinedInYear}`}
                </p>

                {/* 1.4 Friend List button */}
                <button
                    className="text-[hsl(50,_90%,_70%)] font-bold border-none bg-none p-0 disabled:text-white disabled:font-semibold xl:enabled:cursor-pointer xl:enabled:hover:brightness-95"
                    onClick={() => setOpenFriendList(true)}
                    disabled={profileData.friends?.length < 1}
                >
                    {friendListButtonText}
                </button>

                {/* 1.5  Manage Friend button */}
                {
                    (!isOwnProfile && isAuthenticated) &&
                    (
                        <div className="w-full max-w-[18rem] flex justify-center">
                            {
                                (typeof isFriend === "boolean" && !isLoading)
                                    ?
                                    <WideButton
                                        colors={isFriend
                                            ? { frontText: "hsl(0, 70%, 80%)", backBG: "hsl(0, 80%, 90%)", border: "hsl(0, 70%, 80%)" }
                                            : { frontText: "hsl(130, 70%, 50%)", backBG: "hsl(130, 70%, 80%)", border: "hsl(130, 70%, 50%)" }
                                        }
                                        onClick={handleFriendAction}
                                        disabledIf={!!error || isLoading}
                                    >
                                        {isFriend ? "Remove Friend" : "Add Friend"}
                                    </WideButton>
                                    :
                                    <WideButton disabledIf={isLoading}>
                                        Loading...
                                    </WideButton>
                            }
                        </div>
                    )
                }

            </section >

            {/* 2. Friend List window */}
            {
                openFriendList &&
                <FriendListWindow
                    profileData={profileData}
                    setProfileData={setProfileData}
                    setOpenFriendList={setOpenFriendList}
                />
            }

            {/* 3. About Section */}
            <AboutSection
                aboutMeText={profileData?.aboutMe}
            />

        </>
    )
}