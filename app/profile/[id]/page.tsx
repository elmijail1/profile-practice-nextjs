"use client";
import { useState, useEffect, use } from "react"
// import { useParams, Navigate } from "react-router-dom"
import { usersData } from "../../../data/usersData"
// components
import TopSection from "./TopSection"
// import ImageSection from "../components/Profile/ImageSection/ImageSection"
// import DataSection from "../components/Profile/DataSection/DataSection"

export default function Profile({ params }: { params: Promise<{ id: string }> }) {
    const currentId = use(params).id // write this and the line above down
    const [profileData, setProfileData] = useState({})

    useEffect(() => {
        for (let i = 0; i <= usersData.length; i++) {
            if (usersData[i]?.id === Number(currentId)) {
                return setProfileData(usersData[i])
            }
        }
    }, [currentId])

    // if (currentId > usersData.length) {
    //     return (
    //         <Navigate to="/" />
    //         // somehow we need to change the url too for it to be "/", not, say, "profile/5"
    //     )
    // }

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

                {/* CONTINUE HERE !!! */}
                {/* 2. Image Section: Image + Image Editor */}
                {/* <ImageSection
                    profileData={profileData}
                    setProfileData={setProfileData}
                /> */}

                {/* 3. Data Section: Name, Username, Joined In, Friends – all's dynamic */}
                {/* <DataSection
                    profileData={profileData}
                    setProfileData={setProfileData}
                    usersData={usersData}
                    currentId={currentId}
                /> */}

            </div>
        </main >
    )
}