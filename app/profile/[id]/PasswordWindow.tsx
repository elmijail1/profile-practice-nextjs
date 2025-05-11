"use client"
import PopupWindow from "./PopupWindow"
import React, { useState } from "react"

type PropsFromProfilePage = {
    setPasswordWindowOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type PasswordDisplayType = "password" | "text"

export default function PasswordWindow({ setPasswordWindowOpen }: PropsFromProfilePage) {

    const [currentPasswordInput, setCurrentPasswordInput] = useState("")
    const [passwordDisplay, setPasswordDisplay] = useState<PasswordDisplayType>("password")

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

            <form className="w-[90%] text-lg flex flex-col items-center">
                <label htmlFor="current-password" className="text-black">
                    1. Enter your current password
                    <input
                        id="current-password"
                        type={passwordDisplay}
                        name="password"
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
                    Show password
                </button>

                <button
                    type="submit"
                    className="border-2 border-black text-black w-[60%] rounded-2xl"
                >
                    Check
                </button>
            </form>

        </PopupWindow>
    )
}