"use client";
import { useState } from "react"
import ImageEditForm from "./ImageEditForm"
import { useProfileContext } from "@/lib/ProfileContext";

type ProfileProps = {
    profileData: any,
    setProfileData: any
}

export default function ImageSection({
    profileData, setProfileData
}: ProfileProps) {

    const { session, isOwnProfile } = useProfileContext()

    const [openImageEditor, setOpenImageEditor] = useState(false)


    const sectionClass = "w-4/5 max-w-[23rem] h-40 mt-6 bg-[white] rounded-3xl relative z-0 flex justify-center items-end"

    return (
        <>
            <section
                className={sectionClass}
                style={{ backgroundColor: `hsl(${profileData.bgColor[0]}, ${profileData.bgColor[1]}%, ${profileData.bgColor[2]}%)` }}
            >

                {/* 1. Initially visible part: Image + Pencil Button */}
                <div className="w-1/2 max-w-[10rem] h-[70%] relative flex items-end justify-center">
                    <div className="text-[6rem] absolute bottom-1 mx-auto z-10">
                        {profileData.emoji}
                    </div>
                    <div className="relative w-full h-12 flex justify-center">
                        <div className="w-16 h-full bg-[hsl(0,_0%,_85%)]"></div>
                        <div className="absolute w-4/5 h-6 bg-[hsl(0,_0%,_85%)] bottom-[0]"></div>
                    </div>
                </div>

                {
                    session && isOwnProfile &&
                    <>
                        <button
                            className="absolute right-[5%] top-[9%] w-8 h-8 text-[1.2rem] font-medium border-[0.1rem] border-solid border-[hsl(0,0%,85%)] rounded-[0.8rem] text-[hsl(0,_0%,_60%)] bg-[white] [rotate:90deg] z-10 xl:cursor-pointer xl:hover:bg-gray-100"
                            onClick={() => setOpenImageEditor(true)}
                        >
                            ✎
                        </button>
                        <button
                            className="absolute right-[5%] top-[10.5%] w-8 h-8 border-none rounded-[0.8rem] bg-[hsl(0,_0%,_85%)] z-0"
                            onClick={() => setOpenImageEditor(true)}
                        >
                        </button>
                    </>
                }


            </section>

            {/* 2. Image Editor Window */}
            {
                openImageEditor &&
                <ImageEditForm
                    profileData={profileData}
                    setProfileData={setProfileData}
                    setOpenImageEditor={setOpenImageEditor}
                />
            }
        </>
    )
}