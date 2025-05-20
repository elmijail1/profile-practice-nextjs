// general
import { useState } from "react"
// components
import TextEditForm from "./TextEditForm"
import { useProfileContext } from "@/lib/ProfileContext"

type ProfileProps = {
    profileData: any,
    setProfileData: any
}

export default function TopSection({
    profileData, setProfileData //*0.2
}: ProfileProps) {

    const { session, isOwnProfile } = useProfileContext()
    const [openTextEditor, setOpenTextEditor] = useState(false)


    return (
        <section className="w-[80%] flex justify-center items-center h-[4rem] border-b border-white mt-[1rem] relative">

            {/* 1. Initially visible H1 & Gear Button */}
            <h1 className="mx-auto">Profile</h1>

            {
                session && isOwnProfile &&
                <button
                    className="absolute right-0 bg-transparent text-white border-none text-[2.3rem]"
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