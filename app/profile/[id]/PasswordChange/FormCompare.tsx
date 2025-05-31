import React, { useEffect, useState } from "react"
import { PasswordDisplayType, ProgressStageType } from "./PasswordWindow"
import SubmitButton from "./SubmitButton"

type FormCompareProps = {
    passwordDisplay: PasswordDisplayType,
    setPasswordDisplay: React.Dispatch<React.SetStateAction<PasswordDisplayType>>,
    currentPasswordInput: string,
    setCurrentPasswordInput: React.Dispatch<React.SetStateAction<string>>,
    setProgressStage: React.Dispatch<React.SetStateAction<ProgressStageType>>,
    regex: RegExp
}

export default function FormCompare({
    passwordDisplay,
    setPasswordDisplay,
    currentPasswordInput,
    setCurrentPasswordInput,
    setProgressStage,
    regex
}: FormCompareProps) {

    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [passwordIsValid, setPasswordIsValid] = useState<boolean | null>(null)

    function validatePassword() {
        if (!currentPasswordInput) {
            if (typeof passwordIsValid === "boolean") {
                setPasswordIsValid(null)
            }
            return
        }
        console.log(regex.test(currentPasswordInput))
        setPasswordIsValid(regex.test(currentPasswordInput))
    }

    useEffect(() => {
        validatePassword()
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

    function determineButtonText() {
        if (!passwordIsValid) {
            return "Enter Valid Password"
        } else if (passwordIsValid && !isLoading) {
            return "Check Password"
        } else if (passwordIsValid && isLoading) {
            return "Checking..."
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

            <SubmitButton disabledIf={!passwordIsValid || isLoading}>
                {determineButtonText()}
            </SubmitButton>
        </form>
    )
}