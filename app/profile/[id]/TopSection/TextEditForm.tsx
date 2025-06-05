"use client";
import React, { useState, useRef, useEffect } from "react"
import CrossButton from "../CrossButton"
import FormInput from "./FormInput"
import PopupWindow from "../PopupWindow"
import useHandleElsewhereClick from "@/utilities/useHandleElsewhereClick"
import debounce from "lodash.debounce"
import { useProfileContext } from "@/lib/ProfileContext";
import WideButton from "@/app/components/WideButton";
import { useSession, signOut } from "next-auth/react";
import { User } from "@/app/types/user";
import { useRouter } from "next/navigation";

type TextEditFormProps = {
    profileData: User,
    setProfileData: React.Dispatch<React.SetStateAction<User | undefined>>,
    setOpenTextEditor: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TextEditForm({
    profileData, setProfileData, setOpenTextEditor
}: TextEditFormProps) {

    const { currentId } = useProfileContext()

    const [inputData, setInputData] = useState({
        name: profileData?.name,
        email: profileData?.email,
        aboutMe: profileData?.aboutMe
    })
    const inputCounter = { name: 20, aboutMe: 100 }

    const [emailStatus, setEmailStatus] = useState<"idle" | "invalid" | "checking" | "available" | "unavailable">("idle")
    const [error, setError] = useState("")

    function validateEmail(email: string) {
        return /^(?=.{5,100}$)[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const router = useRouter()

    async function checkEmail(emailToCheck: string) {
        if (!emailToCheck || !validateEmail(emailToCheck)) return
        try {
            const res = await fetch("/api/users/check-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: emailToCheck, userId: currentId })
            })

            if (!res.ok) {
                const response = await res.json()
                if (response.error === "Session expired") {
                    await signOut({ redirect: false })
                    router.push("/login?reason=expired")
                    return
                }
                setError("Checking is currently unavailable. Try again later.")
                return
            }

            const data = await res.json()

            if (lastValidEmailRef.current === emailToCheck) {
                setEmailStatus(data.isTaken ? "unavailable" : "available")
            }
        } catch (error) {
            console.error("Failed to check email", error)
            if (lastValidEmailRef.current === emailToCheck) {
                setEmailStatus("unavailable")
            }
        }
    }

    const checkEmailRef = useRef(debounce(checkEmail, 1000))

    useEffect(() => {
        checkEmailRef.current = debounce(checkEmail, 1000)
        return () => checkEmailRef.current.cancel()
    }, [currentId])

    const lastValidEmailRef = useRef<string | null>(null)

    useEffect(() => {
        const email = inputData.email
        const emailHasChanged = email !== profileData.email

        if (!emailHasChanged) {
            setEmailStatus("idle")
            return
        }

        const emailIsValid = validateEmail(email)
        if (!emailIsValid) {
            setEmailStatus("invalid")
            lastValidEmailRef.current = null
            return
        }

        setEmailStatus("checking")
        lastValidEmailRef.current = email
        checkEmailRef.current(email)

    }, [inputData.email, profileData.email])

    const { update } = useSession()

    async function handleSubmission(event: React.FormEvent<HTMLFormElement>) {
        if (["invalid", "unavailable", "checking"].includes(emailStatus)) {
            return
        }

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
            await update()
            setProfileData(updatedUser.user)
            setOpenTextEditor(false)

        } catch (error) {
            console.error("Error updating the profile's texts: ", error)
            setError("Updating is currently unavailable. Try again later.")
        }
    }

    function handleInput(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) { //*0.4
        const { name, value } = event.target
        setInputData(prevInputData => {
            return ({ ...prevInputData, [name]: value })
        })
    }

    function discardChanges() {
        setInputData({
            name: profileData?.name,
            email: profileData?.email,
            aboutMe: profileData?.aboutMe
        })
        setOpenTextEditor(false)
    }

    const popupWindowRef = useRef<HTMLDivElement | null>(null)
    useHandleElsewhereClick(popupWindowRef, "popup-window", discardChanges)



    return (
        <PopupWindow windowReference={popupWindowRef}>
            <h2 className="text-black">Edit Profile</h2>
            {error &&
                <p className="text-red-500 w-[80%] text-center my-[-1.5rem]">
                    {error}
                </p>
            }
            <form
                className="flex flex-col items-center w-4/5 gap-6 pb-4 relative z-0"
                onSubmit={handleSubmission}
            >
                <FormInput
                    inputData={inputData.name}
                    fieldName={"name"}
                    fieldType={"input"}
                    handleInput={handleInput}
                    inputCounter={inputCounter.name}
                />

                <FormInput
                    inputData={inputData.email}
                    fieldName={"email"}
                    fieldType={"input"}
                    handleInput={handleInput}
                />

                {emailStatus === "available" && <p className="text-green-600">{emailStatus.toUpperCase()}</p>}
                {["unavailable", "invalid"].includes(emailStatus) && <p className="text-red-600">{emailStatus.toUpperCase()}</p>}
                {emailStatus === "checking" && <p className="text-black">{emailStatus.toUpperCase()}</p>}


                <FormInput
                    inputData={inputData.aboutMe}
                    fieldName={"aboutMe"}
                    fieldType={"textarea"}
                    handleInput={handleInput}
                    inputCounter={inputCounter.aboutMe}
                />


                {
                    (!["checking", "invalid", "unavailable"].includes(emailStatus)) &&
                    (
                        <div className="w-full flex flex-col items-center gap-4">
                            {
                                !error && inputData.name && inputData.email &&
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
                    )
                }
            </form>

            <CrossButton onClickAction={discardChanges} />
        </PopupWindow>
    )
}