"use client";
import { useState, useEffect } from "react"
import { useParams } from "next/navigation";
import { usersData } from "@/data/usersData"
// components
import TopSection from "./TopSection/TopSection"
import ImageSection from "./ImageSection/ImageSection"
import DataSection from "./DataSection/DataSection"
import type { User } from "@/app/types/user";
import Link from "next/link";

export default function Profile() {
    const currentId = useParams().id
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

                <Link
                    href="/api/auth/signout"
                    className="bg-amber-600 w-1/2 flex justify-center py-1 rounded-full"
                >
                    Sign out
                </Link>

            </div>
        </main >
    )
}