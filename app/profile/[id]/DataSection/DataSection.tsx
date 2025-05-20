"use client";


import { useState } from "react"
import AboutSection from "./AboutSection"
import FriendListWindow from "./FriendListWindow"
import { useFriendList } from "../useFriendList";
import WideButton from "../WideButton"
import { wideButtonColorsData, extractColorObject } from "../../../../data/wideButtonColorsData"
import { useProfileContext } from "@/lib/ProfileContext";

type ProfileProps = {
    profileData: any,
    setProfileData: any,
}

export default function DataSection({
    profileData, setProfileData // *0.2 Props
}: ProfileProps) {

    const { session, currentId, isOwnProfile } = useProfileContext()
    const currentIdNumber = Number(currentId)

    const [openFriendList, setOpenFriendList] = useState(false)
    const isAuthenticated = !!session

    const months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ]


    const joinedInMonth = months[new Date(profileData.joinedIn).getMonth()]
    const joinedInYear = new Date(profileData.joinedIn).getFullYear()

    const friendListButtonText = `${profileData.friends?.length} ${profileData.friends?.length !== 1 ? "Friends" : "Friend"}`


    const shouldFetch = !!session && !isOwnProfile
    const { friends, mutate } = useFriendList(shouldFetch)
    const isFriend = friends?.includes(currentIdNumber)
    async function handleFriendAction() {
        try {

            const res = await fetch("/api/account/friend-toggle", {
                method: "POST", // shouldn't it be patch?
                body: JSON.stringify({ targetId: currentIdNumber })
            })
            if (res.ok) {
                mutate(prev => {
                    const list = prev ?? []
                    return isFriend
                        ? list.filter(id => id !== currentIdNumber)
                        : [...list, currentIdNumber]
                }, false)
            }
        } catch (error) {
            console.error("Network or server error during friend toggle: ", error)
        }
    }

    if (!profileData.joinedIn) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <>
            {/* 1. Section */}
            <section className=
                {`
                    ProfDS__Section
                    ${!isOwnProfile && isAuthenticated ? "ProfDS__LowerMargin" : ""}
                `}
            >

                {/* 1.1. Header */}
                <h2>{profileData.name}</h2>

                {/* 1.3. Joined in */}
                <p>
                    {`Joined in ${joinedInMonth} ${joinedInYear}`}
                </p>

                {/* 1.4 Friend List button */}
                <button
                    className="ProfDS__Hyperlink"
                    onClick={() => setOpenFriendList(true)}
                    disabled={profileData.friends?.length < 1}
                >
                    {friendListButtonText}
                </button>

                {/* 1.5  Manage Friend button */}
                {
                    (!isOwnProfile && isAuthenticated) &&
                    <WideButton
                        colors={extractColorObject(wideButtonColorsData, "RedText")}
                        onClickAction={handleFriendAction}
                        buttonText={isFriend ? "Remove Friend" : "Add Friend"}
                    />
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