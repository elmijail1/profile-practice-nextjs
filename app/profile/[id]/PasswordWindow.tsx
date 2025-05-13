"use client"
import PopupWindow from "./PopupWindow"
import React, { useState, useEffect } from "react"

type PropsFromProfilePage = {
    setPasswordWindowOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type PasswordDisplayType = "password" | "text"

export default function PasswordWindow({ setPasswordWindowOpen }: PropsFromProfilePage) {


    const [progressStage, setProgressStage] = useState<"compare" | "setnew" | "success">("compare")

    const [currentPasswordInput, setCurrentPasswordInput] = useState("")
    const [passwordDisplay, setPasswordDisplay] = useState<PasswordDisplayType>("password")
    const [passwordIsWrong, setPasswordIsWrong] = useState<boolean>(false)

    const [newPasswordInput, setNewPasswordInput] = useState("")
    const [repeatPasswordInput, setRepeatPasswordInput] = useState("")
    const [passwordChangeError, setPasswordChangeError] = useState(false)

    const newAndCurrentAreIdentical = newPasswordInput === currentPasswordInput
    const passwordsMatch = newPasswordInput === repeatPasswordInput


    async function comparePasswords(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

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
                setPasswordIsWrong(true)
                return
            }
            setProgressStage("setnew")
            setPasswordChangeError(false)
        } catch (error) {
            console.error("Network or server error: ", error)
            setPasswordChangeError(true)
        }
    }

    async function setNewPassword(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

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
                console.error("Password change failed: ", result.message)
                setPasswordChangeError(true)
                return
            }
            setProgressStage("success")
        } catch (error) {
            console.error("Network or server error: ", error)
            setPasswordChangeError(true)
        }
    }

    return (
        <PopupWindow>
            <button
                className="text-black text-4xl rotate-45"
                onClick={() => setPasswordWindowOpen(false)}
                aria-label="Close password window"
            >
                +
            </button>

            <h2>Change Password</h2>

            {
                progressStage === "compare" &&
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
                        className="text-gray-600 text-sm my-3"
                        onClick={() => setPasswordDisplay(prevDisplay => prevDisplay === "password" ? "text" : "password")}
                    >
                        {passwordDisplay === "password" ? "Show" : "Hide"} password
                    </button>
                    {
                        passwordIsWrong &&
                        <p className="text-gray-600 text-sm my-3">
                            Password is wrong, try again
                        </p>
                    }
                    {
                        passwordChangeError &&
                        <p className="text-red-700 my-3">
                            Some mistake happened, try again!
                        </p>
                    }

                    <button
                        type="submit"
                        className="border-2 border-black text-black w-[60%] rounded-2xl"
                    >
                        Check
                    </button>
                </form>
            }
            {
                progressStage === "setnew" &&
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
                                className="w-full text-gray-700 px-4 text-center text-2xl my-1
                                disabled:bg-gray-300"
                                placeholder="Enter here"
                                autoComplete="new-password"
                                disabled={newAndCurrentAreIdentical}
                            />
                        </label>

                        <button
                            type="button"
                            className="text-gray-600 text-sm my-3"
                            onClick={() => setPasswordDisplay(prevDisplay => prevDisplay === "password" ? "text" : "password")}
                        >
                            {passwordDisplay === "password" ? "Show" : "Hide"} passwords
                        </button>

                        {
                            newPasswordInput.length > 0 && repeatPasswordInput.length > 0 &&
                            <p className="text-gray-600 text-sm my-3">
                                Passwords {!passwordsMatch && "don't"} match
                            </p>
                        }

                        {
                            passwordChangeError &&
                            <p className="text-red-700 my-3">
                                Some mistake happened, try again!
                            </p>
                        }

                        {
                            newAndCurrentAreIdentical &&
                            <p className="text-red-700 my-3">
                                New password can't be identical to the current one!
                            </p>
                        }

                        <button
                            type="submit"
                            className="border-2 border-black text-black w-[70%] rounded-2xl disabled:bg-gray-200 disabled:text-gray-500 disabled:border-0"
                            disabled={!passwordsMatch || newAndCurrentAreIdentical}
                        >
                            Update Password
                        </button>
                    </form>
                </>
            }
            {
                progressStage === "success" &&
                <div
                    className="w-[90%] text-lg flex flex-col items-center text-center gap-5"

                >
                    <p className="text-black">Successfully changed password!</p>
                    <button
                        onClick={() => setPasswordWindowOpen(false)}
                        className="border-1 border-gray-500 text-black w-[70%] rounded-2xl disabled:bg-gray-200 disabled:text-gray-500 disabled:border-0"

                    >
                        Ok, close the window
                    </button>
                </div>
            }


        </PopupWindow >
    )
}