import React, { useState } from "react"
import { PasswordDisplayType, ProgressStageType } from "./PasswordWindow"
import SubmitButton from "./SubmitButton"

type FormCompareProps = {
    passwordDisplay: PasswordDisplayType,
    setPasswordDisplay: React.Dispatch<React.SetStateAction<PasswordDisplayType>>,
    currentPasswordInput: string,
    setCurrentPasswordInput: React.Dispatch<React.SetStateAction<string>>,
    setProgressStage: React.Dispatch<React.SetStateAction<ProgressStageType>>,
}

export default function FormCompare({
    passwordDisplay,
    setPasswordDisplay,
    currentPasswordInput,
    setCurrentPasswordInput,
    setProgressStage
}: FormCompareProps) {

    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function comparePasswords(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch("/api/users/check-password", {
                method: "POST",
                body: JSON.stringify({ password: currentPasswordInput }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const result = await res.json()

            if (!result.success) {
                setError("The password is wrong. Try again.")
                return
            }

            setProgressStage("set-new")
            setPasswordDisplay("password")
        } catch (error) {
            console.error("Network or server error: ", error)
            setError("Password checking is currently unavailable. Try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form
            onSubmit={(event) => comparePasswords(event)}
            className="w-[90%] text-lg flex flex-col items-center text-cneter"
        >
            <label htmlFor="current-password" className="text-black">
                1. Enter your current password
                <input
                    id="current-password"
                    type={passwordDisplay}
                    name="current-password"
                    value={currentPasswordInput}
                    onChange={(event) => setCurrentPasswordInput(event.target.value)}
                    className="w-full text-gray-700 px-4 text-center text-2xl my-1"
                    placeholder="Enter here"
                    autoComplete="current-password"
                />
            </label>

            <button
                type="button"
                className="text-gray-600 text-[1rem] leading-[1.1rem] mt-2 mb-4 border-b-[1px] line-he xl:cursor-pointer xl:hover:font-semibold xl:hover:brightness-90"
                onClick={() => setPasswordDisplay(prevDisplay => prevDisplay === "password" ? "text" : "password")}
            >
                {passwordDisplay === "password" ? "Show" : "Hide"} password
            </button>

            {
                error &&
                <p className="text-red-700 mb-3 text-center text-[1rem]">
                    {error}
                </p>
            }

            <SubmitButton disabledIf={isLoading}>
                {isLoading ? "Checking..." : "Check Password"}
            </SubmitButton>
        </form>
    )
}