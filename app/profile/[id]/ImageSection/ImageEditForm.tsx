"use client";
import React, { useState, useRef, SetStateAction } from "react"
import BGColorInput from "./BGColorInput"
import CrossButton from "../CrossButton"
import ImageInput from "./ImageInput"
import PopupWindow from "../PopupWindow"
import WideButton from "@/app/components/WideButton";
import type { User } from "@/app/types/user";
import useHandleElsewhereClick from "@/utilities/useHandleElsewhereClick"
import { useProfileContext } from "@/lib/ProfileContext";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

type ImageSectionProps = {
    profileData: User,
    setProfileData: React.Dispatch<SetStateAction<User | undefined>>,
    setOpenImageEditor: React.Dispatch<SetStateAction<boolean>>
}

export type ImageInputType = {
    bgColor: number[],
    emoji: string
}

export default function ImageEditForm({
    profileData, setProfileData, setOpenImageEditor
}: ImageSectionProps) {

    const { currentId } = useProfileContext()

    const [inputData, setInputData] = useState<ImageInputType>({
        emoji: profileData.emoji,
        bgColor: profileData.bgColor,
    })

    const [error, setError] = useState("")

    const emojiChanged = inputData.emoji !== profileData.emoji
    const bgColorChanged = inputData.bgColor[0] !== profileData.bgColor[0] || inputData.bgColor[1] !== profileData.bgColor[1] || inputData.bgColor[2] !== profileData.bgColor[2]
    const dataChanged = emojiChanged || bgColorChanged

    function discardChanges() {
        setInputData({
            emoji: profileData.emoji,
            bgColor: profileData.bgColor,
        })
        setOpenImageEditor(false)
    }

    const router = useRouter()

    async function handleSubmission(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const updatedProfileData = { ...inputData }

        try {
            const response = await fetch(`/api/users/${currentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedProfileData)
            })

            if (!response.ok) {
                const res = await response.json()
                if (res.error === "Session expired") {
                    await signOut({ redirect: false })
                    router.push("/login?reason=expired")
                    return
                }
                setError("Updating is currently unavailable. Try again later.")
                return
            }

            const updatedUser = await response.json()
            setProfileData(updatedUser.user)
            setOpenImageEditor(false)

        } catch (error) {
            console.error("Error updating the profile's images: ", error)
            setError("Updating is currently unavailable. Try again later.")
        }
    }


    const popupWindowRef = useRef<HTMLDivElement | null>(null)
    useHandleElsewhereClick(popupWindowRef, "popup-window", () => setOpenImageEditor(false))

    return (
        <PopupWindow windowReference={popupWindowRef}>
            <div className="w-72 px-[0] py-4 bg-[white] rounded-2xl flex flex-col items-center justify-center z-0 gap-8">
                <h2 className="profile-popup-h2">Edit Profile Image</h2>
                {error &&
                    <p className="text-red-500 w-[80%] text-center my-[-1.5rem]">
                        {error}
                    </p>
                }
                <form
                    className="flex flex-col items-center w-4/5 gap-8 pb-4"
                    onSubmit={handleSubmission}
                >
                    <ImageInput
                        emoji={inputData.emoji}
                        setInputData={setInputData}
                    />

                    <BGColorInput
                        bgColor={inputData.bgColor}
                        setInputData={setInputData}
                    />

                    {
                        dataChanged &&
                        <div className="w-full flex flex-col items-center gap-4">
                            {!error &&
                                <WideButton
                                    colors={{ frontBG: "hsl(130, 70%, 50%)", backBG: "hsl(130, 70%, 80%)" }}
                                >
                                    Save changes
                                </WideButton>
                            }

                            <WideButton
                                colors={{ frontText: "hsl(0, 70%, 80%)", backBG: "hsl(0, 80%, 90%)", border: "hsl(0, 70%, 80%)" }}
                                onClick={discardChanges}
                            >
                                Discard changes
                            </WideButton>
                        </div>
                    }

                    <CrossButton onClickAction={discardChanges} />

                </form>
            </div>
        </PopupWindow>
    )
}