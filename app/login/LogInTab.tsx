"use client";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthFormInput from "./AuthFormInput";
import WideButton from "../components/WideButton";

export default function LogInTab() {

    const [inputData, setInputData] = useState({ email: "", password: "" })
    function handleInput(event: any) {
        const { name, value } = event.target
        setInputData(prevData => ({ ...prevData, [name]: value }))
    }

    const [error, setError] = useState("")

    const router = useRouter()

    const [isSubmitting, setIsSubmitting] = useState(false)

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
                console.error("Login failed")
                setError("Invalid email or password")
                return
            }

            const session = await getSession()

            if (!session?.user.id) {
                console.error("Session missing user ID")
                setError("Session missing user ID")
                return
            }

            router.push(`/profile/${session.user.id}`)
        } catch (error) {
            console.error("Error while logging in a user: ", error)
        } finally {
            setIsSubmitting(false)
        }
    }

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
                        Log in
                    </WideButton>

                </form>
            </div>
        </>
    )
}