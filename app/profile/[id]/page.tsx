"use client";
import { useState, useEffect, use } from "react"
// import { useParams, Navigate } from "react-router-dom"
import { usersData } from "@/data/usersData"
// components
import TopSection from "./TopSection/TopSection"
import ImageSection from "./ImageSection/ImageSection"
import DataSection from "./DataSection/DataSection"
import type { User } from "@/app/types/user";

export default function Profile({ params }: { params: Promise<{ id: string }> }) {
    const currentId = use(params).id
    const [profileData, setProfileData] = useState<User | undefined>()

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch(`/api/users/${currentId}`)
            const user = await res.json()
            setProfileData(user)
        }
        fetchUser()
    }, [])

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
                {/* 3. Data Section: Name, Username, Joined In, Friends – all's dynamic */}
                <DataSection
                    profileData={profileData}
                    setProfileData={setProfileData}
                    usersData={usersData}
                    currentId={Number(currentId)}
                />

            </div>
        </main >
    )
}