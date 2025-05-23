"use client";
// *0.1
// general
import { useState, useRef } from "react"
// components
import BGColorInput from "./BGColorInput"
import CrossButton from "../CrossButton"
import ImageInput from "./ImageInput"
import PopupWindow from "../PopupWindow"
import WideButton from "@/app/components/WideButton";
// data
// utilities
import useHandleElsewhereClick from "@/utilities/useHandleElsewhereClick"
import { useProfileContext } from "@/lib/ProfileContext";

type ImageSectionProps = {
    profileData: any,
    setProfileData: any,
    setOpenImageEditor: any
}

export default function ImageEditForm({
    profileData, setProfileData, setOpenImageEditor // *0.2
}: ImageSectionProps) {

    const { currentId } = useProfileContext()

    const [inputData, setInputData] = useState({ // *0.3
        emoji: profileData.emoji,
        bgColor: profileData.bgColor,
    })

    const [error, setError] = useState("")

    function discardChanges() { // *0.4
        setInputData({
            emoji: profileData.emoji,
            bgColor: profileData.bgColor,
        })
        setOpenImageEditor(false)
    }

    async function handleSubmission(event: React.FormEvent<HTMLFormElement>) { //*0.4
        event.preventDefault()
        // const updatedProfileData = { ...profileData, ...inputData }
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
                // console.error("Failed to update user")
                setError("Updating is currently unavailable. Try again later.")
                return
            }

            const updatedUser = await response.json()
            setProfileData(updatedUser.user)
            setOpenImageEditor(false)

        } catch (error) {
            // console.error("Error updating the profile's images: ", error)
            setError("Updating is currently unavailable. Try again later.")
        }
    }


    let popupWindowRef = useRef()
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
                <form className="flex flex-col items-center w-4/5 gap-8 pb-4">
                    <ImageInput
                        inputData={inputData}
                        setInputData={setInputData}
                    />

                    <BGColorInput
                        inputData={inputData}
                        setInputData={setInputData}
                    />

                    <div className="w-full flex flex-col items-center gap-4">
                        {!error &&
                            <WideButton
                                colors={{ frontBG: "hsl(130, 70%, 50%)", backBG: "hsl(130, 70%, 80%)" }}
                                onClick={handleSubmission}
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

                    <CrossButton onClickAction={discardChanges} />

                </form>
            </div>
        </PopupWindow>
    )
}