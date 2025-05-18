"use client";
// *0.1 Imports
// general
import { useState } from "react"
// components
import AboutSection from "./AboutSection"
import FriendListWindow from "./FriendListWindow"
import { useSession } from "next-auth/react";
import { useFriendList } from "../useFriendList";
import WideButton from "../WideButton"
import { wideButtonColorsData, extractColorObject } from "../../../../data/wideButtonColorsData"

type ProfileProps = {
    profileData: any,
    setProfileData: any,
    usersData: any,
    currentId: number
}

export default function DataSection({
    profileData, setProfileData, usersData, currentId // *0.2 Props
}: ProfileProps) {

    // *0.3 Consts
    const [openFriendList, setOpenFriendList] = useState(false)
    const { data: session, status } = useSession()
    const isOwnProfile = status === "authenticated" && session?.user?.id === currentId.toString()
    const isAuthenticated = !!session

    const months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ]


    const joinedInMonth = months[new Date(profileData.joinedIn).getMonth()]
    const joinedInYear = new Date(profileData.joinedIn).getFullYear()

    const friendListButtonText = `${profileData.friends?.length} ${profileData.friends?.length !== 1 ? "Friends" : "Friend"}`


    const shouldFetch = !!session && !isOwnProfile
    const { friends, mutate, isLoading, error } = useFriendList(shouldFetch)
    const isFriend = friends?.includes(currentId)
    async function handleFriendAction() {
        try {

            const res = await fetch("/api/account/friend-toggle", {
                method: "POST", // shouldn't it be patch?
                body: JSON.stringify({ targetId: currentId })
            })
            if (res.ok) {
                mutate(prev => {
                    const list = prev ?? []
                    return isFriend
                        ? list.filter(id => id !== currentId)
                        : [...list, currentId]
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
                    currentId={currentId}
                />
            }

            {/* 3. About Section */}
            <AboutSection
                aboutMeText={profileData?.aboutMe}
            />

        </>
    )
}

{/*
# II. DataSection

## Idea

It's a general section for the 3rd and the last (lowest position-wise) section of the Profile page. Not only it contains the section with the user profile's main data like the name, registration date, and the number of friends (+ conditionally an Add / Remove friend button), but also it contains the Friend List window activated with the special Friend List button, as well as the About section containing another chunk of the user profile's data.

## Structure

- 1. Section
- 1.1. Header
- 1.2. Joined in
- 1.3. Friend List button
- 1.4. Manage Friend button
- 2. Friend List window
- 3. About Section
,
- 1. Section: the initially visible container with the display of lots of user profile data.
- 1.1. Header: the user profile's name.
- 1.2. Joined in: the user profile's registration date (month + year). In the user profile objects it's stored as a Data value.
- 1.3. Friend List button: it's a button with the style of a hyperlink that does 2 things:
    - 1. It displays the current number of the user's friends;
    - 2. It opens the Friend List pop-up window with the list of friends where you can remove friends or view their profiles (learn more in 2.).
- 1.4. Manage Friend button: it's a button that lets you add or remove the current user as a friend. It's only present on profile pages other than that of the logged in user's own.
- 2. Friend List window: a popup window with the list of friends. You can view their profiles there and remove them from your list as well as sort the list in different ways.
- 3. About section: the user profile's aboutMe value. A short description that you can edit.

## Known uses of this component

- pages/Profile

## More comments

- 0.1. Imports
  - useState, useEffect – React basic hooks.
  - AboutSection, FriendLitsWindow, ManageFriendButton – custom components used in this section's structure.    
- 0.2. Props (from pages/Profile)
    - profileData, setProfileData – a state with the current user profile's data and its setter. We need it to display values of these properties: name, joinedIn, friends, aboutMe;
    - usersData – the general data array containing all the database's user profiles. We need it here for 2 things:
        - 1. [temporary, before the database support has been added] To check if the current logged-in user's friend list includes this profile;
        - 2. To pass as a prop to the FriendListWindow component for it to further take data from the database to populate the friend list. It requires more data than just IDs which are stored as a user's friend property value, that's why we need to access other data of those friend objects (learn more in the FriendListWindow component).
- 0.3. Consts
    - openFriendList, setOpenFriendList: 
    - friendAdded, setFriendAdded: 
    - ownProfile, setOwnProfile: 
    - months: 
    - joinedInMonth: 
    - joinedInYear: 
    - friendListButtonText: 

    const [openFriendList, setOpenFriendList] = useState(false)
    const [friendAdded, setFriendAdded] = useState()
    const [ownProfile, setOwnProfile] = useState()
    const months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ]

    const joinedInMonth = months[profileData.joinedIn.getMonth()]
    const joinedInYear = profileData.joinedIn.getFullYear()

    const friendListButtonText = `${profileData.friends.length} ${profileData.friends.length !== 1 ? "Friends" : "Friend"}`

    // *0.4 Functions
    function determineFriendAdded() {
        if (currentId !== 1) {
            if (usersData[0].friends.includes(currentId)) {
                return true
            } else {
                return false
            }
        }
    }

    function determineOwnProfile() {
        setOwnProfile(currentId === 1)
    }

    // *0.5 Effects
    useEffect(() => {
        setFriendAdded(determineFriendAdded())
        determineOwnProfile()
    }, [profileData])

*/}