import React, { SetStateAction, useEffect, useState } from "react"
import { PasswordDisplayType, ProgressStageType } from "./PasswordWindow"
import SubmitButton from "./SubmitButton"

type FormSetNewProps = {
    newPasswordInput: string,
    setNewPasswordInput: React.Dispatch<SetStateAction<string>>,
    repeatPasswordInput: string,
    setRepeatPasswordInput: React.Dispatch<SetStateAction<string>>,
    passwordDisplay: PasswordDisplayType,
    setPasswordDisplay: React.Dispatch<SetStateAction<PasswordDisplayType>>,
    newAndCurrentAreIdentical: boolean,
    passwordsMatch: boolean,
    currentPasswordInput: string,
    setProgressStage: React.Dispatch<SetStateAction<ProgressStageType>>,
    setPasswordWindowOpen: React.Dispatch<SetStateAction<boolean>>
}

export default function FormSetNew({
    newPasswordInput,
    setNewPasswordInput,
    repeatPasswordInput,
    setRepeatPasswordInput,
    passwordDisplay,
    setPasswordDisplay,
    newAndCurrentAreIdentical,
    passwordsMatch,
    currentPasswordInput,
    setProgressStage,
    setPasswordWindowOpen
}: FormSetNewProps) {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const bothFieldsFilled = newPasswordInput.length > 0 && repeatPasswordInput.length > 0
    const buttonIsShown = passwordsMatch && !newAndCurrentAreIdentical

    useEffect(() => {
        newAndCurrentAreIdentical ? setError("The current password and the new password can't be identical.") : setError("")
    }, [newAndCurrentAreIdentical])

    async function setNewPassword(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch("/api/account/password", {
                method: "PATCH",
                body: JSON.stringify({
                    currentPassword: currentPasswordInput,
                    newPassword: newPasswordInput
                }),
                headers: { "Content-Type": "application/json" }
            })

            const result = await res.json()

            if (!result.success) {
                // console.error("Password change failed: ", result.message)
                setError("Creating new profiles is currently unavailable. Try again later.")
                return
            }
            setProgressStage("success")
        } catch (error) {
            // console.error("Network or server error: ", error)
            setError("Creating new profiles is currently unavailable. Try again later.")
            setIsLoading(false)
        } finally {
        }
    }

    return (
        <>
            <p className="text-black text-lg">1. Password checked successfully</p>
            <form
                onSubmit={setNewPassword}
                className="w-[90%] text-lg flex flex-col items-center text-center"
            >
                <label htmlFor="new-password" className="text-black">
                    2. Enter a new password
                    <input
                        id="new-password"
                        type={passwordDisplay}
                        name="new-password"
                        value={newPasswordInput}
                        onChange={(event) => setNewPasswordInput(event.target.value)}
                        className="w-full text-gray-700 px-4 text-center text-2xl my-1"
                        placeholder="Enter here"
                        autoComplete="new-password"
                    />
                </label>

                <label htmlFor="repeat-password" className="text-black">
                    3. Repeat the new password
                    <input
                        id="repeat-password"
                        type={passwordDisplay}
                        name="repeat-password"
                        value={repeatPasswordInput}
                        onChange={(event) => setRepeatPasswordInput(event.target.value)}
                        className="w-full text-gray-700 px-4 text-center text-2xl my-1 disabled:bg-gray-300"
                        placeholder="Enter here"
                        autoComplete="new-password"
                        disabled={newAndCurrentAreIdentical}
                    />
                </label>

                <button
                    type="button"
                    className="text-gray-600 text-[1rem] leading-[1.1rem] mt-2 mb-4 border-b-[1px] line-he"
                    onClick={() => setPasswordDisplay(prevDisplay => prevDisplay === "password" ? "text" : "password")}
                >
                    {passwordDisplay === "password" ? "Show" : "Hide"} password
                </button>


                {
                    bothFieldsFilled && !newAndCurrentAreIdentical &&
                    (passwordsMatch
                        ? <p className="text-green-700 text-[1rem] mb-2">Passwords match</p>
                        : <p className="text-red-700 text-[1rem] mb-2">Passwords don't match</p>)
                }

                {
                    error &&
                    <p className="text-red-700 mb-3 text-center text-[1rem]">
                        {error}
                    </p>
                }

                {
                    buttonIsShown &&
                    <SubmitButton disabledIf={isLoading || !passwordsMatch || newAndCurrentAreIdentical}>
                        {isLoading ? "Loading..." : "Update Password"}
                    </SubmitButton>
                }
                {
                    error === "Creating new profiles is currently unavailable. Try again later." &&
                    <SubmitButton onClick={() => setPasswordWindowOpen(false)}>
                        Ok, close the window
                    </SubmitButton>
                }


            </form>
        </>
    )
}