"use client";
// *0.1
// general
import { useState, useRef } from "react"
// components
import BGColorInput from "./BGColorInput"
import CrossButton from "../CrossButton"
import ImageInput from "./ImageInput"
import PopupWindow from "../PopupWindow"
import WideButton from "../WideButton"
// data
import { wideButtonColorsData, extractColorObject } from "../../../../data/wideButtonColorsData"
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
                console.error("Failed to update user")
                return
            }

            const updatedUser = await response.json()
            setProfileData(updatedUser.user)
            setOpenImageEditor(false)

        } catch (error) {
            console.error("Error updating the profile's images: ", error)
        }
    }


    let popupWindowRef = useRef() // *0.5
    useHandleElsewhereClick(popupWindowRef, "ProfPUW__DivGen", () => setOpenImageEditor(false))

    return (
        <PopupWindow windowReference={popupWindowRef}>
            <div className="ProfIEF__DivGen">
                <h2>Edit Profile Image</h2>
                <form className="ProfIEF__Form">
                    <ImageInput
                        inputData={inputData}
                        setInputData={setInputData}
                    />

                    <BGColorInput
                        inputData={inputData}
                        setInputData={setInputData}
                    />

                    <WideButton
                        colors={extractColorObject(wideButtonColorsData, "GreenFill")}
                        onClickAction={handleSubmission}
                        buttonText="Save changes"
                    />

                    <WideButton
                        colors={extractColorObject(wideButtonColorsData, "RedText")}
                        onClickAction={discardChanges}
                        buttonText="Discard changes"
                    />

                    <CrossButton onClickAction={discardChanges} />

                </form>
            </div>
        </PopupWindow>
    )
}