"use client"
import PopupWindow from "./PopupWindow"
import React, { useState } from "react"

type PropsFromProfilePage = {
    setPasswordWindowOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function PasswordWindow({ setPasswordWindowOpen }: PropsFromProfilePage) {

    const [currentPasswordInput, setCurrentPasswordInput] = useState("")


    return (
        <PopupWindow>
            <button
                className="text-black text-4xl rotate-45"
                onClick={() => setPasswordWindowOpen(false)}
            >
                +
            </button>

            <h2>Change Password</h2>

            <form className="w-[90%] text-lg flex flex-col items-center">
                <label htmlFor="" className="text-black">
                    1. Enter your current password
                    <input
                        type="password"
                        name="password"
                        value={currentPasswordInput}
                        onChange={(event) => setCurrentPasswordInput(prevInput => event.target.value)}
                        className="w-full text-gray-700 px-4 text-center text-2xl my-1"
                        placeholder="Enter here"
                    />
                </label>

                <p className="text-gray-600 text-sm my-3">
                    Show password
                </p>

                <button
                    className="border-2 border-black text-black w-[60%] rounded-2xl"
                >
                    Check
                </button>
            </form>

        </PopupWindow>
    )
}