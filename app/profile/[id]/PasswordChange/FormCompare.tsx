import React, { SetStateAction, useEffect, useState } from "react"
import { PasswordDisplayType, ProgressStageType } from "./PasswordWindow"
import SubmitButton from "./SubmitButton"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

type FormCompareProps = {
    passwordDisplay: PasswordDisplayType,
    setPasswordDisplay: React.Dispatch<React.SetStateAction<PasswordDisplayType>>,
    currentPasswordInput: string,
    setCurrentPasswordInput: React.Dispatch<React.SetStateAction<string>>,
    setProgressStage: React.Dispatch<React.SetStateAction<ProgressStageType>>,
    validatePassword: (password: string, isValid: boolean | null, setIsValid: React.Dispatch<SetStateAction<boolean | null>>) => void,
}

export default function FormCompare({
    passwordDisplay,
    setPasswordDisplay,
    currentPasswordInput,
    setCurrentPasswordInput,
    setProgressStage,
    validatePassword
}: FormCompareProps) {

    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [passwordIsValid, setPasswordIsValid] = useState<boolean | null>(null)

    useEffect(() => {
        validatePassword(currentPasswordInput, passwordIsValid, setPasswordIsValid)
        if (passwordIsValid === false) {
            setError(
                `Password must be 8+ symbols long and contain at least one:
                – uppercase letter (e.g. A, B, C)
                – lowercase letter (e.g. a, b, c)
                – digit (e.g. 1, 2, 3)
                – special symbol (e.g. _, !, ?)`
            )
        } else {
            setError("")
        }
    }, [currentPasswordInput, passwordIsValid])

    const router = useRouter()

    async function comparePasswords(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()
        if (isLoading) return
        setIsLoading(true)

        try {
            const res = await fetch("/api/users/check-password", {
                method: "POST",
                body: JSON.stringify({ password: currentPasswordInput }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (!res.ok) {
                const response = await res.json()
                if (response.error === "Session expired") {
                    await signOut({ redirect: false })
                    router.push("/login?reason=expired")
                    return
                }
                setError("The password is wrong. Try again.")
                setIsLoading(false)
                return
            }

            setProgressStage("set-new")
            setPasswordDisplay("password")
            setIsLoading(false)

        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error("Server error: ", error)
            } else {
                console.error("Server error")
            }
            setError("Password checking is currently unavailable. Try again later.")
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
                <p className="text-red-700 mb-3 text-left text-[1rem] whitespace-pre-line">
                    {error}
                </p>
            }

            {
                passwordIsValid &&
                <SubmitButton disabledIf={!passwordIsValid || isLoading}>
                    {isLoading ? "Checking..." : "Check Password"}
                </SubmitButton>
            }
        </form>
    )
}