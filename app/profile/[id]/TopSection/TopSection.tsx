import React, { SetStateAction, useState } from "react"
import TextEditForm from "./TextEditForm"
import { useProfileContext } from "@/lib/ProfileContext"
import type { User } from "@/app/types/user"

type ProfileProps = {
    profileData: User,
    setProfileData: React.Dispatch<SetStateAction<User | undefined>>
}

export default function TopSection({
    profileData, setProfileData
}: ProfileProps) {

    const { session, isOwnProfile } = useProfileContext()
    const [openTextEditor, setOpenTextEditor] = useState(false)

    const sectionClassMob = "w-[80%] flex justify-center items-center h-[4rem] border-b border-white mt-[1rem] relative"
    const sectionClassDesk = "max-w-[20rem]"

    return (
        <section className={`${sectionClassMob} ${sectionClassDesk}`}>

            {/* 1. Initially visible H1 & Gear Button */}
            <h1 className="mx-auto">Profile</h1>

            {
                session && isOwnProfile &&
                <button
                    className="absolute right-0 bg-transparent text-white border-none text-[2.3rem] xl:cursor-pointer xl:hover:text-gray-100"
                    onClick={() => setOpenTextEditor(true)}
                >
                    ⚙
                </button>
            }


            {/* 2. Text Editor Window */}
            {
                openTextEditor &&
                <TextEditForm
                    profileData={profileData}
                    setProfileData={setProfileData}
                    setOpenTextEditor={setOpenTextEditor}
                />
            }
        </section>
    )
}