import React, { SetStateAction, useEffect, useState } from "react"
import { PasswordDisplayType, ProgressStageType } from "./PasswordWindow"
import SubmitButton from "./SubmitButton"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

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
    setPasswordWindowOpen: React.Dispatch<SetStateAction<boolean>>,
    validatePassword: (password: string, isValid: boolean | null, setIsValid: React.Dispatch<SetStateAction<boolean | null>>) => void,
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
    setPasswordWindowOpen,
    validatePassword
}: FormSetNewProps) {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const bothFieldsFilled = newPasswordInput.length > 0 && repeatPasswordInput.length > 0
    const [passwordIsValid, setPasswordIsValid] = useState<boolean | null>(null)
    const buttonIsShown = passwordsMatch && !newAndCurrentAreIdentical && passwordIsValid

    useEffect(() => {
        validatePassword(newPasswordInput, passwordIsValid, setPasswordIsValid)
        if (passwordIsValid === false) {
            setError(
                `Password must be 8+ symbols long and contain at least one:
                    – uppercase letter (e.g. A, B, C)
                    – lowercase letter (e.g. a, b, c)
                    – digit (e.g. 1, 2, 3)
                    – special symbol (e.g. _, !, ?)`
            )
        } else if (passwordIsValid && newAndCurrentAreIdentical) {
            setError("The current password and the new password can't be identical.")
        } else if (passwordIsValid && !newAndCurrentAreIdentical) {
            setError("")
        }
    }, [newPasswordInput, passwordIsValid, newAndCurrentAreIdentical])

    const router = useRouter()

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

            if (!res.ok) {
                const response = await res.json()
                if (response.error === "Session expired") {
                    await signOut({ redirect: false })
                    router.push("/login?reason=expired")
                    return
                }
                setError("Updating in currently unavailable. Try again later.")
                setIsLoading(false)
            }

            const result = await res.json()

            if (!result.success) {
                // console.error("Password change failed: ", result.message)
                setError("Creating new profiles is currently unavailable. Try again later.")
                return
            }
            setProgressStage("success")
        } catch (error) {
            console.error("Network or server error: ", error)
            setError("Creating new profiles is currently unavailable. Try again later.")
            setIsLoading(false)
        }
    }

    return (
        <>
            <p className="text-black text-lg mb-[-2rem]">1. Password checked successfully</p>
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
                    className="text-gray-600 text-[1rem] leading-[1.1rem] mt-2 mb-4 border-b-[1px] line-he xl:cursor-pointer xl:hover:font-semibold x:hover:brightness-90"
                    onClick={() => setPasswordDisplay(prevDisplay => prevDisplay === "password" ? "text" : "password")}
                >
                    {passwordDisplay === "password" ? "Show" : "Hide"} password
                </button>


                {
                    bothFieldsFilled && !newAndCurrentAreIdentical &&
                    (passwordsMatch
                        ? <p className="text-green-700 text-[1rem] mb-2">Passwords match</p>
                        : <p className="text-red-700 text-[1rem] mb-2">Passwords don&apos;t match</p>)
                }

                {
                    error &&
                    <p className="text-red-700 mb-3 text-left text-[1rem] whitespace-pre-line">
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