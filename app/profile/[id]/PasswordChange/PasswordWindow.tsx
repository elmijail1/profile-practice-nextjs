"use client"
import CrossButton from "../CrossButton"
import PopupWindow from "../PopupWindow"
import React, { useState, useRef } from "react"
import FormCompare from "./FormCompare"
import FormSetNew from "./FormSetNew"
import SuccessMessage from "./SuccessMessage"
import useHandleElsewhereClick from "@/utilities/useHandleElsewhereClick"

type PropsFromProfilePage = {
    setPasswordWindowOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type PasswordDisplayType = "password" | "text"
export type ProgressStageType = "compare" | "set-new" | "success"

export default function PasswordWindow({ setPasswordWindowOpen }: PropsFromProfilePage) {


    const [progressStage, setProgressStage] = useState<ProgressStageType>("compare")

    const [currentPasswordInput, setCurrentPasswordInput] = useState("")
    const [passwordDisplay, setPasswordDisplay] = useState<PasswordDisplayType>("password")

    const [newPasswordInput, setNewPasswordInput] = useState("")
    const [repeatPasswordInput, setRepeatPasswordInput] = useState("")

    const newAndCurrentAreIdentical = newPasswordInput === currentPasswordInput
    const passwordsMatch = newPasswordInput.length > 0 && newPasswordInput === repeatPasswordInput

    let popupWindowRef = useRef<HTMLDivElement>(null)
    useHandleElsewhereClick(popupWindowRef, "popup-window", setPasswordWindowOpen)


    return (
        <PopupWindow windowReference={popupWindowRef}>
            <h2 className="text-black">Change Password</h2>

            {progressStage === "compare" &&
                <FormCompare
                    passwordDisplay={passwordDisplay}
                    setPasswordDisplay={setPasswordDisplay}
                    currentPasswordInput={currentPasswordInput}
                    setCurrentPasswordInput={setCurrentPasswordInput}
                    setProgressStage={setProgressStage}
                />
            }

            {progressStage === "set-new" &&
                <>
                    <FormSetNew
                        newPasswordInput={newPasswordInput}
                        setNewPasswordInput={setNewPasswordInput}
                        repeatPasswordInput={repeatPasswordInput}
                        setRepeatPasswordInput={setRepeatPasswordInput}
                        passwordDisplay={passwordDisplay}
                        setPasswordDisplay={setPasswordDisplay}
                        newAndCurrentAreIdentical={newAndCurrentAreIdentical}
                        passwordsMatch={passwordsMatch}
                        currentPasswordInput={currentPasswordInput}
                        setProgressStage={setProgressStage}
                        setPasswordWindowOpen={setPasswordWindowOpen}
                    />
                </>
            }
            {
                progressStage === "success" &&
                <SuccessMessage
                    setPasswordWindowOpen={setPasswordWindowOpen}
                />
            }


            <CrossButton onClickAction={() => setPasswordWindowOpen(false)} />
        </PopupWindow >
    )
}