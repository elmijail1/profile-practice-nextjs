"use client";
import { useState, useRef } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthFormInput from "./AuthFormInput";
import WideButton from "../components/WideButton";
import ErrorPopup from "../components/ErrorPopup";
import useHandleElsewhereClick from "@/utilities/useHandleElsewhereClick";

export default function LogInTab() {

    const [inputData, setInputData] = useState({ email: "", password: "" })
    function handleInput(event: any) {
        const { name, value } = event.target
        setInputData(prevData => ({ ...prevData, [name]: value }))
    }

    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await signIn("credentials", {
                redirect: false,
                email: inputData.email,
                password: inputData.password
            })

            if (!response?.ok) {
                // console.error("Login failed")
                setError("Invalid email or password. Try again.")
                setIsSubmitting(false)
                return
            }

            const session = await getSession()

            if (!session?.user.id) {
                // console.error("Session missing user ID")
                setError("The app is unavailable. Try again later.")
                setIsSubmitting(false)
                return
            }

            router.push(`/profile/${session.user.id}`)
        } catch (error) {
            // console.error("Error while logging in a user: ", error)
            setError("The app is unavailable. Try again later.")
            setIsSubmitting(false)
        }
    }

    let popupWindowRef = useRef<HTMLDivElement>(null)
    useHandleElsewhereClick(popupWindowRef, "popup-window-error", setError)

    return (
        <>
            <div className="auth-tab">

                <h2>Welcome back!</h2>
                <form className="auth-form" onSubmit={handleLogin}>

                    <AuthFormInput
                        type="email"
                        name="email"
                        value={inputData.email}
                        onChange={handleInput}
                    >
                        Email
                    </AuthFormInput>

                    <AuthFormInput
                        type="password"
                        name="password"
                        value={inputData.password}
                        onChange={handleInput}
                    >
                        Password
                    </AuthFormInput>

                    <WideButton disabledIf={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Log in"}
                    </WideButton>
                </form>
                {
                    error &&
                    <ErrorPopup
                        error={error}
                        setError={setError}
                        windowReference={popupWindowRef}
                    />
                }

            </div>
        </>
    )
}